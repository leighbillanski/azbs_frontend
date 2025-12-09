# Backend API Reference

**Backend URL:** https://azbs-backend.onrender.com/api

## 🔗 API Endpoints

### 👤 User Endpoints (`/api/users`)

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| GET | `/` | Get all users | - |
| GET | `/:email` | Get user by email | `email` (path) |
| GET | `/:email/guests` | Get user with their guests | `email` (path) |
| POST | `/` | Create new user | `userData` (body) |
| PUT | `/:email` | Update user | `email` (path), `userData` (body) |
| DELETE | `/:email` | Delete user | `email` (path) |

### 👥 Guest Endpoints (`/api/guests`)

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| GET | `/` | Get all guests | - |
| GET | `/user/:userEmail` | Get guests by user email | `userEmail` (path) |
| GET | `/:name/:number` | Get specific guest | `name`, `number` (path) |
| GET | `/:name/:number/items` | Get guest with their items | `name`, `number` (path) |
| POST | `/` | Create new guest | `guestData` (body) |
| PUT | `/:name/:number` | Update guest | `name`, `number` (path), `guestData` (body) |
| DELETE | `/:name/:number` | Delete guest | `name`, `number` (path) |

### 🎁 Item Endpoints (`/api/items`)

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| GET | `/` | Get all items | - |
| GET | `/claimed` | Get all claimed items | - |
| GET | `/unclaimed` | Get all unclaimed items | - |
| GET | `/guest/:guestName/:guestNumber` | Get items by guest | `guestName`, `guestNumber` (path) |
| GET | `/:itemName` | Get specific item | `itemName` (path) |
| POST | `/` | Create new item | `itemData` (body) |
| PUT | `/:itemName` | Update item | `itemName` (path), `itemData` (body) |
| POST | `/:itemName/claim` | Claim an item | `itemName` (path), `guestData` (body) |
| POST | `/:itemName/unclaim` | Unclaim an item | `itemName` (path) |
| DELETE | `/:itemName` | Delete item | `itemName` (path) |

## 📝 Frontend API Functions

All frontend API functions are located in `src/api/api.js`:

### User Functions
- `registerUser(userData)` - Register a new user
- `loginUser(email)` - Login/get user by email
- `getUserWithGuests(email)` - Get user with all their guests

### Guest Functions
- `getGuestsByUser(userEmail)` - Get all guests for a user
- `createGuest(guestData)` - Create a new guest

### Item Functions
- `getAllItems()` - Get all items
- `getClaimedItems()` - Get only claimed items
- `getUnclaimedItems()` - Get only unclaimed items
- `claimItem(itemName, guestData)` - Claim an item for a guest
- `unclaimItem(itemName)` - Remove claim from an item
- `createItem(itemData)` - Create a new item

## 🔧 Configuration

The frontend is configured to connect to:
```javascript
https://azbs-backend.onrender.com/api
```

To use a different backend URL, set the environment variable:
```bash
REACT_APP_API_URL=https://your-backend-url.com/api
```

## ✅ Status

- **Backend:** ✅ Live at https://azbs-backend.onrender.com/
- **Frontend API:** ✅ Configured and tested
- **All Routes:** ✅ Mapped correctly

