// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate, Link } from 'react-router-dom';
import DashboardCard from '../components/Card';
import { Clock, PlusCircle, LogIn , LayoutGrid } from 'lucide-react';


const Dashboard = () => {
  const navigate = useNavigate();
  const [joinRoomId, setJoinRoomId] = useState('');
  const [newRoomName, setNewRoomName] = useState('');
  const [error, setError] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [recentRoom, setRecentRoom] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const lastRoom = localStorage.getItem('recentRoom');
    if (lastRoom) {
      setRecentRoom(JSON.parse(lastRoom));
    }
  }, []);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!newRoomName.trim()) {
      return setError('Please enter a name for your new room.');
    }
    setIsCreating(true);
    setError('');
    try {
      const response = await fetch('http://localhost:3000/api/canvas/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newRoomName }),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('recentRoom', JSON.stringify({ name: data.name, roomId: data.roomId }));
        navigate(`/canvas/${data.roomId}`);
      } else {
        setError('Failed to create a new room. Please try again.');
      }
    } catch (err) {
      setError('A server error occurred. Please try again later.');
    }
    setIsCreating(false);
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (joinRoomId.trim()) {
      navigate(`/canvas/${joinRoomId.trim()}`);
    } else {
      setError('Please enter a valid Room ID.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Navbar />
      <main className="container mx-auto py-16 px-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Your Dashboard</h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Quick Access */}
          {recentRoom && (
            <DashboardCard
              icon={Clock}
              title="Quick Access"
              description={`Jump back into: ${recentRoom.name}`}
              glowColor="purple"
            >
              <Link
                to={`/canvas/${recentRoom.roomId}`}
                className="inline-block mt-4 px-6 py-2 font-semibold text-white bg-purple-600 rounded-md hover:bg-purple-700"
              >
                Rejoin Room
              </Link>
            </DashboardCard>
          )}

          {/* Start a New Session */}
          <DashboardCard
            icon={PlusCircle}
            title="Start a New Session"
            description="Create a new canvas room to begin collaborating."
            glowColor="green"
          >
            <form onSubmit={handleCreateRoom} className="flex flex-col sm:flex-row gap-3 mt-4">
              <input
                type="text"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                placeholder="Enter a room name"
                className="flex-grow px-4 py-2 text-white bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 border border-gray-700"
              />
              <button
                type="submit"
                disabled={isCreating}
                className="px-6 py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-500 shrink-0"
              >
                {isCreating ? 'Creating...' : 'Create'}
              </button>
            </form>
          </DashboardCard>
          
          {/* New "Your Rooms" Card */}
          <DashboardCard
            icon={LayoutGrid}
            title="Your Rooms"
            description="View all the rooms you have created or joined."
          >
             <p className="text-sm text-gray-500 mt-4 italic">(Feature coming soon)</p>
          </DashboardCard>


          {/* Join Existing Session */}
          <DashboardCard
            icon={LogIn}
            title="Join an Existing Session"
            description="Enter a room ID to jump into an active canvas."
            className="md:col-span-2"
          >
            <form onSubmit={handleJoinRoom} className="flex flex-col sm:flex-row gap-3 mt-4">
              <input
                type="text"
                value={joinRoomId}
                onChange={(e) => setJoinRoomId(e.target.value)}
                placeholder="Enter Room ID (e.g., abc1234)"
                className="flex-grow px-4 py-2 text-white bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700"
              />
              <button
                type="submit"
                className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 shrink-0"
              >
                Join
              </button>
            </form>
          </DashboardCard>
        </div>
        {error && <p className="text-center text-sm text-red-400 mt-6">{error}</p>}
      </main>
    </div>
  );
};

export default Dashboard;
