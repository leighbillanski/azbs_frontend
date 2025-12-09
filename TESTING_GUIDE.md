# Testing Guide - Mock Data Setup

## 🧪 Testing RSVP and Claim Functionality

To test the RSVP and claim functionality, you need to populate your database with mock items.

## 📋 What's Included

**15 Baby Shower Items:**
- Baby Crib
- Diapers (Size 1) - Qty: 5
- Baby Bottles Set - Qty: 2
- Stroller
- Baby Monitor
- Onesies Pack - Qty: 3
- Baby Blankets - Qty: 4
- Nursing Pillow
- Baby Bath Tub
- Pacifiers - Qty: 6
- Baby Wipes - Qty: 10
- Baby Carrier
- Swaddle Blankets - Qty: 5
- Baby Thermometer
- Teething Toys - Qty: 3

Each item includes:
- Item name
- Photo (from Unsplash)
- Purchase link (Amazon)
- Quantity needed
- Unclaimed status

## 🚀 How to Add Mock Data

### Using Admin Tools Page

1. **Login** to your account
2. **Navigate** to: `http://localhost:3000/admin`
3. **Click** the "➕ Add Mock Items" button
4. **Wait** for all items to be added
5. **Check results** - you'll see which items succeeded or failed

## 🗑️ How to Remove Mock Data

### Using Admin Tools Page

1. **Navigate** to: `http://localhost:3000/admin`
2. **Click** the "🗑️ Delete Mock Items" button
3. **Confirm** the deletion (you'll be asked to confirm)
4. **Wait** for all items to be deleted
5. **Check results** - you'll see which items were deleted

**Note:** You'll be asked to confirm before deleting. This action cannot be undone!

## ✅ Testing the Features

After adding mock items, you can test:

### RSVP Page (`/rsvp`)
1. View available items
2. Click on any item to select it
3. Choose to claim for yourself or a guest
4. Fill in guest details if claiming for someone else
5. Confirm and submit
6. See success message and updated item list

### Items Page (`/items`)
1. View all items (claimed and unclaimed)
2. See item details and photos
3. View purchase links

### Claimed Items Page (`/claimed`)
1. View only claimed items
2. See who claimed each item
3. Option to unclaim items

## 🔧 Backend Requirements

Make sure your backend is running and accessible:
- Default: `https://azbs-backend.onrender.com/api`
- Or set custom: `REACT_APP_API_URL` in `.env`

## 📝 Notes

- Items may fail to add if they already exist (duplicate names)
- All items are created as "unclaimed" by default
- You can re-run the add process if needed
- Delete will only remove items that match the mock item names exactly
- Items can be managed through the regular Items page after creation
- Both add and delete operations show detailed results for each item

## 🎯 Testing Scenarios

### Scenario 1: Claim for Yourself
1. Go to `/rsvp`
2. Select an item
3. Choose "Myself"
4. Submit
5. Verify item appears in `/claimed`

### Scenario 2: Claim for Guest
1. Go to `/rsvp`
2. Select an item
3. Choose "A Guest"
4. Enter guest name and contact
5. Submit
6. Verify guest appears in claimed items

### Scenario 3: View and Manage
1. Check `/items` to see all items
2. Check `/claimed` to see what's claimed
3. Try unclaiming an item
4. Verify it returns to `/rsvp` available list

## 🐛 Troubleshooting

**Items not appearing?**
- Check backend is running
- Verify API URL is correct
- Check browser console for errors

**Can't add items?**
- Ensure you're logged in
- Check network tab for API errors
- Try clearing items first if duplicates exist

**Claims not working?**
- Verify item exists in backend
- Check item name matches exactly
- Review API response in console

---

**Happy Testing! 🎉**

