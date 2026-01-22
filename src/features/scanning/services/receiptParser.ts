import type { ParsedReceiptItem, ReceiptLineItem } from '../types/scanning.types';

// Common store name patterns in Angola
const STORE_PATTERNS = [
  /kero/i,
  /shoprite/i,
  /jumbo/i,
  /candando/i,
  /maxi/i,
  /intermarket/i,
  /fresmart/i,
  /nosso\s*super/i,
];

// Category keywords for auto-categorization
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  Pantry: ['arroz', 'massa', 'óleo', 'açúcar', 'sal', 'farinha', 'café', 'chá', 'bolachas', 'cereais', 'conservas', 'molho'],
  Refrigerator: ['leite', 'queijo', 'iogurte', 'manteiga', 'margarina', 'sumo', 'refrigerante', 'água'],
  Freezer: ['frango', 'peixe', 'carne', 'congelado', 'gelado', 'gelo'],
  Cleaning: ['detergente', 'lixívia', 'amaciador', 'desinfetante', 'limpa', 'esfregão'],
  Bathroom: ['sabão', 'shampoo', 'pasta', 'escova', 'papel higiénico', 'desodorizante'],
  Medicine: ['vitamina', 'paracetamol', 'ibuprofeno', 'comprimido', 'xarope'],
};

// Date patterns
const DATE_PATTERNS = [
  /(\d{2})[\/\-.](\d{2})[\/\-.](\d{4})/,  // DD/MM/YYYY
  /(\d{4})[\/\-.](\d{2})[\/\-.](\d{2})/,  // YYYY-MM-DD
  /(\d{2})[\/\-.](\d{2})[\/\-.](\d{2})/,  // DD/MM/YY
];

// Price patterns (Kwanza)
const PRICE_PATTERNS = [
  /(\d+[\.,]?\d*)\s*(?:kz|kwanza|aoa)/i,
  /(?:kz|kwanza|aoa)\s*(\d+[\.,]?\d*)/i,
  /(\d{1,3}(?:[\.,]\d{3})*(?:[\.,]\d{2})?)\s*$/,
];

// Total patterns
const TOTAL_PATTERNS = [
  /total[:\s]+(\d+[\.,]?\d*)/i,
  /valor\s*total[:\s]+(\d+[\.,]?\d*)/i,
  /a\s*pagar[:\s]+(\d+[\.,]?\d*)/i,
  /subtotal[:\s]+(\d+[\.,]?\d*)/i,
];

export interface ParsedReceiptData {
  storeName?: string;
  date?: string;
  items: ReceiptLineItem[];
  subtotal?: number;
  tax?: number;
  total?: number;
  rawLines: string[];
}

export function parseReceipt(ocrText: string): ParsedReceiptData {
  const lines = ocrText.split('\n').map(line => line.trim()).filter(Boolean);
  const rawLines = [...lines];

  const storeName = extractStoreName(lines);
  const date = extractDate(ocrText);
  const total = extractTotal(ocrText);
  const items = extractItems(lines);

  return {
    storeName,
    date,
    items,
    total,
    rawLines,
  };
}

function extractStoreName(lines: string[]): string | undefined {
  // Usually the store name is in the first few lines
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i];
    for (const pattern of STORE_PATTERNS) {
      if (pattern.test(line)) {
        return line;
      }
    }
  }
  // If no known store found, use the first non-empty line
  return lines[0] || undefined;
}

function extractDate(text: string): string | undefined {
  for (const pattern of DATE_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      // Try to parse and format as ISO date
      try {
        let day: number, month: number, year: number;

        if (match[1].length === 4) {
          // YYYY-MM-DD format
          year = parseInt(match[1]);
          month = parseInt(match[2]);
          day = parseInt(match[3]);
        } else if (match[3].length === 4) {
          // DD/MM/YYYY format
          day = parseInt(match[1]);
          month = parseInt(match[2]);
          year = parseInt(match[3]);
        } else {
          // DD/MM/YY format
          day = parseInt(match[1]);
          month = parseInt(match[2]);
          year = 2000 + parseInt(match[3]);
        }

        const date = new Date(year, month - 1, day);
        return date.toISOString();
      } catch {
        continue;
      }
    }
  }
  return undefined;
}

function extractTotal(text: string): number | undefined {
  for (const pattern of TOTAL_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      const value = parsePrice(match[1]);
      if (value !== undefined && value > 0) {
        return value;
      }
    }
  }
  return undefined;
}

function extractItems(lines: string[]): ReceiptLineItem[] {
  const items: ReceiptLineItem[] = [];

  for (const line of lines) {
    // Skip header/footer lines
    if (isHeaderOrFooter(line)) continue;

    // Try to extract item with price
    const item = parseItemLine(line);
    if (item) {
      items.push(item);
    }
  }

  return items;
}

function isHeaderOrFooter(line: string): boolean {
  const skipPatterns = [
    /^(nif|contribuinte|nº|fatura|recibo|data|hora|terminal|operador)/i,
    /^(obrigado|volte sempre|total|subtotal|iva|troco|pago)/i,
    /^[\*\-=]+$/,
    /^\d{4,}$/,  // Long numbers (likely barcodes/IDs)
  ];

  return skipPatterns.some(pattern => pattern.test(line.toLowerCase()));
}

function parseItemLine(line: string): ReceiptLineItem | null {
  // Pattern: "Item name    Qty x Price   Total"
  // Or: "Item name    Total"

  // Try to find a price at the end
  let price: number | undefined;
  let quantity = 1;
  let name = line;

  // Extract price from end of line
  for (const pattern of PRICE_PATTERNS) {
    const match = line.match(pattern);
    if (match) {
      price = parsePrice(match[1]);
      name = line.substring(0, match.index).trim();
      break;
    }
  }

  if (!price || price <= 0) return null;

  // Try to extract quantity
  const qtyMatch = name.match(/(\d+)\s*[xX]\s*/);
  if (qtyMatch) {
    quantity = parseInt(qtyMatch[1]) || 1;
    name = name.replace(qtyMatch[0], '').trim();
  }

  // Clean up name
  name = name.replace(/[\*\-=]+/g, '').trim();

  if (!name || name.length < 2) return null;

  // Auto-categorize
  const category = categorizeItem(name);

  return {
    name,
    quantity,
    price,
    category,
  };
}

function parsePrice(priceStr: string): number | undefined {
  // Remove currency symbols and normalize
  const normalized = priceStr
    .replace(/[kKzZaAoO]/g, '')
    .replace(/\s/g, '')
    .replace(',', '.');

  const value = parseFloat(normalized);
  return isNaN(value) ? undefined : Math.round(value);
}

function categorizeItem(itemName: string): string {
  const nameLower = itemName.toLowerCase();

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (nameLower.includes(keyword)) {
        return category;
      }
    }
  }

  return 'Pantry'; // Default category
}

export function generateReceiptItemId(): string {
  return `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function convertToParsedReceiptItems(items: ReceiptLineItem[]): ParsedReceiptItem[] {
  return items.map(item => ({
    id: generateReceiptItemId(),
    name: item.name,
    quantity: item.quantity,
    unitPrice: Math.round(item.price / item.quantity),
    totalPrice: item.price,
    category: item.category,
    confidence: 80, // Default confidence for parsed items
  }));
}
