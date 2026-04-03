# Antriview Codebase Analysis

## 📋 Executive Summary

**Antriview** is an AI-powered mock interview preparation platform built with **Next.js 15** and **TypeScript**. It leverages real-time voice AI agents to simulate realistic interview experiences, providing users with personalized feedback and performance tracking.

---

## 🏗️ Architecture Overview

### Tech Stack
- **Frontend Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 with animations
- **UI Components**: shadcn/ui (custom components)
- **Form Handling**: React Hook Form + Zod validation
- **Database**: Firestore (Firebase)
- **Authentication**: Firebase Auth
- **AI/Voice**: Vapi AI SDK (voice agent integration)
- **LLM**: Google Gemini API (for question generation & feedback)
- **Notifications**: Sonner (Toast notifications)
- **Date Handling**: Day.js

---

## 📁 Project Structure

```
antriview/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes (grouped)
│   │   ├── sign-in/page.tsx
│   │   └── sign-up/page.tsx
│   ├── (root)/                   # Main application routes (grouped)
│   │   ├── page.tsx              # Home/Dashboard
│   │   └── interview/
│   │       ├── page.tsx          # Interview generation page
│   │       └── [id]/
│   │           ├── page.tsx      # Individual interview page
│   │           └── feedback/page.tsx  # Feedback display page
│   ├── api/
│   │   └── vapi/
│   │       └── generate/route.ts # API endpoint for interview generation
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
│
├── components/                   # React components
│   ├── Agent.tsx                 # Main AI agent voice interaction component
│   ├── AuthForm.tsx              # Sign-in/Sign-up form
│   ├── ComingSoon.tsx            # Coming soon page
│   ├── DisplayTechIcons.tsx      # Tech stack icon display
│   ├── FormField.tsx             # Reusable form field wrapper
│   ├── InterviewCard.tsx         # Interview card component
│   └── ui/                       # UI component library
│       ├── button.tsx
│       ├── form.tsx
│       ├── input.tsx
│       ├── label.tsx
│       └── sonner.tsx
│
├── firebase/                     # Firebase configuration
│   ├── admin.ts                  # Firebase Admin SDK initialization
│   └── client.ts                 # Firebase Client SDK initialization
│
├── lib/                          # Utilities & actions
│   ├── actions/
│   │   ├── auth.action.ts        # Authentication server actions
│   │   └── general.action.ts     # General server actions (interviews, feedback)
│   ├── utils.ts                  # Utility functions
│   └── vapi.sdk.ts               # Vapi AI SDK initialization
│
├── types/                        # TypeScript type definitions
│   ├── index.d.ts                # Main type definitions
│   └── vapi.d.ts                 # Vapi-specific types
│
├── constants/                    # Constants
│   └── index.ts                  # Configuration, mappings, schemas
│
├── public/                       # Static assets
│   ├── Images (logos, avatars, icons)
│   └── covers/                   # Company cover images
│
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript configuration
├── next.config.ts                # Next.js configuration
└── tailwind.config.ts            # Tailwind CSS configuration
```

---

## 🔄 User Flow & Data Flow

### 1. **Authentication Flow**

```
User → Sign-Up/Sign-In Page
       ↓
Firebase Auth (Client SDK) → Create/Verify User
       ↓
Server Action (signUp/signIn) → Firestore (Create user document)
       ↓
Session Cookie Set (HTTP-only)
       ↓
Redirect to Home/Dashboard
```

**Key Files**:
- `app/(auth)/sign-in/page.tsx` - Sign-in page
- `app/(auth)/sign-up/page.tsx` - Sign-up page
- `components/AuthForm.tsx` - Handles form submission
- `lib/actions/auth.action.ts` - Server-side auth logic
- `firebase/client.ts` - Client Firebase config
- `firebase/admin.ts` - Server Firebase config

**Process Details**:
1. User submits email/password via `AuthForm`
2. Firebase client SDK creates auth user
3. Server action (`signUp`/`signIn`) is called with uid/idToken
4. User document is created in Firestore `/users` collection
5. Profile picture is generated using `ui-avatars.com` API
6. Session cookie is set for server-side authentication

---

### 2. **Interview Creation Flow**

#### **Flow A: Interview Generation (Guided Setup)**

```
User → Interview Generation Page (form with AI assistant)
       ↓
User answers conversational questions via Vapi AI
       ↓
AI collects: role, level, tech stack, question type, count
       ↓
POST /api/vapi/generate → Google Gemini API
       ↓
Generates array of interview questions
       ↓
Interview document saved to Firestore (/interviews collection)
       ↓
Redirect to interview page
```

**Key Files**:
- `app/(root)/interview/page.tsx` - Interview generation page
- `components/Agent.tsx` - AI agent component (type="generate")
- `app/api/vapi/generate/route.ts` - API endpoint for question generation
- `constants/index.ts` - Vapi workflow configuration

**Process Details**:
1. User navigates to `/interview`
2. `Agent` component is rendered with `type="generate"`
3. User clicks "Call" button → `vapi.start()` initiates conversation
4. Vapi uses workflow defined in `NEXT_PUBLIC_VAPI_WORKFLOW_ID`
5. Workflow collects user details and calls generate API
6. Gemini generates interview questions (no special characters for voice)
7. Questions saved with interview metadata
8. After generation completes, user is redirected home

#### **Flow B: Interview Execution (Taking Interview)**

```
User → Home Page → Select Interview Card → Interview Page
       ↓
Interview details loaded (role, level, questions, tech stack)
       ↓
User clicks "Call" → Vapi AI Agent starts
       ↓
Agent reads questions from interview document
       ↓
Real-time conversation with voice agent
       ↓
Transcript collected message by message
       ↓
When call ends → createFeedback() server action
       ↓
Transcript sent to Gemini → Generates feedback
       ↓
Feedback saved to Firestore (/feedback collection)
       ↓
Redirect to feedback page
```

**Key Files**:
- `app/(root)/page.tsx` - Home/Dashboard
- `app/(root)/interview/[id]/page.tsx` - Interview execution page
- `components/InterviewCard.tsx` - Interview card component
- `components/Agent.tsx` - Voice agent component (type="interview")
- `lib/actions/general.action.ts` - Interview/feedback actions

**Process Details**:
1. User selects interview from home page
2. Interview details fetched from Firestore
3. `Agent` component loads with `type="interview"` and questions
4. User clicks "Call" → Questions formatted and passed to `vapi.start()`
5. Vapi agent receives questions in system prompt
6. Real-time transcript collected via `message` event listener
7. When call ends, `handleGenerateFeedback()` is triggered
8. Transcript array sent to `createFeedback()` server action

---

### 3. **Feedback Generation Flow**

```
Interview Transcript Array
       ↓
Server Action: createFeedback(interviewId, userId, transcript)
       ↓
Format transcript for prompt
       ↓
Google Gemini API (structuredOutputs: false)
       ↓
generateObject() with feedbackSchema
       ↓
Returns: {totalScore, categoryScores[], strengths[], areasForImprovement, finalAssessment}
       ↓
Save to Firestore (/feedback collection)
       ↓
Return success & feedbackId
```

**Key Files**:
- `lib/actions/general.action.ts` - `createFeedback()` function
- `constants/index.ts` - `feedbackSchema` (Zod validation)

**Feedback Categories** (5 dimensions):
1. **Communication Skills** (0-100)
2. **Technical Knowledge** (0-100)
3. **Problem Solving** (0-100)
4. **Cultural Fit** (0-100)
5. **Confidence & Clarity** (0-100)

---

### 4. **Feedback Viewing Flow**

```
User → Home Page → Interview Card
       ↓
Click "View Feedback" (if feedback exists)
       ↓
getFeedbackByInterviewId() server action
       ↓
Load interview & feedback from Firestore
       ↓
Display: Overall Score, Category Breakdown, Strengths, Improvements, Assessment
       ↓
User can navigate back to home
```

**Key Files**:
- `app/(root)/interview/[id]/feedback/page.tsx` - Feedback page
- `lib/actions/general.action.ts` - `getFeedbackByInterviewId()` function

---

## 🔌 Database Schema (Firestore)

### Collections Structure

#### **`/users` Collection**
```typescript
{
  uid: string;              // Firebase Auth UID (document ID)
  name: string;
  email: string;
  profilePicture: string;   // Generated avatar URL
  profileInitials: string;  // For fallback avatar
  createdAt: string;        // ISO timestamp
}
```

#### **`/interviews` Collection**
```typescript
{
  id: string;               // Document ID
  userId: string;           // User who created it
  role: string;             // e.g., "Frontend Developer"
  level: string;            // e.g., "Senior", "Junior"
  type: string;             // e.g., "Technical", "Behavioral", "Mixed"
  techstack: string[];      // e.g., ["React", "Node.js"]
  questions: string[];      // Array of interview questions
  coverImage: string;       // Random cover image path
  finalized: boolean;       // Whether ready for interview
  createdAt: string;        // ISO timestamp
}
```

#### **`/feedback` Collection**
```typescript
{
  id: string;               // Document ID
  interviewId: string;      // Reference to interview
  userId: string;           // User who took interview
  totalScore: number;       // 0-100
  categoryScores: [
    {
      name: string;         // Category name
      score: number;        // 0-100
      comment: string;      // Detailed feedback
    }
  ];
  strengths: string[];      // List of strengths
  areasForImprovement: string[];  // List of improvements
  finalAssessment: string;  // Overall assessment paragraph
  createdAt: string;        // ISO timestamp
}
```

---

## 🤖 AI/Voice Agent Integration

### **Vapi AI Setup**

**Initialization** (`lib/vapi.sdk.ts`):
```typescript
import Vapi from '@vapi-ai/web';
export const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN!);
```

### **Two Workflows**

#### **1. Interview Generation Workflow** (`type="generate"`)
- Vapi workflow ID: `NEXT_PUBLIC_VAPI_WORKFLOW_ID`
- Purpose: Conversational AI collects interview parameters
- Variables passed:
  - `username`: User's name
  - `userid`: User's Firebase ID
- Workflow calls: `POST /api/vapi/generate` with collected data
- Returns: Generated interview document

#### **2. Interview Execution Workflow** (`type="interview"`)
- Uses `interviewer` assistant from `constants/index.ts`
- System prompt: Professional interviewer role with guidelines
- Voice: ElevenLabs "sarah" voice
- Transcriber: Deepgram Nova-2
- Questions provided in system prompt as variables
- Real-time transcript collection
- On call end: Feedback generation triggered

### **Agent Configuration** (`constants/index.ts`)

```typescript
export const interviewer: CreateAssistantDTO = {
  name: "Interviewer",
  firstMessage: "Hello! Thank you for taking the time to speak with me today...",
  transcriber: {
    provider: "deepgram",
    model: "nova-2",
    language: "en",
  },
  voice: {
    provider: "11labs",
    voiceId: "sarah",
    stability: 0.4,
    similarityBoost: 0.8,
    speed: 0.9,
    style: 0.5,
    useSpeakerBoost: true,
  },
  model: {
    provider: "openai",
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "Professional interviewer prompt with instructions..."
      }
    ]
  }
};
```

### **Vapi Event Listeners** (`Agent.tsx`)

| Event | Handler | Purpose |
|-------|---------|---------|
| `call-start` | Sets status to ACTIVE | Call initiated |
| `call-end` | Sets status to FINISHED | Call completed |
| `message` | Collects transcript | Real-time transcript |
| `speech-start` | Sets isSpeaking to true | Visual indicator |
| `speech-end` | Sets isSpeaking to false | Visual indicator |
| `error` | Logs error | Error handling |

---

## 🔐 Authentication & Authorization

### **Session Management**

**Client-Side** (`AuthForm.tsx`):
- Firebase Auth SDK handles user creation/login
- `createUserWithEmailAndPassword()` / `signInWithEmailAndPassword()`
- Gets ID token from Firebase user

**Server-Side** (`auth.action.ts`):
- Creates session cookie using Firebase Admin SDK
- `auth.createSessionCookie(idToken, {expiresIn: ONE_WEEK})`
- HTTP-only, secure, sameSite=lax
- Sets cookie in response headers

**Server-Side Protection** (`getCurrentUser()`):
- Reads session cookie
- Verifies with Firebase Admin Auth
- Returns user object with Firestore data
- Used in `redirect()` for protected pages

---

## 🎨 UI/UX Components

### **Key Components**

| Component | Purpose | Key Props |
|-----------|---------|-----------|
| `AuthForm` | Sign-in/Sign-up form | `type: "sign-in" \| "sign-up"` |
| `Agent` | Voice AI interaction | `type, userName, userId, interviewId, questions` |
| `InterviewCard` | Interview summary card | `role, type, techstack, id, userId, createdAt` |
| `DisplayTechIcons` | Tech stack visualization | `techStack: string[]` |
| `FormField` | Wrapper for form inputs | `form, name, label, placeholder` |

### **Design System**
- **Colors**: Dark theme with primary/secondary colors
- **Spacing**: Tailwind default scales
- **Animations**:
  - `animate-speak`: Speaking indicator
  - `animate-ping`: Call button pulse
  - `animate-fadeIn`: Message appearance
- **Responsive**: Mobile-first with max-sm breakpoints

---

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     ANTRIVIEW PLATFORM                          │
└─────────────────────────────────────────────────────────────────┘

1. AUTHENTICATION
   User Input → Firebase Client Auth → Server Session Cookie → Protected Routes

2. INTERVIEW GENERATION
   Vapi Workflow → AI Q&A → /api/vapi/generate → Gemini API → Firestore

3. INTERVIEW TAKING
   Interview Page → Vapi Agent → Real-time Voice → Transcript Collection

4. FEEDBACK GENERATION
   Transcript → createFeedback Action → Gemini API → Firestore

5. FEEDBACK VIEWING
   Interview Card → Feedback Page → Display Results

All authenticated actions use:
- Firebase Admin SDK (server-side)
- Session cookies (HTTP-only)
- Firestore (real-time database)
```

---

## 🔄 Key Server Actions

Located in `lib/actions/`:

### **auth.action.ts**
- `signUp(params)` - Create new user account
- `signIn(params)` - Sign in user with email
- `setSessionCookie(idToken)` - Store session
- `getCurrentUser()` - Get current authenticated user

### **general.action.ts**
- `getInterviewsByUserId(userId)` - Get user's interviews
- `getLatestInterviews({userId, limit})` - Get recent public interviews
- `getInterviewById(interviewId)` - Get single interview
- `createFeedback({interviewId, userId, transcript})` - Generate feedback
- `getFeedbackByInterviewId({interviewId, userId})` - Get feedback

---

## 🔗 Environment Variables Required

```env
# Firebase Admin
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

# Firebase Client
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

# Vapi AI
NEXT_PUBLIC_VAPI_WEB_TOKEN=
NEXT_PUBLIC_VAPI_WORKFLOW_ID=

# Google Gemini
Not explicitly set (uses ai package default)
```

---

## 📱 Pages & Routes

| Route | Component | Purpose | Auth Required |
|-------|-----------|---------|---------------|
| `/` | `(root)/page.tsx` | Dashboard/Home | ✅ |
| `/sign-in` | `(auth)/sign-in/page.tsx` | Sign in form | ❌ |
| `/sign-up` | `(auth)/sign-up/page.tsx` | Sign up form | ❌ |
| `/interview` | `(root)/interview/page.tsx` | Generate interview | ✅ |
| `/interview/[id]` | `(root)/interview/[id]/page.tsx` | Take interview | ✅ |
| `/interview/[id]/feedback` | `(root)/interview/[id]/feedback/page.tsx` | View feedback | ✅ |
| `/api/vapi/generate` | `api/vapi/generate/route.ts` | Generate questions API | ❌ |

---

## 🚀 Deployment Considerations

1. **Next.js Features Used**:
   - App Router (file-based routing)
   - Server Components (default)
   - Server Actions (using `'use server'`)
   - Route Handlers (API routes)

2. **Build Configuration** (`next.config.ts`):
   - ESLint warnings ignored during build
   - TypeScript errors ignored (for deployment)
   - Remote image patterns configured for ui-avatars.com

3. **Recommended Deployment**:
   - Vercel (native Next.js support)
   - Environment variables in platform dashboard
   - Firebase project setup (Firestore, Auth, Admin SDK)
   - Vapi AI credentials

---

## 🔍 Key Features Summary

✅ **Real-Time Voice Interviews** - Vapi AI agents simulate realistic interviews  
✅ **AI-Generated Questions** - Gemini creates custom questions based on role/tech stack  
✅ **Automated Feedback** - AI analyzes performance across 5 dimensions  
✅ **User Authentication** - Secure Firebase Auth with session management  
✅ **Interview History** - Track all interviews and feedback  
✅ **Progress Analytics** - View scores and improvement areas  
✅ **Tech Stack Visualization** - Display technologies used in interviews  
✅ **Responsive Design** - Mobile-first Tailwind CSS  
✅ **Real-Time Transcript** - Live conversation capture during interviews  

---

## 🛠️ Development Tips

1. **Type Safety**: All major flows have TypeScript interfaces
2. **Error Handling**: Try-catch blocks in server actions with user feedback
3. **Performance**: Server-side data fetching reduces client bundle
4. **Security**: HTTP-only cookies, no sensitive data in client
5. **Scalability**: Firestore queries optimized with indices

---

**Last Updated**: April 2026  
**Version**: V2 (Enterprise Ready)
