SignLangAI
AI-Powered Real-Time Hand Gesture & Sign Language Recognition System Using Deep Learning

<img width="1822" height="1202" alt="image" src="https://github.com/user-attachments/assets/84fb51ed-9e7f-49d1-8b06-569b3d334a7f" />

📌 Overview

SignLangAI is an AI-powered real-time hand gesture and sign language recognition system designed to improve communication accessibility for speech-impaired and hearing-impaired individuals.

The system uses:

Computer Vision
Deep Learning
MediaPipe Hand Tracking
CNN-based Gesture Classification
Multilingual Translation

to recognize hand gestures through a webcam and translate them into:

English
Hindi
Gujarati

The project focuses on creating a practical, touchless, and accessibility-oriented communication platform using Artificial Intelligence.

🚀 Key Features
🎥 Real-time webcam gesture detection
✋ Hand landmark tracking using MediaPipe
🧠 CNN-based gesture classification
🌐 Multilingual translation support
🇮🇳 English, Hindi, and Gujarati output
⚡ Real-time prediction with confidence score
📊 Accuracy and performance visualization
🖥 Modern AI-inspired user interface
🔊 Future-ready voice assistant support
♿ Accessibility-focused system design
🧠 Technologies Used
Technology	Purpose
Python	Core programming
TensorFlow / Keras	Deep learning
OpenCV	Image processing
MediaPipe	Hand landmark detection
NumPy	Numerical computation
Pandas	Data handling
Matplotlib	Visualization
Flask / FastAPI	Backend integration
Google Colab	Model training


🏗 System Architecture
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


📂 Project Structure
SignLangAI/
│
├── dataset/
├── models/
├── notebooks/
├── screenshots/
├── static/
├── templates/
├── app.py
├── train.py
├── predict.py
├── requirements.txt
├── README.md
└── assets/


📊 Dataset Information

The model was trained using multiple gesture datasets:

ASL Alphabet Dataset
LeapGestRecog Dataset
Indian Sign Language Dataset
Custom Webcam Gesture Dataset

The datasets include:

Static gestures
Hand landmarks
Real-time gesture samples
Accessibility-focused sign inputs
🧪 Model Training

The gesture recognition model uses a Convolutional Neural Network (CNN) for image classification.

Training Workflow
Dataset Collection
        ↓
Image Preprocessing
        ↓
Landmark Extraction
        ↓
CNN Training
        ↓
Validation
        ↓
Gesture Prediction
Training Configuration
Parameter	Value
Epochs	30
Batch Size	32
Optimizer	Adam
Accuracy	~96%



🌍 Supported Languages
Language	Status
English	✅ Supported
Hindi	✅ Supported
Gujarati	✅ Supported
⚙ Installation
Clone Repository
git clone https://github.com/shubh0022/SignLangAI.git
Navigate to Project Folder
cd SignLangAI
Install Dependencies
pip install -r requirements.txt
Run Application
python app.py
📈 Performance
Metric	Result
Accuracy	96%
Precision	95%
FPS	24
Response Time	<1 sec

The trained model performed well during real-time testing and maintained stable gesture recognition under normal lighting conditions.

💡 Real-World Applications
Accessibility communication systems
Smart classrooms
Healthcare support systems
AI-powered translation platforms
Touchless smart interfaces
Public assistance kiosks
🔮 Future Scope

Future improvements may include:

📱 Mobile application support
🥽 Smart glasses integration
🔊 Voice assistant support
🌐 Cloud deployment
🧠 Dynamic sentence recognition
🕶 AR/VR interaction systems
📚 Research Contribution

This project focuses not only on gesture recognition accuracy but also on practical accessibility support and multilingual communication.

The system attempts to reduce communication barriers by combining:

Deep Learning
Computer Vision
Real-time AI interaction
Regional language translation

into a single intelligent platform.

👨‍💻 Author

Yadav Shubham Jangbahadur
PU-CDOE — One Year Diploma in Neural Network(2522759X5XX28)
Parul University, Vadodara

📄 License

This project is developed for academic and research purposes.

⭐ Acknowledgement

Special thanks to:

TensorFlow Community
OpenCV Developers
MediaPipe Team
Open-source AI research contributors

for providing valuable frameworks and resources that supported the development of this project.
