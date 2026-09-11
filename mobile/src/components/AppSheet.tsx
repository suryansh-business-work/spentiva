import type { ReactNode } from 'react';
import { Sheet } from 'tamagui';
import { C } from '@/theme/colors';

interface AppSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  /** Height as % of the screen; omit to size to content */
  heightPercent?: number;
}

/** Bottom sheet with the app's overlay, handle and rounded frame */
export function AppSheet({ open, onOpenChange, children, heightPercent }: Readonly<AppSheetProps>) {
  const sizing = heightPercent ? { snapPoints: [heightPercent], snapPointsMode: 'percent' as const } : { snapPointsMode: 'fit' as const };
  return (
    <Sheet modal open={open} onOpenChange={onOpenChange} dismissOnSnapToBottom moveOnKeyboardChange transition="quick" {...sizing}>
      <Sheet.Overlay backgroundColor="rgba(0,0,0,0.35)" transition="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
      <Sheet.Handle backgroundColor={C.line} />
      <Sheet.Frame backgroundColor={C.white} borderTopLeftRadius={28} borderTopRightRadius={28} padding={20} paddingBottom={36} gap={14}>
        {children}
      </Sheet.Frame>
    </Sheet>
  );
}
