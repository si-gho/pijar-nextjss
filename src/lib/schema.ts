import { pgTable, serial, text, integer, numeric, timestamp, varchar, boolean, date } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// NextAuth required tables
export const users = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: timestamp('email_verified'),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  role: varchar('role').default('operator'),
  password: text('password').notNull(),
});

// Alias for compatibility
export const user = users;

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
});

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Projects table
export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  location: varchar('location'),
  startDate: date('start_date'),
  endDate: date('end_date'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Inventories table (materials/stocks)
export const inventories = pgTable('inventories', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id').references(() => projects.id),
  name: varchar('name').notNull(),
  unit: varchar('unit').notNull(),
  initialStock: numeric('initial_stock').default('0'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Transactions table
export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id').references(() => projects.id),
  inventoryId: integer('inventory_id').references(() => inventories.id),
  userId: text('user_id').references(() => user.id),
  type: varchar('type').notNull(), // 'in' or 'out'
  quantity: numeric('quantity').notNull(),
  unit: varchar('unit').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const projectsRelations = relations(projects, ({ many }) => ({
  inventories: many(inventories),
  transactions: many(transactions),
}));

export const inventoriesRelations = relations(inventories, ({ one, many }) => ({
  project: one(projects, {
    fields: [inventories.projectId],
    references: [projects.id],
  }),
  transactions: many(transactions),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  project: one(projects, {
    fields: [transactions.projectId],
    references: [projects.id],
  }),
  inventory: one(inventories, {
    fields: [transactions.inventoryId],
    references: [inventories.id],
  }),
  user: one(user, {
    fields: [transactions.userId],
    references: [user.id],
  }),
}));

export const userRelations = relations(user, ({ many }) => ({
  transactions: many(transactions),
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));