import { pgTable, serial, text, integer, numeric, timestamp, varchar, boolean, date } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table
export const users = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email'),
  emailVerified: boolean('email_verified'),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  isAnonymous: boolean('is_anonymous'),
  username: varchar('username'),
  passwordHash: text('password_hash'),
  role: varchar('role'),
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
  userId: text('user_id').references(() => users.id),
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
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  transactions: many(transactions),
}));