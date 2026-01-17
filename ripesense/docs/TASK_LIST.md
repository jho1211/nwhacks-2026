# RipeSense - Development Task List

## Overview

This document outlines the step-by-step tasks to build the RipeSense produce ripeness detection app. Tasks are organized by phase and priority.

---

## ✅ Completed

- [x] Initialize Expo React Native project
- [x] Set up project structure with Expo Router
- [x] Document design decisions and project overview

---

## ✅ Phase 1: Project Setup & Foundation (COMPLETED)

### 1.1 Install Dependencies
- [x] Install Expo Camera (`expo-camera`)
- [x] Install Expo Image Manipulator (`expo-image-manipulator`)
- [x] Install TFLite package (`react-native-tflite`) - Note: TensorFlow.js React Native has peer dep conflicts
- [x] Install Expo FileSystem (`expo-file-system`) for model loading
- [x] Install Expo Asset (`expo-asset`) for bundling models

### 1.2 Project Structure Setup
- [x] Create `assets/models/` directory for TFLite models
- [x] Create `services/` directory for ML inference logic
- [x] Create `types/` directory for TypeScript definitions
- [x] Update `constants/` with produce-specific constants
- [ ] Set up camera-related components directory (Phase 2)

### 1.3 TypeScript Types & Constants
- [x] Define `ProduceType` enum (banana, avocado)
- [x] Define `BananaRipeness` type with 6 classes
- [x] Define `AvocadoRipeness` type with 5 classes
- [x] Define `ClassificationResult` interface
- [x] Create produce metadata constants (labels, colors, descriptions)
- [x] Create `useProduceClassifier` hook
- [x] Create `classifier.ts` service (with placeholder for TFLite implementation)

---

## ✅ Phase 2: Camera Integration (COMPLETED)

### 2.1 Camera Permissions
- [x] Configure camera permissions in `app.json`
- [x] Create permission request flow on app launch
- [x] Handle permission denied state with user guidance

### 2.2 Camera Screen
- [x] Replace default home screen with camera view
- [x] Implement `CameraView` component using Expo Camera
- [x] Add camera preview with proper aspect ratio
- [x] Create `CaptureButton` component for taking photos
- [x] Add camera flip button (front/back)
- [x] Style camera UI with minimal/clean design
- [x] Add scanning guide overlay with corner frame

### 2.3 Image Capture & Processing
- [x] Implement photo capture functionality
- [x] Add haptic feedback on capture
- [ ] Use Expo Image Manipulator to resize images to model input size (224x224) - *In Phase 3*
- [ ] Convert image to proper format for TensorFlow (base64 or tensor) - *In Phase 3*

### 2.4 Results UI (Bonus - done early)
- [x] Create `RipenessCard` component with image, label, and description
- [x] Create `RipenessIndicator` component (visual ripeness scale)
- [x] Create `result.tsx` screen with navigation
- [x] Add "Scan Again" button flow

---

## ✅ Phase 3: ML Model Integration (COMPLETED)

### 3.1 Model Preparation
- [x] Train avocado ripeness model in Google Teachable Machine
- [x] Export model as TensorFlow Lite (.tflite) format
- [x] Export model labels file
- [x] Add model files to `assets/models/avocado_tflite/` directory
- [x] Configure Metro to bundle `.tflite` files (metro.config.js)

### 3.2 TFLite Setup
- [x] Install `react-native-tflite` package
- [x] Create `classifier.ts` service for model operations
- [x] Implement model loading with fallback to mock data
- [x] Handle model loading states (loading, ready, error)
- [x] Create label mapping from Teachable Machine to internal labels

### 3.3 Inference Pipeline
- [x] Create `useProduceClassifier` hook
- [x] Implement image preprocessing (resize to 224x224)
- [x] Run inference on captured image (or mock in Expo Go)
- [x] Parse model output to classification result
- [x] Calculate confidence scores for each class
- [x] Return top prediction with confidence

### Note on Development Builds
The app works in Expo Go with **mock data** for testing UI. 
To use the actual TFLite model, you need to create a development build:
```bash
npx expo prebuild
npx expo run:ios  # or run:android
```

---

## ✅ Phase 4: Results UI (COMPLETED)

### 4.1 Results Screen
- [ ] Create result display screen/modal
- [ ] Show captured image thumbnail
- [ ] Display detected produce type
- [ ] Show ripeness classification prominently

### 4.2 Ripeness Visualization
- [ ] Create `RipenessIndicator` component (visual scale)
- [ ] Create `RipenessCard` component with details
- [ ] Color-code ripeness stages (green → yellow → brown)
- [ ] Show confidence percentage
- [ ] Add ripeness description text

### 4.3 User Flow
- [ ] Implement navigation from camera → result
- [ ] Add "Scan Again" button to return to camera
- [ ] Add smooth transitions between screens
- [ ] Handle loading state during inference

---

## 🧪 Phase 5: Testing & Polish

### 5.1 Testing
- [ ] Test camera on iOS simulator
- [ ] Test camera on Android emulator
- [ ] Test on physical iOS device
- [ ] Test on physical Android device
- [ ] Test model inference accuracy
- [ ] Test with various lighting conditions
- [ ] Test with different banana ripeness stages

### 5.2 Error Handling
- [ ] Handle camera initialization errors
- [ ] Handle model loading failures
- [ ] Handle inference errors gracefully
- [ ] Show user-friendly error messages
- [ ] Add retry mechanisms where appropriate

### 5.3 UI Polish
- [ ] Add loading spinners/skeletons
- [ ] Implement haptic feedback on capture
- [ ] Add subtle animations
- [ ] Ensure consistent styling across screens
- [ ] Test dark mode support (if applicable)
- [ ] Optimize for different screen sizes

---

## 🥑 Phase 6: Avocado Support (Post-MVP)

### 6.1 Avocado Model
- [ ] Train avocado ripeness model in Teachable Machine
- [ ] Export and add avocado TFLite model
- [ ] Update classifier service for multi-model support

### 6.2 Produce Selection
- [ ] Add produce type selector (banana/avocado)
- [ ] Or implement auto-detection of produce type
- [ ] Update results UI for avocado-specific classes

### 6.3 UI Updates
- [ ] Update ripeness indicators for avocado stages
- [ ] Add avocado-specific descriptions
- [ ] Test full flow with avocados

---

## 📦 Phase 7: Build & Distribution

### 7.1 App Configuration
- [ ] Update app name, slug, and bundle IDs
- [ ] Create app icon (1024x1024)
- [ ] Create splash screen
- [ ] Configure adaptive icon for Android
- [ ] Add app store metadata

### 7.2 Build
- [ ] Test Expo Go development build
- [ ] Create development build with EAS
- [ ] Create preview build for testing
- [ ] Create production build

### 7.3 Distribution
- [ ] Submit to Apple App Store (if applicable)
- [ ] Submit to Google Play Store (if applicable)
- [ ] Or distribute via Expo for hackathon demo

---

## 🚀 Quick Start (Minimum for Demo)

If you need a working demo quickly, prioritize these tasks:

1. **Install camera dependencies** (Phase 1.1)
2. **Camera permissions & basic view** (Phase 2.1, 2.2)
3. **Train and export model** (Phase 3.1)
4. **Basic inference pipeline** (Phase 3.2, 3.3)
5. **Simple results display** (Phase 4.1)

This minimal path gets you a working demo in ~4-6 hours of focused work.

---

## 📊 Progress Tracker

| Phase | Status | Completion |
|-------|--------|------------|
| Phase 1: Setup | ✅ Complete | 100% |
| Phase 2: Camera | ✅ Complete | 100% |
| Phase 3: ML Model | ✅ Complete | 100% |
| Phase 4: Results UI | ✅ Complete | 100% |
| Phase 5: Testing | 🔄 In Progress | 50% |
| Phase 6: Avocado | ✅ Complete | 100% |
| Phase 7: Build | ⏳ Not Started | 0% |

---

*Last Updated: January 17, 2026*
