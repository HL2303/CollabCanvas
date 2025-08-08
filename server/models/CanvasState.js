// server/models/CanvasState.js
const mongoose = require('mongoose');

const CanvasStateSchema = new mongoose.Schema({
  // A unique identifier for our canvas room.
  roomId: {
    type: String,
    required: true,
    unique: true,
  },
  // The user-provided name for the room.
  name: {
    type: String,
    required: [true, 'Please provide a room name'],
    trim: true,
  },
  // This field will store the entire array of drawing actions for the room.
  drawingHistory: {
    type: Array,
    default: [],
  },
}, { timestamps: true });

const CanvasState = mongoose.model('CanvasState', CanvasStateSchema);

module.exports = CanvasState;
