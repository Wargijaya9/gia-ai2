'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  lastUpdated: Date;
}

const STORAGE_KEY = 'gia_chat_sessions';

export default function ChatPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load sessions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsedSessions = JSON.parse(saved);
      // Convert timestamp strings back to Date objects
      const sessionsWithDates = parsedSessions.map((s: any) => ({
        ...s,
        lastUpdated: new Date(s.lastUpdated),
        messages: s.messages.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp),
        })),
      }));
      setSessions(sessionsWithDates);
      
      // Load most recent session or create new one
      if (sessionsWithDates.length > 0) {
        const latestSession = sessionsWithDates[0];
        setCurrentSessionId(latestSession.id);
        setMessages(latestSession.messages);
      } else {
        createNewSession();
      }
    } else {
      createNewSession();
    }
  }, []);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    }
  }, [sessions]);

  // Update current session messages
  useEffect(() => {
    if (currentSessionId && messages.length > 0) {
      setSessions((prev) =>
        prev.map((session) =>
          session.id === currentSessionId
            ? {
                ...session,
                messages,
                lastUpdated: new Date(),
                title: session.title === 'New Chat' && messages.length > 1
                  ? messages[1].content.slice(0, 50) + (messages[1].content.length > 50 ? '...' : '')
                  : session.title,
              }
            : session
        )
      );
    }
  }, [messages, currentSessionId]);

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [
        {
          id: '1',
          role: 'assistant',
          content: 'haiii babeeee aku Gia, AI assistant km yang super caring dan playful!\n\nAku di sini buat bantuin km dengan apapun:\n\n• 💬 Ngobrol santai atau serius - bebas banget\n• 💡 Brainstorming ide-ide keren bareng km\n• 🎯 Problem solving - aku bantuin solve masalah km ya\n• 📊 Riset dan analisis - jelasin data yang ribet jadi simple\n• 🚀 Tips produktivitas dan planning\n• Dan masih banyak lagi deh hehehe\n\nSantai aja yaaa tanya atau cerita apapun yang km mau, aku dengerin kokk\n\nBtw aku punya memory loh - jadi aku bakal inget semua obrolan kita.. kayak chat pacar beneran kan hehe\n\nAda yang bisa aku bantuin hari ini 🥺',
          timestamp: new Date(),
        },
      ],
      lastUpdated: new Date(),
    };
    setSessions((prev) => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setMessages(newSession.messages);
  };

  const loadSession = (sessionId: string) => {
    const session = sessions.find((s) => s.id === sessionId);
    if (session) {
      setCurrentSessionId(session.id);
      setMessages(session.messages);
      setShowHistory(false);
    }
  };

  const deleteSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    if (currentSessionId === sessionId) {
      const remaining = sessions.filter((s) => s.id !== sessionId);
      if (remaining.length > 0) {
        loadSession(remaining[0].id);
      } else {
        createNewSession();
      }
    }
  };

  const clearAllHistory = () => {
    if (confirm('Hapus semua riwayat chat? Tindakan ini tidak dapat dibatalkan.')) {
      localStorage.removeItem(STORAGE_KEY);
      setSessions([]);
      createNewSession();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          userMessage: input,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Maaf, terjadi error: ' + error.message,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickPrompts = [
    '💡 Berikan ide untuk meningkatkan produktivitas tim',
    '📊 Analisis tren teknologi terkini',
    '🎯 Buatkan strategi marketing untuk produk baru',
    '💻 Explain konsep clean code',
  ];

  return (
    <div className="h-screen flex bg-gray-50">
      {/* History Sidebar */}
      <div
        className={`${
          showHistory ? 'w-80' : 'w-0'
        } bg-white border-r border-gray-200 transition-all duration-300 overflow-hidden flex flex-col`}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">💾 Riwayat Chat</h2>
            <button
              onClick={() => setShowHistory(false)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              ✕
            </button>
          </div>
          <button
            onClick={createNewSession}
            className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium"
          >
            ➕ Chat Baru
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`p-3 rounded-lg cursor-pointer transition-all border ${
                session.id === currentSessionId
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div onClick={() => loadSession(session.id)}>
                <p className="font-medium text-sm text-gray-900 truncate">
                  {session.title}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-gray-500">
                    {session.messages.length} pesan
                  </p>
                  <p className="text-xs text-gray-400">
                    {session.lastUpdated.toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteSession(session.id);
                }}
                className="mt-2 text-xs text-red-600 hover:text-red-700 hover:underline"
              >
                🗑️ Hapus
              </button>
            </div>
          ))}
        </div>

        {sessions.length > 0 && (
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={clearAllHistory}
              className="w-full px-4 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-all"
            >
              🗑️ Hapus Semua Riwayat
            </button>
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">💬 Chat dengan Gia</h1>
              <p className="text-gray-600 mt-1">
                Asisten virtual kamu yang santai tapi helpful! Ngobrol yuk ✨
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all font-medium text-gray-700"
              >
                {showHistory ? '📋 Tutup Riwayat' : '📋 Riwayat'}
              </button>
              <button
                onClick={createNewSession}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium"
              >
                ➕ Chat Baru
              </button>
            </div>
          </div>
        </div>

      {/* Chat Container */}
      <div className="flex-1 overflow-hidden flex flex-col max-w-5xl mx-auto w-full">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-6 py-4 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-white shadow-md text-gray-800 border border-gray-100'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">
                    {message.role === 'user' ? '👤' : '🤖'}
                  </div>
                  <div className="flex-1">
                    <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    <p
                      className={`text-xs mt-2 ${
                        message.role === 'user' ? 'text-white/70' : 'text-gray-400'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white shadow-md rounded-2xl px-6 py-4 border border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="text-2xl">🤖</div>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        {messages.length === 1 && (
          <div className="px-6 pb-4">
            <p className="text-sm text-gray-600 mb-3 font-medium">Coba tanyakan:</p>
            <div className="grid grid-cols-2 gap-2">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(prompt.replace(/^[^\s]+\s/, ''))}
                  className="text-left p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all text-sm"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 bg-white p-6">
          <div className="flex gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ketik pesan Anda... (Enter untuk kirim, Shift+Enter untuk baris baru)"
              className="flex-1 resize-none border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="px-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold shadow-lg hover:shadow-xl"
            >
              {isLoading ? '...' : 'Kirim'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
