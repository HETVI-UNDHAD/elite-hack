import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

const CommonChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const savedMessages = JSON.parse(localStorage.getItem('commonChat') || '[]');
    setMessages(savedMessages);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      text: newMessage,
      sender: user.name,
      userId: user.id,
      timestamp: new Date().toISOString(),
      read: false
    };

    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    localStorage.setItem('commonChat', JSON.stringify(updatedMessages));
    setNewMessage('');

    // Mark as read after 1 second
    setTimeout(() => {
      const readMessages = updatedMessages.map(m => m.id === message.id ? {...m, read: true} : m);
      setMessages(readMessages);
      localStorage.setItem('commonChat', JSON.stringify(readMessages));
    }, 1000);
  };

  const getNameColor = (name) => {
    const colors = ['text-blue-600', 'text-purple-600', 'text-pink-600', 'text-indigo-600', 'text-teal-600'];
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-lg border border-blue-100" style={{ height: 'calc(100vh - 100px)' }}>
      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-4 rounded-t-lg">
        <h3 className="font-bold text-lg">💬 Common Chat</h3>
        <p className="text-xs text-blue-100">Chat with all users</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <div className="text-4xl mb-2">💬</div>
            <p className="text-sm">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.userId === user.id ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-lg p-3 ${
                msg.userId === user.id 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {msg.userId !== user.id && (
                  <p className={`text-xs font-bold mb-1 ${getNameColor(msg.sender)}`}>{msg.sender}</p>
                )}
                <p className="text-sm break-words">{msg.text}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className={`text-xs ${msg.userId === user.id ? 'text-blue-100' : 'text-gray-500'}`}>
                    {formatTime(msg.timestamp)}
                  </p>
                  {msg.userId === user.id && (
                    <span className="text-xs ml-2">{msg.read ? '✓✓' : '✓'}</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommonChat;
