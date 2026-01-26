import { useState, useCallback } from 'react';
import { Barcode, Loader2, Search, Package, Plus, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import { ScannerCamera } from './ScannerCamera';
import { scanBarcodeFromImage, lookupProduct, formatBarcodeType } from '../services/barcodeService';
import type { BarcodeResult, ProductLookupResult } from '../types/scanning.types';

interface BarcodeScannerProps {
  onAddToInventory?: (product: ProductLookupResult & { quantity: number }) => Promise<void>;
  onAddToShoppingList?: (product: ProductLookupResult) => Promise<void>;
}

export function BarcodeScanner({ onAddToInventory, onAddToShoppingList }: BarcodeScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [lastResult, setLastResult] = useState<BarcodeResult | null>(null);
  const [product, setProduct] = useState<ProductLookupResult | null>(null);
  const [manualBarcode, setManualBarcode] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleCapture = useCallback(async (imageData: string) => {
    setIsScanning(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await scanBarcodeFromImage(imageData);

      if (result) {
        setLastResult(result);
        await handleLookup(result.text);
      } else {
        setError('Nenhum código de barras encontrado. Tente novamente.');
      }
    } catch (err) {
      setError('Erro ao digitalizar. Tente novamente.');
    } finally {
      setIsScanning(false);
    }
  }, []);

  const handleLookup = async (barcode: string) => {
    setIsLookingUp(true);
    setProduct(null);

    try {
      const result = await lookupProduct(barcode);
      if (result) {
        setProduct(result);
      } else {
        setError('Produto não encontrado. Pode adicioná-lo manualmente.');
      }
    } catch (err) {
      setError('Erro ao procurar produto.');
    } finally {
      setIsLookingUp(false);
    }
  };

  const handleManualLookup = () => {
    if (manualBarcode.trim()) {
      setLastResult({
        text: manualBarcode.trim(),
        format: 'MANUAL',
      });
      handleLookup(manualBarcode.trim());
    }
  };

  const handleAddToInventory = async () => {
    if (!product || !onAddToInventory) return;

    try {
      await onAddToInventory({ ...product, quantity });
      setSuccess(`${product.name} adicionado ao inventário!`);
      setTimeout(() => {
        setProduct(null);
        setLastResult(null);
        setSuccess(null);
        setQuantity(1);
      }, 2000);
    } catch (err) {
      setError('Erro ao adicionar ao inventário.');
    }
  };

  const handleAddToShoppingList = async () => {
    if (!product || !onAddToShoppingList) return;

    try {
      await onAddToShoppingList(product);
      setSuccess(`${product.name} adicionado à lista de compras!`);
      setTimeout(() => {
        setProduct(null);
        setLastResult(null);
        setSuccess(null);
      }, 2000);
    } catch (err) {
      setError('Erro ao adicionar à lista.');
    }
  };

  const handleReset = () => {
    setLastResult(null);
    setProduct(null);
    setError(null);
    setSuccess(null);
    setManualBarcode('');
    setQuantity(1);
  };

  // Show product details if found
  if (product) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Produto Encontrado
          </CardTitle>
          <CardDescription>
            Código: {lastResult?.text}
            {lastResult?.format && lastResult.format !== 'MANUAL' && (
              <Badge variant="outline" className="ml-2">
                {formatBarcodeType(lastResult.format)}
              </Badge>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {success ? (
            <div className="flex items-center justify-center py-8 text-green-600 dark:text-green-400">
              <Check className="h-8 w-8 mr-2" />
              <span className="text-lg font-medium">{success}</span>
            </div>
          ) : (
            <>
              <div className="flex gap-4">
                {product.imageUrl && (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-24 h-24 object-contain rounded-lg bg-muted"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  {product.brand && (
                    <p className="text-sm text-muted-foreground">{product.brand}</p>
                  )}
                  {product.category && (
                    <Badge variant="secondary" className="mt-1">
                      {product.category}
                    </Badge>
                  )}
                </div>
              </div>

              {onAddToInventory && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Quantidade:</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center text-lg font-semibold">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              )}

              <div className="flex gap-2">
                {onAddToInventory && (
                  <Button onClick={handleAddToInventory} className="flex-1">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar ao Inventário
                  </Button>
                )}
                {onAddToShoppingList && (
                  <Button variant="outline" onClick={handleAddToShoppingList}>
                    Adicionar à Lista
                  </Button>
                )}
              </div>

              <Button variant="ghost" onClick={handleReset} className="w-full">
                Digitalizar Outro
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Barcode className="h-5 w-5" />
          Ler Código de Barras
        </CardTitle>
        <CardDescription>
          Aponte a câmara para o código de barras do produto
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-0">
        {/* Camera */}
        <div className="relative">
          <ScannerCamera
            onCapture={handleCapture}
            className="h-[300px]"
          />
          {(isScanning || isLookingUp) && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center text-white">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                <p>{isScanning ? 'A digitalizar...' : 'A procurar produto...'}</p>
              </div>
            </div>
          )}
        </div>

        {/* Manual input */}
        <div className="px-4 pb-4 space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Ou insira o código manualmente..."
              value={manualBarcode}
              onChange={(e) => setManualBarcode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleManualLookup()}
            />
            <Button onClick={handleManualLookup} disabled={!manualBarcode.trim()}>
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
