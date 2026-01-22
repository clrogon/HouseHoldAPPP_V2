import { Receipt, Barcode } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import type { ScanMode } from '../types/scanning.types';

interface ScanModeSelectorProps {
  mode: ScanMode;
  onModeChange: (mode: ScanMode) => void;
}

export function ScanModeSelector({ mode, onModeChange }: ScanModeSelectorProps) {
  return (
    <Tabs value={mode} onValueChange={(v) => onModeChange(v as ScanMode)}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="receipt" className="gap-2">
          <Receipt className="h-4 w-4" />
          Recibo
        </TabsTrigger>
        <TabsTrigger value="barcode" className="gap-2">
          <Barcode className="h-4 w-4" />
          Código de Barras
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
