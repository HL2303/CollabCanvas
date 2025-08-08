// src/pages/CollabCanvas.jsx
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Canvas from '../components/Canvas';
import OnlineUsers from '../components/OnlineUsers';
import Navbar from '../components/Navbar';
import { Save, Copy } from 'lucide-react';

const CollabCanvas = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [token, setToken] = useState(null);
  const [roomName, setRoomName] = useState('Loading...');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [drawingHistory, setDrawingHistory] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [inviteButtonText, setInviteButtonText] = useState('Invite');
  const socketRef = useRef(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      navigate('/login');
    } else {
      setToken(storedToken);
    }
  }, [navigate]);

  const clearCanvas = useCallback(() => {
    setDrawingHistory([]);
  }, []);

  useEffect(() => {
    if (!token || !roomId) return;

    const loadCanvas = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/canvas/load/${roomId}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setDrawingHistory(data.drawingHistory || []);
          setRoomName(data.name);
          localStorage.setItem('recentRoom', JSON.stringify({ name: data.name, roomId: data.roomId }));
        } else {
          setError('Room not found or you do not have access.');
        }
      } catch (err) {
        setError('Error loading canvas.');
      }
    };
    loadCanvas();

    const socket = new WebSocket(`ws://localhost:3000?token=${token}&roomId=${roomId}`);
    socketRef.current = socket;

    socket.onopen = () => console.log(`WebSocket connection established for room ${roomId}`);
    socket.onclose = () => console.log('WebSocket connection closed');

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'online-users') {
            setOnlineUsers(data.users);
        } else if (data.type === 'draw') {
            setDrawingHistory((prev) => [...prev, data]);
        } else if (data.type === 'clear') {
            clearCanvas();
        }
    };

    return () => socket.close();
  }, [token, roomId, navigate, clearCanvas]);

  const handleSave = async () => {
    if (!token || !roomId) return;
    setIsSaving(true);
    try {
      await fetch('http://localhost:3000/api/canvas/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ drawingHistory, roomId }),
      });
      alert('Canvas saved successfully!');
    } catch (err) {
      alert('Failed to save canvas.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInvite = () => {
    const inviteLink = window.location.href;
    navigator.clipboard.writeText(inviteLink);
    setInviteButtonText('Copied!');
    setTimeout(() => setInviteButtonText('Invite'), 2000);
  };
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A0A0A] text-white">
        <p className="text-2xl text-red-500 mb-4">{error}</p>
        <Link to="/dashboard" className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">
          Back to Dashboard
        </Link>
      </div>
    );
  }
  
  if (!token) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-white">
      <Navbar />
       <div className="w-full bg-gray-900/50 border-b border-gray-800 p-3 px-8 flex justify-between items-center gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">{roomName}</h2>
          <p className="text-xs text-gray-400 font-mono">ID: {roomId}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleInvite}
            className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            <Copy className="w-4 h-4" />
            {inviteButtonText}
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-500"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
      <main className="flex-grow w-full flex justify-center items-start p-8 gap-8">
        <Canvas 
          socket={socketRef.current} 
          drawingHistory={drawingHistory}
        />
        <OnlineUsers users={onlineUsers} />
      </main>
    </div>
  );
};

export default CollabCanvas;
