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
const CanvasState = require('./models/CanvasState');

// Connect to Database
connectDB();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// This map now stores a complete state object for each room
const rooms = new Map();

function broadcastToRoom(roomId, message) {
  const room = rooms.get(roomId);
  if (room && room.clients) {
    room.clients.forEach((client) => {
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(message);
      }
    });
  }
}

function broadcastOnlineUsers(roomId) {
  const room = rooms.get(roomId);
  if (!room || !room.clients) return;

  const onlineUsers = Array.from(room.clients).map(c => ({ id: c.userId, username: c.username }));
  const message = JSON.stringify({ type: 'online-users', users: onlineUsers });
  broadcastToRoom(roomId, message);
}

wss.on('connection', async (ws, req) => {
  const query = url.parse(req.url, true).query;
  const token = query.token;
  const roomId = query.roomId;

  if (!token || !roomId) return ws.terminate();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userRecord = await User.findById(decoded.user.id).select('-password');
    if (!userRecord) return ws.terminate();

    // If the room doesn't exist in memory, create it and load its history from DB
    if (!rooms.has(roomId)) {
      const savedState = await CanvasState.findOne({ roomId });
      rooms.set(roomId, {
        clients: new Set(),
        drawingHistory: savedState ? savedState.drawingHistory : [],
      });
    }

    const room = rooms.get(roomId);
    const clientInfo = {
      userId: userRecord._id.toString(),
      username: userRecord.username,
      ws: ws,
    };
    
    room.clients.add(clientInfo);
    console.log(`${clientInfo.username} connected to room ${roomId}`);

    // Immediately send the full, up-to-date history to the new user
    ws.send(JSON.stringify({
      type: 'initial-state',
      payload: room.drawingHistory,
    }));

    broadcastOnlineUsers(roomId);

    ws.on('message', (message) => {
      const messageString = message.toString();
      const data = JSON.parse(messageString);

      // If it's a draw or clear event, update the server's in-memory history
      if (data.type === 'draw') {
        room.drawingHistory.push(data);
      } else if (data.type === 'clear') {
        room.drawingHistory = [];
      }
      
      // Broadcast the message to everyone in the room
      broadcastToRoom(roomId, messageString);
    });

    ws.on('close', () => {
      if (rooms.has(roomId)) {
        const room = rooms.get(roomId);
        room.clients.delete(clientInfo);
        if (room.clients.size === 0) {
          // Optional: Save final state to DB when room is empty
          // const finalState = new CanvasState({ roomId, drawingHistory: room.drawingHistory });
          // await CanvasState.findOneAndUpdate({ roomId }, finalState, { upsert: true });
          rooms.delete(roomId);
          console.log(`Room ${roomId} is empty and has been closed.`);
        } else {
          broadcastOnlineUsers(roomId);
        }
      }
      console.log(`${clientInfo.username} disconnected from room ${roomId}`);
    });

  } catch (err) {
    console.log('Connection rejected:', err.message);
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
