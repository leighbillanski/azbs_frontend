# App Icon Instructions

## Current Icon
- Using: `baby-icon.svg` (baby emoji 👶)
- Color: Purple (#667eea)

## To Use Your Couple Photo

### Step 1: Save Your Photo
Save the couple photo to:
```
/home/vmuser/personal/azbs_frontend/public/couple-icon.jpg
```

### Step 2: Update index.html
Change line 5 in `public/index.html` from:
```html
<link rel="icon" href="%PUBLIC_URL%/baby-icon.svg" type="image/svg+xml" />
```
to:
```html
<link rel="icon" href="%PUBLIC_URL%/couple-icon.jpg" />
```

And line 6 from:
```html
<link rel="apple-touch-icon" href="%PUBLIC_URL%/baby-icon.svg" />
```
to:
```html
<link rel="apple-touch-icon" href="%PUBLIC_URL%/couple-icon.jpg" />
```

### Step 3: Update manifest.json
Change the icons array in `public/manifest.json` to:
```json
"icons": [
  {
    "src": "couple-icon.jpg",
    "sizes": "512x512",
    "type": "image/jpeg"
  }
]
```

### Step 4: Clear Cache & Reload
- Hard refresh: `Ctrl + Shift + R`
- Or restart your browser
- The couple photo will now be your app icon!

---

## Current Files
- ✅ `baby-icon.svg` - Temporary emoji icon (currently active)
- ⏳ `couple-icon.jpg` - Your photo (save this to use it)

