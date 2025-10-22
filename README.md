# 🥗 NutriScan 2.0 - AI-Powered Food Safety Analyzer

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-brightgreen)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18+-blue)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-v6+-green)](https://www.mongodb.com/)
[![AI](https://img.shields.io/badge/AI-Google%20Gemini-orange)](https://ai.google.dev/)

> **A comprehensive food safety platform that empowers users to make informed dietary choices through AI-powered ingredient analysis, community reporting, and personalized health tracking.**

---

## 🌟 Overview

NutriScan 2.0 revolutionizes food safety by combining cutting-edge AI technology with community-driven insights. Whether you're managing allergies, following a specific diet, or simply want to eat healthier, NutriScan provides instant, personalized analysis of food products.

### ✨ Why NutriScan?

- **🎯 Instant Analysis** - Scan any food label and get results in seconds
- **🤖 AI-Powered** - Google Gemini provides intelligent, context-aware recommendations
- **👥 Community-Driven** - Benefit from thousands of user reports and reviews
- **💾 Works Offline** - Continue scanning even without internet connectivity
- **🔒 Privacy-First** - Your health data stays secure and encrypted

---

## 📋 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage Guide](#-usage-guide)
- [API Documentation](#-api-documentation)
- [Offline Mode](#-offline-mode-explained)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Features

### 🔍 Core Functionality

#### 1. **OCR Food Label Scanning**
- Upload images from gallery or capture with camera
- Tesseract.js OCR extracts ingredient text automatically
- Supports JPEG, PNG, GIF formats (up to 5MB)
- Real-time progress tracking during analysis

#### 2. **AI-Powered Ingredient Analysis**
- **156+ ingredient database** with safety classifications
- Three-tier risk assessment: Safe, Moderate, Harmful
- Instant health score calculation (0-100)
- Detailed ingredient breakdown with visual charts

#### 3. **Personalized Health Profiles**
- Set allergies, dietary preferences (vegan, keto, paleo, etc.)
- Define health goals (weight loss, heart health, muscle gain)
- Track BMI, activity level, and nutritional targets
- AI adapts recommendations based on your profile

#### 4. **Smart Ingredient Substitution**
- AI suggests 3 healthier alternatives for harmful ingredients
- Personalized based on your diet type and allergies
- Health scores (1-10) for each substitute
- Diet compatibility indicators

#### 5. **Mood-Based Food Recommendations**
- 7 mood categories: Happy, Sad, Stressed, Energetic, Tired, Anxious, Calm
- Science-backed food suggestions for emotional well-being
- Complete nutritional breakdown (carbs, protein, fat, calories)
- Explanations of why each food helps

#### 6. **AI Health Risk Rating**
- Comprehensive risk analysis for scanned products
- Allergen warnings based on your profile
- Long-term health impact assessment
- Personalized recommendations for safer alternatives

#### 7. **AI Chat Expert**
- Ask any question about ingredients
- Get detailed, scientific answers instantly
- Conversational interface powered by Google Gemini
- Quick question suggestions for common queries

### 🛡️ Community Safety Features

#### 8. **Community Product Alerts**
- Real-time alerts for products flagged by users
- Filter by severity: Low, Medium, High, Critical
- Upvote system highlights most concerning products
- Category-based filtering (allergen, harmful ingredient, expired, etc.)

#### 9. **Report Unsafe Products**
- Enhanced reporting interface with detailed forms
- Severity levels: Low, Medium, High, Critical
- Category selection for better organization
- Community guidelines to ensure quality reports

#### 10. **My Reports Dashboard**
- Track all your submitted reports
- View status: Pending, Reviewing, Resolved, Dismissed
- Upvote tracking to see community support
- Edit or delete your reports

### 📊 Tracking & Analytics

#### 11. **Daily Nutrition Tracker**
- Log meals by type: Breakfast, Lunch, Dinner, Snack
- Track macros: Carbs, Protein, Fat, Calories, Fiber, Sugar
- Visual progress bars show goal achievement
- Auto-calculated daily targets based on your profile

#### 12. **Nutrition Charts & Insights**
- Interactive pie charts for macro distribution
- Calorie estimation formulas
- 7-day nutrition history
- Health score trending

#### 13. **Real-Time Statistics**
- Live-updated scan count
- Safe vs harmful ingredient ratios
- Personal health score (0-100)
- Recent activity timeline with scan details

---

## 💾 Offline Mode Explained

### Why Offline Cache is Important

The **Offline Cache** feature is a critical component that ensures NutriScan works reliably in all network conditions:

#### **Use Cases:**
1. **🏪 Grocery Shopping in Poor Signal Areas**
   - Many supermarkets have weak cellular signals
   - Underground stores or rural areas may lack connectivity
   - Scan products without waiting for network

2. **✈️ Travel Scenarios**
   - Airplane mode while traveling
   - International trips without roaming
   - Remote locations with no internet

3. **📱 Data Saving**
   - Avoid using mobile data for scans
   - Batch sync when connected to WiFi
   - Reduce bandwidth costs

4. **⚡ Performance & Reliability**
   - Instant scanning without network latency
   - No failed requests due to timeouts
   - Guaranteed data preservation

#### **How It Works:**

1. **IndexedDB Storage**
   - Browser-based database stores scan data locally
   - Persists even when browser is closed
   - Supports up to 50MB+ of data per domain

2. **Automatic Caching**
   - Every scan is automatically cached when offline
   - Images stored as Blobs with metadata
   - Extracted text and results preserved

3. **Smart Sync**
   - One-click sync when back online
   - Background sync for seamless experience
   - Conflict resolution for duplicate scans

4. **Visual Indicators**
   - 🟢 Online badge when connected
   - 🔴 Offline badge when disconnected
   - Badge count shows pending sync items

#### **Technical Implementation:**
```javascript
// Uses IndexedDB for persistent storage
const offlineStorage = {
  saveScan(scanData),     // Save scan locally
  getAllScans(),          // Retrieve all cached scans
  getUnsyncedScans(),     // Get scans pending sync
  markAsSynced(id),       // Mark as uploaded
  deleteScan(id),         // Remove from cache
  clearAll()              // Clear entire cache
};
```

---

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI framework with hooks
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Data visualization
- **Tesseract.js** - OCR text extraction
- **Lucide React** - Beautiful icon library
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **Multer** - File upload handling
- **bcrypt.js** - Password hashing

### AI & Services
- **Google Gemini 2.0 Flash** - Advanced AI model
- **OpenAI GPT-3.5 Turbo** - Fallback AI (optional)
- **Node-Cache** - In-memory caching
- **IndexedDB** - Client-side storage

---

## 📥 Installation

### Prerequisites

- **Node.js** v18 or higher
- **MongoDB** v6 or higher (local or Atlas)
- **Google Gemini API Key** ([Get it here](https://ai.google.dev/))
- **Git** for cloning

### Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/nutriscan-2.0.git
cd nutriscan-2.0
```

### Step 2: Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in `backend/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/nutriscan
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/nutriscan

# Authentication
JWT_SECRET=your_super_secret_jwt_key_min_32_characters
JWT_EXPIRE=24h

# AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: OpenAI (fallback)
OPENAI_API_KEY=sk-your_openai_key_here

# CORS
CORS_ORIGIN=http://localhost:3000
```

Start backend server:

```bash
npm run dev
```

Backend runs on: `http://localhost:5000`

### Step 3: Frontend Setup

Open new terminal:

```bash
cd frontend
npm install
```

Create `.env` file in `frontend/` directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

Start frontend:

```bash
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

## ⚙️ Configuration

### Get Google Gemini API Key

1. Visit [Google AI Studio](https://ai.google.dev/)
2. Sign in with Google account
3. Click **"Get API Key"**
4. Create new project or use existing
5. Copy API key
6. Paste in both `.env` files

### MongoDB Setup Options

#### Option A: Local MongoDB

```bash
# Install MongoDB Community Edition
# macOS
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Connection string
MONGO_URI=mongodb://localhost:27017/nutriscan
```

#### Option B: MongoDB Atlas (Cloud)

1. Create free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create new cluster (free tier available)
3. Add database user
4. Whitelist IP address (0.0.0.0/0 for development)
5. Get connection string
6. Replace `<password>` and `<dbname>` in URI

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/nutriscan?retryWrites=true&w=majority
```

---

## 📖 Usage Guide

### 1. **Register & Login**

- Navigate to `http://localhost:5173`
- Click **"Sign Up"**
- Enter name, email, password
- Verify email is unique
- Login with credentials

### 2. **Set Up Health Profile**

- Go to **"Health Profile"** tab
- Add allergies (e.g., peanuts, gluten)
- Select diet type (vegan, keto, etc.)
- Set health goals (weight loss, muscle gain)
- Enter age, weight, height, activity level
- Click **"Save Profile"**

### 3. **Scan Your First Product**

- Click **"Scan Food"** tab
- Choose **"Upload from Gallery"** or **"Take Photo"**
- Select clear image of ingredient list
- Enter product name
- Click **"Scan & Analyze"**
- Wait 10-15 seconds for results

### 4. **View Results**

- See overall health score (0-100)
- Check ingredient breakdown: Safe, Moderate, Harmful
- View detailed ingredient list with risk levels
- Get personalized recommendations

### 5. **Use AI Features**

#### Smart Substitution:
- Enter harmful ingredient (e.g., "palm oil")
- AI suggests 3 healthier alternatives
- See health scores and diet compatibility

#### Mood Foods:
- Select current mood
- Get 3 scientifically-backed food recommendations
- View nutritional breakdown for each

#### AI Chat:
- Ask "What is MSG?"
- Ask "Alternatives to sugar?"
- Get detailed, referenced answers

### 6. **Report Products**

- Click **"Report Product"** tab
- Enter product name
- Select category and severity
- Write detailed reason (factual)
- Submit report

### 7. **Track Nutrition**

- Go to **"Nutrition Tracker"**
- Click **"Add Meal"**
- Select meal type (breakfast, lunch, etc.)
- Enter food name and macros
- View daily progress bars
- Check 7-day history

### 8. **Use Offline Mode**

- Enable airplane mode on device
- Scan products as normal
- Data saves to offline cache
- Badge shows pending sync count
- Reconnect to internet
- Click **"Sync All"** in Offline Cache tab

---

## 🔌 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secure123"
}

Response: 201 Created
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "token": "jwt_token"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "secure123"
}

Response: 200 OK
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "token": "jwt_token"
}
```

### Scan Endpoints

#### Analyze Ingredients
```http
POST /api/scan/analyze
Authorization: Bearer {token}
Content-Type: multipart/form-data

FormData:
- image: File
- extractedText: String
- productName: String

Response: 201 Created
{
  "_id": "scan_id",
  "productName": "Coca Cola",
  "results": {
    "total": 10,
    "safe": 7,
    "moderate": 2,
    "harmful": 1,
    "details": [...]
  }
}
```

#### Get Scan History
```http
GET /api/scan/history
Authorization: Bearer {token}

Response: 200 OK
[
  {
    "_id": "scan_id",
    "productName": "Product Name",
    "results": {...},
    "createdAt": "2025-01-15T10:30:00Z"
  }
]
```

### AI Endpoints

#### Get Substitutions
```http
POST /api/ai/substitution
Authorization: Bearer {token}
Content-Type: application/json

{
  "ingredient": "palm oil"
}

Response: 200 OK
{
  "ingredient": "palm oil",
  "substitutes": [
    {
      "name": "Olive Oil",
      "healthScore": 10,
      "reason": "Heart-healthy, rich in omega-3",
      "dietCompatible": ["vegan", "keto", "paleo"]
    }
  ],
  "aiProvider": "Gemini"
}
```

#### Mood Recommendations
```http
POST /api/ai/mood
Authorization: Bearer {token}
Content-Type: application/json

{
  "mood": "stressed"
}

Response: 200 OK
{
  "mood": "stressed",
  "recommendations": [
    {
      "foodName": "Green Tea",
      "nutrients": {
        "carbs": 0,
        "protein": 0,
        "fat": 0,
        "calories": 2
      },
      "reason": "L-theanine promotes relaxation",
      "emoji": "🍵"
    }
  ]
}
```

### Report Endpoints

#### Submit Report
```http
POST /api/report
Authorization: Bearer {token}
Content-Type: application/json

{
  "productName": "Unsafe Product",
  "reason": "Contains undeclared allergens",
  "category": "allergen",
  "severity": "high"
}

Response: 201 Created
{
  "_id": "report_id",
  "productName": "Unsafe Product",
  "status": "pending",
  "upvotes": 0
}
```

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### 1. Fork the Repository

```bash
git fork https://github.com/yourusername/nutriscan-2.0.git
```

### 2. Create Feature Branch

```bash
git checkout -b feature/amazing-feature
```

### 3. Make Changes

- Follow existing code style
- Add comments for complex logic
- Update README if needed

### 4. Test Thoroughly

```bash
npm test
```

### 5. Commit Changes

```bash
git commit -m "Add amazing feature"
```

### 6. Push to Branch

```bash
git push origin feature/amazing-feature
```

### 7. Create Pull Request

- Describe changes in detail
- Reference related issues
- Add screenshots if UI changes

---

## 📜 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Google Gemini AI** for powerful language model
- **Tesseract.js** for OCR capabilities
- **MongoDB** for flexible database
- **React & Tailwind** for modern UI framework
- **Community contributors** for valuable feedback

---

## 📧 Support

- **Email**: support@nutriscan.com
- **Issues**: [GitHub Issues](https://github.com/Ctrl-apk/nutriscan-2.0/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Ctrl-apk/nutriscan-2.0/discussions)

---

## 🗺️ Roadmap

### Version 2.1 (Q2 2025)
- [ ] Barcode scanning support
- [ ] Multi-language OCR
- [ ] iOS/Android mobile apps
- [ ] Export nutrition reports to PDF
- [ ] Integration with fitness trackers

### Version 2.2 (Q3 2025)
- [ ] Recipe suggestions based on safe ingredients
- [ ] Social sharing features
- [ ] Advanced AI meal planning
- [ ] Voice-activated scanning

---

## ⭐ Star History

If you find NutriScan useful, please star the repository!

[![Star History Chart](https://api.star-history.com/svg?repos=Ctrl-apk/nutriscan-2.0&type=Date)](https://star-history.com/#Ctrl-apk/nutriscan-2.0&Date)

---

Made with ❤️ by the NutriScan Team