# Pijar Pro Pantau - Sistem Pantau Material Konstruksi

Aplikasi web mobile-first untuk monitoring dan pencatatan aliran material konstruksi dengan authentication dan dashboard yang komprehensif. Dibangun dengan arsitektur modular yang mendukung pengembangan lanjutan dan reusability untuk berbagai domain bisnis.

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Copy environment template
cp .env.example .env

# Update .env dengan database credentials Anda
# DATABASE_URL="your_neon_database_url"
# NEXTAUTH_SECRET="your_secret_key"

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📚 Dokumentasi Pengembangan

Untuk pengembangan lanjutan dan pemahaman arsitektur yang mendalam, lihat dokumentasi komprehensif di folder [`pijar-docs/`](./pijar-docs/):

### **Dokumentasi Kontekstual**
- [**Development Context**](./pijar-docs/01-development-context.md) - Konteks, visi, dan tantangan pengembangan
- [**Current Architecture Analysis**](./pijar-docs/02-current-architecture-analysis.md) - Analisis mendalam arsitektur saat ini
- [**Future Development Strategy**](./pijar-docs/03-future-development-strategy.md) - Roadmap dan strategi pengembangan masa depan

### **Dokumentasi Teknis**
- [**Technical Architecture Guide**](./pijar-docs/04-technical-architecture-guide.md) - Panduan implementasi arsitektur teknis
- [**Implementation Patterns**](./pijar-docs/05-implementation-patterns.md) - Pattern dan best practices
- [**Security & Performance Guidelines**](./pijar-docs/06-security-performance-guidelines.md) - Panduan keamanan dan optimasi performa
- [**Modular Development Framework**](./pijar-docs/07-modular-development-framework.md) - Framework pengembangan modular

### **Panduan Praktis**
- [**Development Workflow**](./pijar-docs/08-development-workflow.md) - Alur kerja dan standar pengembangan
- [**Role Authentication System**](./ROLE_AUTHENTICATION_DOCS.md) - Sistem autentikasi berbasis role
- [**Mobile Optimization**](./MOBILE_OPTIMIZATION_SUMMARY.md) - Optimasi untuk perangkat mobile

> **💡 Untuk Developer Baru**: Mulai dengan [Development Context](./pijar-docs/01-development-context.md) untuk memahami visi dan konteks, lalu lanjut ke [Technical Architecture Guide](./pijar-docs/04-technical-architecture-guide.md) untuk implementasi.

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

## 📱 Fitur Saat Ini

### **Core Features**
- **Mobile-first responsive design** dengan UI yang intuitif
- **Role-based authentication** (Admin/Operator) dengan NextAuth.js v5
- **Dashboard monitoring** material konstruksi real-time
- **Material tracking** untuk laporan masuk dan keluar
- **Inventory management** dengan progress tracking
- **Transaction history** dengan filtering dan pencarian
- **User profile management** dan pengaturan akun

### **Technical Features**
- **Modern UI** dengan shadcn/ui components dan Tailwind CSS
- **Type-safe development** dengan TypeScript dan Zod validation
- **Database integration** dengan PostgreSQL dan Drizzle ORM
- **Optimized performance** dengan Next.js 15 dan React Query
- **Toast notifications** untuk user feedback
- **PWA-ready** untuk instalasi mobile

### **🚀 Fitur yang Sedang Dikembangkan**
- **Advanced Admin Dashboard** - User management dan system configuration
- **Enhanced Permission System** - Fine-grained access control
- **Reporting & Analytics** - Custom reports dan data visualization
- **Multi-project Support** - Project isolation dan resource allocation
- **API Integration** - Webhook support dan third-party integrations

> **📖 Lihat [Future Development Strategy](./pijar-docs/03-future-development-strategy.md) untuk roadmap lengkap pengembangan.**

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Authentication**: NextAuth.js v5
- **Database**: Neon PostgreSQL + Drizzle ORM
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Icons**: Lucide React
- **State Management**: React Query + Custom hooks
- **TypeScript**: Full type safety
- **Validation**: Zod
- **Image Optimization**: Next.js Image + Sharp

## 📁 Struktur Project

### **Current Structure**
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
├── lib/                # Database, schema, utilities
│   ├── db.ts           # Database connection
│   ├── schema.ts       # Drizzle schema
│   └── seed.ts         # Database seeder
└── types/              # TypeScript type definitions
```

### **Target Modular Structure**
```
src/
├── features/              # Feature-based modules
│   ├── admin/            # User & role management
│   ├── inventory/        # Material & stock management
│   ├── projects/         # Project management
│   └── reporting/        # Analytics & reports
├── shared/               # Shared utilities & components
│   ├── components/       # Reusable UI components
│   ├── services/         # Business logic services
│   ├── hooks/           # Custom hooks
│   ├── types/           # Shared type definitions
│   └── utils/           # Utility functions
└── app/                 # Next.js App Router (routes only)
```

> **🏗️ Lihat [Modular Development Framework](./pijar-docs/07-modular-development-framework.md) untuk panduan implementasi struktur modular.**

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
# Database
DATABASE_URL="your_neon_database_connection_string"

# Authentication
NEXTAUTH_SECRET="your_strong_secret_key_here"
NEXTAUTH_URL="http://localhost:3000"

# App Configuration
NEXT_PUBLIC_APP_NAME="Pijar Pro Pantau"
NEXT_PUBLIC_APP_VERSION="1.0.0"

# Optional: Feature Flags
FEATURE_ADMIN_MODULE="true"
FEATURE_REPORTING_MODULE="true"
FEATURE_PLUGIN_SYSTEM="false"

# Optional: Security
ENCRYPTION_KEY="your_encryption_key_for_sensitive_data"
MAX_LOGIN_ATTEMPTS="5"
SESSION_TIMEOUT="1800000"
```

> **🔒 Lihat [Security Guidelines](./pijar-docs/06-security-performance-guidelines.md) untuk konfigurasi keamanan yang lebih detail.**

## 🤝 Kontribusi

Kami menyambut kontribusi untuk pengembangan sistem ini! Ikuti panduan berikut:

### **Getting Started**
1. Fork the project
2. Clone your fork: `git clone https://github.com/your-username/pijar-nextjs.git`
3. Install dependencies: `pnpm install`
4. Create feature branch: `git checkout -b feature/amazing-feature`

### **Development Process**
1. **Follow the workflow**: Lihat [Development Workflow](./pijar-docs/08-development-workflow.md)
2. **Code standards**: Ikuti [Implementation Patterns](./pijar-docs/05-implementation-patterns.md)
3. **Security**: Terapkan [Security Guidelines](./pijar-docs/06-security-performance-guidelines.md)
4. **Testing**: Pastikan test coverage >80%

### **Commit & PR**
1. Commit dengan format: `feat(scope): description`
2. Push to branch: `git push origin feature/amazing-feature`
3. Open Pull Request dengan template yang disediakan
4. Tunggu code review dan approval

### **Areas for Contribution**
- 🔐 **Security improvements** (password hashing, input validation)
- 🏗️ **Architecture refactoring** (service layer, modular structure)
- 🧪 **Testing** (unit tests, integration tests, E2E tests)
- 📊 **Admin features** (user management, reporting, analytics)
- 🎨 **UI/UX improvements** (accessibility, mobile optimization)
- 📚 **Documentation** (API docs, tutorials, examples)

> **💡 Untuk kontributor baru**: Mulai dengan issues yang berlabel `good-first-issue` atau `help-wanted`.

## 📄 License

This project is licensed under the MIT License.