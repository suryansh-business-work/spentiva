import type { Types } from 'mongoose';
import { Category } from '../models/Category.js';
import { PaymentSource } from '../models/PaymentSource.js';

const EXPENSE = [
  { name: 'Food', icon: 'food', color: '#F2B705', items: ['Groceries', 'Restaurant', 'Snacks', 'Coffee'] },
  { name: 'Transport', icon: 'transport', color: '#3B82F6', items: ['Fuel', 'Taxi', 'Metro', 'Parking'] },
  { name: 'Housing', icon: 'home', color: '#F59E0B', items: ['Rent', 'Electricity', 'Water', 'Maintenance'] },
  { name: 'Shopping', icon: 'shopping', color: '#EC4899', items: ['Clothes', 'Electronics', 'Household'] },
  { name: 'Health', icon: 'health', color: '#E5484D', items: ['Medicine', 'Doctor', 'Gym'] },
  { name: 'Entertainment', icon: 'entertainment', color: '#6B7280', items: ['Movies', 'Subscriptions', 'Games'] },
  { name: 'Bills', icon: 'bills', color: '#8B5CF6', items: ['Mobile', 'Internet', 'Insurance'] },
  { name: 'Education', icon: 'education', color: '#14B8A6', items: ['Books', 'Courses', 'Fees'] },
  { name: 'Travel', icon: 'travel', color: '#0EA5E9', items: ['Flights', 'Hotels', 'Trains'] },
  { name: 'Other', icon: 'other', color: '#22C3E6', items: [] },
];

const INCOME = [
  { name: 'Salary', icon: 'salary', color: '#5DA314', items: [] },
  { name: 'Freelance', icon: 'freelance', color: '#84CC16', items: [] },
  { name: 'Business', icon: 'business', color: '#16A34A', items: [] },
  { name: 'Investments', icon: 'investment', color: '#0D9488', items: ['Interest', 'Dividends'] },
  { name: 'Gifts', icon: 'gift', color: '#F97316', items: [] },
  { name: 'Other Income', icon: 'other', color: '#65A30D', items: [] },
];

const SOURCES = [
  { name: 'Cash', icon: 'cash', isDefault: true },
  { name: 'UPI', icon: 'upi', isDefault: false },
  { name: 'Debit Card', icon: 'card', isDefault: false },
  { name: 'Credit Card', icon: 'credit', isDefault: false },
  { name: 'Bank Transfer', icon: 'bank', isDefault: false },
];

/** Give a brand new user sensible, editable defaults */
export async function seedUserDefaults(userId: Types.ObjectId): Promise<void> {
  const toDocs = (list: typeof EXPENSE, type: 'EXPENSE' | 'INCOME') =>
    list.map((c) => ({ ...c, type, userId, items: c.items.map((name) => ({ name })) }));
  await Promise.all([
    Category.insertMany([...toDocs(EXPENSE, 'EXPENSE'), ...toDocs(INCOME, 'INCOME')]),
    PaymentSource.insertMany(SOURCES.map((s) => ({ ...s, userId }))),
  ]);
}
