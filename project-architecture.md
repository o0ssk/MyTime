# Project Architecture & System Context — MyTime (The Ethereal Observer)

## 1. Project Overview & Tech Stack
**MyTime** is a high-fidelity, 3D interactive daily planner inspired by luxury Swiss horology and celestial navigation. It visualizes a 24-hour itinerary on a 12-hour analog clock face using a dual-orbital task system.

### Core Tech Stack:
- **Framework**: Next.js 15.1.0 (App Router)
- **Runtime**: React 19.x
- **3D Engine**: Three.js (r175)
- **3D React Layer**: @react-three/fiber, @react-three/drei
- **State Management**: Zustand 5.0.0 (Persistent storage via `localStorage`)
- **Styling**: Tailwind CSS 4.x (Mobile-first, fluid layout)
- **Animations**: Framer Motion 12.x
- **Utilities**: Lucide React, date-fns

---

## 2. File & Directory Structure
```text
src/
├── app/
│   ├── components/       # Primary UI Layout Components
│   │   ├── TopNav.tsx    # Global header with mobile menu toggle
│   │   ├── SideNav.tsx   # Responsive drawer / sidebar (Desktop vs Mobile)
│   │   ├── TaskSidebar.tsx # Mobile-first pull-up bottom sheet / Desk task list
│   │   └── OrbitalClock.tsx # Responsive 3D Canvas container
│   ├── context/
│   │   └── TaskContext.tsx # Context Provider bridging Zustand and UI state
│   ├── layout.tsx        # Global PWA head tags, fonts, and providers
│   ├── page.tsx          | Root entry: Assembler for main layout components
│   └── types.ts          # Core entity definitions (Task, TaskCompletion)
├── components/           # Functional sub-components
│   ├── clock/            # 3D Scene Components
│   │   ├── ClockScene.tsx  # Scene compositor & task segment logic
│   │   ├── ClockFace.tsx   # Multi-layered glassmorphic disc
│   │   ├── ClockHands.tsx  # Dynamic hour/minute/second hands
│   │   ├── TaskArc.tsx     # Orbital arc geometry (TubeGeometry along curve)
│   │   └── ClockLabels.tsx # 3D numeral/tick mark positioning
│   └── sidebar/          # Sidebar specific units (TaskList, etc.)
├── lib/                  # Shared logic layer
│   ├── timeUtils.ts      # AM/PM splitting & Angle calculation math
│   └── storage.ts        # Persistence helpers for 24h cycle
├── store/
│   └── useTaskStore.ts   # Zustand store for tasks and completions
└── globals.css           # Design tokens, celestial theme, glassmorphic utilities
```

---

## 3. Core Components Architecture
The application follows a **Decoupled 3D-to-UI** architecture.

### DOM Hierarchy (Simplified):
1. **`MainLayout`** (app/page.tsx)
   - **`TopNav`**: Absolute-positioned z-indexed header.
   - **`SideNav`**: Responsive overlay (mobile) or fixed panel (desktop).
   - **`OrbitalClock`**: A full-viewport `Canvas` container.
     - `ClockScene`: The Three.js orchestration layer.
       - `ClockFace` + `ClockHands`.
       - `TaskArcsGroup`: Iterates over split task segments.
       - `TaskArcTooltip`: HTML overlay synchronized with 3D positions.
   - **`TaskSidebar`**: Mobile pull-up drawer (sheet) or fixed sidebar.
   - **`AddTaskModal`**: Portal-based modal for task entry.

---

## 4. State Management (Zustand)
Global state is managed by `useTaskStore` with `persist` middleware.

### State Variables:
- `tasks`: `Task[]` — Core task definitions (id, title, color, start/end string).
- `completions`: `TaskCompletion[]` — Tracks completion status by `taskId` and `date`.
- `hoveredTaskId`: `string | null` — Used for cross-component highlighting (syncs Sidebar ↔ Clock).

### Core Actions:
- `addTask(taskData)`: Generates unique ID and sorts by start time.
- `deleteTask(id)`: Removes task and associated completions.
- `toggleTaskCompletion(id, date)`: Toggles record in completion array.
- `resetCompletionsForDate(date)`: Clears historical data for a specific 24h cycle.

---

## 5. Mathematical & Logic Core
### Time-to-Angle Mapping:
Angle calculation follows a clockwise polar coordinate system starting at 12 o'clock (`Math.PI / 2`):
```typescript
angle = (Math.PI / 2) - ((hour12 % 12) / 12) * (Math.PI * 2)
```

### AM/PM Dual-Ring Implementation:
To visualize 24 hours on a 12-hour face without overlap, the system uses **Concentric Orbitals**:
- **AM (Day)**: Inner Ring. `radius: 3.55`, `y_offset: 0.12`.
- **PM (Night)**: Outer Ring. `radius: 3.80`, `y_offset: 0.08`.

### Period Splitting Logic (`splitTaskByPeriod`):
A task that crosses 12:00 or 00:00 is decomposed into discrete segments:
- Segment A: `[startHour, 12]` → Assigned to AM layer.
- Segment B: `[12, endHour]` → Assigned to PM layer.
This ensures visual continuity while maintaining spatial separation between AM/PM activity blocks.

---

## 6. Current Styling & Design System
- **Theme**: "Midnight Canvas" (#0f172a / #020617 gradients).
- **Glassmorphism**: `backdrop-blur-2xl`, `bg-slate-900/40`, `border-white/10`.
- **Typography**: Inter (UI), Outfit (Secondary).
- **No-Line Policy**: Avoid high-contrast borders. Use box-shadows (tinted by task color) and subtle gradient fills to define shapes.

---

## 7. Current Status & Known Issues

### Operational Status:
- [x] **24h Task engine**: Fully functional dual-ring splitting.
- [x] **Mobile Optimization**: Pull-up bottom sheet and responsive side drawer.
- [x] **PWA**: Manifest and Service Workers configured for installation.
- [x] **Hydration**: Stabilized via `mounted` guards for SSR-to-Client handoff.

### Known Bugs / Priority Debt:
1. **Clock Centering**: On extreme aspect ratios (Ultrawide), the 3D clock face can offset slightly from the visual center.
2. **Double Dev Conflict**: Multiple `npm run dev` processes can occasionally cause port conflicts and "connection refused" errors in subagents.
3. **Tooltip Clipping**: At high angles, `Html` tooltips can clip with the 3D bezel; requires z-index refinement or distance-based scaling.
