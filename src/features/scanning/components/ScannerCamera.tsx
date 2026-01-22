import { useRef, ChangeEvent } from 'react';
import Webcam from 'react-webcam';
import { Camera, Upload, RotateCcw, X } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useCamera, videoConstraints } from '../hooks/useCamera';
import { cn } from '@/shared/lib/utils';

interface ScannerCameraProps {
  onCapture: (imageData: string) => void;
  onClose?: () => void;
  className?: string;
}

export function ScannerCamera({ onCapture, onClose, className }: ScannerCameraProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    webcamRef,
    hasPermission,
    isReady,
    error,
    capture,
    handleUserMedia,
    handleUserMediaError,
  } = useCamera();

  const handleCapture = () => {
    const imageSrc = capture();
    if (imageSrc) {
      onCapture(imageSrc);
    }
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageData = event.target?.result as string;
      if (imageData) {
        onCapture(imageData);
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn('relative rounded-lg overflow-hidden bg-black', className)}>
      {/* Close button */}
      {onClose && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/70 text-white"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>
      )}

      {/* Camera view */}
      {hasPermission !== false && (
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          onUserMedia={handleUserMedia}
          onUserMediaError={handleUserMediaError}
          className="w-full h-full object-cover"
        />
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/90 p-4 text-center">
          <Camera className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <Button onClick={triggerFileUpload} variant="secondary">
            <Upload className="h-4 w-4 mr-2" />
            Carregar Imagem
          </Button>
        </div>
      )}

      {/* Loading state */}
      {hasPermission === null && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/90">
          <div className="text-center">
            <Camera className="h-12 w-12 text-muted-foreground mb-2 mx-auto animate-pulse" />
            <p className="text-sm text-muted-foreground">A aceder à câmara...</p>
          </div>
        </div>
      )}

      {/* Scan overlay */}
      {isReady && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Scan frame */}
          <div className="absolute inset-8 border-2 border-white/50 rounded-lg">
            <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg" />
            <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg" />
            <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg" />
            <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg" />
          </div>

          {/* Scan line animation */}
          <div className="absolute left-8 right-8 top-8 h-0.5 bg-primary/70 animate-pulse" />
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
        <Button
          size="lg"
          variant="secondary"
          onClick={triggerFileUpload}
          className="rounded-full"
        >
          <Upload className="h-5 w-5" />
        </Button>

        <Button
          size="lg"
          onClick={handleCapture}
          disabled={!isReady}
          className="rounded-full h-16 w-16"
        >
          <Camera className="h-6 w-6" />
        </Button>

        <Button
          size="lg"
          variant="secondary"
          onClick={() => window.location.reload()}
          className="rounded-full"
        >
          <RotateCcw className="h-5 w-5" />
        </Button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
}
