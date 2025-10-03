// Test script untuk material flow
// Jalankan dengan: node test-material-flow.js

const BASE_URL = 'http://localhost:3000/api/operations';

async function testAPI(endpoint, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();
    
    console.log(`✅ ${method} ${endpoint}:`, response.status);
    console.log('Response:', data);
    return { success: response.ok, data };
  } catch (error) {
    console.error(`❌ ${method} ${endpoint}:`, error.message);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🚀 Starting Material Flow Tests...\n');
  
  // Test 1: Database Connection
  console.log('1. Testing Database Connection...');
  await testAPI('/test-db', 'GET');
  console.log('');
  
  // Test 2: Get Projects
  console.log('2. Testing Get Projects...');
  const projectsResult = await testAPI('/projects', 'GET');
  console.log('');
  
  // Test 3: Get Inventories
  console.log('3. Testing Get Inventories...');
  await testAPI('/inventories', 'GET');
  console.log('');
  
  // Test 4: Get Stocks
  console.log('4. Testing Get Stocks...');
  await testAPI('/stocks', 'GET');
  console.log('');
  
  // Test 5: Get Transactions
  console.log('5. Testing Get Transactions...');
  await testAPI('/transactions', 'GET');
  console.log('');
  
  // Test 6: Add New Inventory (if projects exist)
  if (projectsResult.success && projectsResult.data.length > 0) {
    console.log('6. Testing Add New Inventory...');
    await testAPI('/inventories', 'POST', {
      projectId: projectsResult.data[0].id,
      name: 'Test Material',
      unit: 'Test Unit',
      initialStock: '10'
    });
    console.log('');
  }
  
  // Test 7: Add Transaction
  console.log('7. Testing Add Transaction...');
  await testAPI('/transactions', 'POST', {
    projectId: 1,
    inventoryId: 1,
    userId: 'user-1',
    type: 'in',
    quantity: '5',
    unit: 'Test Unit',
    notes: 'Test transaction'
  });
  console.log('');
  
  console.log('🎉 Tests completed!');
}

// Run tests
runTests().catch(console.error);