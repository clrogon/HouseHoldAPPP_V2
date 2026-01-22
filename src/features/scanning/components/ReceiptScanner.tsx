import { useState } from 'react';
import { Receipt, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Progress } from '@/shared/components/ui/progress';
import { ScannerCamera } from './ScannerCamera';
import { ReceiptReviewDialog } from './ReceiptReviewDialog';
import { useOCR } from '../hooks/useOCR';
import type { ParsedReceiptData } from '../services/receiptParser';

interface ReceiptScannerProps {
  onSaveReceipt: (receipt: {
    storeName: string;
    date: string;
    total: number;
    items: { name: string; quantity: number; price: number; category?: string }[];
  }) => Promise<void>;
}

export function ReceiptScanner({ onSaveReceipt }: ReceiptScannerProps) {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const { isProcessing, progress, result, confidence, error, processImage, reset } = useOCR();

  const handleCapture = async (imageData: string) => {
    setCapturedImage(imageData);
    const parsedResult = await processImage(imageData);
    if (parsedResult) {
      setReviewDialogOpen(true);
    }
  };

  const handleRetry = () => {
    setCapturedImage(null);
    reset();
  };

  const handleSave = async (data: ParsedReceiptData) => {
    await onSaveReceipt({
      storeName: data.storeName || 'Loja Desconhecida',
      date: data.date || new Date().toISOString(),
      total: data.total || data.items.reduce((sum, item) => sum + item.price, 0),
      items: data.items,
    });
    handleRetry();
    setReviewDialogOpen(false);
  };

  if (isProcessing) {
    return (
      <Card className="h-[500px] flex flex-col items-center justify-center">
        <CardContent className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg font-medium mb-2">{progress?.status || 'A processar...'}</p>
          {progress && (
            <div className="w-64 mx-auto">
              <Progress value={progress.progress * 100} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2">
                {Math.round(progress.progress * 100)}%
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-[500px] flex flex-col items-center justify-center">
        <CardContent className="text-center">
          <Receipt className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-lg font-medium text-destructive mb-2">Erro ao processar</p>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="text-primary hover:underline"
          >
            Tentar novamente
          </button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Digitalizar Recibo
          </CardTitle>
          <CardDescription>
            Aponte a câmara para o recibo ou carregue uma imagem
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ScannerCamera
            onCapture={handleCapture}
            className="h-[400px]"
          />
        </CardContent>
      </Card>

      {result && (
        <ReceiptReviewDialog
          open={reviewDialogOpen}
          onOpenChange={setReviewDialogOpen}
          imageData={capturedImage || undefined}
          parsedData={result}
          confidence={confidence || 0}
          onSave={handleSave}
          onRetry={handleRetry}
        />
      )}
    </>
  );
}
