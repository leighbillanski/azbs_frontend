# Mock Data Field Name Fix

## 🐛 Issue

When trying to add mock items, the backend returned error:
```
"Item name is required"
```

## 🔍 Root Cause

The mock data was using **camelCase** field names, but the backend expects **snake_case** field names (matching database conventions).

### Before (Wrong):
```javascript
{
  itemName: 'Baby Crib',
  photoUrl: 'https://...',
  purchaseLink: 'https://...',
  itemCount: 1,
  claimed: false
}
```

### After (Correct):
```javascript
{
  item_name: 'Baby Crib',
  item_photo: 'https://...',
  item_link: 'https://...',
  item_count: 1,
  claimed: false
}
```

## ✅ Files Fixed

1. **`src/utils/mockData.js`**
   - Changed all field names to snake_case
   - Added comment explaining backend expects snake_case

2. **`src/screens/AdminTools.js`**
   - Updated to use `item.item_name` instead of `item.itemName`
   - Updated to use `item.item_count` instead of `item.itemCount`

3. **`src/screens/RSVP.js`**
   - Updated to use `item.item_name` instead of `item.itemName`
   - Updated to use `item.item_photo` instead of `item.photoUrl`
   - Updated to use `item.item_link` instead of `item.purchaseLink`
   - Updated to use `item.item_count` instead of `item.itemCount`

## 📝 Field Name Mapping

| Frontend (Old) | Backend (Correct) |
|----------------|-------------------|
| `itemName`     | `item_name`       |
| `photoUrl`     | `item_photo`      |
| `purchaseLink` | `item_link`       |
| `itemCount`    | `item_count`      |
| `claimed`      | `claimed`         |

## 🚀 Ready to Test

The mock data should now work correctly. Try adding items again:

1. Go to: `http://localhost:3000/admin`
2. Click "➕ Add Mock Items"
3. All 15 items should be added successfully

## ✅ Status

- ✅ Mock data structure fixed
- ✅ AdminTools.js updated
- ✅ RSVP.js updated
- ✅ No linter errors
- ✅ Ready for testing

---

**Fixed:** December 8, 2025

