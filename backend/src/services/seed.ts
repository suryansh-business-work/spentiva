import type { Types } from 'mongoose';
import { Category } from '../models/Category.js';
import { PaymentSource } from '../models/PaymentSource.js';
import type { TrackerKind } from '../models/Tracker.js';

interface CategorySeed {
  name: string;
  icon: string;
  color: string;
  items: string[];
}

interface SourceSeed {
  name: string;
  icon: string;
  isDefault: boolean;
}

interface TrackerTemplate {
  expense: CategorySeed[];
  income: CategorySeed[];
  sources: SourceSeed[];
}

/** Editable starting categories and payment modes for each kind of tracker */
const TEMPLATES: Record<TrackerKind, TrackerTemplate> = {
  PERSONAL: {
    expense: [
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
    ],
    income: [
      { name: 'Salary', icon: 'salary', color: '#5DA314', items: [] },
      { name: 'Freelance', icon: 'freelance', color: '#84CC16', items: [] },
      { name: 'Business', icon: 'business', color: '#16A34A', items: [] },
      { name: 'Investments', icon: 'investment', color: '#0D9488', items: ['Interest', 'Dividends'] },
      { name: 'Gifts', icon: 'gift', color: '#F97316', items: [] },
      { name: 'Other Income', icon: 'other', color: '#65A30D', items: [] },
    ],
    sources: [
      { name: 'Cash', icon: 'cash', isDefault: true },
      { name: 'UPI', icon: 'upi', isDefault: false },
      { name: 'Debit Card', icon: 'card', isDefault: false },
      { name: 'Credit Card', icon: 'credit', isDefault: false },
      { name: 'Bank Transfer', icon: 'bank', isDefault: false },
    ],
  },
  BUSINESS: {
    expense: [
      { name: 'Rent & Office', icon: 'home', color: '#F59E0B', items: ['Rent', 'Maintenance', 'Office Supplies'] },
      { name: 'Salaries', icon: 'salary', color: '#5DA314', items: ['Staff', 'Contractors', 'Bonus'] },
      { name: 'Inventory', icon: 'parcel', color: '#F2B705', items: ['Stock', 'Raw Material', 'Packaging'] },
      { name: 'Marketing', icon: 'star', color: '#EC4899', items: ['Ads', 'Social Media', 'Events'] },
      { name: 'Utilities', icon: 'utilities', color: '#8B5CF6', items: ['Electricity', 'Internet', 'Phone'] },
      { name: 'Software', icon: 'tech', color: '#3B82F6', items: ['Subscriptions', 'Hosting', 'Licenses'] },
      { name: 'Travel', icon: 'travel', color: '#0EA5E9', items: ['Flights', 'Hotels', 'Local Transport'] },
      { name: 'Taxes & Fees', icon: 'bills', color: '#E5484D', items: ['GST', 'Income Tax', 'Bank Charges'] },
      { name: 'Professional Services', icon: 'business', color: '#14B8A6', items: ['Accounting', 'Legal', 'Consulting'] },
      { name: 'Equipment', icon: 'repair', color: '#6B7280', items: ['Hardware', 'Furniture', 'Repairs'] },
      { name: 'Other', icon: 'other', color: '#22C3E6', items: [] },
    ],
    income: [
      { name: 'Sales', icon: 'business', color: '#16A34A', items: ['Products', 'Online', 'Retail'] },
      { name: 'Services', icon: 'freelance', color: '#5DA314', items: ['Projects', 'Retainers'] },
      { name: 'Interest', icon: 'investment', color: '#0D9488', items: [] },
      { name: 'Other Income', icon: 'other', color: '#65A30D', items: [] },
    ],
    sources: [
      { name: 'Bank Transfer', icon: 'bank', isDefault: true },
      { name: 'UPI', icon: 'upi', isDefault: false },
      { name: 'Business Card', icon: 'credit', isDefault: false },
      { name: 'Cash', icon: 'cash', isDefault: false },
    ],
  },
};

/** Give a brand new tracker sensible, editable defaults for its kind */
export async function seedTracker(trackerId: Types.ObjectId, kind: TrackerKind): Promise<void> {
  const template = TEMPLATES[kind];
  const toDocs = (list: CategorySeed[], type: 'EXPENSE' | 'INCOME') =>
    list.map((c) => ({ ...c, type, trackerId, items: c.items.map((name) => ({ name })) }));
  await Promise.all([
    Category.insertMany([...toDocs(template.expense, 'EXPENSE'), ...toDocs(template.income, 'INCOME')]),
    PaymentSource.insertMany(template.sources.map((s) => ({ ...s, trackerId }))),
  ]);
}
