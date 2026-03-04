<div align="center">

<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=0:ff6b6b,25:ffd93d,50:6bcb77,75:4d96ff,100:c77dff&height=220&section=header&text=✏️%20Scribbl&fontSize=90&fontColor=ffffff&animation=fadeIn&fontAlignY=40&desc=draw%20%7C%20guess%20%7C%20win&descAlignY=62&descColor=ffffff&descSize=22"/>

<!-- Doodle divider -->
<h3>🎨 &nbsp; Draw &nbsp;·&nbsp; Guess &nbsp;·&nbsp; Win &nbsp; 🏆</h3>
<p><i>A real-time multiplayer drawing game built with React + Socket.IO</i></p>

<br/>

<p>
  <a href="https://scribbl-clone-mnag.onrender.com">
    <img src="https://img.shields.io/badge/🎮%20Play%20Now-Live%20Game-ff6b6b?style=for-the-badge" alt="Play Now"/>
  </a>
</p>

<p>
  <img src="https://img.shields.io/badge/React-Vite-61DAFB?style=flat&logo=react&logoColor=black"/>
  <img src="https://img.shields.io/badge/Socket.IO-Real--time-010101?style=flat&logo=socketdotio&logoColor=white"/>
  <img src="https://img.shields.io/badge/Node.js-18-339933?style=flat&logo=nodedotjs&logoColor=white"/>
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat&logo=mongodb&logoColor=white"/>
  <img src="https://img.shields.io/badge/license-ISC-blue?style=flat"/>
</p>

</div>

---

```
 ╔═══════════════════════════════════════════════════════════╗
 ║  ✏️  draw something...  💬  others guess...  🏆  win!    ║
 ╚═══════════════════════════════════════════════════════════╝
```

**Scribbl** is a full-stack clone of [skribbl.io](https://skribbl.io) — a real-time multiplayer drawing and guessing game. Create a private room, invite your friends, pick a word, and draw it before the timer runs out. Built from scratch with WebSockets, HTML5 Canvas, and a server-controlled game engine.

---

## ✏️ Features

```
 ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
 │  🏠 Private     │  │  🎨 Real-time   │  │  🖌️ Drawing    │
 │     Rooms       │  │     Canvas      │  │     Tools       │
 │                 │  │                 │  │                 │
 │ Create & share  │  │ Live stroke     │  │ Color palette   │
 │ invite links    │  │ streaming via   │  │ Brush sizes     │
 │ instantly       │  │ WebSockets      │  │ Eraser & clear  │
 └─────────────────┘  └─────────────────┘  └─────────────────┘

 ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
 │  💬 Live Chat   │  │  ⏱️ Server      │ │ 🏆 Scoring      │
 │   & Guessing    │  │     Timer       │  │    System       │
 │                 │  │                 │  │                 │
 │ Type guesses    │  │ Countdown synced│  │ Faster = more   │
 │ in real-time    │  │ across ALL      │  │ points. Max     │
 │ wrong = chat    │  │ clients         │  │ 500 pts/round   │
 └─────────────────┘  └─────────────────┘  └─────────────────┘

 ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
 │  📝 Word        │  │  👥 Live        │  │  🔁 Reconnect  │
 │   Selection     │  │  Leaderboard    │  │    Support      │
 │                 │  │                 │  │                 │
 │ Pick from 3     │  │ Scores update   │  │ Reload without  │
 │ options. Auto   │  │ instantly on    │  │ losing your     │
 │ picks after 15s │  │ correct guess   │  │ game state      │
 └─────────────────┘  └─────────────────┘  └─────────────────┘
```

---

## 🎮 How to Play

```
  1. ✍️  Enter your name + pick an avatar
         ↓
  2. 🏠  Create a Private Room
         ↓
  3. 🔗  Share the invite link with friends
         ↓
  4. ⚙️  Host configures: players · draw time · rounds
         ↓
  5. 🚀  Host clicks START
         ↓
  6. 📝  Drawer picks a word from 3 options
         ↓
  7. 🎨  Draw it on the canvas!
         ↓
  8. 💬  Others type guesses in chat
         ↓
  9. ⚡  Faster correct guess = more points
         ↓
  10. 🏆  Highest score wins!
```

---

## 🧠 Scoring Formula

```
╔════════════════════════════════════════════╗
║                                            ║
║   points = max( 50, timeLeft/drawTime×500) ║
║                                            ║
║   45s left on 50s timer  →  450 pts  🔥   ║
║   25s left on 50s timer  →  250 pts  ⚡   ║
║    5s left on 50s timer  →   50 pts  😅   ║
║                                            ║
╚════════════════════════════════════════════╝
```

---

## 🔌 Socket Events

| Event | Direction | What it does |
|-------|-----------|-------------|
| `join-room` | Client → Server | Join with player profile |
| `room-update` | Server → Client | Broadcast players & game state |
| `start-game` | Client → Server | Host fires the starting gun |
| `word-options` | Server → Drawer | Here are your 3 word choices |
| `select-word` | Client → Server | Drawer picks one |
| `drawing-started` | Server → Client | Masked word sent to guessers |
| `draw-stroke` | Client ↔ Server | Every stroke streamed live |
| `clear-canvas` | Client ↔ Server | Wipe the board |
| `submit-guess` | Client → Server | Player's guess submitted |
| `player-guessed` | Server → Client | Correct! Points awarded |
| `chat-message` | Server → Client | Wrong guess in chat |
| `timer-tick` | Server → Client | Tick tock ⏱️ |
| `turn-ended` | Server → Client | Reveal the word |
| `game-over` | Server → Client | Final scores 🏆 |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React · Vite · Tailwind CSS |
| **Real-time** | Socket.IO Client + Server |
| **Backend** | Node.js · Express |
| **Database** | MongoDB · Mongoose |
| **State** | In-memory room store + MongoDB |
| **Routing** | React Router |
| **Deploy** | Render |

---

## 📁 Project Structure

```
Scribbl-clone/
├── Client/
│   └── src/
│       ├── Components/
│       │   ├── Canvas.jsx        ← 🎨 Drawing canvas + toolbar
│       │   ├── PlayerList.jsx    ← 👥 Live leaderboard
│       │   ├── JoinGate.jsx      ← 🚪 Join room modal
│       │   ├── Settings.jsx      ← ⚙️  Game settings panel
│       │   └── Avatar.jsx        ← 🎭 Avatar picker
│       ├── Pages/
│       │   ├── LandingPage.jsx   ← 🏠 Home
│       │   └── Private.jsx       ← 🎮 Game room
│       └── socket.js             ← ⚡ Socket.IO instance
│
└── Server/
    ├── Memory/
    │   └── roomstore.js          ← 🧠 In-memory game state
    ├── models/
    │   └── RoomSchema.js         ← 🗄️  MongoDB schema
    ├── routes/
    │   └── roomRoutes.js         ← 🛣️  REST API
    ├── controllers/
    │   └── roomController.js     ← 🎛️  Room logic
    ├── socket/
    │   ├── index.js              ← 🔌 Socket init
    │   ├── roomEvents.js         ← 🚪 Join/disconnect
    │   └── gameEvents.js         ← 🎮 Game logic & timer
    └── server.js                 ← 🚀 Entry point
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js v18+
- MongoDB

### Clone

```bash
git clone https://github.com/alamrumman/Scribbl-clone.git
cd Scribbl-clone
```

### Backend

```bash
cd Server
npm install
```

Create `.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
FRONTEND_URL=http://localhost:5173
```

```bash
npm run dev
```

### Frontend

```bash
cd Client
npm install
```

Create `.env`:

```env
VITE_BACKEND_URL=http://localhost:5000
```

```bash
npm run dev
```

---

## 〔 Roadmap 〕
- [ ] Redis integration for fault-tolerant room state — persists room data 
      and stroke history across server crashes, enabling horizontal scaling 
      across multiple server instances
- [ ] Unit and integration testing with Jest — covering game logic, room 
      lifecycle, and Socket.io event handlers
- [ ] CI/CD pipeline via GitHub Actions — runs test suite on every push 
      and deploys to Render via webhook only if all tests pass
---


<div align="center">

## 👨‍💻 Author

**Md Rumman Alam**


<br/>

<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=0:c77dff,25:4d96ff,50:6bcb77,75:ffd93d,100:ff6b6b&height=120&section=footer&animation=fadeIn"/>

</div>
