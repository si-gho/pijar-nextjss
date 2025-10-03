# Test Data Documentation

## 📊 **Comprehensive Test Data Overview**

Database telah diisi dengan data percobaan yang realistis untuk testing aplikasi Pijar Pro. Data ini mencakup semua relasi yang diperlukan dan mencerminkan skenario nyata proyek konstruksi di Labuhanbatu Selatan.

## 🏗️ **Projects (4 Proyek)**

### 1. **Gedung Perkantoran Dinas**
- **Lokasi**: Jl. Pembangunan No. 45, Labuhanbatu Selatan
- **Periode**: 15 Jan 2024 - 31 Des 2024
- **Status**: Aktif
- **Materials**: 7 jenis material (semen, besi, keramik, cat, pasir, batu split)

### 2. **Jembatan Sungai Barumun**
- **Lokasi**: Desa Sejahtera, Kec. Bilah Hilir
- **Periode**: 1 Mar 2024 - 30 Okt 2024
- **Status**: Aktif
- **Materials**: 5 jenis material (beton ready mix, besi beton, kawat, bekisting)

### 3. **Jalan Raya Tol Akses**
- **Lokasi**: Km 15-25 Labuhanbatu Selatan
- **Periode**: 1 Feb 2024 - 31 Jan 2025
- **Status**: Aktif
- **Materials**: 4 jenis material (aspal, agregat, semen)

### 4. **Sekolah Dasar Negeri 001**
- **Lokasi**: Desa Pendidikan, Kec. Kota Pinang
- **Periode**: 1 Apr 2024 - 30 Nov 2024
- **Status**: Aktif
- **Materials**: 4 jenis material (bata, genteng, kayu, paku)

## 👥 **Users (3 Pengguna)**

### 1. **Ahmad Operator** (`ahmad_op`)
- **Role**: Operator
- **Email**: ahmad@pijar.com
- **Responsibilities**: Input material masuk/keluar, monitoring harian

### 2. **Siti Supervisor** (`siti_sup`)
- **Role**: Supervisor
- **Email**: siti@pijar.com
- **Responsibilities**: Supervisi operasi, validasi transaksi

### 3. **Budi Manager** (`budi_mgr`)
- **Role**: Manager
- **Email**: budi@pijar.com
- **Responsibilities**: Oversight, reporting, strategic decisions

## 📦 **Inventories (20 Material Types)**

### **Gedung Perkantoran** (7 materials):
1. Semen Portland Tiga Roda - 200 Sak (50kg)
2. Besi Beton 10mm - 500 Batang (12m)
3. Besi Beton 12mm - 300 Batang (12m)
4. Keramik Lantai 60×60 - 150 Dus (1.44m²)
5. Cat Tembok Dulux - 50 Kaleng (25kg)
6. Pasir Cor - 25 M³
7. Batu Split 1-2cm - 30 M³

### **Jembatan Sungai** (5 materials):
1. Beton Ready Mix K-300 - 100 M³
2. Besi Beton 16mm - 400 Batang (12m)
3. Besi Beton 19mm - 200 Batang (12m)
4. Kawat Bendrat - 100 Kg
5. Papan Bekisting - 80 Lembar (4×8 feet)

### **Jalan Tol** (4 materials):
1. Aspal Hotmix AC-WC - 500 Ton
2. Agregat Kasar - 200 M³
3. Agregat Halus - 150 M³
4. Semen Portland - 300 Sak (50kg)

### **Sekolah** (4 materials):
1. Bata Merah Press - 10,000 Buah
2. Genteng Keramik - 2,000 Buah
3. Kayu Meranti 5×7 - 100 Batang (4m)
4. Paku 2-12 inch - 50 Kg

## 📊 **Transactions (15 Transaksi)**

### **Recent Activity** (Hari ini):
- Semen masuk 25 sak untuk finishing gedung
- Besi 16mm keluar 50 batang untuk deck jembatan

### **Historical Transactions**:
- Material IN: 7 transaksi
- Material OUT: 8 transaksi
- Date range: 17 Jan 2024 - Today
- All transactions include realistic notes and proper user attribution

## 🔄 **Data Relationships**

### **Relasi yang Diimplementasi**:
1. **Projects ↔ Inventories**: Setiap proyek memiliki material spesifik
2. **Inventories ↔ Transactions**: Setiap transaksi terkait material tertentu
3. **Users ↔ Transactions**: Setiap transaksi dicatat oleh user tertentu
4. **Projects ↔ Transactions**: Transaksi terkait proyek spesifik

### **Data Integrity**:
- ✅ Semua foreign key relationships valid
- ✅ No orphaned records
- ✅ Realistic stock levels and transaction quantities
- ✅ Proper date sequencing
- ✅ Consistent units across related records

## 🧪 **Testing Scenarios**

### **Material IN Testing**:
1. Select "Gedung Perkantoran" → Should show 7 materials
2. Add new material → Should work and refresh dropdown
3. Submit transaction → Should create record and update stock

### **Material OUT Testing**:
1. Select "Jembatan Sungai" → Should show materials with stock > 0
2. Try to exceed stock → Should show validation error
3. Valid transaction → Should reduce stock accordingly

### **Stock Management Testing**:
1. View stocks by project → Should show calculated current stock
2. Check stock alerts → Materials with low stock should show warnings
3. Stock calculation → Should reflect initial + in - out

### **Historical Data Testing**:
1. View transaction history → Should show 15 transactions
2. Filter by type → Should separate IN/OUT correctly
3. Filter by date → Should show chronological data

## 📋 **Upload Instructions**

### **Automatic Upload**:
```bash
# Run the upload script
node upload-test-data.js
```

### **Manual Upload via API**:
```bash
# Seed database
curl -X POST http://localhost:3000/api/seed

# Verify upload
curl http://localhost:3000/api/database-stats
```

### **Verification Steps**:
1. ✅ Database connection successful
2. ✅ All tables populated with correct counts
3. ✅ Relationships properly established
4. ✅ API endpoints return data correctly
5. ✅ Frontend can load and display data

## 🎯 **Expected Results**

After uploading test data, you should see:
- **Dashboard**: Shows 4 active projects with recent activity
- **Material IN**: Dropdown populated with materials per project
- **Material OUT**: Only materials with available stock shown
- **History**: 15 transactions with proper filtering
- **Stocks**: Real-time stock calculations with alerts
- **Users**: 3 users with different roles and activity levels

## 🔧 **Troubleshooting**

### **If upload fails**:
1. Check DATABASE_URL in .env
2. Ensure development server is running
3. Verify database connectivity
4. Check console for detailed error messages

### **If data seems incorrect**:
1. Run database stats API to verify counts
2. Check foreign key relationships
3. Verify transaction calculations
4. Clear and re-seed if necessary

This comprehensive test data provides a realistic foundation for testing all features of the Pijar Pro application! 🚀