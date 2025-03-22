'use client';
import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Navbar from './Navbar';

const socket = io('http://localhost:4000');

const Home = () => {
  const [sessionId, setSessionId] = useState('');
  const [messages, setMessages] = useState<{ user: string; message: string }[]>([]);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState('');
  const [sessionActive, setSessionActive] = useState(false);

  useEffect(() => {
    const handleMessage = (msg: { user: string; message: string; sessionId: string }) => {
      if (msg.sessionId === sessionId) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    const handleSessionDeleted = () => {
      setMessages([]);
      setSessionActive(false);
      setSessionId('');
      alert('Session has been deleted for everyone. The page will refresh.');
      window.location.reload();
    };

    socket.on('receive-message', handleMessage);
    socket.on('session-deleted', handleSessionDeleted);

    return () => {
      socket.off('receive-message', handleMessage);
      socket.off('session-deleted', handleSessionDeleted);
    };
  }, [sessionId]);

  const createSession = () => {
    const newSessionId = Math.random().toString(36).substr(2, 9);
    setSessionId(newSessionId);
    socket.emit('create-session', newSessionId);
    setSessionActive(true);
  };

  const joinSession = () => {
    if (sessionId.trim()) {
      socket.emit('join-session', { sessionId, user });
      setSessionActive(true);
    }
  };

  const sendMessage = () => {
    if (message.trim() && user.trim()) {
      const msg = { user, message, sessionId };
      socket.emit('send-message', msg); // Emit to server
      setMessage(''); // Clear input after sending
    }
  };

  const deleteSession = () => {
    socket.emit('delete-session', sessionId);
    setMessages([]);
    setSessionActive(false);
    setSessionId('');
  };

  return (
    <div>
      <Navbar />
      <div className="p-6 bg-black text-neon-green min-h-screen font-mono">
        {!sessionActive ? (
          <>
            <button onClick={createSession} className="mb-4 p-2 bg-purple-600 hover:bg-purple-700 rounded">Create Session</button>
            <input
              type="text"
              placeholder="Session ID"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              className="flex items-center p-2 mb-4 bg-gray-800 text-neon-green w-full border-b-2 border-neon-green"
            />
            <button onClick={joinSession} className="ml-2 p-2 bg-green-600 hover:bg-green-700 rounded">Join Session</button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Username"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="p-2 mb-4 bg-gray-800 text-neon-green w-full border-b-2 border-neon-green"
            />
            <input
              type="text"
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="p-2 mb-4 bg-gray-800 text-neon-green w-full border-b-2 border-neon-green"
            />
            <button onClick={sendMessage} className="ml-2 p-2 bg-blue-600 hover:bg-blue-700 rounded">Send</button>
            <button onClick={deleteSession} className="ml-2 p-2 bg-red-600 hover:bg-red-700 rounded">Delete Session</button>
            <h2 className="mt-6 text-xl text-neon-green">Session ID: {sessionId}</h2>
            <div className="mt-4 space-y-2">
              {messages.map((msg, index) => (
                <p key={index} className={msg.user === user ? 'text-right text-neon-green' : 'text-left text-neon-yellow'}>
                  <strong>{msg.user || 'Unknown'}:</strong> {msg.message || 'No message'}
                </p>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
