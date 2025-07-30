# 🚀 Premium Barber Shop - Deployment Guide

Your barbershop application is ready for deployment! Choose from the options below based on your needs.

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have:

### 1. Set Up Environment Variables

Create your environment variables based on `.env.example`:

```bash
# Required for Supabase
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Required for SMS functionality
VITE_AFRICAS_TALKING_USERNAME=your_africas_talking_username
VITE_AFRICAS_TALKING_API_KEY=your_africas_talking_api_key
VITE_AFRICAS_TALKING_ENVIRONMENT=sandbox # or production
VITE_SMS_DEMO_MODE=false # Set to false for real SMS

# Optional customization
VITE_APP_NAME="Premium Barber Shop"
VITE_BARBER_PHONE=+254700000000
```

### 2. Supabase Setup

1. Create a Supabase project at https://supabase.com
2. Create the `bookings` table with the following schema:

```sql
CREATE TABLE bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    customer_phone VARCHAR NOT NULL,
    date DATE NOT NULL,
    price VARCHAR NOT NULL,
    reminder BOOLEAN DEFAULT FALSE,
    service VARCHAR NOT NULL,
    status VARCHAR NOT NULL DEFAULT 'upcoming',
    time VARCHAR NOT NULL,
    user_id UUID REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own bookings
CREATE POLICY "Users can view own bookings" ON bookings
    FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own bookings
CREATE POLICY "Users can insert own bookings" ON bookings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Admins can see all bookings
CREATE POLICY "Admins can view all bookings" ON bookings
    FOR ALL USING (
        auth.uid() IN (
            SELECT id FROM auth.users 
            WHERE raw_user_meta_data->>'role' IN ('admin', 'staff')
        )
    );
```

3. Enable Authentication in your Supabase project
4. Get your project URL and anon key from Settings > API

### 3. Africa's Talking Setup (Optional)

1. Sign up at https://africastalking.com
2. Get your username and API key
3. Set `VITE_SMS_DEMO_MODE=false` to enable real SMS

---

## 🌐 Deployment Options

### Option 1: Lovable (Quickest) ⚡

**Best for**: Quick demos and testing

1. Visit: https://lovable.dev/projects/917a4516-eef0-44df-8ae9-e3e18f3a6822
2. Click **Share** → **Publish**
3. Your app will be live instantly!

**Pros**: Instant deployment, no setup required
**Cons**: Limited customization, Lovable subdomain only

---

### Option 2: Netlify (Recommended) 🌟

**Best for**: Production deployment with custom domain

#### Deploy via Git (Recommended)

1. **Push to GitHub/GitLab**:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your repository
   - Netlify will auto-detect the settings!

3. **Add Environment Variables**:
   - Go to Site settings → Environment variables
   - Add all your `VITE_` variables

#### Deploy via Drag & Drop

1. **Build locally**:
   ```bash
   npm run build
   ```

2. **Deploy**:
   - Go to [netlify.com](https://netlify.com)
   - Drag the `dist` folder to the deploy area

**Pros**: Fast CDN, custom domain, automatic deployments
**Cons**: Requires account setup

---

### Option 3: Vercel ⚡

**Best for**: React applications with great performance

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Follow prompts** and add environment variables when asked

**Or deploy via Git**:
- Connect your repo at [vercel.com](https://vercel.com)
- Vercel will auto-detect and deploy

**Pros**: Excellent performance, automatic deployments
**Cons**: Requires account setup

---

### Option 4: GitHub Pages (Free) 📖

**Best for**: Simple hosting, no backend features

1. **Install gh-pages**:
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update package.json**:
   ```json
   {
     "homepage": "https://yourusername.github.io/barbershop",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Deploy**:
   ```bash
   npm run deploy
   ```

**Pros**: Free, easy setup
**Cons**: Static hosting only, GitHub domain

---

### Option 5: Self-Hosted (Advanced) 🔧

**Best for**: Full control, enterprise deployment

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Upload `dist` folder** to your web server

3. **Configure web server** for SPA routing:

   **Nginx**:
   ```nginx
   location / {
     try_files $uri $uri/ /index.html;
   }
   ```

   **Apache** (.htaccess):
   ```apache
   RewriteEngine On
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule . /index.html [L]
   ```

**Pros**: Full control, custom configuration
**Cons**: Requires server management skills

---

## 🔧 Post-Deployment Setup

### 1. Test Core Features
- [ ] User registration/login
- [ ] Booking creation
- [ ] Admin panel access
- [ ] SMS notifications (if enabled)

### 2. Create Admin User
```sql
-- Update user role in Supabase
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb 
WHERE email = 'your-admin-email@example.com';
```

### 3. Configure Custom Domain (if needed)
- **Netlify**: Site settings → Domain management
- **Vercel**: Project settings → Domains
- **Update DNS**: Point your domain to the platform

---

## 🚨 Security Notes

- Always use HTTPS in production
- Never commit `.env` files with real secrets
- Use environment variables for all sensitive data
- Enable RLS (Row Level Security) in Supabase
- Regularly update dependencies

---

## 📞 Support

If you encounter issues:

1. Check the browser console for errors
2. Verify all environment variables are set
3. Ensure Supabase database is properly configured
4. Test SMS functionality in demo mode first

---

## 🎉 Success!

Your Premium Barber Shop application is now live! Share the URL with your customers and start taking bookings.

**Next Steps**:
- Add your real business information
- Customize the gallery images
- Set up real payment processing
- Monitor usage and performance