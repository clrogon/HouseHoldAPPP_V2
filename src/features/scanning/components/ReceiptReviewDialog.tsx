import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Plus, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { Badge } from '@/shared/components/ui/badge';
import { formatCurrency } from '@/shared/lib/currency';
import type { ParsedReceiptData } from '../services/receiptParser';

const receiptSchema = z.object({
  storeName: z.string().min(1, 'Nome da loja é obrigatório'),
  date: z.string().min(1, 'Data é obrigatória'),
  total: z.number().min(0, 'Total deve ser positivo'),
});

type ReceiptFormData = z.infer<typeof receiptSchema>;

interface ReceiptItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  category: string;
}

interface ReceiptReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageData?: string;
  parsedData: ParsedReceiptData;
  confidence: number;
  onSave: (data: ParsedReceiptData) => Promise<void>;
  onRetry: () => void;
}

const CATEGORIES = [
  'Pantry',
  'Refrigerator',
  'Freezer',
  'Cleaning',
  'Bathroom',
  'Medicine',
];

export function ReceiptReviewDialog({
  open,
  onOpenChange,
  imageData,
  parsedData,
  confidence,
  onSave,
  onRetry,
}: ReceiptReviewDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<ReceiptItem[]>(
    parsedData.items.map((item, index) => ({
      id: `item-${index}`,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      category: item.category || 'Pantry',
    }))
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReceiptFormData>({
    resolver: zodResolver(receiptSchema),
    defaultValues: {
      storeName: parsedData.storeName || '',
      date: parsedData.date
        ? new Date(parsedData.date).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      total: parsedData.total || items.reduce((sum, item) => sum + item.price, 0),
    },
  });

  const updateItem = (id: string, field: keyof ReceiptItem, value: string | number) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        id: `item-${Date.now()}`,
        name: '',
        quantity: 1,
        price: 0,
        category: 'Pantry',
      },
    ]);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.price, 0);
  };

  const onSubmit = async (data: ReceiptFormData) => {
    setIsLoading(true);
    try {
      await onSave({
        ...parsedData,
        storeName: data.storeName,
        date: new Date(data.date).toISOString(),
        total: data.total,
        items: items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          category: item.category,
        })),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getConfidenceColor = (conf: number) => {
    if (conf >= 80) return 'text-green-600 dark:text-green-400';
    if (conf >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getConfidenceIcon = (conf: number) => {
    if (conf >= 80) return <CheckCircle className="h-4 w-4" />;
    return <AlertTriangle className="h-4 w-4" />;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Rever Recibo Digitalizado</DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            Verifique e corrija os dados extraídos
            <Badge variant="outline" className={getConfidenceColor(confidence)}>
              {getConfidenceIcon(confidence)}
              <span className="ml-1">{Math.round(confidence)}% confiança</span>
            </Badge>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-4">
              {/* Receipt image preview */}
              {imageData && (
                <div className="relative h-32 w-full bg-muted rounded-lg overflow-hidden">
                  <img
                    src={imageData}
                    alt="Recibo digitalizado"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              {/* Store and date */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Nome da Loja</Label>
                  <Input
                    id="storeName"
                    placeholder="Ex: Kero Supermercado"
                    {...register('storeName')}
                  />
                  {errors.storeName && (
                    <p className="text-sm text-destructive">{errors.storeName.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Data</Label>
                  <Input
                    id="date"
                    type="date"
                    {...register('date')}
                  />
                  {errors.date && (
                    <p className="text-sm text-destructive">{errors.date.message}</p>
                  )}
                </div>
              </div>

              {/* Items */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Itens ({items.length})</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addItem}>
                    <Plus className="h-3 w-3 mr-1" />
                    Adicionar
                  </Button>
                </div>

                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-2 items-center p-2 bg-muted/50 rounded-lg">
                      <Input
                        placeholder="Nome do item"
                        value={item.name}
                        onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                        className="w-16"
                      />
                      <Input
                        type="number"
                        min="0"
                        value={item.price}
                        onChange={(e) => updateItem(item.id, 'price', parseInt(e.target.value) || 0)}
                        className="w-24"
                        placeholder="Preço"
                      />
                      <Select
                        value={item.category}
                        onValueChange={(value) => updateItem(item.id, 'category', value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        disabled={items.length === 1}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <Label>Total Calculado</Label>
                  <p className="text-2xl font-bold">{formatCurrency(calculateTotal())}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="total">Total do Recibo</Label>
                  <Input
                    id="total"
                    type="number"
                    min="0"
                    className="w-32"
                    {...register('total', { valueAsNumber: true })}
                  />
                </div>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={onRetry}>
              Digitalizar Novamente
            </Button>
            <Button type="submit" disabled={isLoading || items.length === 0}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  A guardar...
                </>
              ) : (
                'Guardar Recibo'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
