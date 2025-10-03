# Material Management Features

## 📦 Fitur Tambah Material Baru

### Deskripsi
Fitur ini memungkinkan pengguna untuk menambahkan material baru langsung dari form Material Masuk ketika material yang dibutuhkan belum tersedia di database.

### Lokasi Fitur
- **Form Material Masuk**: `/operations/in`
- **Tombol**: Ikon `+` di sebelah dropdown "Jenis Material"

### Cara Kerja

#### 1. **Akses Fitur**
- Buka form Material Masuk
- Pilih proyek terlebih dahulu
- Klik tombol `+` di sebelah dropdown "Jenis Material"

#### 2. **Dialog Tambah Material**
Dialog akan menampilkan form dengan field:
- **Nama Material** (wajib): Contoh "Semen Portland", "Besi Beton 12mm"
- **Satuan** (wajib): Contoh "Sak (50kg)", "Batang (12m)", "M³", "Dus"
- **Stok Awal** (opsional): Jumlah stok awal, default 0
- **Deskripsi** (opsional): Deskripsi tambahan

#### 3. **Validasi**
- Nama material dan satuan wajib diisi
- Data akan disimpan ke tabel `inventories` dengan `project_id` yang sesuai

#### 4. **Setelah Berhasil**
- Material baru langsung muncul di dropdown
- Form dialog tertutup otomatis
- Notifikasi sukses ditampilkan

## 🚫 Validasi Stok untuk Material Keluar

### Deskripsi
Form Material Keluar memiliki validasi ketat untuk memastikan material yang dikeluarkan tidak melebihi stok yang tersedia.

### Fitur Validasi

#### 1. **Filter Material**
- Hanya menampilkan material yang memiliki stok > 0
- Menampilkan jumlah stok di dropdown: "Semen Portland (Stok: 50)"

#### 2. **Informasi Stok**
- Menampilkan stok tersedia di bawah input jumlah
- Format: "Stok tersedia: 50 Sak (50kg)"

#### 3. **Validasi Input**
- Input jumlah memiliki atribut `max` sesuai stok tersedia
- Validasi saat submit:
  - Jumlah tidak boleh > stok tersedia
  - Jumlah harus > 0
  - Menampilkan error dengan detail stok tersedia

#### 4. **Pesan Error**
```
"Jumlah melebihi stok yang tersedia"
"Stok tersedia: 50 Sak (50kg)"
```

## 🔄 API Endpoints

### POST /api/operations/inventories
Menambahkan material baru ke database.

**Request Body:**
```json
{
  "projectId": 1,
  "name": "Semen Portland",
  "unit": "Sak (50kg)",
  "initialStock": "100"
}
```

**Response:**
```json
{
  "id": 5,
  "projectId": 1,
  "name": "Semen Portland",
  "unit": "Sak (50kg)",
  "initialStock": "100",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### GET /api/operations/stocks
Mendapatkan data stok real-time dengan perhitungan dari transaksi.

**Query Parameters:**
- `projectId` (optional): Filter berdasarkan proyek

**Response:**
```json
[
  {
    "id": 1,
    "name": "Semen Portland",
    "unit": "Sak (50kg)",
    "currentStock": 75,
    "totalCapacity": 100,
    "stockIn": 100,
    "stockOut": 25,
    "projectName": "Gedung Perkantoran"
  }
]
```

## 🎯 Business Rules

### Material Masuk
1. ✅ Dapat menambah material baru jika belum ada
2. ✅ Material baru otomatis terkait dengan proyek yang dipilih
3. ✅ Tidak ada batasan jumlah material masuk
4. ✅ Stok awal bisa diset saat menambah material baru

### Material Keluar
1. ❌ **TIDAK BISA** menambah material baru
2. ✅ Hanya bisa pilih material yang sudah ada di database
3. ✅ Hanya bisa pilih material dengan stok > 0
4. ✅ Jumlah keluar tidak boleh > stok tersedia
5. ✅ Validasi real-time berdasarkan stok terkini

## 🔧 Technical Implementation

### Components
- `AddMaterialDialog.tsx`: Dialog untuk menambah material baru
- Form validation di `MaterialInPage` dan `MaterialOutPage`

### Database
- Tabel `inventories`: Menyimpan master data material
- Tabel `transactions`: Menyimpan transaksi masuk/keluar
- Perhitungan stok: `initial_stock + stock_in - stock_out`

### State Management
- Custom hook `useApi` untuk data fetching
- Local state untuk form management
- Real-time refresh setelah operasi CRUD

## 🚀 User Experience

### Material Masuk
1. Pilih proyek → Dropdown material ter-populate
2. Jika material belum ada → Klik `+` → Isi form → Material langsung tersedia
3. Workflow lancar tanpa harus keluar dari form

### Material Keluar
1. Pilih proyek → Hanya material dengan stok muncul
2. Pilih material → Stok tersedia ditampilkan
3. Input jumlah → Validasi real-time
4. Submit → Validasi final sebelum simpan

Fitur ini memastikan akurasi data dan mencegah stok negatif sambil memberikan fleksibilitas untuk menambah material baru saat dibutuhkan di lapangan.