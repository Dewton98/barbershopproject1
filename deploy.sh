#!/bin/bash

# Premium Barber Shop - Quick Deployment Script
echo "🚀 Premium Barber Shop - Deployment Setup"
echo "=========================================="

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  Environment file not found!"
    echo "📝 Copying .env.example to .env..."
    cp .env.example .env
    echo "✅ Please edit .env file with your actual values before deploying!"
    echo ""
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run linting
echo "🔍 Running lint check..."
npm run lint

# Build the project
echo "🏗️  Building for production..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🌐 Ready for deployment! Choose your option:"
    echo ""
    echo "1. Lovable (Quickest):"
    echo "   Visit: https://lovable.dev/projects/917a4516-eef0-44df-8ae9-e3e18f3a6822"
    echo "   Click Share → Publish"
    echo ""
    echo "2. Netlify (Recommended):"
    echo "   - Drag 'dist' folder to netlify.com"
    echo "   - Or connect your Git repository"
    echo ""
    echo "3. Vercel:"
    echo "   - Run: npx vercel"
    echo "   - Or connect your Git repository"
    echo ""
    echo "4. GitHub Pages:"
    echo "   - Run: npm run deploy (after adding gh-pages script)"
    echo ""
    echo "📖 For detailed instructions, see DEPLOYMENT.md"
else
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi