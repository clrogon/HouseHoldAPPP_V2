export interface ParsedReceipt {
  id: string;
  imageData: string;
  storeName?: string;
  storeAddress?: string;
  date?: string;
  items: ParsedReceiptItem[];
  subtotal?: number;
  tax?: number;
  total?: number;
  paymentMethod?: string;
  rawText: string;
  confidence: number;
  ocrService: 'tesseract' | 'openai' | 'google';
  processedAt: string;
}

export interface ParsedReceiptItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category?: string;
  matchedInventoryId?: string;
  confidence: number;
}

export interface ScanResult {
  type: 'barcode' | 'receipt';
  data: string;
  format?: string;
  timestamp: string;
}

export interface BarcodeResult {
  text: string;
  format: string;
  rawBytes?: Uint8Array;
}

export interface OCRServiceConfig {
  service: 'tesseract' | 'openai' | 'google';
  apiKey?: string;
  enabled: boolean;
}

export interface ScannedReceipt {
  id: string;
  imageUrl?: string;
  storeName: string;
  date: string;
  total: number;
  items: ReceiptLineItem[];
  linkedTransactionId?: string;
  linkedInventoryUpdates?: string[];
  processedAt: string;
  householdId: string;
}

export interface ReceiptLineItem {
  name: string;
  quantity: number;
  price: number;
  category?: string;
}

export type ScanMode = 'receipt' | 'barcode';

export interface ProductLookupResult {
  name: string;
  brand?: string;
  category?: string;
  imageUrl?: string;
  barcode: string;
}
