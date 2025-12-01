# AI-Powered RFP Management System

A single-user web application that streamlines the Request for Proposal (RFP) procurement process using AI to automate RFP creation, vendor response parsing, and proposal comparison.

## 🎯 What is an RFP?

**Request for Proposal (RFP)** is a business document where a company asks multiple vendors to submit bids/proposals for a project or purchase.

**Example flow:**
1. Company needs to buy 20 laptops
2. Creates RFP describing specs, budget, deadline
3. Sends RFP to multiple vendors (Dell, HP, Lenovo)
4. Vendors respond with proposals (pricing, terms, delivery)
5. Company compares and picks the best vendor

This app automates the entire process with AI!

## 🏗️ Tech Stack

### Frontend
- React.js
- Axios (HTTP client)
- React Router (navigation)

### Backend
- Node.js with Express
- SQLite (local database)
- Ollama (local AI - Llama 3.1 model)

### AI & Email
- **AI**: Ollama running locally (free, no API keys)
- **Email**: Simulated system (web form for vendor responses)

## 📋 Prerequisites

Before running this project, ensure you have:

1. **Node.js** (v16 or higher)
   ```bash
   node --version
   ```

2. **Ollama** (for local AI)
   ```bash
   # Install Ollama on Mac
   brew install ollama
   
   # Pull the Llama 3.1 model
   ollama pull llama3.1
   ```

3. **Git** (for version control)

## 🚀 Installation & Setup

### Step 1: Clone the Repository
```bash
git clone <your-repo-url>
cd rfp-management-system
```

### Step 2: Backend Setup
```bash
cd backend
npm install
```

### Step 3: Frontend Setup
```bash
cd ../frontend
npm install
```

### Step 4: Environment Configuration
```bash
# Copy the example environment file
cp .env.example .env

# No changes needed - Ollama runs on default localhost:11434
```

## 🎬 Running the Application

You need to run **3 processes** in separate terminal windows:

### Terminal 1: Start Ollama
```bash
ollama serve
```
Keep this running - it provides the AI service.

### Terminal 2: Start Backend Server
```bash
cd backend
npm start
```
Backend will run on `http://localhost:5000`

### Terminal 3: Start Frontend
```bash
cd frontend
npm start
```
Frontend will run on `http://localhost:3000` and open automatically in your browser.

## 📚 API Documentation

### RFP Endpoints

#### Create RFP from Natural Language
```http
POST /api/rfps
Content-Type: application/json

{
  "description": "I need 20 laptops with 16GB RAM, budget $50,000, delivery within 30 days"
}

Response:
{
  "id": 1,
  "title": "Laptop Procurement",
  "structured_data": {
    "items": ["20 laptops with 16GB RAM"],
    "budget": "$50,000",
    "deadline": "30 days"
  },
  "status": "draft"
}
```

#### List All RFPs
```http
GET /api/rfps

Response:
[
  {
    "id": 1,
    "title": "Laptop Procurement",
    "status": "sent",
    "created_at": "2024-12-01T15:30:00Z"
  }
]
```

#### Get Single RFP
```http
GET /api/rfps/:id

Response:
{
  "id": 1,
  "title": "Laptop Procurement",
  "description": "...",
  "structured_data": {...},
  "status": "sent",
  "vendors": [...]
}
```

### Vendor Endpoints

#### Add Vendor
```http
POST /api/vendors
Content-Type: application/json

{
  "name": "Dell Technologies",
  "email": "sales@dell.com",
  "company": "Dell Inc."
}
```

#### List All Vendors
```http
GET /api/vendors

Response:
[
  {
    "id": 1,
    "name": "Dell Technologies",
    "email": "sales@dell.com",
    "company": "Dell Inc."
  }
]
```

### Proposal Endpoints

#### Submit Vendor Response (Simulated Email)
```http
POST /api/proposals/submit
Content-Type: application/json

{
  "rfp_id": 1,
  "vendor_id": 1,
  "response_text": "We can provide 20 laptops at $2000 each, delivery in 25 days, 2-year warranty included"
}

Response:
{
  "id": 1,
  "parsed_data": {
    "price": "$2000 each",
    "total": "$40,000",
    "delivery_time": "25 days",
    "warranty": "2 years"
  }
}
```

#### Get Proposals for RFP
```http
GET /api/rfps/:id/proposals

Response:
[
  {
    "id": 1,
    "vendor_name": "Dell Technologies",
    "parsed_data": {...},
    "received_at": "2024-12-01T16:00:00Z"
  }
]
```

#### Compare Proposals (AI-Powered)
```http
GET /api/rfps/:id/comparison

Response:
{
  "summary": "Dell offers best value with competitive pricing and faster delivery...",
  "recommendations": {...},
  "comparison_table": [...]
}
```

## 🎯 Key Features

### 1. AI-Powered RFP Creation
- User describes needs in natural language
- AI (Ollama/Llama 3.1) converts to structured RFP
- Extracts: items, quantities, budget, deadlines, terms

### 2. Vendor Management
- Add and manage vendor database
- Select multiple vendors for each RFP
- Track vendor responses

### 3. Simulated Email System
- "Send RFP" marks as sent to vendors
- Web form to simulate vendor responses
- Demonstrates email workflow without real SMTP complexity

### 4. AI-Powered Response Parsing
- Paste messy vendor responses (text, prices, terms)
- AI extracts structured data automatically
- No manual data entry needed

### 5. Intelligent Comparison
- Side-by-side proposal comparison
- AI-generated summaries and recommendations
- Scores and highlights best option

## 🧪 Testing the Application

### Test Scenario 1: Complete RFP Flow

1. **Create RFP**
   - Go to "Create RFP" page
   - Enter: "Need 10 monitors 27-inch, budget $5000, delivery in 14 days, 1-year warranty"
   - Click "Generate RFP"
   - Review structured output

2. **Add Vendors**
   - Go to "Vendors" page
   - Add 3 vendors: Dell, HP, Samsung
   - Save each vendor

3. **Send RFP**
   - Return to RFP detail page
   - Select all 3 vendors
   - Click "Send RFP" (simulated)

4. **Simulate Vendor Responses**
   - Go to "Simulate Response" page
   - Submit 3 responses with different pricing:
     - Dell: "$450 per monitor, delivery 10 days, 1-year warranty"
     - HP: "$500 per monitor, delivery 7 days, 2-year warranty"  
     - Samsung: "$400 per monitor, delivery 20 days, 1-year warranty"

5. **Compare Proposals**
   - Go to RFP comparison page
   - View side-by-side comparison
   - Read AI recommendation

## 💡 Design Decisions & Assumptions

### Why Ollama (Local AI)?
- **Free forever** - no API costs
- **Privacy** - data stays local
- **No rate limits** - unlimited requests
- **Offline capable** - works without internet
- Good quality with Llama 3.1 model

### Why Simulated Email?
- **Simplifies setup** - no SMTP/IMAP configuration
- **Demonstrates AI capability** - focuses on intelligent parsing
- **Reliable for demo** - no email delivery issues
- **Clear workflow** - easier to understand and test
- In production, would integrate real email service (SendGrid, AWS SES)

### Database Choice
- **SQLite** - perfect for single-user local app
- **No setup required** - works out of the box
- **Portable** - single file database
- Easy to inspect and debug

### Assumptions
1. Single user (no authentication needed)
2. Vendor responses are in text format (no PDF parsing)
3. Budget is in USD
4. Delivery times in days
5. Focus on core RFP workflow (not full procurement suite)

## 🛠️ AI Tools Used During Development

### Tools
- **GitHub Copilot** - Code suggestions and boilerplate
- **ChatGPT/Claude** - Architecture planning and debugging
- **Cline** - AI pair programming assistant

### What They Helped With
- Express route structure and error handling
- React component boilerplate
- SQL query optimization
- Ollama API integration patterns
- Prompt engineering for RFP parsing
- Database schema design

### Key Learning
- AI tools excel at boilerplate but need human oversight for business logic
- Prompt engineering is critical for quality AI responses
- Local AI (Ollama) is surprisingly capable for structured data extraction

## 🚧 Known Limitations

1. **Email is simulated** - not real SMTP/IMAP
2. **Single user only** - no authentication/multi-tenancy
3. **No file upload** - vendor responses must be text
4. **Basic scoring** - simple comparison algorithm
5. **No edit history** - can't track RFP changes over time

## 🔮 Future Enhancements

If I had more time, I would add:
- Real email integration (SendGrid/AWS SES)
- PDF parsing for vendor proposals
- Advanced scoring with weighted criteria
- Email templates for RFPs
- Approval workflows
- Analytics dashboard
- Export to Excel/PDF
- Multi-user support with authentication

## 📹 Demo Video

[Link to demo video will be added here]

5-10 minute walkthrough showing:
1. RFP creation from natural language
2. Vendor management
3. Sending RFP (simulated)
4. Receiving and parsing vendor responses
5. AI-powered comparison and recommendation
6. Quick code structure overview

## 📄 License

This project was created as an SDE assignment.

## 👤 Author

[Your Name]
[Your Email]
[Your GitHub]

---

Built with ❤️ using React, Node.js, and Ollama
