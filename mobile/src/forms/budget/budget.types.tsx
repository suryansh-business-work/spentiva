import { z } from 'zod';
import { toOptionalAmount, zOptionalAmount } from '../validators';

export const budgetSchema = z.object({ amount: zOptionalAmount });

export type BudgetValues = z.infer<typeof budgetSchema>;

export const budgetDefaults = (current: number | null): BudgetValues => ({ amount: current ? String(current) : '' });

export const toMonthlyBudget = (v: BudgetValues) => toOptionalAmount(v.amount);
