// src/components/OnlineUsers.jsx
import React from 'react';
import { User } from 'lucide-react';

const OnlineUsers = ({ users }) => {
  return (
    <div className="w-64 p-4 bg-gray-900/50 border border-gray-800 rounded-lg shadow-lg">
      <h3 className="text-lg font-bold text-white mb-4 border-b border-gray-700 pb-2">
        Online Users ({users.length})
      </h3>
      <ul>
        {users.map((user) => (
          <li key={user.id} className="flex items-center mb-2 p-1">
            <User className="w-4 h-4 text-gray-400 mr-3" />
            <span className="text-gray-300">{user.username}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OnlineUsers;
