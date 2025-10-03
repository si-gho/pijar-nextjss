// Script untuk upload dan verifikasi test data
// Jalankan dengan: node upload-test-data.js

const BASE_URL = 'http://localhost:3000/api';

async function makeRequest(endpoint, method = 'GET') {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, { method });
    const data = await response.json();
    
    return {
      success: response.ok,
      status: response.status,
      data
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

async function uploadTestData() {
  console.log('🚀 Starting test data upload process...\n');

  // Step 1: Test database connection
  console.log('1️⃣ Testing database connection...');
  const dbTest = await makeRequest('/test-db');
  if (!dbTest.success) {
    console.error('❌ Database connection failed:', dbTest.error || dbTest.data);
    return;
  }
  console.log('✅ Database connection successful');
  console.log(`   Current data: ${JSON.stringify(dbTest.data.data, null, 2)}\n`);

  // Step 2: Upload seed data
  console.log('2️⃣ Uploading comprehensive test data...');
  const seedResult = await makeRequest('/seed', 'POST');
  if (!seedResult.success) {
    console.error('❌ Failed to seed database:', seedResult.error || seedResult.data);
    return;
  }
  console.log('✅ Test data uploaded successfully');
  console.log(`   Seeded data: ${JSON.stringify(seedResult.data.data, null, 2)}\n`);

  // Step 3: Verify data with statistics
  console.log('3️⃣ Verifying uploaded data...');
  const statsResult = await makeRequest('/database-stats');
  if (!statsResult.success) {
    console.error('❌ Failed to get database stats:', statsResult.error || statsResult.data);
    return;
  }

  const stats = statsResult.data;
  console.log('✅ Data verification completed');
  console.log('\n📊 DATABASE STATISTICS:');
  console.log('═══════════════════════════════════════');
  console.log(`📁 Projects: ${stats.summary.projects}`);
  console.log(`📦 Inventories: ${stats.summary.inventories}`);
  console.log(`👥 Users: ${stats.summary.users}`);
  console.log(`📊 Transactions: ${stats.summary.transactions.total}`);
  console.log(`   ↗️  Material IN: ${stats.summary.transactions.in}`);
  console.log(`   ↙️  Material OUT: ${stats.summary.transactions.out}`);

  console.log('\n🏗️ PROJECTS OVERVIEW:');
  console.log('═══════════════════════════════════════');
  stats.details.projects.forEach((project, index) => {
    console.log(`${index + 1}. ${project.name}`);
    console.log(`   📍 Location: ${project.location}`);
    console.log(`   📦 Materials: ${project.inventoryCount} types`);
    console.log(`   📅 Period: ${project.startDate} → ${project.endDate}`);
    console.log('');
  });

  console.log('👥 USERS OVERVIEW:');
  console.log('═══════════════════════════════════════');
  stats.details.users.forEach((user, index) => {
    console.log(`${index + 1}. ${user.name} (${user.role})`);
    console.log(`   📊 Transactions: ${user.transactionCount}`);
    console.log('');
  });

  console.log('📈 RECENT TRANSACTIONS:');
  console.log('═══════════════════════════════════════');
  stats.details.recentTransactions.slice(0, 5).forEach((tx, index) => {
    const icon = tx.type === 'in' ? '↗️' : '↙️';
    const date = new Date(tx.createdAt).toLocaleDateString('id-ID');
    console.log(`${index + 1}. ${icon} ${tx.material} - ${tx.quantity} ${tx.unit}`);
    console.log(`   🏗️ ${tx.project} | 👤 ${tx.user}`);
    console.log(`   📅 ${date} | 📝 ${tx.notes}`);
    console.log('');
  });

  // Step 4: Test API endpoints
  console.log('4️⃣ Testing API endpoints...');
  const endpoints = [
    '/operations/projects',
    '/operations/inventories',
    '/operations/stocks',
    '/operations/transactions',
    '/operations/users'
  ];

  for (const endpoint of endpoints) {
    const result = await makeRequest(endpoint);
    const status = result.success ? '✅' : '❌';
    const count = result.success && Array.isArray(result.data) ? result.data.length : 'N/A';
    console.log(`   ${status} ${endpoint} (${count} records)`);
  }

  console.log('\n🎉 TEST DATA UPLOAD COMPLETED SUCCESSFULLY!');
  console.log('\n📋 NEXT STEPS:');
  console.log('1. Start development server: npm run dev');
  console.log('2. Open browser: http://localhost:3000/operations');
  console.log('3. Test material input forms with the uploaded data');
  console.log('4. Verify all features work with real database connections');
}

// Run the upload process
uploadTestData().catch(console.error);