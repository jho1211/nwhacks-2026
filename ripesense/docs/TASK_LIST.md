# RipeSense - Development Task List

## Overview

This document outlines the step-by-step tasks to build the RipeSense produce ripeness detection app. The app uses a **Python + FastAPI backend** for TensorFlow model inference, with a **React Native + Expo frontend** for the mobile UI.

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

## 🔄 Phase 3: Backend API (NEW - In Progress)

### 3.1 Backend Setup
- [x] Create `backend/` directory in project root
- [x] Set up Python virtual environment
- [x] Install dependencies (FastAPI, uvicorn, tensorflow, pillow, python-multipart)
- [x] Create `requirements.txt`
- [x] Create `main.py` with FastAPI app

### 3.2 Model Integration
- [x] Copy avocado Keras model to `backend/models/avocado/`
- [x] Create `classifier.py` service for model loading
- [x] Implement image preprocessing (resize to 224x224, normalize)
- [x] Implement inference function
- [x] Create label mapping from model output to ripeness classes

### 3.3 API Endpoints
- [x] Create POST `/classify` endpoint
- [x] Accept image as base64 or multipart file upload
- [x] Add `produce_type` parameter (avocado, banana)
- [x] Return JSON with ripeness class, confidence, all predictions
- [x] Configure CORS for mobile app access

### 3.4 Frontend Integration
- [x] Update `classifier.ts` service to call backend API
- [x] Send image as base64 to `/classify` endpoint
- [x] Handle API responses and map to `ClassificationResult` type
- [ ] Test full flow: capture → upload → classify → display

### Previous Phase 3 (On-Device TFLite - DEPRECATED)
The previous on-device TFLite approach has been replaced with a backend API.
Files like `services/classifier.ts` will be updated to call the backend API instead.

---

## ✅ Phase 4: Results UI (COMPLETED)

### 4.1 Results Screen
- [x] Create result display screen/modal
- [x] Show captured image thumbnail
- [x] Display detected produce type
- [x] Show ripeness classification prominently

### 4.2 Ripeness Visualization
- [x] Create `RipenessIndicator` component (visual scale)
- [x] Create `RipenessCard` component with details
- [x] Color-code ripeness stages (green → yellow → brown)
- [x] Show confidence percentage
- [x] Add ripeness description text

### 4.3 User Flow
- [x] Implement navigation from camera → result
- [x] Add "Scan Again" button to return to camera
- [x] Add smooth transitions between screens
- [x] Handle loading state during inference

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

## 🍌 Phase 6: Banana Support (Post-MVP)

### 6.1 Banana Model
- [ ] Train banana ripeness model in Teachable Machine
- [ ] Export Keras model and labels
- [ ] Add banana model to backend `models/banana/` directory

### 6.2 Backend Updates
- [ ] Update classifier service to support multiple models
- [ ] Add banana label mapping
- [ ] Test banana classification endpoint

### 6.3 Frontend Updates
- [ ] Add produce type selector (banana/avocado)
- [ ] Update UI to show correct produce emoji/info
- [ ] Test full flow with bananas

---

## 📦 Phase 7: Build & Distribution

### 7.1 App Configuration
- [x] Update app name, slug, and bundle IDs
- [ ] Create app icon (1024x1024)
- [ ] Create splash screen
- [x] Configure adaptive icon for Android
- [ ] Add app store metadata

### 7.2 Backend Deployment (Optional)
- [ ] Choose hosting provider (Railway, Render, Fly.io, AWS, etc.)
- [ ] Deploy FastAPI backend to cloud
- [ ] Update app to use production backend URL
- [ ] Set up environment variables for API URL

### 7.3 Mobile App Build
- [x] Test with Expo Go (local backend)
- [ ] Create development build with EAS (if needed)
- [ ] Create preview build for testing
- [ ] Create production build

### 7.4 Distribution
- [ ] Submit to Apple App Store (if applicable)
- [ ] Submit to Google Play Store (if applicable)
- [x] Demo via Expo Go + local backend for hackathon

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
| Phase 3: Backend API | 🔄 In Progress | 90% |
| Phase 4: Results UI | ✅ Complete | 100% |
| Phase 5: Testing | ⏳ Not Started | 0% |
| Phase 6: Banana Support | ⏳ Not Started | 0% |
| Phase 7: Build | ⏳ Not Started | 0% |

---

*Last Updated: January 17, 2026*
