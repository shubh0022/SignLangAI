# SignLangAI - AI-Powered Sign Language Platform

## 🚀 Overview
**SignLangAI** is a production-ready, full-stack platform leveraging Deep Learning and Computer Vision for real-time hand gesture and sign language recognition. The system accurately tracks hand landmarks using MediaPipe, classifies gestures via a CNN (TensorFlow/Keras), and translates them into multiple languages (English, Hindi, Gujarati) with live confidence scoring.

The project focuses on creating a practical, touchless, and accessibility-oriented communication platform using Artificial Intelligence.

## ✨ Core Features
- **Real-Time Webcam Detection**: 30+ FPS real-time webcam gesture detection.
- **Advanced AI/ML**: 21-point hand landmark tracking (MediaPipe) & CNN-based gesture classification (TensorFlow/Keras).
- **Multilingual Support**: Live translations in English, Hindi (हिंदी), and Gujarati (ગુજરાતી).
- **Accessibility UI**: Dark/Light mode, voice output assistant support, translation history, and a modern dashboard.
- **Live Metrics**: Real-time prediction confidence scoring and visual accuracy graphs.

## 🛠 Tech Stack
- **Frontend**: React.js, Tailwind CSS v4, Framer Motion, Vite
- **Backend**: FastAPI, WebSockets
- **AI/ML**: Python, TensorFlow, Keras, OpenCV, MediaPipe
- **Database**: MongoDB (via Motor) / Optional MySQL (via SQLAlchemy)

## 🏗 System Architecture
```text
Webcam Input
      ↓
OpenCV Frame Capture
      ↓
MediaPipe Hand Detection
      ↓
Image Preprocessing
      ↓
CNN Deep Learning Model
      ↓
Gesture Prediction
      ↓
Translation Engine
      ↓
English / Hindi / Gujarati Output
```

## 📂 Project Structure
```text
SignLangAI/
├── API/                 # Postman collections, Swagger specs, or external API configs
├── assets/              # Global project assets (logos, branding)
├── backend/             # FastAPI backend server
│   ├── app/
│   │   ├── api/         # API routes
│   │   ├── models/      # Database models & ML architecture
│   │   ├── services/    # Business logic & Translation handlers
│   │   └── main.py      # FastAPI application entry point
│   ├── train.py         # Model training pipeline
│   └── requirements.txt # Python dependencies
├── dataset/             # Raw & processed training data (video/images)
├── frontend/            # React.js frontend application
│   ├── public/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── contexts/    # React context (Theme, Auth)
│   │   ├── hooks/       # Custom React hooks
│   │   ├── pages/       # Dashboard & Application pages
│   │   └── App.jsx      # Main application router
│   ├── package.json     # Node.js dependencies
│   └── vite.config.js   # Vite bundler configuration
├── model/               # Saved trained `.keras` or `.h5` model files
├── screenshot/          # Application screenshots for documentation
├── README.md            # Project documentation
└── requirements.txt     # Root reference for dependencies
```

## ⚙️ Setup Instructions

### 1. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
pip install -r requirements.txt
# Start the FastAPI server
uvicorn app.main:app --reload
```

### 2. Frontend Setup
```bash
cd frontend
npm install
# Start the Vite development server
npm run dev
```

### 3. Training the AI Model
To generate synthetic data or train on a custom dataset:
```bash
cd backend
python train.py
```
*Note: The script outputs the trained model to `backend/app/models/gesture_model.keras`.*

## 🔮 Future Roadmap
- Integration of custom user authentication.
- Continuous model learning from user feedback.
- Deployment via Docker, Vercel (Frontend), and AWS/GCP (Backend).
- Mobile application support and smart glasses integration.
- Dynamic sentence recognition (continuous signing stream).

## 🔗 Project Link
- **Live Vercel Application**: [https://sign-lang-ai-qk62.vercel.app/](https://sign-lang-ai-qk62.vercel.app/)

## 👨‍💻 Author
**Yadav Shubham Jangbahadur**
- PU-CDOE — One Year Diploma in Neural Network (2522759X5XX28)
- Parul University, Vadodara

## 📄 License
This project is developed for academic and research purposes.

## ⭐ Acknowledgement
Special thanks to:
- TensorFlow Community
- OpenCV Developers
- MediaPipe Team
- Open-source AI research contributors

for providing valuable frameworks and resources that supported the development of this project.
