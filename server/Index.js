// server/index.js

const express = require('express');
const http = require('http');
const { WebSocketServer, WebSocket } = require('ws');
const cors = require('cors');
const url = require('url');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/users');

connectDB();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const rooms = new Map();

// --- Helper function to broadcast messages to a specific room ---
function broadcastToRoom(roomId, message, senderWs) {
  const room = rooms.get(roomId);
  if (room) {
    room.forEach((user) => {
      // Send to everyone in the room including the sender,
      // as the frontend will now rely on this broadcast to draw.
      if (user.ws.readyState === WebSocket.OPEN) {
        user.ws.send(message);
      }
    });
  }
}

function broadcastOnlineUsers(roomId) {
  const room = rooms.get(roomId);
  if (!room) return;
  const onlineUsers = Array.from(room.values()).map(user => ({
    id: user.id,
    username: user.username,
  }));
  const message = JSON.stringify({ type: 'online-users', users: onlineUsers });
  broadcastToRoom(roomId, message);
}

wss.on('connection', async (ws, req) => {
  const query = url.parse(req.url, true).query;
  const token = query.token;
  const roomId = query.roomId;

  if (!token || !roomId) {
    return ws.terminate();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userRecord = await User.findById(decoded.user.id).select('-password');
    if (!userRecord) { return ws.terminate(); }

    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Map());
    }

    const room = rooms.get(roomId);
    const userInfo = {
      id: userRecord._id.toString(),
      username: userRecord.username,
      ws: ws,
    };
    
    room.set(userInfo.id, userInfo);
    console.log(`${userInfo.username} connected to room ${roomId}`);

    broadcastOnlineUsers(roomId);

    ws.on('message', (message) => {
      // The server now simply acts as a broadcaster.
      // It trusts that the client is sending all the necessary drawing info (color, size, etc.).
      broadcastToRoom(roomId, message, ws);
    });

    ws.on('close', () => {
      const room = rooms.get(roomId);
      if (room) {
        room.delete(userInfo.id);
        if (room.size === 0) {
          rooms.delete(roomId);
        }
      }
      console.log(`${userInfo.username} disconnected from room ${roomId}`);
      broadcastOnlineUsers(roomId);
    });

  } catch (err) {
    console.log('Connection rejected: Invalid token or user.');
    return ws.terminate();
  }
});

// --- API Routes ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/canvas', require('./routes/canvas'));

// --- Server Startup ---
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
