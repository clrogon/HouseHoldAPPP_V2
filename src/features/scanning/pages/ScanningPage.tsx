import { useState } from 'react';
import { ScanLine, Receipt, History, Settings2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { ScanModeSelector } from '../components/ScanModeSelector';
import { ReceiptScanner } from '../components/ReceiptScanner';
import { BarcodeScanner } from '../components/BarcodeScanner';
import { useLanguage } from '@/shared/i18n';
import { formatCurrency } from '@/shared/lib/currency';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import type { ScanMode, ScannedReceipt, ProductLookupResult } from '../types/scanning.types';
import {
  getScannedReceipts,
  saveScannedReceipt,
  addReceiptItemsToInventory,
  createTransactionFromReceipt,
} from '@/mocks/scanning';
import { useAuthStore } from '@/features/auth';

export function ScanningPage() {
  const { t } = useLanguage();
  const { user } = useAuthStore();
  const [scanMode, setScanMode] = useState<ScanMode>('receipt');
  const [recentReceipts, setRecentReceipts] = useState<ScannedReceipt[]>([]);
  const [isLoadingReceipts, setIsLoadingReceipts] = useState(false);
  const [activeTab, setActiveTab] = useState('scan');

  // Check if user can create transactions (PARENT or ADMIN only)
  const canCreateTransactions = user?.role === 'ADMIN' || user?.role === 'PARENT';

  // Load recent receipts when history tab is clicked
  const handleTabChange = async (value: string) => {
    setActiveTab(value);
    if (value === 'history' && recentReceipts.length === 0) {
      setIsLoadingReceipts(true);
      try {
        const receipts = await getScannedReceipts();
        setRecentReceipts(receipts);
      } finally {
        setIsLoadingReceipts(false);
      }
    }
  };

  // Handle saving a scanned receipt
  const handleSaveReceipt = async (receipt: {
    storeName: string;
    date: string;
    total: number;
    items: { name: string; quantity: number; price: number; category?: string }[];
  }) => {
    // Save the receipt
    const savedReceipt = await saveScannedReceipt({
      storeName: receipt.storeName,
      date: receipt.date,
      total: receipt.total,
      items: receipt.items,
      householdId: user?.householdId || '1',
    });

    // Add items to inventory
    await addReceiptItemsToInventory(receipt.items);

    // Create finance transaction if user has permission
    if (canCreateTransactions) {
      await createTransactionFromReceipt(savedReceipt);
    }

    // Update the recent receipts list
    setRecentReceipts((prev) => [savedReceipt, ...prev]);
  };

  // Handle adding product to inventory from barcode scan
  const handleAddToInventory = async (product: ProductLookupResult & { quantity: number }) => {
    await addReceiptItemsToInventory([
      {
        name: product.name,
        quantity: product.quantity,
        price: 0,
        category: product.category,
      },
    ]);
  };

  // Handle adding product to shopping list
  const handleAddToShoppingList = async (product: ProductLookupResult) => {
    // In a real implementation, this would add to the shopping list
    console.log('Adding to shopping list:', product);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <ScanLine className="h-8 w-8" />
            {t.navigation.dashboard === 'Painel' ? 'Digitalização' : 'Scanning'}
          </h1>
          <p className="text-muted-foreground">
            {t.navigation.dashboard === 'Painel'
              ? 'Digitalize recibos e códigos de barras para gerir inventário e despesas.'
              : 'Scan receipts and barcodes to manage inventory and expenses.'}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList>
          <TabsTrigger value="scan" className="gap-2">
            <ScanLine className="h-4 w-4" />
            {t.navigation.dashboard === 'Painel' ? 'Digitalizar' : 'Scan'}
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <History className="h-4 w-4" />
            {t.navigation.dashboard === 'Painel' ? 'Histórico' : 'History'}
            {recentReceipts.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {recentReceipts.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Scan Tab */}
        <TabsContent value="scan" className="space-y-4">
          {/* Mode Selector */}
          <ScanModeSelector mode={scanMode} onModeChange={setScanMode} />

          {/* Permission Notice for Staff */}
          {!canCreateTransactions && (
            <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
              <CardContent className="p-4 flex items-center gap-3">
                <Settings2 className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium text-blue-700 dark:text-blue-300">
                    {t.navigation.dashboard === 'Painel' ? 'Modo Funcionário' : 'Staff Mode'}
                  </p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    {t.navigation.dashboard === 'Painel'
                      ? 'Os recibos serão guardados e o inventário atualizado. As transações financeiras requerem permissão de administrador.'
                      : 'Receipts will be saved and inventory updated. Financial transactions require admin permission.'}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Scanner Components */}
          {scanMode === 'receipt' ? (
            <ReceiptScanner onSaveReceipt={handleSaveReceipt} />
          ) : (
            <BarcodeScanner
              onAddToInventory={handleAddToInventory}
              onAddToShoppingList={handleAddToShoppingList}
            />
          )}

          {/* Quick Tips */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                {t.navigation.dashboard === 'Painel' ? 'Dicas Rápidas' : 'Quick Tips'}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              {scanMode === 'receipt' ? (
                <>
                  <p>
                    •{' '}
                    {t.navigation.dashboard === 'Painel'
                      ? 'Certifique-se de que o recibo está bem iluminado e plano'
                      : 'Make sure the receipt is well-lit and flat'}
                  </p>
                  <p>
                    •{' '}
                    {t.navigation.dashboard === 'Painel'
                      ? 'Capture todo o recibo numa só imagem'
                      : 'Capture the entire receipt in one image'}
                  </p>
                  <p>
                    •{' '}
                    {t.navigation.dashboard === 'Painel'
                      ? 'Pode editar os dados antes de guardar'
                      : 'You can edit the data before saving'}
                  </p>
                </>
              ) : (
                <>
                  <p>
                    •{' '}
                    {t.navigation.dashboard === 'Painel'
                      ? 'Alinhe o código de barras dentro da área de digitalização'
                      : 'Align the barcode within the scanning area'}
                  </p>
                  <p>
                    •{' '}
                    {t.navigation.dashboard === 'Painel'
                      ? 'Mantenha o produto estável durante a leitura'
                      : 'Keep the product steady while scanning'}
                  </p>
                  <p>
                    •{' '}
                    {t.navigation.dashboard === 'Painel'
                      ? 'Pode introduzir o código manualmente se necessário'
                      : 'You can enter the code manually if needed'}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          {isLoadingReceipts ? (
            <div className="flex items-center justify-center h-[300px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : recentReceipts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Receipt className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {t.navigation.dashboard === 'Painel'
                    ? 'Nenhum recibo digitalizado'
                    : 'No scanned receipts'}
                </h3>
                <p className="text-sm text-muted-foreground text-center max-w-sm">
                  {t.navigation.dashboard === 'Painel'
                    ? 'Os recibos digitalizados aparecerão aqui. Comece por digitalizar o seu primeiro recibo.'
                    : 'Scanned receipts will appear here. Start by scanning your first receipt.'}
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setActiveTab('scan');
                    setScanMode('receipt');
                  }}
                >
                  <ScanLine className="h-4 w-4 mr-2" />
                  {t.navigation.dashboard === 'Painel' ? 'Digitalizar Recibo' : 'Scan Receipt'}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {recentReceipts.map((receipt) => (
                <Card key={receipt.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{receipt.storeName}</CardTitle>
                      <Badge variant="secondary">
                        {formatCurrency(receipt.total)}
                      </Badge>
                    </div>
                    <CardDescription>
                      {format(new Date(receipt.date), 'PPP', {
                        locale: t.navigation.dashboard === 'Painel' ? pt : undefined,
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        {receipt.items.length}{' '}
                        {t.navigation.dashboard === 'Painel' ? 'itens' : 'items'}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {receipt.items.slice(0, 5).map((item, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {item.name} x{item.quantity}
                          </Badge>
                        ))}
                        {receipt.items.length > 5 && (
                          <Badge variant="outline" className="text-xs">
                            +{receipt.items.length - 5}{' '}
                            {t.navigation.dashboard === 'Painel' ? 'mais' : 'more'}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
