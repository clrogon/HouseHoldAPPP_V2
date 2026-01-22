import type { ScannedReceipt, ReceiptLineItem } from '@/features/scanning/types/scanning.types';

export const mockScannedReceipts: ScannedReceipt[] = [
  {
    id: '1',
    storeName: 'Kero Supermercado',
    date: new Date().toISOString(),
    total: 15500,
    items: [
      { name: 'Arroz 5kg', quantity: 1, price: 4500, category: 'Pantry' },
      { name: 'Óleo Vegetal 1L', quantity: 2, price: 2500, category: 'Pantry' },
      { name: 'Açúcar 1kg', quantity: 1, price: 1500, category: 'Pantry' },
      { name: 'Leite 1L', quantity: 2, price: 900, category: 'Refrigerator' },
      { name: 'Pão de Forma', quantity: 1, price: 850, category: 'Pantry' },
    ],
    processedAt: new Date(Date.now() - 86400000).toISOString(),
    householdId: '1',
  },
  {
    id: '2',
    storeName: 'Shoprite',
    date: new Date(Date.now() - 86400000 * 3).toISOString(),
    total: 8750,
    items: [
      { name: 'Detergente Omo 2kg', quantity: 1, price: 3500, category: 'Cleaning' },
      { name: 'Sabão Dove', quantity: 3, price: 650, category: 'Bathroom' },
      { name: 'Pasta de Dentes Colgate', quantity: 2, price: 800, category: 'Bathroom' },
      { name: 'Papel Higiénico 4 rolos', quantity: 1, price: 1200, category: 'Bathroom' },
    ],
    processedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    householdId: '1',
  },
  {
    id: '3',
    storeName: 'Jumbo',
    date: new Date(Date.now() - 86400000 * 7).toISOString(),
    total: 22300,
    items: [
      { name: 'Peito de Frango 1kg', quantity: 2, price: 4500, category: 'Freezer' },
      { name: 'Legumes Congelados 500g', quantity: 3, price: 1200, category: 'Freezer' },
      { name: 'Peixe Carapau 1kg', quantity: 1, price: 3800, category: 'Freezer' },
      { name: 'Massa Esparguete 500g', quantity: 4, price: 450, category: 'Pantry' },
      { name: 'Molho de Tomate 400g', quantity: 3, price: 600, category: 'Pantry' },
    ],
    processedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    householdId: '1',
  },
];

// Mock barcode database for common products
export const mockBarcodeDatabase: Record<string, { name: string; category: string; defaultPrice: number }> = {
  '5601234567890': { name: 'Arroz Tio João 5kg', category: 'Pantry', defaultPrice: 4500 },
  '5607891234567': { name: 'Óleo Fula 1L', category: 'Pantry', defaultPrice: 2500 },
  '5609876543210': { name: 'Açúcar Sidul 1kg', category: 'Pantry', defaultPrice: 1500 },
  '5601122334455': { name: 'Leite Mimosa 1L', category: 'Refrigerator', defaultPrice: 900 },
  '5602233445566': { name: 'Detergente Skip 2kg', category: 'Cleaning', defaultPrice: 3800 },
  '5603344556677': { name: 'Coca-Cola 1.5L', category: 'Refrigerator', defaultPrice: 650 },
  '5604455667788': { name: 'Água Luso 1.5L', category: 'Pantry', defaultPrice: 350 },
};

// Mock API functions
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getScannedReceipts(): Promise<ScannedReceipt[]> {
  await delay(300);
  return [...mockScannedReceipts].sort(
    (a, b) => new Date(b.processedAt).getTime() - new Date(a.processedAt).getTime()
  );
}

export async function getScannedReceiptById(id: string): Promise<ScannedReceipt | undefined> {
  await delay(300);
  return mockScannedReceipts.find(r => r.id === id);
}

export async function saveScannedReceipt(
  receipt: Omit<ScannedReceipt, 'id' | 'processedAt'>
): Promise<ScannedReceipt> {
  await delay(500);
  const newReceipt: ScannedReceipt = {
    ...receipt,
    id: String(mockScannedReceipts.length + 1),
    processedAt: new Date().toISOString(),
  };
  mockScannedReceipts.unshift(newReceipt);
  return newReceipt;
}

export async function deleteScannedReceipt(id: string): Promise<void> {
  await delay(300);
  const index = mockScannedReceipts.findIndex(r => r.id === id);
  if (index !== -1) {
    mockScannedReceipts.splice(index, 1);
  }
}

export async function lookupBarcode(
  barcode: string
): Promise<{ name: string; category: string; defaultPrice: number } | null> {
  await delay(200);
  return mockBarcodeDatabase[barcode] || null;
}

export async function addReceiptItemsToInventory(
  items: ReceiptLineItem[]
): Promise<{ success: boolean; updatedCount: number }> {
  await delay(500);
  // In a real implementation, this would update the inventory
  return { success: true, updatedCount: items.length };
}

export async function createTransactionFromReceipt(
  receipt: ScannedReceipt
): Promise<{ success: boolean; transactionId: string }> {
  await delay(500);
  // In a real implementation, this would create a finance transaction
  return { success: true, transactionId: `txn_${Date.now()}` };
}
