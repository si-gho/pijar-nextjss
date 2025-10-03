# Pijar Pro - Comprehensive Troubleshooting Guide

## 🚨 Common Issues

### Material Input & Database Issues

#### Issue 1: "No projects available"
**Symptoms:**
- Dropdown "Lokasi Proyek" kosong
- Console error: Failed to fetch projects

**Solutions:**
```bash
# 1. Test database connection
curl http://localhost:3000/api/test-db

# 2. Check if projects exist
curl http://localhost:3000/api/operations/projects

# 3. If empty, seed database
curl -X POST http://localhost:3000/api/seed

# 4. Restart development server
npm run dev
```

#### Issue 2: "No materials available"
**Symptoms:**
- Dropdown "Jenis Material" kosong setelah pilih proyek
- Pesan "Belum ada material untuk proyek ini"

**Solutions:**
1. **Add material manually** via + button
2. **Check inventories API:**
   ```bash
   curl "http://localhost:3000/api/operations/inventories?projectId=1"
   ```
3. **Seed more data** if needed

#### Issue 3: Database Connection Failed
**Symptoms:**
- API endpoints return 500 errors
- "Database connection failed" messages

**Solutions:**
```bash
# 1. Check DATABASE_URL in .env
cat .env

# 2. Test connection
curl http://localhost:3000/api/test-db

# 3. Verify database is accessible
# Check Neon dashboard for database status
```

## 🚨 Build & Development Issues

### 404 Errors for JS/CSS Files

If you see errors like:
```
Failed to load resource: the server responded with a status of 404 (Not Found)
- layout.css:1
- main-app.js:1  
- page.js:1
- app-pages-internals.js:1
- layout.js:1
```

**Solutions:**

1. **Install Dependencies**
   ```bash
   cd pijar-nextjs
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Clear Next.js Cache**
   ```bash
   rm -rf .next
   npm run dev
   ```

4. **Check Node.js Version**
   ```bash
   node --version  # Should be 18.17.0 or higher
   ```

### Build Issues

1. **TypeScript Errors**
   ```bash
   npm run build
   ```
   Fix any TypeScript errors shown in the output.

2. **Image Optimization Issues**
   Make sure `sharp` is installed:
   ```bash
   npm install sharp
   ```

### Import Errors

1. **Element type is invalid**
   **Error:** `Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined`
   
   **Cause:** Incorrect import of components that don't exist
   
   **Solution:**
   ```typescript
   // ❌ Wrong - importing non-existent exports
   import { LoadingState, ErrorState } from "@/components/LoadingSpinner";
   
   // ✅ Correct - import actual exports
   import { LoadingSpinner } from "@/components/LoadingSpinner";
   ```

2. **Module Not Found**
   - Check if all UI components are properly created
   - Verify import paths use `@/` alias correctly

3. **Toast Import Issues**
   Use correct import:
   ```typescript
   import { toast } from "sonner";
   ```

## ✅ Verification Steps

### Database & API Testing
```bash
# 1. Test database connection
curl http://localhost:3000/api/test-db

# 2. Test all API endpoints
node test-material-flow.js

# 3. Seed sample data if needed
curl -X POST http://localhost:3000/api/seed
```

### Frontend Testing
1. **Check Project Structure**
   ```
   pijar-nextjs/
   ├── src/
   │   ├── app/api/operations/
   │   ├── components/
   │   └── lib/
   ├── public/
   ├── package.json
   └── .env
   ```

2. **Test Development Server**
   ```bash
   npm run dev
   ```
   Should start on http://localhost:3000

3. **Test Material Flow**
   - Open http://localhost:3000/operations/in
   - Select project → Materials should load
   - Try adding new material with + button
   - Submit form → Should show success toast

4. **Test Build**
   ```bash
   npm run build
   ```
   Should complete without errors

### Browser Testing Checklist
- [ ] Projects load in dropdown
- [ ] Materials load after selecting project  
- [ ] + button works for adding new materials
- [ ] Form submissions succeed
- [ ] Toast notifications appear
- [ ] No console errors in Developer Tools

## 🔧 Reset Project

If all else fails:
```bash
# Remove node_modules and lock files
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install

# Start fresh
npm run dev
```