// Stub file - API integration pending

import type { ScannedReceipt, ReceiptLineItem } from '@/features/scanning/types/scanning.types';

export const mockScannedReceipts: ScannedReceipt[] = [];

export const mockBarcodeDatabase: Record<string, { name: string; category: string; defaultPrice: number }> = {};

export async function getScannedReceipts(): Promise<ScannedReceipt[]> {
  return [];
}

export async function getScannedReceiptById(_id: string): Promise<ScannedReceipt | undefined> {
  return undefined;
}

export async function saveScannedReceipt(
  receipt: Omit<ScannedReceipt, 'id' | 'processedAt'>
): Promise<ScannedReceipt> {
  return {
    ...receipt,
    id: String(Date.now()),
    processedAt: new Date().toISOString(),
  };
}

export async function deleteScannedReceipt(_id: string): Promise<void> {
  return;
}

export async function lookupBarcode(
  barcode: string
): Promise<{ name: string; category: string; defaultPrice: number } | null> {
  return mockBarcodeDatabase[barcode] || null;
}

export async function addReceiptItemsToInventory(
  _items: ReceiptLineItem[]
): Promise<{ success: boolean; updatedCount: number }> {
  return { success: true, updatedCount: 0 };
}

export async function createTransactionFromReceipt(
  _receipt: ScannedReceipt
): Promise<{ success: boolean; transactionId: string }> {
  return { success: true, transactionId: `txn_${Date.now()}` };
}
