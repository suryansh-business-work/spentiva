import { z } from 'zod';
import type { AdminUserFieldsFragment, RulesFieldsFragment, UserRole, UserUpdateInput } from '@/gql/graphql';
import { ROLE_LABELS, optionsOf } from '@/lib/labels';

const ROLES = Object.keys(ROLE_LABELS) as [UserRole, ...UserRole[]];
export const ROLE_OPTIONS = optionsOf(ROLE_LABELS);

/** Name limit from the API; when editing yourself you can't drop admin access or disable the account */
export const userEditSchema = (rules: Pick<RulesFieldsFragment, 'nameMax'>, isSelf: boolean) =>
  z
    .object({
      name: z.string().trim().min(1, 'Enter a name').max(rules.nameMax, `Use at most ${rules.nameMax} characters`),
      role: z.enum(ROLES),
      disabled: z.boolean(),
    })
    .superRefine((v, ctx) => {
      if (!isSelf) return;
      if (v.role !== 'ADMIN') ctx.addIssue({ code: 'custom', path: ['role'], message: "You can't remove your own admin access" });
      if (v.disabled) ctx.addIssue({ code: 'custom', path: ['disabled'], message: "You can't disable your own account" });
    });

export type UserEditValues = z.infer<ReturnType<typeof userEditSchema>>;

export const userEditDefaults = (u: AdminUserFieldsFragment): UserEditValues => ({ name: u.name, role: u.role, disabled: u.disabled });

export const toUserUpdate = (v: UserEditValues): UserUpdateInput => ({ name: v.name.trim(), role: v.role, disabled: v.disabled });
