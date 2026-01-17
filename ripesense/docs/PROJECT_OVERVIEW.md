# RipeSense - Produce Ripeness Detector

> A mobile app that uses machine learning to identify produce and determine ripeness levels.

## 📋 Project Overview

RipeSense is a React Native mobile application that allows users to take pictures of produce (starting with avocados, then bananas) and instantly receive ripeness classification. The app sends images to a Python + FastAPI backend server that runs TensorFlow models trained via Google Teachable Machine.

### Key Features

- 📸 **Camera-based scanning** - Point your camera at produce to analyze ripeness
- 🧠 **ML-powered classification** - TensorFlow model hosted on backend server
- 🥑 **Multi-produce support** - Starting with avocados, expanding to bananas
- 🎯 **Detailed classification** - Multiple ripeness stages per produce type
- 🚀 **Fast inference** - Backend processing with instant results

---

## 🎨 Design Decisions

### Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Backend** | Python + FastAPI | Fast async API, easy TensorFlow integration, simple deployment |
| **ML Framework** | TensorFlow / Keras | Works directly with Google Teachable Machine exports |
| **Model Training** | Google Teachable Machine | Easy to train custom models, exports to TensorFlow format |
| **Frontend Framework** | React Native + Expo | Cross-platform (iOS & Android), rapid development, managed workflow |
| **Camera Library** | Expo Camera | Native integration with Expo, easy permissions handling |
| **Image Transfer** | Base64 / Multipart | Send raw images from app to backend for processing |

### UI/UX Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Design Style** | Minimal/Clean | Focus on core functionality, reduce visual clutter |
| **History/Storage** | No local storage | MVP scope - real-time detection only |
| **User Accounts** | None | Not needed for MVP, simplifies architecture |

---

## 🍌 Produce Classification

### Banana Ripeness Classes (6 stages)

| Class | Description | Visual Indicators |
|-------|-------------|-------------------|
| `unripe` | Very green, not ready | Fully green, firm |
| `freshunripe` | Starting to ripen | Green with hints of yellow |
| `freshripe` | Perfect for eating | Yellow with green tips |
| `ripe` | Fully ripe | Fully yellow |
| `overripe` | Past peak, still edible | Yellow with brown spots |
| `rotten` | Not safe to eat | Mostly brown/black |

### Avocado Ripeness Classes (5 stages)

| Class | Stage | Description |
|-------|-------|-------------|
| `underripe` | 1 | Hard, bright green, not ready |
| `breaking` | 2 | Starting to soften, color changing |
| `ripe_stage_1` | 3 | Ripe (First Stage) - Ready to eat |
| `ripe_stage_2` | 4 | Ripe (Second Stage) - Very soft, use immediately |
| `overripe` | 5 | Too soft, browning inside |

---

## 🛠 Technical Stack

```
┌─────────────────────────────────────────────────────────────┐
│                       RipeSense App                          │
│                    (React Native + Expo)                     │
├─────────────────────────────────────────────────────────────┤
│  UI Layer                                                    │
│  ├── React Native + Expo                                    │
│  ├── Expo Router (Navigation)                               │
│  └── Minimal/Clean Design System                            │
├─────────────────────────────────────────────────────────────┤
│  Camera Layer                                                │
│  ├── Expo Camera                                            │
│  └── Image capture & base64 encoding                        │
├─────────────────────────────────────────────────────────────┤
│  API Layer                                                   │
│  └── HTTP POST requests to backend                          │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP POST (image)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     Backend Server                           │
│                   (Python + FastAPI)                         │
├─────────────────────────────────────────────────────────────┤
│  API Layer                                                   │
│  ├── FastAPI endpoints                                      │
│  ├── Image validation & parsing                             │
│  └── CORS configuration                                     │
├─────────────────────────────────────────────────────────────┤
│  ML Inference Layer                                          │
│  ├── TensorFlow / Keras                                     │
│  ├── Image preprocessing (resize to 224x224)                │
│  ├── Model inference                                        │
│  └── Custom Trained Models (Teachable ML)                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📱 App Structure

### Frontend (React Native)

```
ripesense/
├── app/                      # Expo Router pages
│   ├── (tabs)/              # Tab-based navigation
│   │   ├── index.tsx        # Home/Camera screen
│   │   └── info.tsx         # About/Help screen
│   ├── _layout.tsx          # Root layout
│   └── result.tsx           # Result display screen
├── assets/
│   └── images/              # App icons, splash screens
├── components/
│   ├── camera/              # Camera-related components
│   │   ├── CameraView.tsx
│   │   └── CaptureButton.tsx
│   ├── results/             # Result display components
│   │   ├── RipenessCard.tsx
│   │   └── RipenessIndicator.tsx
│   └── ui/                  # Shared UI components
├── constants/
│   ├── theme.ts             # Colors, typography
│   └── produce.ts           # Produce types & classes
├── hooks/
│   └── useProduceClassifier.ts  # API call hook
├── services/
│   └── api.ts               # Backend API service
└── types/
    └── produce.ts           # TypeScript types
```

### Backend (Python + FastAPI)

```
backend/
├── main.py                  # FastAPI app entry point
├── requirements.txt         # Python dependencies
├── models/
│   ├── avocado/            # Avocado TensorFlow model
│   │   ├── keras_model.h5
│   │   └── labels.txt
│   └── banana/             # Banana TensorFlow model (future)
│       ├── keras_model.h5
│       └── labels.txt
├── services/
│   ├── classifier.py       # Model loading & inference
│   └── preprocessing.py    # Image preprocessing
└── schemas/
    └── classification.py   # Pydantic request/response models
```

---

## 🚀 MVP Scope

### Phase 1: Avocado Detection (Current)
- [x] Camera integration with Expo Camera
- [x] Results UI with ripeness display
- [ ] Backend API with FastAPI
- [ ] TensorFlow model integration on backend
- [ ] Avocado ripeness classification (5 classes)

### Phase 2: Banana Detection (Next)
- [ ] Add banana model to backend
- [ ] Produce type selection/detection
- [ ] Banana ripeness classification (6 classes)

### Future Enhancements (Post-MVP)
- [ ] Deploy backend to cloud (Railway, Render, AWS, etc.)
- [ ] Additional produce types (tomatoes, mangoes, etc.)
- [ ] Storage tips based on ripeness
- [ ] "Days until ripe" estimation
- [ ] Scan history (optional)
- [ ] Share results feature

---

## 📝 Notes

- **Model Format**: Google Teachable Machine exports models in Keras H5 format for use with TensorFlow
- **Image Preprocessing**: Backend resizes images to 224x224 and normalizes pixel values
- **Inference Speed**: Server-side inference is fast; main latency is network transfer
- **Model Size**: Teachable Machine models are typically 2-5MB
- **Local Development**: Backend runs on localhost; app connects via local network IP

---

## 🔗 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Camera](https://docs.expo.dev/versions/latest/sdk/camera/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Google Teachable Machine](https://teachablemachine.withgoogle.com/)
- [TensorFlow / Keras](https://www.tensorflow.org/)

---

*Last Updated: January 17, 2026*
