# Frontend Debugging Guide

## 🔍 How to Debug Registration Issues

### Step 1: Open Browser Developer Console
1. Press **F12** or **Ctrl+Shift+I** (Windows/Linux) or **Cmd+Option+I** (Mac)
2. Click on the **Console** tab
3. Clear any existing messages

### Step 2: Test Backend Connection
1. On the registration page, click the **"Test Backend Connection"** button at the bottom
2. Check the console for the response
3. You should see: `Backend connection test: {success: true, count: X, data: [...]}`

### Step 3: Attempt Registration
1. Fill in the registration form:
   - Email: Use a NEW email (not kaylynnjohnson1@gmail.com - that one already exists)
   - Name: Your full name
2. Click **Register**
3. Watch the console for detailed logs

### Expected Console Output (Success):
```
=== REGISTRATION ATTEMPT ===
Form Data: {email: "...", name: "...", role: "user"}
Calling registerUser API...
Registration response: {success: true, data: {...}}
Response type: object
Response success: true
Response data: {email: "...", name: "...", ...}
Registration successful! Logging in user...
=== REGISTRATION ATTEMPT COMPLETE ===
```

### Expected Console Output (Error):
```
=== REGISTRATION ATTEMPT ===
Form Data: {email: "...", name: "...", role: "user"}
Calling registerUser API...
=== REGISTRATION ERROR ===
Error object: [Error details]
Error message: [Specific error message]
Error response: [Response from server]
=== REGISTRATION ATTEMPT COMPLETE ===
```

## 🐛 Common Issues & Solutions

### Issue 1: "This email is already registered"
**Solution:** Use a different email address. These emails are already registered:
- kaylynnjohnson1@gmail.com
- test@test.com
- newuser@test.com
- frontendtest@test.com

### Issue 2: Network Error / No Response
**Symptoms:** Console shows "No response received"
**Solutions:**
1. Check your internet connection
2. Verify backend is running: https://azbs-backend.onrender.com/
3. Check browser network tab for blocked requests

### Issue 3: CORS Error
**Symptoms:** Console shows "Access-Control-Allow-Origin" error
**Solution:** Backend CORS is already enabled. Clear browser cache and try again.

### Issue 4: "Registration failed" with no specific error
**Check:**
1. Network tab in DevTools (F12 → Network)
2. Look for the POST request to `/api/users`
3. Check the request payload and response

## 📊 Network Tab Debugging

1. Open DevTools → **Network** tab
2. Try to register
3. Look for: `POST` request to `https://azbs-backend.onrender.com/api/users`
4. Click on it to see:
   - **Headers:** Request/Response headers
   - **Payload:** Data being sent
   - **Response:** Server response

### Successful Request Should Show:
- **Status:** 201 Created
- **Response:**
```json
{
  "success": true,
  "data": {
    "email": "your@email.com",
    "name": "Your Name",
    "role": "user",
    "photo": null,
    "created_at": "...",
    "updated_at": "..."
  }
}
```

## 🔧 Quick Fixes

### Clear Browser Cache
```
Ctrl+Shift+Delete (Windows/Linux)
Cmd+Shift+Delete (Mac)
```

### Hard Refresh
```
Ctrl+F5 (Windows/Linux)
Cmd+Shift+R (Mac)
```

### Check Local Storage
1. DevTools → **Application** tab (Chrome) or **Storage** tab (Firefox)
2. Look for `azbs_user` key
3. Delete it if you want to log out

## 📝 What to Report

If registration still fails, provide:
1. **Console logs** (copy all text from console)
2. **Network request details** (from Network tab)
3. **Email you're trying to register** (to check if it already exists)
4. **Any error messages** shown on screen

## 🎯 Test Users

You can login with these existing users:
- kaylynnjohnson1@gmail.com

Or register a new user with any email that hasn't been used yet.

## 🚀 Backend Status

Check backend health: https://azbs-backend.onrender.com/health

Should return:
```json
{
  "status": "healthy",
  "timestamp": "...",
  "uptime": ...,
  "environment": "..."
}
```

