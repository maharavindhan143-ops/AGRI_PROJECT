# 🌾 RuralFix - Agro MedKnow Nexus
> **கிராம குறைதீர்ப்பு, எளிய விவசாய வழிகாட்டி & சுகாதார ஒருங்கிணைப்பு தளம்**  
> *A Next.js 15 & React 19 Powered Civic Operations, AI Agriculture & Rural Healthcare Platform*

---

## 📖 திட்ட அறிமுகம் (Project Overview)

**RuralFix - Agro MedKnow Nexus** என்பது கிராமத்து பொதுமக்கள், விவசாயிகள், களப்பணியாளர்கள் மற்றும் பஞ்சாயத்து அதிகாரிகளை இணைக்கும் ஒரு நவீன மற்றும் எளிதில் புரியக்கூடிய வலைத்தளமாகும்.

### 🌟 முதன்மை வசதிகள் (Key Features)

1. **🛠️ கிராம குறைதீர்ப்பு (RuralFix Civic Grievances)**
   - தெருவிளக்கு பழுது, குடிநீர் கசிவு, சாக்கடை அடைப்பு, மற்றும் சாலை பழுது புகார்களை 1-கிளிக் மூலம் பதிவு செய்தல்.
   - புகைப்படப் பதிவேற்றம் (Photo proof) & நேரலை GPS இருப்பிட தானியங்கி பதிவு (Auto GPS Tagging).
   - புகாரின் நிலைமை (Reported ⏳ ➔ Assigned 🔧 ➔ Repaired 📸 ➔ Verified ✅).

2. **🌾 விவசாய வழிகாட்டி & AI இலை மருத்துவர் (Agro-MedKnow)**
   - **மண்டி சந்தை விலை (Mandi Rates)**: மஞ்சள், நெல், பருத்தி மற்றும் கரும்பு அன்றாட விலை நிலவரம்.
   - **AI இலை நோய் மருத்துவர் (AI Leaf Doctor)**: பயிர் இலை போட்டோவை அப்லோட் செய்து நோய் விபரம் மற்றும் இயற்கை/வேதியியல் சிகிச்சை முறைகளை அறிதல்.
   - **வானிலை ஆலோசனை (Monsoon Advisory)**: புயல் மற்றும் மழை எச்சரிக்கைகள்.

3. **🗺️ கிராம ஜி.ஐ.எஸ் வரைபடம் (Interactive Village GIS Map)**
   - கிராமத்தில் எந்தெந்த இடங்களில் புகார்கள் உள்ளன மற்றும் சரிசெய்யப்பட்டுள்ளன என்பதை நேரடியாக மேப்பில் பார்க்கும் வசதி.

4. **📞 அவசர உதவி எண்கள் (Emergency Helplines)**
   - 108 ஆம்புலன்ஸ், 1912 மின்வாரியம், பஞ்சாயத்து அலுவலகம் மற்றும் உழவர் உதவி எண்களுக்கு 1-Tap Speed Dial.

5. **🔊 தமிழ் & ஆங்கில குரல் வழிகாட்டி (Audio Speech Assistant)**
   - எழுதப் படிக்கத் தெரியாத கிராம மக்கள் எளிதில் புரிந்துகொள்ள அனைத்து தகவல்களையும் தமிழில் ஒலி வடிவில் கேட்கும் வசதி.

6. **👤 பயனர் நிலை மாற்றி (Persona Switcher)**
   - பொதுமக்கள் (Citizen), பஞ்சாயத்து அதிகாரி (Authority), களப்பணியாளர் (Worker), விவசாயி (Farmer), நிர்வாகி (Admin) என 5 நிலைகளில் பரிசோதிக்கும் வசதி.

---

## 🚀 இயக்கும் முறை (How to Run)

### 1. தேவையானவை (Prerequisites)
- Node.js (v18 அல்லது அதற்கு மேற்பட்ட பதிப்பு)
- npm / yarn / pnpm

### 2. திட்டத்தை துவக்குதல் (Start Dev Server)
```bash
# Dependencies நிறுவ (Install dependencies)
npm install

# Local development server இயக்க (Run dev mode)
npm run dev
```

உங்களது பிரவுசரில் [http://localhost:3000](http://localhost:3000) முகவரியைத் திறந்து பார்க்கவும்.

### 3. Production Build தயாரித்தல்
```bash
# Next.js Build
npm run build

# Start Production Server
npm run start
```

---

## 📁 திட்டத்தின் கோப்பு அமைப்பு (Folder Structure)

```text
Thillai project/
├── src/
│   ├── app/                    # Next.js App Router (பக்கங்கள்)
│   │   ├── page.tsx            # முகப்பு பலகை (Main Dashboard)
│   │   ├── ruralfix/           # புகார்கள் & நிலை கண்காணிப்பு
│   │   ├── agro/               # விவசாயம், மண்டி விலை & AI இலை மருத்துவர்
│   │   ├── map/                # கிராம GIS வரைபடம்
│   │   ├── reports/            # பஞ்சாயத்து பகுப்பாய்வு அறிக்கைகள்
│   │   └── ai-assistant/       # AI கிராம உதவியாளர்
│   ├── components/             # மறுபயன்பாட்டு UI கூறுகள்
│   │   ├── UserGuideModal.tsx  # 📖 எளிய பயன்பாட்டு வழிகாட்டி பாப்-அப்
│   │   ├── Navbar.tsx          # மேல் வழிசெலுத்தல் & ஒலி வழிகாட்டி
│   │   ├── Sidebar.tsx         # பக்கவாட்டு மெனு
│   │   ├── ComplaintModal.tsx  # புகார் பதிவு பாப்-அப் படிவம்
│   │   ├── InteractiveGisMap.tsx# Leaflet வரைபடம்
│   │   └── VillageQuickActionGrid.tsx # பெரிய டச் பட்டன்கள்
│   ├── lib/
│   │   ├── context/AppContext.tsx # மாநில மேலாண்மை & தமிழ்/ஆங்கில மொழி
│   │   ├── mockData.ts         # மாதிரி தரவுகள் (Demo Complaints & Mandi rates)
│   │   └── translations.ts     # தமிழ் & ஆங்கில மொழிபெயர்ப்புகள்
│   └── types/                  # TypeScript வகை வரையறைகள்
├── package.json
└── README.md
```

---

## 💡 எளிதாகப் பயன்படுத்துவது எப்படி? (Quick Usage Guide)

1. **மொழி மாற்ற (Change Language)**: மேல் வலது பக்கத்தில் உள்ள **"தமிழ்"** அல்லது **"English"** பட்டனை கிளிக் செய்யவும்.
2. **பயன்பாட்டு உதவி பெற (View Guide)**: மேல் பகுதியில் உள்ள **"📖 வழிகாட்டி"** அல்லது **"How to Use?"** பட்டனை கிளிக் செய்தால் 1-நிமிட பாப்-அப் வழிகாட்டி தோன்றும்.
3. **குரல் வடிவில் கேட்க (Listen Audio)**: **"ஒலி 🔊"** பட்டனை அழுத்தினால் தற்போதைய தகவல்கள் தமிழில் வாசிக்கப்படும்.
4. **புகார் பதிவு செய்ய (Report Issue)**: **"+ புதிய புகார்"** பட்டனை அழுத்தி போட்டோ அப்லோட் செய்து சமர்ப்பிக்கலாம்.
