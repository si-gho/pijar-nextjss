# 🚀 Quick Start dengan Test Data

## 📋 **Langkah-langkah Setup**

### 1. **Pastikan Environment Ready**
```bash
# Cek apakah development server berjalan
npm run dev

# Pastikan DATABASE_URL terkonfigurasi di .env
cat .env
```

### 2. **Upload Test Data**
```bash
# Jalankan script upload otomatis
node upload-test-data.js
```

**Expected Output:**
```
🚀 Starting test data upload process...

1️⃣ Testing database connection...
✅ Database connection successful

2️⃣ Uploading comprehensive test data...
✅ Test data uploaded successfully
   Seeded data: {
     "users": 3,
     "projects": 4,
     "inventories": 20,
     "transactions": 15
   }

3️⃣ Verifying uploaded data...
✅ Data verification completed

📊 DATABASE STATISTICS:
═══════════════════════════════════════
📁 Projects: 4
📦 Inventories: 20
👥 Users: 3
📊 Transactions: 15
   ↗️  Material IN: 7
   ↙️  Material OUT: 8
```

### 3. **Verifikasi Manual (Optional)**
```bash
# Test individual endpoints
curl http://localhost:3000/api/operations/projects
curl http://localhost:3000/api/operations/inventories
curl http://localhost:3000/api/database-stats
```

## 🧪 **Testing Scenarios**

### **Scenario 1: Material IN Flow**
1. Buka http://localhost:3000/operations/in
2. Pilih "Gedung Perkantoran Dinas"
3. Dropdown material akan menampilkan 7 jenis material
4. Pilih "Semen Portland Tiga Roda"
5. Input jumlah: 50
6. Satuan otomatis terisi: "Sak (50kg)"
7. Submit → Should success

### **Scenario 2: Add New Material**
1. Di form Material IN
2. Pilih "Sekolah Dasar Negeri 001"
3. Klik tombol `+` di sebelah dropdown material
4. Isi form:
   - Nama: "Pipa PVC 4 inch"
   - Satuan: "Batang (6m)"
   - Stok Awal: 20
5. Submit → Material baru muncul di dropdown

### **Scenario 3: Material OUT with Stock Validation**
1. Buka http://localhost:3000/operations/out
2. Pilih "Jembatan Sungai Barumun"
3. Dropdown hanya menampilkan material dengan stok > 0
4. Pilih "Beton Ready Mix K-300"
5. Lihat info stok tersedia di bawah input jumlah
6. Coba input jumlah > stok → Should show error
7. Input jumlah valid → Should success

### **Scenario 4: View Transaction History**
1. Buka http://localhost:3000/operations/histories
2. Should menampilkan 15 transaksi
3. Test filter "Masuk" → 7 transaksi
4. Test filter "Keluar" → 8 transaksi
5. Check detail transaksi dengan notes realistis

### **Scenario 5: Stock Management**
1. Buka http://localhost:3000/operations/stocks
2. Pilih "Gedung Perkantoran Dinas"
3. Should menampilkan 7 material dengan stok terhitung
4. Check progress bars dan status indicators
5. Material dengan stok rendah should show warning

## 📊 **Data yang Tersedia untuk Testing**

### **Projects Ready for Testing:**
1. **Gedung Perkantoran** - 7 materials, active transactions
2. **Jembatan Sungai** - 5 materials, ongoing work
3. **Jalan Tol** - 4 materials, large scale
4. **Sekolah** - 4 materials, building construction

### **Users for Role Testing:**
1. **Ahmad** (Operator) - Daily operations
2. **Siti** (Supervisor) - Oversight
3. **Budi** (Manager) - Strategic

### **Materials with Different Stock Levels:**
- **High Stock**: Bata Merah (8,000 remaining)
- **Medium Stock**: Semen Portland (175 remaining)
- **Low Stock**: Beton Ready Mix (70 remaining)
- **Critical Stock**: Some materials after transactions

## 🎯 **Expected Behaviors**

### **✅ Should Work:**
- All dropdowns populate correctly
- Stock calculations are accurate
- Form validations work
- Toast notifications appear
- Data persists across page refreshes
- Real-time stock updates

### **✅ Should Prevent:**
- Material OUT exceeding available stock
- Duplicate material names in same project
- Invalid input data (negative numbers, empty fields)
- Broken relationships (orphaned records)

## 🔧 **Troubleshooting**

### **If no data appears:**
```bash
# Re-run upload script
node upload-test-data.js

# Check database connection
curl http://localhost:3000/api/test-db
```

### **If stock calculations seem wrong:**
```bash
# Check database stats
curl http://localhost:3000/api/database-stats

# Verify transactions
curl http://localhost:3000/api/operations/transactions
```

### **If forms don't work:**
1. Check browser console for errors
2. Verify API endpoints in Network tab
3. Restart development server
4. Clear browser cache

## 🎉 **Success Indicators**

You'll know everything is working when:
- ✅ All 4 projects appear in dropdowns
- ✅ Materials load based on selected project
- ✅ Stock validation prevents over-withdrawal
- ✅ New materials can be added via + button
- ✅ Transaction history shows realistic data
- ✅ Stock levels update after transactions
- ✅ No console errors in browser
- ✅ Toast notifications work properly

## 📞 **Need Help?**

If you encounter issues:
1. Check TROUBLESHOOTING.md for common solutions
2. Run `node upload-test-data.js` to reset data
3. Verify DATABASE_URL in .env file
4. Ensure development server is running on port 3000

Happy testing! 🚀