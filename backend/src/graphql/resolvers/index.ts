import { CURRENCIES, TIME_ZONES } from '../../services/reference.js';
import { DateTime } from '../scalars.js';
import { adminResolvers } from './admin.js';
import { authResolvers } from './auth.js';
import { catalogResolvers } from './catalog.js';
import { chatResolvers } from './chat.js';
import { moneyResolvers } from './money.js';

const referenceResolvers = {
  Query: {
    currencies: () => CURRENCIES,
    timeZones: () => TIME_ZONES,
  },
};

const modules = [authResolvers, catalogResolvers, moneyResolvers, chatResolvers, adminResolvers, referenceResolvers];

export const resolvers = {
  DateTime,
  Query: Object.assign({}, ...modules.map((m) => m.Query)),
  Mutation: Object.assign({}, ...modules.map((m) => ('Mutation' in m ? m.Mutation : {}))),
};
