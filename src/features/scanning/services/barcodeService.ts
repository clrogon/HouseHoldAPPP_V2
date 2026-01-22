import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import type { BarcodeResult, ProductLookupResult } from '../types/scanning.types';
import { lookupBarcode } from '@/mocks/scanning';

let codeReader: BrowserMultiFormatReader | null = null;

export function getCodeReader(): BrowserMultiFormatReader {
  if (!codeReader) {
    codeReader = new BrowserMultiFormatReader();
  }
  return codeReader;
}

export function resetCodeReader(): void {
  if (codeReader) {
    codeReader.reset();
    codeReader = null;
  }
}

export async function scanBarcodeFromImage(imageData: string): Promise<BarcodeResult | null> {
  const reader = getCodeReader();

  try {
    const result = await reader.decodeFromImageUrl(imageData);
    return {
      text: result.getText(),
      format: result.getBarcodeFormat().toString(),
      rawBytes: result.getRawBytes() || undefined,
    };
  } catch (error) {
    if (error instanceof NotFoundException) {
      return null;
    }
    throw error;
  }
}

export async function startContinuousScan(
  videoElement: HTMLVideoElement,
  onResult: (result: BarcodeResult) => void,
  onError?: (error: Error) => void
): Promise<() => void> {
  const reader = getCodeReader();

  try {
    const controls = await reader.decodeFromVideoDevice(
      undefined,
      videoElement,
      (result, error) => {
        if (result) {
          onResult({
            text: result.getText(),
            format: result.getBarcodeFormat().toString(),
            rawBytes: result.getRawBytes() || undefined,
          });
        }
        if (error && !(error instanceof NotFoundException)) {
          onError?.(error as Error);
        }
      }
    );

    return () => {
      controls.stop();
    };
  } catch (error) {
    onError?.(error as Error);
    return () => {};
  }
}

export async function lookupProduct(barcode: string): Promise<ProductLookupResult | null> {
  // First check local mock database
  const localResult = await lookupBarcode(barcode);
  if (localResult) {
    return {
      name: localResult.name,
      category: localResult.category,
      barcode,
    };
  }

  // Try Open Food Facts API (public, no API key needed)
  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
    );

    if (!response.ok) return null;

    const data = await response.json();

    if (data.status === 1 && data.product) {
      return {
        name: data.product.product_name || data.product.generic_name || 'Unknown Product',
        brand: data.product.brands,
        category: mapOpenFoodFactsCategory(data.product.categories_tags),
        imageUrl: data.product.image_small_url,
        barcode,
      };
    }
  } catch (error) {
    console.error('Error looking up product:', error);
  }

  return null;
}

function mapOpenFoodFactsCategory(categoryTags?: string[]): string {
  if (!categoryTags || categoryTags.length === 0) return 'Pantry';

  const categoryMap: Record<string, string> = {
    'en:beverages': 'Refrigerator',
    'en:dairy': 'Refrigerator',
    'en:meat': 'Freezer',
    'en:frozen': 'Freezer',
    'en:cleaning': 'Cleaning',
    'en:personal-care': 'Bathroom',
  };

  for (const tag of categoryTags) {
    for (const [pattern, category] of Object.entries(categoryMap)) {
      if (tag.includes(pattern)) {
        return category;
      }
    }
  }

  return 'Pantry';
}

export function formatBarcodeType(format: string): string {
  const formatMap: Record<string, string> = {
    'EAN_13': 'EAN-13',
    'EAN_8': 'EAN-8',
    'UPC_A': 'UPC-A',
    'UPC_E': 'UPC-E',
    'QR_CODE': 'QR Code',
    'CODE_128': 'Code 128',
    'CODE_39': 'Code 39',
  };

  return formatMap[format] || format;
}
