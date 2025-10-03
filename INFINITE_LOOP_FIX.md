# Infinite Loop Fix Documentation

## 🐛 **Problem: Maximum Update Depth Exceeded**

### Error Message
```
Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.
```

### Root Cause
The error was caused by infinite re-rendering loops in useEffect hooks due to unstable function references in dependency arrays.

## 🔧 **Solutions Applied**

### 1. **useApi Hook Optimization**
**Before:**
```typescript
const fetchData = async () => {
  // function recreated on every render
};

useEffect(() => {
  if (options.autoFetch && url) {
    fetchData();
  }
}, [url, options.autoFetch]); // fetchData not in deps = stale closure
```

**After:**
```typescript
const fetchData = useCallback(async () => {
  if (!url) return;
  // stable function reference
}, [url]);

const postData = useCallback(async (body: any) => {
  // stable function reference
}, [url]);

useEffect(() => {
  if (options.autoFetch && url) {
    fetchData();
  }
}, [fetchData, options.autoFetch]); // stable deps
```

### 2. **Component-Level Simplification**

#### **Material In Page**
**Before (Problematic):**
```typescript
const { data: inventories, refetch: fetchInventories } = useApi(url, { autoFetch: false });

useEffect(() => {
  if (formData.projectId) {
    fetchInventories(); // unstable function reference
  }
}, [formData.projectId, fetchInventories]); // causes infinite loop
```

**After (Fixed):**
```typescript
const { data: inventories, refetch: fetchInventories } = useApi(
  formData.projectId ? `/api/operations/inventories?projectId=${formData.projectId}` : '',
  { autoFetch: !!formData.projectId } // auto-fetch when projectId exists
);
// No manual useEffect needed!
```

#### **Material Out Page**
**Before (Problematic):**
```typescript
useEffect(() => {
  if (formData.projectId) {
    fetchInventories(); // multiple unstable functions
    fetchStocks();
  }
}, [formData.projectId, fetchInventories, fetchStocks]); // infinite loop
```

**After (Fixed):**
```typescript
const { data: inventories } = useApi(url, { autoFetch: !!formData.projectId });
const { data: stocks } = useApi(url, { autoFetch: !!formData.projectId });
// Auto-fetch handles everything
```

#### **Stocks Page**
**Before (Problematic):**
```typescript
const { data: stocks, refetch } = useApi(url);

useEffect(() => {
  refetch(); // unstable function
}, [selectedProjectId, refetch]); // infinite loop
```

**After (Fixed):**
```typescript
const { data: stocks } = useApi(
  `/api/operations/stocks${selectedProjectId !== 'all' ? `?projectId=${selectedProjectId}` : ''}`
);
// URL change triggers auto-refetch
```

## 🎯 **Key Principles Applied**

### 1. **Stable Function References**
- Use `useCallback` for functions that go into dependency arrays
- Memoize functions that are passed as props or used in effects

### 2. **Declarative Data Fetching**
- Let URL changes drive data fetching instead of manual effects
- Use `autoFetch` flag to control when data should be fetched

### 3. **Minimize Manual Effects**
- Prefer built-in mechanisms over manual useEffect
- Only use useEffect when absolutely necessary

### 4. **Dependency Array Hygiene**
- Include all dependencies in useEffect arrays
- Use ESLint exhaustive-deps rule
- Prefer stable references in dependencies

## 🚀 **Performance Benefits**

### Before Fix:
- ❌ Infinite re-renders
- ❌ Excessive API calls
- ❌ Browser freezing
- ❌ Memory leaks

### After Fix:
- ✅ Stable rendering cycles
- ✅ Efficient API calls only when needed
- ✅ Smooth user experience
- ✅ Proper cleanup

## 🔍 **Testing the Fix**

### Manual Testing:
1. **Material In Form**:
   - Select project → inventories load once
   - Add new material → inventories refresh once
   - No infinite loops

2. **Material Out Form**:
   - Select project → inventories and stocks load once
   - Change project → data refreshes once
   - No infinite loops

3. **Stocks Page**:
   - Change project filter → stocks refresh once
   - No infinite loops

### Code Quality:
```bash
# No TypeScript errors
npm run type-check

# No ESLint warnings about dependencies
npm run lint

# No console errors in browser
```

## 📚 **Best Practices Learned**

1. **Always use useCallback for functions in dependency arrays**
2. **Prefer declarative data fetching over imperative**
3. **Let URL/parameter changes drive data fetching**
4. **Minimize manual useEffect usage**
5. **Test for infinite loops during development**

## 🛡️ **Prevention Strategies**

1. **ESLint Rules**:
   ```json
   {
     "rules": {
       "react-hooks/exhaustive-deps": "error"
     }
   }
   ```

2. **Code Review Checklist**:
   - [ ] All useEffect dependencies included
   - [ ] Functions in deps are memoized
   - [ ] No unnecessary manual effects
   - [ ] URL changes drive data fetching

3. **Development Tools**:
   - React DevTools Profiler
   - Browser Performance tab
   - Console warnings monitoring

This fix ensures stable, performant React components without infinite loops while maintaining all functionality.