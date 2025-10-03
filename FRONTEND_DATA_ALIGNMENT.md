# Frontend Data Alignment Documentation

## 🎯 **Tujuan Penyesuaian**

Memastikan semua data yang ditampilkan di frontend sesuai dengan struktur database dan API endpoints. Pedoman utama adalah kebutuhan tampilan frontend.

## 📊 **Pemetaan Data Frontend ke Database**

### **1. Operations Dashboard (`/operations`)**

#### **Frontend Requirements:**
- Total transaksi hari ini
- Jumlah proyek aktif
- Nama proyek dengan lokasi
- Statistik quick stats

#### **Database Mapping:**
```typescript
interface Project {
  id: number;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
}

interface Transaction {
  id: number;
  type: 'in' | 'out';
  createdAt: string;
}
```

#### **API Endpoints:**
- `GET /api/operations/projects`
- `GET /api/operations/transactions?limit=100`

---

### **2. Histories Page (`/operations/histories`)**

#### **Frontend Requirements:**
- Material name dan unit
- Project name dan location
- User name
- Transaction details (type, quantity, notes, date)

#### **Database Mapping:**
```typescript
interface Transaction {
  id: number;
  type: 'in' | 'out';
  quantity: string;
  unit: string;
  notes: string;
  createdAt: string;
  material: string;        // from inventories.name
  materialUnit: string;    // from inventories.unit
  project: string;         // from projects.name
  projectLocation: string; // from projects.location
  userName: string;        // from users.name
}
```

#### **API Endpoints:**
- `GET /api/operations/transactions`
- `GET /api/operations/transactions?type=in`
- `GET /api/operations/transactions?type=out`

---

### **3. Stocks Page (`/operations/stocks`)**

#### **Frontend Requirements:**
- Material name dan unit
- Project name dan location
- Current stock calculation
- Stock status (Aman/Kritis/Perlu dipesan)

#### **Database Mapping:**
```typescript
interface Stock {
  id: number;
  name: string;
  unit: string;
  initialStock: string;
  projectId: number;
  projectName: string;
  projectLocation: string;
  stockIn: number;         // calculated from transactions
  stockOut: number;        // calculated from transactions
  currentStock: number;    // initialStock + stockIn - stockOut
  totalCapacity: number;   // initialStock + stockIn
}
```

#### **API Endpoints:**
- `GET /api/operations/stocks`
- `GET /api/operations/stocks?projectId=1`

---

### **4. Users Page (`/operations/users`)**

#### **Frontend Requirements:**
- Material masuk bulan ini
- Material keluar bulan ini
- Proyek aktif
- Total transaksi
- Akurasi percentage

#### **Database Mapping:**
```typescript
interface UserStats {
  userId: string;
  currentMonth: {
    materialIn: number;
    materialOut: number;
    activeProjects: number;
  };
  overall: {
    totalTransactions: number;
    accuracy: number;
  };
}
```

#### **API Endpoints:**
- `GET /api/operations/user-stats?userId=user-1`

---

### **5. Material Forms (`/operations/in`, `/operations/out`)**

#### **Frontend Requirements:**
- Project list dengan nama dan lokasi
- Material list per project
- Material unit auto-populate
- Stock validation untuk material OUT

#### **Database Mapping:**
```typescript
interface Project {
  id: number;
  name: string;
  location: string;
}

interface Inventory {
  id: number;
  name: string;
  unit: string;
  projectId: number;
  projectName: string;
}
```

#### **API Endpoints:**
- `GET /api/operations/projects`
- `GET /api/operations/inventories?projectId=1`
- `POST /api/operations/inventories` (add new material)
- `POST /api/operations/transactions` (submit form)

## 🔧 **Penyesuaian yang Dilakukan**

### **1. API Transactions Enhancement**
- ✅ Menambahkan join dengan inventories, projects, users
- ✅ Return material name, project name, user name
- ✅ Return project location untuk display
- ✅ Proper date formatting

### **2. API Stocks Calculation**
- ✅ Real-time stock calculation: `initialStock + stockIn - stockOut`
- ✅ Total capacity calculation untuk percentage
- ✅ Project information included

### **3. New API User Stats**
- ✅ `/api/operations/user-stats` endpoint
- ✅ Current month statistics
- ✅ Overall user performance metrics
- ✅ Active projects count

### **4. Enhanced Seed Data**
- ✅ Realistic transaction dates (relative to today)
- ✅ Multiple transactions for today (testing real-time features)
- ✅ Proper relationships between all entities
- ✅ Varied transaction types and quantities

### **5. Frontend Integration**
- ✅ Users page now uses real API data
- ✅ All pages use consistent data structures
- ✅ Proper error handling and loading states

## 📋 **Data Validation Checklist**

### **✅ Operations Dashboard**
- [x] Shows correct project count
- [x] Shows today's transaction count
- [x] Project cards display name and location
- [x] Quick stats are dynamic

### **✅ Histories Page**
- [x] All transactions show material names
- [x] Project names and locations visible
- [x] User names attributed correctly
- [x] Filtering by type works
- [x] Date formatting is correct

### **✅ Stocks Page**
- [x] Stock calculations are accurate
- [x] Project filtering works
- [x] Status indicators (Aman/Kritis) work
- [x] Progress bars show correct percentages

### **✅ Users Page**
- [x] Statistics reflect real data
- [x] Current month calculations correct
- [x] Total transactions accurate
- [x] Achievement metrics realistic

### **✅ Material Forms**
- [x] Project dropdown populated
- [x] Material dropdown filtered by project
- [x] Units auto-populate
- [x] Stock validation works (OUT form)
- [x] Form submissions create proper records

## 🧪 **Testing Commands**

### **Upload Fresh Data:**
```bash
node upload-test-data.js
```

### **Verify Data Alignment:**
```bash
node verify-frontend-data.js
```

### **Test Individual Endpoints:**
```bash
curl http://localhost:3000/api/operations/projects
curl http://localhost:3000/api/operations/transactions
curl http://localhost:3000/api/operations/stocks
curl http://localhost:3000/api/operations/user-stats
```

## 🎯 **Expected Results**

After alignment, all frontend pages should:
- ✅ Display real data from database
- ✅ Show proper relationships between entities
- ✅ Calculate real-time statistics correctly
- ✅ Handle today's data for real-time features
- ✅ Provide consistent user experience
- ✅ Support all CRUD operations properly

## 🔄 **Maintenance**

To maintain data alignment:
1. **Always check frontend requirements first** when adding new features
2. **Update API endpoints** to match frontend data needs
3. **Test with realistic data** using seed scripts
4. **Verify relationships** between all entities
5. **Keep documentation updated** when making changes

This alignment ensures that the frontend displays meaningful, accurate data that reflects the real state of the construction material management system! 🚀