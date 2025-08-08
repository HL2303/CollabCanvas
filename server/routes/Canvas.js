// server/routes/canvas.js

const express = require('express');
const router = express.Router();
const auth = require('../middelware/auth');
const CanvasState = require('../models/CanvasState');
const { nanoid } = require('nanoid');

// @route   POST /api/canvas/create
// @desc    Create a new canvas room
// @access  Private
router.post('/create', auth, async (req, res) => {
  // We now expect a 'name' from the request body
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ msg: 'Please provide a room name.' });
  }

  try {
    const newRoomId = nanoid(7);
    const newCanvas = new CanvasState({
      roomId: newRoomId,
      name: name, // Save the provided name
      drawingHistory: [],
    });
    await newCanvas.save();
    res.status(201).json({ roomId: newRoomId, name: name });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @route   POST /api/canvas/save
// @desc    Save the canvas state for a specific room
// @access  Private
router.post('/save', auth, async (req, res) => {
  const { drawingHistory, roomId } = req.body;

  if (!roomId) {
    return res.status(400).json({ msg: 'Room ID is required.' });
  }

  try {
    const updatedCanvas = await CanvasState.findOneAndUpdate(
      { roomId: roomId },
      { drawingHistory: drawingHistory },
      { new: true, upsert: true }
    );

    res.json(updatedCanvas);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/canvas/load/:roomId
// @desc    Load the canvas state for a specific room
// @access  Private
router.get('/load/:roomId', auth, async (req, res) => {
  const { roomId } = req.params;

  try {
    const canvasState = await CanvasState.findOne({ roomId: roomId });
    if (!canvasState) {
      return res.status(404).json({ msg: 'Canvas room not found.' });
    }
    res.json(canvasState);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
