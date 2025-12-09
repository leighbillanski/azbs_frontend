# Mock Data Reference Guide

## Overview
The mock data files in `src/data/` are used as a **reference and seed data source** for the database. The application always uses the **real backend API** to fetch and update data.

**Note:** The mock JSON files are kept for documentation and database seeding purposes only. The application does not read from these files during runtime.

---

## Database Connection

The app connects to the backend API at:
```
https://azbs-backend.onrender.com/api
```

All item data is stored in and retrieved from the PostgreSQL database via the backend API.

---

## Mock Data Structure

The mock data file is located at: `src/data/mockItems.json`

### Item Schema
Each item follows the backend's expected structure:

```json
{
  "item_name": "Baby Crib",
  "item_photo": "https://example.com/photo.jpg",
  "item_link": "https://www.amazon.com/baby-crib",
  "item_count": 5,
  "claimed_count": 0,
  "claimed": false,
  "guest_name": null,
  "guest_number": null
}
```

**Key Fields:**
- **`item_name`** (string, required): Unique identifier and display name
- **`item_photo`** (string, optional): URL to item image
- **`item_link`** (string, optional): External link for more details
- **`item_count`** (number, required): Total quantity of this item
- **`claimed_count`** (number, required): Number already claimed (default: 0)
- **`claimed`** (boolean, required): Fully claimed status (true when claimed_count >= item_count)
- **`guest_name`** (string, nullable): Name of guest who last claimed the item
- **`guest_number`** (string, nullable): Contact number of guest who last claimed

**Available Quantity Calculation:**
```javascript
availableQuantity = item_count - claimed_count
```

Items are hidden from the list when `claimed_count >= item_count`.

---

## Backend Compatibility

The mock data is designed to match the backend's API response structure:

### Backend Expected Fields
- Uses **snake_case** naming convention (`item_name`, not `itemName`)
- Guest data requires: `guest_name`, `guest_number`, `user_email`
- Items can be claimed with a `quantity` parameter

### User Schema
Users now include a `number` field for phone numbers:

```json
{
  "email": "user@example.com",
  "name": "Full Name",
  "number": "123-456-7890",
  "password": "hashed_password",
  "role": "guest"
}
```

---

## How It Works

### ItemList Screen
- Fetches items from `/items` endpoint
- Displays available quantity as `item_count - claimed_count`
- Creates guest entries before claiming
- Claims update the database via API
- Items disappear when `claimed_count >= item_count`
- Supports multi-select and quantity selection

### RSVP Screen
- Fetches from `/items/unclaimed` endpoint
- Displays available quantity as `item_count - claimed_count`
- Creates guest entries if needed
- Claims update the database via API
- Single item claiming (quantity 1)
- Items disappear when fully claimed

---

## Testing Claim Functionality

### Test Scenario 1: Claim for Self
1. Navigate to Items or RSVP page
2. Select an item
3. Choose "Myself" option
4. Confirm claim
5. ✅ Item should be claimed and database updated with your user details

### Test Scenario 2: Claim for Guest
1. Select an item
2. Choose "A Guest" option
3. Enter guest name and phone number
4. Confirm claim
5. ✅ Item should be claimed and database updated with guest details

### Test Scenario 3: Multiple Item Claim (ItemList only)
1. Select multiple items using checkboxes
2. Adjust quantities as needed
3. Click "Claim X Items" button
4. Choose claiming for self or guest
5. Confirm batch claim
6. ✅ All selected items should be claimed in the database

---

## Adding New Mock Items

Edit `src/data/mockItems.json`:

```json
{
  "item_name": "New Item Name",
  "item_photo": "https://images.unsplash.com/photo-example?w=400",
  "item_link": "https://store.com/product",
  "item_count": 5,
  "claimed_count": 0,
  "claimed": false,
  "guest_name": null,
  "guest_number": null
}
```

**Tips:**
- Use unique `item_name` values
- Unsplash provides free placeholder images: `https://source.unsplash.com/400x300/?baby`
- Set `item_count` based on total quantity available
- Always set `claimed_count` to `0` for new items
- Leave `claimed`, `guest_name`, and `guest_number` as `null` for new items
- Available quantity will be calculated as `item_count - claimed_count`

---

## Current Mock Data Includes
- Baby Crib
- Diapers (Size 1) - Quantity: 5
- Baby Bottles Set - Quantity: 2
- Stroller
- Baby Monitor
- Onesies Pack - Quantity: 3
- Baby Blankets - Quantity: 4
- Nursing Pillow
- Baby Bath Tub
- Pacifiers - Quantity: 6
- Baby Wipes - Quantity: 10
- Baby Carrier
- Swaddle Blankets - Quantity: 5
- Baby Thermometer
- Teething Toys - Quantity: 3

**Total: 15 items, 51 total quantity**

---

## Seeding the Database

To seed the database with the mock items:

1. **Backend Setup:** Ensure your backend has a seeding script
2. **Import Data:** Use the `mockItems.json` as a data source
3. **Run Seed Script:** Execute the backend's database seeding command

Example seed data format is maintained in `src/data/mockItems.json`.

---

## Troubleshooting

### Items not loading?
- Check backend API is running and accessible
- Verify `REACT_APP_API_URL` is set correctly
- Check browser console for network errors
- Ensure database connection is working on backend

### Items not filtering correctly?
- Verify `claimed_count` is being updated in the database
- Check backend API returns correct `item_count - claimed_count` calculation
- ItemList shows ALL items with `claimed_count < item_count`
- RSVP shows only unclaimed items

### Claims not working?
- Check user authentication is valid
- Verify backend `/claim` endpoint is functioning
- Check guest creation endpoint is working
- Review backend logs for errors

---

## Development Tips

1. **Keep mock data synced with backend schema** - prevents schema mismatches
2. **Test with real API during development** - catches issues early
3. **Monitor available quantities** - ensure `claimed_count` updates correctly
4. **Use backend seeding scripts** - for consistent test data

---

## Related Files

- `src/data/mockItems.json` - Reference item data for seeding database
- `src/screens/ItemList.js` - Items list with multiselect
- `src/screens/RSVP.js` - RSVP page with single item claim
- `src/api/api.js` - API integration functions
- `.env` - Environment configuration (set `REACT_APP_API_URL`)

---

**Last Updated:** December 2025  
**Backend:** https://azbs-backend.onrender.com/api

