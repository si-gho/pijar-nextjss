# Pijar Pro - Aplikasi Monitoring Material Proyek

Aplikasi mobile-first untuk monitoring dan pencatatan aliran material proyek bangunan di Kabupaten Labuhanbatu Selatan.

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Setup database (lihat Database Setup di bawah)
# Update .env.local dengan DATABASE_URL

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🗄️ Database Setup

1. **Buat akun Neon Database**
   - Kunjungi [neon.tech](https://neon.tech)
   - Buat database baru
   - Copy connection string

2. **Update Environment Variables**
   ```bash
   # .env.local
   DATABASE_URL="your_neon_database_connection_string"
   ```

3. **Generate dan Push Schema**
   ```bash
   pnpm drizzle-kit generate
   pnpm drizzle-kit push
   ```

4. **Seed Database (Optional)**
   ```bash
   # Jalankan aplikasi dulu, lalu akses:
   curl -X POST http://localhost:3000/api/seed
   ```

## 📱 Fitur

- **Mobile-first responsive design**
- **Modern UI dengan shadcn/ui components**
- **Dashboard untuk monitoring material**
- **Laporan material masuk dan keluar**
- **Riwayat transaksi dengan filtering**
- **Manajemen stok dengan progress tracking**
- **Profile management**
- **Toast notifications**
- **Optimized untuk deployment di Hugging Face Spaces**

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Neon PostgreSQL + Drizzle ORM
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Icons**: Lucide React
- **State Management**: Custom hooks + React state
- **TypeScript**: Full type safety
- **Validation**: Zod
- **Image Optimization**: Next.js Image + Sharp

## 📁 Struktur Project

```
src/
├── app/                    # Next.js App Router
│   ├── api/operations/     # API endpoints
│   │   ├── projects/       # Projects API
│   │   ├── transactions/   # Transactions API
│   │   ├── stocks/         # Stocks API
│   │   ├── inventories/    # Inventories API
│   │   └── users/          # Users API
│   ├── operations/         # Halaman operasi
│   │   ├── page.tsx       # Dashboard
│   │   ├── in/page.tsx    # Material Masuk
│   │   ├── out/page.tsx   # Material Keluar
│   │   ├── histories/     # Riwayat Transaksi
│   │   ├── stocks/        # Manajemen Stok
│   │   └── users/         # Profile User
│   ├── globals.css        # Global styles & CSS variables
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home redirect
├── components/
│   ├── Header.tsx         # App header
│   ├── BottomNav.tsx      # Bottom navigation
│   └── ui/               # shadcn/ui components
├── assets/               # Images & static files
├── hooks/               # Custom hooks (API, toast)
└── lib/                # Database, schema, utilities
    ├── db.ts           # Database connection
    ├── schema.ts       # Drizzle schema
    └── seed.ts         # Database seeder
```

## 🎨 Design System

Project menggunakan design system yang konsisten dengan:
- **Primary Color**: Orange (#FF8C00)
- **Success Color**: Green (#22C55E) 
- **Danger Color**: Red (#EF4444)
- **Typography**: Poppins (display) + Inter (body)
- **Animations**: Fade-in, slide-up, scale transforms
- **Mobile-first responsive breakpoints**

## 🚀 Deployment

### Hugging Face Spaces
Project sudah dikonfigurasi untuk deployment ke Hugging Face Spaces:

1. Upload project ke Hugging Face Spaces
2. Set environment ke "Static"
3. Build command: `npm run build`
4. Output directory: `out`

### Vercel/Netlify
```bash
# Build for static export
npm run build
```

## 📝 Development Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Static export (for Hugging Face)
npm run export
```

## 🔧 Environment Variables

Create `.env.local` for development:
```env
NEXT_PUBLIC_APP_NAME="Pijar Pro Pantau"
NEXT_PUBLIC_APP_VERSION="1.0.0"
```

## 🤝 Kontribusi

1. Fork the project
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.