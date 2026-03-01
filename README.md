# 🎨 Scribbl — Skribbl.io Clone
Production url - https://scribbl-clone-mnag.onrender.com
A real-time multiplayer drawing and guessing game built with React, Node.js, and Socket.IO.

---

## 🚀 Features

- 🏠 **Private Rooms** — Create or join rooms with a shareable invite link
- 🎨 **Real-time Canvas** — HTML5 canvas with live stroke streaming via WebSockets
- 🖌️ **Drawing Tools** — Color palette, brush size slider, eraser, and clear canvas
- 💬 **Live Chat & Guessing** — Type guesses in real-time, wrong guesses show in chat
- ⏱️ **Server-controlled Timer** — Countdown synced across all clients
- 🔄 **Turn Rotation** — Each player draws for the full number of rounds before passing
- 📝 **Word Selection** — Drawer picks from 3 random word options (auto-picks after 15s)
- 🏆 **Points System** — Time-based scoring, faster guesses earn more points (max 500)
- 👥 **Live Leaderboard** — Player scores update in real-time as correct guesses come in
- 🔁 **Reconnect Support** — Players can reload without losing their game state
- 🎭 **Avatar Picker** — Choose a custom avatar before joining

---

## 🛠️ Tech Stack

**Frontend**
- React (Vite)
- Tailwind CSS
- Socket.IO Client
- React Router

**Backend**
- Node.js + Express
- Socket.IO
- MongoDB + Mongoose
- UUID

---

## 📁 Project Structure

```
scribbl/
├── client/                  # React frontend
│   ├── src/
│   │   ├── Components/
│   │   │   ├── Canvas.jsx       # Drawing canvas with toolbar
│   │   │   ├── PlayerList.jsx   # Live leaderboard
│   │   │   ├── JoinGate.jsx     # Join room modal
│   │   │   ├── Settings.jsx     # Game settings panel
│   │   │   └── Avatar.jsx       # Avatar picker
│   │   ├── Pages/
│   │   │   ├── LandingPage.jsx  # Home page
│   │   │   └── Private.jsx      # Game room page
│   │   └── socket.js            # Socket.IO client instance
│
├── server/                  # Node.js backend
│   ├── Memory/
│   │   └── roomstore.js         # In-memory room state
│   ├── models/
│   │   └── RoomSchema.js        # MongoDB room model
│   ├── routes/
│   │   └── roomRoutes.js        # REST API routes
│   ├── controllers/
│   │   └── roomController.js    # Room creation logic
│   ├── socket/
│   │   ├── index.js             # Socket.IO initialization
│   │   ├── roomEvents.js        # Join/disconnect handlers
│   │   └── gameEvents.js        # Game logic & timer
│   └── server.js                # Entry point
```

---

## ⚙️ Installation

### Prerequisites
- Node.js v18+
- MongoDB

### Clone the repo

```bash
git clone https://github.com/yourusername/scribbl.git
cd scribbl
```

### Setup Backend

```bash
cd server
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
FRONTEND_URL=http://localhost:5173
```

Start the server:

```bash
npm run dev
```

### Setup Frontend

```bash
cd client
npm install
```

Create a `.env` file:

```env
VITE_BACKEND_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

---

## 🎮 How to Play

1. Enter your name and pick an avatar on the landing page
2. Click **Create Private Room** to start a new room
3. Share the invite link with friends
4. The host configures settings (players, draw time, rounds, word count)
5. Host clicks **Start** to begin the game
6. The drawer picks a word from 3 options
7. Guessers type in the chat to guess the word
8. Faster correct guesses earn more points
9. Each player takes turns drawing for the full number of rounds
10. Highest score at the end wins 🏆

---

## 🔌 Socket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `join-room` | Client → Server | Join a room with player profile |
| `room-update` | Server → Client | Broadcast player list and game state |
| `start-game` | Client → Server | Host starts the game |
| `word-options` | Server → Drawer | Send 3 word choices |
| `select-word` | Client → Server | Drawer picks a word |
| `your-word` | Server → Drawer | Confirm selected word |
| `drawing-started` | Server → Client | Send masked word to guessers |
| `draw-stroke` | Client ↔ Server | Stream canvas strokes in real-time |
| `clear-canvas` | Client ↔ Server | Clear the canvas |
| `submit-guess` | Client → Server | Player submits a guess |
| `player-guessed` | Server → Client | Correct guess notification + points |
| `chat-message` | Server → Client | Wrong guess shown in chat |
| `timer-tick` | Server → Client | Countdown every second |
| `turn-ended` | Server → Client | Reveal correct word |
| `game-over` | Server → Client | Final scores |

---

## 🧠 Scoring

Points are calculated based on how quickly a player guesses the word:

```
points = max(50, (timeLeft / drawTime) * 500)
```

- Guess with 45s left on a 50s timer → **450 pts**
- Guess with 5s left → **50 pts** (minimum)
- If all players guess correctly, the turn ends early

---

