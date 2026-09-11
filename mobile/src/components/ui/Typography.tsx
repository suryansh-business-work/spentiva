import { Text, styled } from 'tamagui';
import { C } from '@/theme/colors';

export const Title = styled(Text, { fontSize: 26, fontWeight: '800', color: C.ink, letterSpacing: -0.6 });
export const H2 = styled(Text, { fontSize: 18, fontWeight: '700', color: C.ink, letterSpacing: -0.2 });
export const H3 = styled(Text, { fontSize: 15, fontWeight: '700', color: C.ink });
export const Body = styled(Text, { fontSize: 14, color: C.ink });
export const Muted = styled(Text, { fontSize: 13, color: C.sub });
export const Tiny = styled(Text, { fontSize: 11, color: C.faint });
export const Amount = styled(Text, { fontSize: 30, fontWeight: '800', color: C.ink, letterSpacing: -1 });
export const Success = styled(Text, { fontSize: 13, color: C.green, fontWeight: '600' });
