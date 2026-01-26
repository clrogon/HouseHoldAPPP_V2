import { useState, useCallback } from 'react';
import { performOCR, preprocessImage, type OCRProgress } from '../services/ocrService';
import { parseReceipt, type ParsedReceiptData } from '../services/receiptParser';

export interface UseOCRResult {
  isProcessing: boolean;
  progress: OCRProgress | null;
  result: ParsedReceiptData | null;
  rawText: string | null;
  confidence: number | null;
  error: string | null;
  processImage: (imageData: string) => Promise<ParsedReceiptData | null>;
  reset: () => void;
}

export function useOCR(): UseOCRResult {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<OCRProgress | null>(null);
  const [result, setResult] = useState<ParsedReceiptData | null>(null);
  const [rawText, setRawText] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const processImage = useCallback(async (imageData: string): Promise<ParsedReceiptData | null> => {
    setIsProcessing(true);
    setProgress({ status: 'Preparando imagem...', progress: 0 });
    setError(null);
    setResult(null);
    setRawText(null);
    setConfidence(null);

    try {
      // Preprocess image for better OCR results
      setProgress({ status: 'Otimizando imagem...', progress: 0.1 });
      const processedImage = await preprocessImage(imageData);

      // Perform OCR
      const ocrResult = await performOCR(processedImage, (p) => {
        const statusMap: Record<string, string> = {
          'loading tesseract core': 'A carregar motor OCR...',
          'initializing tesseract': 'A inicializar...',
          'loading language traineddata': 'A carregar idioma...',
          'initializing api': 'A preparar análise...',
          'recognizing text': 'A reconhecer texto...',
        };

        setProgress({
          status: statusMap[p.status] || p.status,
          progress: p.progress,
        });
      });

      // Parse the OCR result
      setProgress({ status: 'A analisar recibo...', progress: 0.9 });
      const parsedData = parseReceipt(ocrResult.text);

      setRawText(ocrResult.text);
      setConfidence(ocrResult.confidence);
      setResult(parsedData);
      setProgress({ status: 'Concluído!', progress: 1 });

      return parsedData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao processar imagem';
      setError(errorMessage);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIsProcessing(false);
    setProgress(null);
    setResult(null);
    setRawText(null);
    setConfidence(null);
    setError(null);
  }, []);

  return {
    isProcessing,
    progress,
    result,
    rawText,
    confidence,
    error,
    processImage,
    reset,
  };
}
