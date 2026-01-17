# RipeSense - Produce Ripeness Detector

> A mobile app that uses on-device machine learning to identify produce and determine ripeness levels.

## 📋 Project Overview

RipeSense is a React Native mobile application that allows users to take pictures of produce (starting with bananas, then avocados) and instantly receive ripeness classification. The app uses TensorFlow Lite models trained via Google Teachable Machine, running entirely on-device for fast, private, and offline-capable inference.

### Key Features

- 📸 **Camera-based scanning** - Point your camera at produce to analyze ripeness
- 🧠 **On-device ML** - No internet required, instant results
- 🍌 **Multi-produce support** - Starting with bananas, expanding to avocados
- 🎯 **Detailed classification** - Multiple ripeness stages per produce type
- 🔒 **Privacy-first** - Images never leave your device

---

## 🎨 Design Decisions

### Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Backend** | None (on-device only) | Eliminates server costs, enables offline use, reduces latency, improves privacy |
| **ML Framework** | TensorFlow Lite | Optimized for mobile, works with Google Teachable Machine exports |
| **Model Training** | Google Teachable Machine | Easy to train custom models, exports to TFLite format |
| **Frontend Framework** | React Native + Expo | Cross-platform (iOS & Android), rapid development, managed workflow |
| **Camera Library** | Expo Camera | Native integration with Expo, easy permissions handling |

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
┌─────────────────────────────────────────────┐
│                  RipeSense                   │
├─────────────────────────────────────────────┤
│  UI Layer                                    │
│  ├── React Native + Expo                    │
│  ├── Expo Router (Navigation)               │
│  └── Minimal/Clean Design System            │
├─────────────────────────────────────────────┤
│  Camera Layer                                │
│  ├── Expo Camera                            │
│  └── Expo Image Manipulator                 │
├─────────────────────────────────────────────┤
│  ML Inference Layer                          │
│  ├── TensorFlow.js                          │
│  ├── TFLite React Native                    │
│  └── Custom Trained Models (Teachable ML)   │
└─────────────────────────────────────────────┘
```

---

## 📱 App Structure

```
ripesense/
├── app/                      # Expo Router pages
│   ├── (tabs)/              # Tab-based navigation
│   │   ├── index.tsx        # Home/Camera screen
│   │   └── info.tsx         # About/Help screen
│   ├── _layout.tsx          # Root layout
│   └── result.tsx           # Result display screen
├── assets/
│   ├── images/              # App icons, splash screens
│   └── models/              # TFLite model files
│       ├── banana_model.tflite
│       └── avocado_model.tflite
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
│   └── useProduceClassifier.ts  # ML inference hook
├── services/
│   └── classifier.ts        # TFLite model loading & inference
└── types/
    └── produce.ts           # TypeScript types
```

---

## 🚀 MVP Scope

### Phase 1: Banana Detection (Current)
- [ ] Camera integration with Expo Camera
- [ ] TFLite model integration
- [ ] Banana ripeness classification (6 classes)
- [ ] Clean results display UI

### Phase 2: Avocado Detection (Next)
- [ ] Add avocado model
- [ ] Produce type selection/detection
- [ ] Avocado ripeness classification (5 classes)

### Future Enhancements (Post-MVP)
- [ ] Additional produce types (tomatoes, mangoes, etc.)
- [ ] Storage tips based on ripeness
- [ ] "Days until ripe" estimation
- [ ] Scan history (optional)
- [ ] Share results feature

---

## 📝 Notes

- **Model Format**: Google Teachable Machine exports models in TFLite format, which is compatible with mobile deployment
- **Image Preprocessing**: Images need to be resized to match model input dimensions (typically 224x224 for Teachable Machine models)
- **Inference Speed**: On-device inference typically takes <100ms on modern devices
- **Model Size**: Teachable Machine models are typically 2-5MB, suitable for mobile apps

---

## 🔗 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Camera](https://docs.expo.dev/versions/latest/sdk/camera/)
- [Google Teachable Machine](https://teachablemachine.withgoogle.com/)
- [TensorFlow Lite](https://www.tensorflow.org/lite)
- [TensorFlow.js React Native](https://www.tensorflow.org/js/guide/react_native)

---

*Last Updated: January 17, 2026*
