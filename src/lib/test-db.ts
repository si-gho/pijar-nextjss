import { db } from './db';
import { projects, inventories, users, transactions } from './schema';

export async function testDatabaseConnection() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test basic connection
    const result = await db.select().from(projects).limit(1);
    console.log('✅ Database connection successful');
    
    // Test all tables
    const projectsCount = await db.select().from(projects);
    const inventoriesCount = await db.select().from(inventories);
    const usersCount = await db.select().from(users);
    const transactionsCount = await db.select().from(transactions);
    
    console.log('📊 Database Status:');
    console.log(`- Projects: ${projectsCount.length} records`);
    console.log(`- Inventories: ${inventoriesCount.length} records`);
    console.log(`- Users: ${usersCount.length} records`);
    console.log(`- Transactions: ${transactionsCount.length} records`);
    
    return {
      success: true,
      data: {
        projects: projectsCount.length,
        inventories: inventoriesCount.length,
        users: usersCount.length,
        transactions: transactionsCount.length,
      }
    };
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}