# 🥗 NutriScan 2.0

### *Because reading ingredient labels shouldn't require a PhD in chemistry* 🔬

**Stop playing Russian roulette with your snacks.** Scan food labels, let AI do the heavy lifting, and finally know if that "natural flavoring" is friend or foe.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-brightgreen)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18+-blue)](https://reactjs.org/)
[![Saves Lives](https://img.shields.io/badge/Saves-Lives-red)]()
[![Gluten Aware](https://img.shields.io/badge/Gluten-Aware-yellow)]()

---

## 📹 See It In Action

*Watch our AI roast your favorite junk food in real-time:*

https://github.com/user-attachments/assets/4c8257d2-1ddc-4ab2-b430-e772090c7c85

> "Finally, an app that judges my food choices harder than my mom does." - *Every User Ever*

---

## 🤔 What's This About?

Ever stood in a grocery store trying to pronounce "Butylated Hydroxyanisole" while your ice cream melts? Yeah, we've all been there.

**NutriScan is your AI bodyguard against sketchy ingredients.** Point your camera, get instant verdicts, and make choices that won't haunt you at 3 AM.

### The Problem
- 🤷 You can't pronounce half the ingredients
- 😰 "Natural flavors" could mean literally anything
- ⏰ Reading labels takes forever
- 🧠 You're not a food scientist (probably)

### The Solution
- 📸 Snap a photo
- ⏱️ Wait 10 seconds
- ✅ Get a health score and AI roast
- 🏃 Make better choices (or ignore them, we're not your mom)

---

## ⚡ Quick Start *(Or: How to Stop Poisoning Yourself)*

```bash
# 1. Grab the goods
git clone https://github.com/yourusername/nutriscan-2.0.git
cd nutriscan-2.0

# 2. Backend (the smart one)
cd backend
npm install
# Create .env - don't worry, we'll tell you what goes there
npm run dev

# 3. Frontend (the pretty one)
cd frontend
npm install
# Another .env - yes, two of them, we're fancy
npm run dev

# 4. Open http://localhost:5173 and prepare to be horrified by your snack choices
```

**Time to setup:** 5 minutes ⏰  
**Time saved per grocery trip:** 30 minutes 🛒  
**Existential crises about food:** Priceless 😱

---

## 🎯 Features *(AKA Why Your Friends Will Be Jealous)*

<div align="center">

| Feature | What It Does | Why You Need It |
|---------|--------------|-----------------|
| 📸 **OCR Scanning** | Reads labels for you | Because squinting is so 2010 |
| 🤖 **AI Analysis** | 156+ ingredients tracked | Knows more chemistry than your high school teacher |
| 💯 **Health Score** | 0-100 rating | Finally, a score that matters |
| 👤 **Personal Profile** | Tracks YOUR allergies | Unlike your friends who "always forget" |
| 🔄 **Smart Substitutes** | Healthier alternatives | "Just use olive oil" - AI, probably |
| 😊 **Mood Foods** | Food for feelings | Emotional eating, but make it science |
| 🚨 **Community Reports** | Crowdsourced warnings | The Yelp of food safety |
| 📊 **Nutrition Tracker** | Log your meals | Accountability without judgment (from us) |
| 💾 **Offline Mode** | Works without WiFi | For underground grocery stores |
| 💬 **AI Chat** | Ask anything | "Is ketchup a vegetable?" - Finally get answers |

</div>

---

## 🛠️ Tech Stack *(For the Nerds)*

**Frontend:** React 18 *(the cool kid)*, Tailwind CSS *(because who writes CSS anymore)*, Tesseract.js *(OCR magic)*  
**Backend:** Node.js + Express *(old reliable)*, MongoDB *(schemaless chaos)*, JWT *(token party)*  
**AI:** Google Gemini 2.0 *(the brain)*, OpenAI *(emergency backup brain)*

**Translation:** Fancy words that mean "it actually works" ✨

---

## ⚙️ Configuration *(Don't Skip This Part)*

### Step 1: Get Your AI Key 🔑

1. Visit [Google AI Studio](https://ai.google.dev/)
2. Click "Get API Key" 
3. Pretend you read the terms and conditions
4. Copy that beautiful key

### Step 2: Backend `.env` *(The Secret Sauce)*
```env
PORT=5000                                    # Where the magic happens
MONGO_URI=mongodb://localhost:27017/nutriscan # Your data's home
JWT_SECRET=make_this_super_duper_secret_okay  # Like, really secret
GEMINI_API_KEY=your_gemini_key_here          # The AI overlord's key
CORS_ORIGIN=http://localhost:3000            # Who's allowed in
```

### Step 3: Frontend `.env` *(The Other Secret Sauce)*
```env
VITE_API_URL=http://localhost:5000/api       # Talk to the backend
VITE_GEMINI_API_KEY=your_gemini_key_here     # Yes, again
```

### Step 4: MongoDB *(Database Time)*

**Easy Mode (Local):**  
```bash
brew install mongodb-community
brew services start mongodb-community
# Done. You're a DBA now.
```

**Cloud Mode (For Show-offs):**  
Get a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - it's like Dropbox but for data

---

## 📖 How to Use *(The Fun Part)*

### 1️⃣ **Create Account** 
Sign up at `localhost:5173` - Use a real email or don't, we're not the cops

### 2️⃣ **Set Up Your Profile**
- Add allergies (peanuts will NOT sneak past us)
- Pick your diet vibe (vegan, keto, "whatever's in the fridge")
- Set goals (six-pack? heart health? just don't die young?)

### 3️⃣ **Scan Something**
- Point camera at ingredient list
- Try not to cry when you see the score
- Get personalized roast from AI
- Contemplate life choices

### 4️⃣ **Use the AI Sidekick**
- **Need a substitute?** "What can I use instead of palm oil?"
- **Feeling moody?** Tell us, we'll suggest comfort food (the healthy kind)
- **Got questions?** "Is MSG actually bad?" - Ask away, judgment-free zone

### 5️⃣ **Track Your Nutrition**
Log meals like you're an Instagram influencer, but with actual data

### 6️⃣ **Go Offline** 
No signal? No problem. Scan away and sync when civilization returns

---

## 🔌 API Endpoints *(For the Backend Wizards)*

```http
POST /api/auth/register        # Join the club
POST /api/auth/login           # Welcome back
POST /api/scan/analyze         # The main event
GET  /api/scan/history         # Your hall of shame
POST /api/ai/substitution      # "Replace this garbage with..."
POST /api/ai/mood              # Emotional support food
POST /api/report               # Tattle on bad products
```

**Pro tip:** All requests need `Authorization: Bearer {token}` - We're not savages here

---

## 💾 Offline Mode *(For Apocalypse Preppers)*

**Works when:**
- 🏔️ You're in a mountain grocery store
- ✈️ Airplane mode activated
- 📵 Your phone plan ran out
- 🌍 You're somewhere WiFi fears to tread

**How it works:** Magic. (JK, it's IndexedDB. But feels like magic.)

---

## 🤝 Contributing *(Join the Squad)*

Got ideas? Found a bug? Think you can make it better?

```bash
git checkout -b feature/your-amazing-idea
# Code like the wind
git commit -m "feat: made it 10x cooler"
git push origin feature/your-amazing-idea
# Create PR and await glory
```

**Rules:**
1. Don't break stuff
2. Make it better than you found it
3. Add tests (please?)
4. Be nice in comments (we're all trying our best)

---

## 🗺️ Coming Soon™

**v2.1** - Barcode scanning (because typing is hard)  
**v2.2** - Recipe suggestions (AI becomes your chef)  
**v3.0** - AR food labels (welcome to the future)  

---

## 🆘 Need Help?

**Bug?** [GitHub Issues](https://github.com/Ctrl-apk/NutriScan/issues) - We actually read these  
**Question?** support@nutriscan.com - We'll respond (eventually)  
**Existential crisis?** That's not in our scope, friend

---

## 📜 Legal Stuff

MIT License - Do whatever you want, just don't sue us if you eat something weird

---

<div align="center">

### 🌟 Made with ❤️, ☕, and late-night panic by [Shifa](https://github.com/Ctrl-apk)

*"Warning: May cause excessive ingredient-label-reading and unsolicited health advice to friends"*

---

⭐ **Star this repo if you like eating food that won't kill you** ⭐

![Visitors](https://visitor-badge.laobi.icu/badge?page_id=nutriscan-2.0)

**Remember:** You are what you eat. So don't be fast, cheap, easy, or fake. 🍔❌

</div>
