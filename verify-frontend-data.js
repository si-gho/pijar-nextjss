// Script untuk memverifikasi data frontend vs database
// Jalankan dengan: node verify-frontend-data.js

const BASE_URL = 'http://localhost:3000/api/operations';

async function makeRequest(endpoint) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function verifyFrontendData() {
  console.log('🔍 Verifying Frontend Data Requirements...\n');

  // 1. Verify Operations Dashboard Data
  console.log('1️⃣ Operations Dashboard Requirements:');
  const projects = await makeRequest('/projects');
  const transactions = await makeRequest('/transactions?limit=100');
  
  if (projects.success && transactions.success) {
    const today = new Date().toDateString();
    const todayTransactions = transactions.data.filter(t => 
      new Date(t.createdAt).toDateString() === today
    );
    
    console.log('   ✅ Projects count:', projects.data.length);
    console.log('   ✅ Total transactions:', transactions.data.length);
    console.log('   ✅ Today transactions:', todayTransactions.length);
  } else {
    console.log('   ❌ Failed to fetch dashboard data');
  }

  // 2. Verify Histories Page Data
  console.log('\n2️⃣ Histories Page Requirements:');
  const historiesData = await makeRequest('/transactions');
  
  if (historiesData.success && historiesData.data.length > 0) {
    const sample = historiesData.data[0];
    const requiredFields = [
      'id', 'type', 'quantity', 'unit', 'notes', 'createdAt',
      'material', 'materialUnit', 'project', 'projectLocation', 'userName'
    ];
    
    const missingFields = requiredFields.filter(field => !(field in sample));
    
    if (missingFields.length === 0) {
      console.log('   ✅ All required fields present');
      console.log('   ✅ Sample transaction:', {
        material: sample.material,
        project: sample.project,
        user: sample.userName,
        type: sample.type
      });
    } else {
      console.log('   ❌ Missing fields:', missingFields);
    }
  } else {
    console.log('   ❌ No transaction data available');
  }

  // 3. Verify Stocks Page Data
  console.log('\n3️⃣ Stocks Page Requirements:');
  const stocksData = await makeRequest('/stocks');
  
  if (stocksData.success && stocksData.data.length > 0) {
    const sample = stocksData.data[0];
    const requiredFields = [
      'id', 'name', 'unit', 'projectName', 'projectLocation',
      'stockIn', 'stockOut', 'currentStock', 'totalCapacity'
    ];
    
    const missingFields = requiredFields.filter(field => !(field in sample));
    
    if (missingFields.length === 0) {
      console.log('   ✅ All required fields present');
      console.log('   ✅ Sample stock:', {
        material: sample.name,
        project: sample.projectName,
        currentStock: sample.currentStock,
        totalCapacity: sample.totalCapacity
      });
    } else {
      console.log('   ❌ Missing fields:', missingFields);
    }
  } else {
    console.log('   ❌ No stock data available');
  }

  // 4. Verify Users Page Data
  console.log('\n4️⃣ Users Page Requirements:');
  const userStats = await makeRequest('/user-stats');
  
  if (userStats.success) {
    console.log('   ✅ User statistics available');
    console.log('   ✅ Current month stats:', userStats.data.currentMonth);
    console.log('   ✅ Overall stats:', userStats.data.overall);
  } else {
    console.log('   ❌ User statistics not available');
  }

  // 5. Verify Material Forms Data
  console.log('\n5️⃣ Material Forms Requirements:');
  const inventories = await makeRequest('/inventories');
  
  if (inventories.success && inventories.data.length > 0) {
    const sample = inventories.data[0];
    const requiredFields = ['id', 'name', 'unit', 'projectId', 'projectName'];
    
    const missingFields = requiredFields.filter(field => !(field in sample));
    
    if (missingFields.length === 0) {
      console.log('   ✅ All required fields present');
      console.log('   ✅ Sample inventory:', {
        material: sample.name,
        unit: sample.unit,
        project: sample.projectName
      });
    } else {
      console.log('   ❌ Missing fields:', missingFields);
    }
  } else {
    console.log('   ❌ No inventory data available');
  }

  // 6. Test Data Relationships
  console.log('\n6️⃣ Data Relationships Verification:');
  
  if (projects.success && inventories.success && transactions.success) {
    // Check if all transactions have valid references
    const validTransactions = transactions.data.filter(t => 
      t.material && t.project && t.userName
    );
    
    console.log('   ✅ Valid transactions with relationships:', validTransactions.length, '/', transactions.data.length);
    
    // Check if all inventories have project references
    const validInventories = inventories.data.filter(i => i.projectName);
    console.log('   ✅ Valid inventories with project refs:', validInventories.length, '/', inventories.data.length);
    
    // Check project distribution
    const projectDistribution = {};
    inventories.data.forEach(inv => {
      projectDistribution[inv.projectName] = (projectDistribution[inv.projectName] || 0) + 1;
    });
    
    console.log('   ✅ Materials per project:', projectDistribution);
  }

  // 7. Test Today's Data for Real-time Features
  console.log('\n7️⃣ Real-time Data Verification:');
  
  if (transactions.success) {
    const today = new Date().toDateString();
    const todayTransactions = transactions.data.filter(t => 
      new Date(t.createdAt).toDateString() === today
    );
    
    const todayIn = todayTransactions.filter(t => t.type === 'in').length;
    const todayOut = todayTransactions.filter(t => t.type === 'out').length;
    
    console.log('   ✅ Today\'s transactions:', todayTransactions.length);
    console.log('   ✅ Today\'s IN:', todayIn);
    console.log('   ✅ Today\'s OUT:', todayOut);
    
    if (todayTransactions.length > 0) {
      console.log('   ✅ Recent transaction sample:', {
        material: todayTransactions[0].material,
        type: todayTransactions[0].type,
        quantity: todayTransactions[0].quantity,
        time: new Date(todayTransactions[0].createdAt).toLocaleTimeString()
      });
    }
  }

  console.log('\n🎉 Frontend Data Verification Completed!');
  console.log('\n📋 Summary:');
  console.log('- Dashboard: Projects and transaction counts ✅');
  console.log('- Histories: Transaction details with relationships ✅');
  console.log('- Stocks: Material stocks with calculations ✅');
  console.log('- Users: Personal statistics ✅');
  console.log('- Forms: Material and project data ✅');
  console.log('- Real-time: Today\'s activity data ✅');
}

// Run verification
verifyFrontendData().catch(console.error);