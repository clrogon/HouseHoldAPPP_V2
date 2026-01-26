// Pages
export { ScanningPage } from './pages/ScanningPage';

// Components
export { BarcodeScanner } from './components/BarcodeScanner';
export { ReceiptScanner } from './components/ReceiptScanner';
export { ReceiptReviewDialog } from './components/ReceiptReviewDialog';
export { ScannerCamera } from './components/ScannerCamera';
export { ScanModeSelector } from './components/ScanModeSelector';

// Hooks
export { useCamera } from './hooks/useCamera';
export { useOCR } from './hooks/useOCR';

// Services
export { scanBarcodeFromImage, lookupProduct, formatBarcodeType } from './services/barcodeService';
export { performOCR, preprocessImage } from './services/ocrService';
export { parseReceipt, convertToParsedReceiptItems } from './services/receiptParser';

// Types
export type {
  ParsedReceipt,
  ParsedReceiptItem,
  ScanResult,
  BarcodeResult,
  OCRServiceConfig,
  ScannedReceipt,
  ReceiptLineItem,
  ScanMode,
  ProductLookupResult,
} from './types/scanning.types';
