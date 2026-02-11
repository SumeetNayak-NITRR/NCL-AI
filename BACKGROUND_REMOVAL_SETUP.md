# Background Removal Setup Guide

## Overview

Player photos are automatically processed to remove backgrounds during registration, creating clean FIFA-style player cutouts.

## Setup Instructions

### 1. Get a Remove.bg API Key

1. Visit [remove.bg](https://www.remove.bg/users/sign_up)
2. Sign up for a free account
3. Go to [API Dashboard](https://www.remove.bg/api)
4. Copy your API key

### 2. Add API Key to Environment

Open `.env` file and replace the placeholder:

```env
VITE_REMOVE_BG_API_KEY=your_actual_api_key_here
```

### 3. Restart Dev Server

```bash
npm run dev
```

## How It Works

1. User uploads a player photo during registration
2. Photo is cropped using the ImageUpload component
3. **Background is automatically removed** using remove.bg API
4. Processed image (PNG with transparency) is uploaded to Supabase
5. Player card displays clean cutout on custom background

## Free Tier Limits

- **50 images per month** for free
- After that: $0.20 per image
- For monthly subscription: $9/month (500 images)

## Fallback Behavior

If the API key is not configured or API call fails:
- Original image is used (with background)
- User sees a warning message
- Registration continues normally

## Testing

1. Register a new player with a photo that has a busy background
2. Check the card preview - player should appear as a clean cutout
3. Verify the photo in Admin dashboard

## Troubleshooting

**Issue:** Background not removed
- Check API key is correct in `.env`
- Verify API key has remaining credits
- Check browser console for error messages

**Issue:** "Background removal failed" alert
- API might be down or rate-limited
- Image format might not be supported
- Check remove.bg dashboard for quota

**Issue:** Image quality issues
- Original image resolution too low
- Try uploading higher quality photos (recommended: 1000x1000px minimum)
