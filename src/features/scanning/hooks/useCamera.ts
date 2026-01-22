import { useState, useCallback, useRef } from 'react';
import Webcam from 'react-webcam';

export interface UseCameraOptions {
  facingMode?: 'user' | 'environment';
  width?: number;
  height?: number;
}

export interface UseCameraResult {
  webcamRef: React.RefObject<Webcam | null>;
  hasPermission: boolean | null;
  isReady: boolean;
  error: string | null;
  capture: () => string | null;
  handleUserMedia: () => void;
  handleUserMediaError: (error: Error | string) => void;
}

export function useCamera(options: UseCameraOptions = {}): UseCameraResult {
  const { facingMode = 'environment' } = options;

  const webcamRef = useRef<Webcam | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUserMedia = useCallback(() => {
    setHasPermission(true);
    setIsReady(true);
    setError(null);
  }, []);

  const handleUserMediaError = useCallback((err: Error | string) => {
    setHasPermission(false);
    setIsReady(false);

    const errorMessage = typeof err === 'string' ? err : err.message;

    if (errorMessage.includes('Permission denied') || errorMessage.includes('NotAllowedError')) {
      setError('Permissão de câmara negada. Por favor, permita o acesso à câmara nas definições do navegador.');
    } else if (errorMessage.includes('NotFoundError') || errorMessage.includes('DevicesNotFoundError')) {
      setError('Nenhuma câmara encontrada. Por favor, conecte uma câmara ou use o upload de imagem.');
    } else {
      setError(`Erro ao aceder à câmara: ${errorMessage}`);
    }
  }, []);

  const capture = useCallback((): string | null => {
    if (!webcamRef.current) return null;

    try {
      const imageSrc = webcamRef.current.getScreenshot();
      return imageSrc;
    } catch (err) {
      console.error('Error capturing image:', err);
      return null;
    }
  }, []);

  return {
    webcamRef,
    hasPermission,
    isReady,
    error,
    capture,
    handleUserMedia,
    handleUserMediaError,
  };
}

export const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: 'environment',
};

export const mobileVideoConstraints = {
  width: 720,
  height: 1280,
  facingMode: { exact: 'environment' },
};
