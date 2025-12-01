# 🚀 Quick Start Guide

This guide will help you get the AI-Powered RFP Management System up and running in 10 minutes.

## Prerequisites Check

Before starting, verify you have these installed:

```bash
# Check Node.js (should be v16+)
node --version

# Check npm
npm --version

# Check if Ollama is installed
ollama --version
```

If Ollama is not installed:
```bash
brew install ollama
```

## Step-by-Step Setup

### Step 1: Install Ollama Model (One-time setup)

Open a terminal and run:

```bash
# Pull the Llama 3.1 model (this may take a few minutes)
ollama pull llama3.1
```

Wait for the download to complete. This model will be used for all AI operations.

### Step 2: Start Ollama Service

Open **Terminal 1** and keep it running:

```bash
ollama serve
```

You should see: `Ollama is running on http://localhost:11434`

⚠️ **Important:** Keep this terminal running throughout your demo!

### Step 3: Start Backend Server

Open **Terminal 2**:

```bash
cd /Users/wbeniroh/Desktop/aerchain/rfp-management-system/backend
npm start
```

You should see:
```
==================================================
🚀 AI-Powered RFP Management System
==================================================
Server running on http://localhost:5000
```

⚠️ **Important:** Keep this terminal running!

### Step 4: Start Frontend

Open **Terminal 3**:

```bash
cd /Users/wbeniroh/Desktop/aerchain/rfp-management-system/frontend
npm start
```

The app will automatically open in your browser at `http://localhost:3000`

If it doesn't open automatically, manually navigate to: http://localhost:3000

---

## 🎯 Complete Test Workflow

Follow these steps to test all features:

### 1️⃣ Add Vendors (2 minutes)

1. Click **"Vendors"** in navigation
2. Click **"➕ Add Vendor"**
3. Add three vendors:

**Vendor 1: Dell**
- Name: `Dell Technologies`
- Email: `dell@example.com`
- Company: `Dell Inc.`

**Vendor 2: HP**
- Name: `HP Enterprise`
- Email: `hp@example.com`
- Company: `HP Inc.`

**Vendor 3: Lenovo**
- Name: `Lenovo Solutions`
- Email: `lenovo@example.com`
- Company: `Lenovo Group`

### 2️⃣ Create RFP with AI (2 minutes)

1. Click **"Create RFP"** in navigation
2. Click **"Use Example"** button to fill the textarea with sample text
3. Click **"✨ Generate RFP"** button
4. Wait 5-10 seconds for AI to process
5. See structured RFP created automatically!

### 3️⃣ Send RFP to Vendors (1 minute)

1. Go back to **"RFPs"** page
2. Find your newly created RFP
3. Click **"View Details"**
4. Select all three vendors (Dell, HP, Lenovo)
5. Click **"📤 Send RFP"**
6. RFP status changes to "sent"

### 4️⃣ Simulate Vendor Responses (3 minutes)

1. Go to **"Simulate Response"** in navigation
2. **For Dell response:**
   - Select your RFP from dropdown
   - Select "Dell Technologies" as vendor
   - Click **"Dell Example"** button to auto-fill response
   - Click **"📤 Submit Response"**
   - Wait for AI to parse (5-10 seconds)

3. **Repeat for HP:**
   - Click **"HP Example"** button
   - Submit response

4. **Repeat for Lenovo:**
   - Click **"Lenovo Example"** button
   - Submit response

### 5️⃣ View AI-Powered Comparison (2 minutes)

1. Go back to **"RFPs"** page
2. Click **"Compare Proposals"** on your RFP
3. Wait 10-15 seconds for AI to analyze all proposals
4. See:
   - ✅ AI summary of all proposals
   - ✅ Best price, fastest delivery, best warranty highlights
   - ✅ Side-by-side comparison table
   - ✅ Vendor rankings with scores
   - ✅ Pros and cons for each vendor
   - ✅ AI recommendation on which vendor to choose
   - ✅ Key considerations

---

## 🎥 Demo Video Checklist

When recording your demo video, show:

### Part 1: Introduction (1 minute)
- Explain what RFP is
- Show the application homepage
- Navigate through the menu items

### Part 2: RFP Creation (2 minutes)
- Go to Create RFP page
- Show natural language input
- Click Generate
- Show AI-generated structured data
- Explain how AI extracted items, budget, deadline, etc.

### Part 3: Vendor Management (1 minute)
- Show vendor list page
- Add a new vendor (or show existing ones)
- Explain vendor database

### Part 4: Sending RFP (1 minute)
- Show RFP list
- Open RFP details
- Select vendors
- Send RFP (simulated)

### Part 5: Vendor Responses (2 minutes)
- Go to Simulate Response page
- Show how to submit responses
- Submit at least 2 responses
- Explain that AI parses messy text automatically

### Part 6: AI Comparison (2 minutes)
- Navigate to comparison view
- Show AI analysis loading
- Walk through all comparison sections:
  - Summary
  - Recommendations
  - Side-by-side table
  - Rankings with scores
  - Pros/cons
- Highlight the AI recommendation

### Part 7: Code Walkthrough (1-2 minutes)
Show in VS Code:
- Project structure (backend/frontend)
- `backend/services/ollama.js` - AI integration
- One API route file
- One React component
- Explain key decisions

---

## 🐛 Troubleshooting

### Issue: "Failed to generate AI response"
**Solution:** Make sure Ollama is running
```bash
ollama serve
```

### Issue: "Model not found"
**Solution:** Pull the model
```bash
ollama pull llama3.1
```

### Issue: "Cannot connect to backend"
**Solution:** Check if backend is running on port 5000
```bash
cd backend
npm start
```

### Issue: Frontend not loading
**Solution:** 
```bash
cd frontend
npm start
```

### Issue: CORS errors
**Solution:** Backend automatically allows CORS from localhost:3000. If you changed ports, update `backend/.env`

---

## 📊 Expected AI Processing Times

- **RFP Creation:** 5-15 seconds
- **Vendor Response Parsing:** 5-10 seconds each
- **Proposal Comparison:** 15-30 seconds (depends on number of proposals)

These times are normal for local AI (Ollama). The AI is doing real natural language processing!

---

## ✅ Verification Steps

After setup, verify everything works:

1. **Backend Health Check:**
   - Open http://localhost:5000/api/health
   - Should see: `"status": "ok"` and `"ollama.running": true`

2. **Frontend Loading:**
   - Open http://localhost:3000
   - Should see the navigation and RFP list page

3. **Create Test RFP:**
   - Create a simple RFP
   - If it generates structured data, everything is working!

---

## 💾 Data Storage

All data is stored in `backend/database.sqlite` file. To reset:

```bash
rm backend/database.sqlite
# Restart backend to create fresh database
```

---

## 🎓 Key Features to Highlight in Demo

1. **Natural Language Processing** - Type requirements naturally, AI structures it
2. **Intelligent Parsing** - Paste messy vendor responses, AI extracts key data
3. **Smart Comparison** - AI analyzes all proposals and recommends best option
4. **No Manual Data Entry** - Everything is automated with AI
5. **Local & Free** - Runs entirely on your machine, no API costs

---

## 📝 Recording Tips

1. **Prepare test data before recording** - Add vendors and RFP beforehand
2. **Close unnecessary tabs** - Clean browser for recording
3. **Use good microphone** - Explain what you're doing
4. **Show loading states** - Demonstrates AI is actually processing
5. **Highlight AI output** - Point out how AI extracted structured data
6. **Code walkthrough last** - Show 2-3 important files

---

## 🎬 Ready to Record!

You now have everything needed to:
- ✅ Run the application locally
- ✅ Test all features end-to-end
- ✅ Record a professional demo video
- ✅ Submit the assignment

Good luck! 🚀
