# 🧪 Testing Guide

## Comprehensive Testing Scenarios for AI-Powered RFP Management System

This document provides detailed test cases to verify all functionality works correctly.

---

## Test Scenario 1: Basic RFP Creation

### Objective
Verify that AI can convert natural language into structured RFP data.

### Steps
1. Navigate to "Create RFP" page
2. Enter the following text:
   ```
   We need 50 office chairs with ergonomic support. 
   Budget is $15,000. Need delivery within 2 weeks. 
   Must have 5-year warranty.
   ```
3. Click "Generate RFP"

### Expected Results
- ✅ AI processes the request (5-15 seconds)
- ✅ Structured data shows:
  - Title: Something like "Office Chair Procurement"
  - Items: ["50 office chairs with ergonomic support"]
  - Budget: "$15,000"
  - Deadline: "2 weeks" or "14 days"
  - Requirements: Include warranty mention
- ✅ RFP appears in RFP list with status "draft"

### Pass Criteria
AI successfully extracts at least: title, items, budget, and deadline.

---

## Test Scenario 2: Vendor Management

### Objective
Verify vendor CRUD operations work correctly.

### Steps
1. Navigate to "Vendors" page
2. Click "Add Vendor"
3. Fill in:
   - Name: "Test Vendor Inc."
   - Email: "test@vendor.com"
   - Company: "Test Corp"
4. Submit

### Expected Results
- ✅ Vendor saved successfully
- ✅ Vendor appears in vendor list
- ✅ All fields displayed correctly

### Edge Case Testing
- Try adding vendor without email (should fail)
- Try adding vendor with invalid email format (should fail)
- Add vendor with only required fields (name + email) - should work

---

## Test Scenario 3: Send RFP to Multiple Vendors

### Objective
Verify RFP can be sent to selected vendors.

### Prerequisites
- At least 1 RFP created
- At least 3 vendors added

### Steps
1. Go to RFP List
2. Click "View Details" on a draft RFP
3. Select 2 vendors (not all)
4. Click "Send RFP"

### Expected Results
- ✅ Success message appears
- ✅ RFP status changes from "draft" to "sent"
- ✅ Selected vendors are recorded
- ✅ Modal closes

---

## Test Scenario 4: AI Vendor Response Parsing

### Objective
Verify AI can extract structured data from messy vendor responses.

### Prerequisites
- At least 1 RFP with status "sent"
- At least 1 vendor exists

### Test Case A: Well-Formatted Response
**Input:**
```
We can provide 50 ergonomic office chairs at $280 per unit.
Total: $14,000
Delivery: 10 days
Warranty: 7 years
Payment: Net 30
```

**Expected Output:**
- ✅ Pricing extracted: "$280 per unit" or "$14,000"
- ✅ Delivery time: "10 days"
- ✅ Warranty: "7 years"
- ✅ Payment terms: "Net 30"

### Test Case B: Messy Response
**Input:**
```
Hi! Thanks for the RFP. Our quote: chairs are 290 dollars each, 
so for 50 that's like $14500 total. We ship pretty fast, 
probably 12 days max. warranty is standard 5yr. 
Net 30 payment is fine!
```

**Expected Output:**
- ✅ Pricing extracted (even if messy format)
- ✅ Delivery time found: "12 days"
- ✅ Warranty: "5 years" or similar
- ✅ Some payment terms mentioned

### Pass Criteria
AI extracts at least 3 out of 4 key fields (pricing, delivery, warranty, payment).

---

## Test Scenario 5: AI-Powered Comparison

### Objective
Verify AI can compare multiple proposals and provide recommendations.

### Prerequisites
- 1 RFP with at least 2 proposals submitted

### Steps
1. Go to RFP List
2. Click "Compare Proposals" on RFP
3. Wait for AI analysis

### Expected Results
- ✅ AI Summary generated (paragraph explaining proposals)
- ✅ Comparison highlights show:
  - Best price vendor
  - Fastest delivery vendor
  - Best warranty vendor
  - Best overall value vendor
- ✅ Side-by-side table displays all proposals
- ✅ Vendor rankings with scores (0-100)
- ✅ Pros and cons for each vendor
- ✅ Clear recommendation statement
- ✅ Key considerations listed

### Pass Criteria
- All sections render without errors
- AI provides a clear recommendation
- Rankings are logical (lower price = higher score, etc.)

---

## Test Scenario 6: End-to-End Workflow

### Objective
Complete full RFP lifecycle from creation to comparison.

### Steps
1. **Create RFP:** "Need 10 monitors, budget $5000, delivery 14 days"
2. **Add 3 vendors:** Dell, HP, Samsung
3. **Send RFP** to all 3 vendors
4. **Submit 3 responses** with different pricing:
   - Dell: "$450 per monitor, 10 days, 1-year warranty"
   - HP: "$500 per monitor, 7 days, 2-year warranty"
   - Samsung: "$400 per monitor, 20 days, 1-year warranty"
5. **View Comparison**

### Expected Results
- ✅ Complete workflow executes without errors
- ✅ Each step transitions smoothly
- ✅ AI processes all responses correctly
- ✅ Comparison shows Samsung has best price
- ✅ Comparison shows HP has fastest delivery
- ✅ AI provides balanced recommendation considering all factors

---

## Test Scenario 7: Error Handling

### Test A: Ollama Not Running
1. Stop Ollama service
2. Try to create RFP
3. Should show error: "Failed to generate AI response"

### Test B: Invalid RFP ID
1. Manually navigate to `/comparison/999`
2. Should show error message

### Test C: Empty Form Submission
1. Try submitting forms with empty required fields
2. Should show validation errors

### Test D: Comparison Without Proposals
1. Create and send RFP
2. Try to compare without submitting any proposals
3. Should show: "No proposals found for this RFP"

---

## Performance Tests

### AI Response Times
Monitor and document:
- **RFP Creation:** Should be < 30 seconds
- **Response Parsing:** Should be < 20 seconds
- **Comparison:** Should be < 60 seconds for 3 proposals

### UI Responsiveness
- ✅ Loading states show during AI processing
- ✅ Buttons disable while processing
- ✅ Success/error messages display appropriately

---

## Cross-Browser Testing

Test on:
- ✅ Chrome (primary)
- ✅ Safari (macOS default)
- ✅ Firefox (optional)

Verify:
- All pages render correctly
- Forms work properly
- CSS styling displays correctly

---

## Data Persistence Tests

### Test Database Persistence
1. Create RFP and vendors
2. Stop backend server
3. Restart backend server
4. Verify data still exists

### Test Database Reset
1. Delete `backend/database.sqlite`
2. Restart backend
3. Verify fresh database created
4. Verify all tables created correctly

---

## Accessibility Tests

### Keyboard Navigation
- ✅ Can navigate with Tab key
- ✅ Can submit forms with Enter key
- ✅ Can close modals with Escape (if implemented)

### Screen Reader Compatibility
- ✅ Forms have proper labels
- ✅ Buttons have descriptive text
- ✅ Error messages are clear

---

## Known Limitations

Document these in your README:

1. **AI Response Time:** Local AI is slower than cloud APIs (acceptable tradeoff for free)
2. **AI Accuracy:** May occasionally miss fields in very messy responses
3. **Single User:** No authentication or multi-user support
4. **Simulated Email:** Not real SMTP/IMAP integration
5. **No File Upload:** Vendor responses must be text (no PDF parsing)

---

## Success Metrics

Your implementation is successful if:

✅ **Functionality:** All 5 core features work
- RFP creation from natural language
- Vendor management
- Send RFP (simulated)
- Receive and parse responses with AI
- Compare proposals with AI recommendation

✅ **AI Integration:** AI is used meaningfully in 3+ places
- Creating RFPs
- Parsing responses
- Comparing proposals

✅ **User Experience:** Workflow is intuitive
- Clear navigation
- Helpful error messages
- Loading indicators
- Success confirmations

✅ **Code Quality:**
- Clean separation of concerns
- Proper error handling
- Consistent code style
- Well-commented where needed

✅ **Documentation:**
- Complete README
- Clear setup instructions
- API documentation
- Design decisions explained

---

## Demo Video Quality Checklist

Before submitting, ensure your video shows:

- [ ] Clear audio (no background noise)
- [ ] Screen is easily readable
- [ ] You explain what you're doing at each step
- [ ] You highlight AI processing moments
- [ ] You show the AI-generated outputs clearly
- [ ] Code walkthrough is concise but informative
- [ ] Video is 5-10 minutes (not longer!)
- [ ] Video is accessible (public link on Loom/YouTube/Drive)

---

## Final Submission Checklist

Before submitting to evaluators:

- [ ] All code pushed to GitHub
- [ ] README is complete and accurate
- [ ] .env.example exists with all variables
- [ ] Demo video recorded and uploaded
- [ ] Demo video link added to README
- [ ] Known limitations documented
- [ ] Setup instructions tested on fresh machine (if possible)
- [ ] No secrets or API keys in repository
- [ ] Repository is public
- [ ] Code is well-organized and commented

---

## Tips for Demo Video

### Do's ✅
- Explain what RFP means at the beginning
- Show the natural language input clearly
- Highlight when AI is processing
- Point out structured data AI extracted
- Show the comparison analysis in detail
- Explain your tech stack choices
- Mention why you chose Ollama (free, local)

### Don'ts ❌
- Don't rush through features
- Don't skip explaining AI's role
- Don't forget to show code structure
- Don't make video longer than 10 minutes
- Don't assume evaluator knows your codebase

---

## Questions Evaluators Might Ask

Be prepared to answer:

1. **Why Ollama instead of OpenAI?**
   - Free, no API costs
   - Works offline
   - Good quality for this use case
   - No rate limits

2. **Why simulated email?**
   - Focuses on AI capabilities
   - Easier setup for demo
   - Avoids email service complexity
   - Still demonstrates the concept

3. **How does AI parsing work?**
   - Send vendor response to Ollama
   - Use structured prompt engineering
   - Extract JSON from response
   - Store in database

4. **What would you improve?**
   - Real email integration (SMTP/IMAP)
   - PDF parsing for attachments
   - Better scoring algorithm
   - User authentication
   - Multi-tenancy support

---

Good luck with testing and demo recording! 🎉
