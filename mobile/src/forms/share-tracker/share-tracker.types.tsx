import { z } from 'zod';
import { MEMBER_ROLE_OPTIONS } from '@/lib/constants';
import { zEmail } from '../validators';

type MemberRole = (typeof MEMBER_ROLE_OPTIONS)[number]['value'];
const ROLES = MEMBER_ROLE_OPTIONS.map((o) => o.value) as [MemberRole, ...MemberRole[]];

/** Who to share with (an existing Spentiva account) and what they may do */
export const shareTrackerSchema = z.object({
  email: zEmail,
  role: z.enum(ROLES, 'Pick what they can do'),
});

export type ShareTrackerValues = z.infer<typeof shareTrackerSchema>;

export const shareTrackerDefaults: ShareTrackerValues = { email: '', role: 'EDITOR' };
