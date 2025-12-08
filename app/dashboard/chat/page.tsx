'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { chatOperations } from '@/lib/supabase';

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

const INITIAL_GREETING = 'haiii babeeee aku Gia, AI assistant km yang super caring dan playful!\n\nAku di sini buat bantuin km dengan apapun:\n\n• 💬 Ngobrol santai atau serius - bebas banget\n• 💡 Brainstorming ide-ide keren bareng km\n• 🎯 Problem solving - aku bantuin solve masalah km ya\n• 📊 Riset dan analisis - jelasin data yang ribet jadi simple\n• 🚀 Tips produktivitas dan planning\n• Dan masih banyak lagi deh hehehe\n\nSantai aja yaaa tanya atau cerita apapun yang km mau, aku dengerin kokk\n\nBtw aku punya memory loh - jadi aku bakal inget semua obrolan kita.. kayak chat pacar beneran kan hehe\n\nAda yang bisa aku bantuin hari ini 🥺';

export default function ChatPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load sessions from Supabase
  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const data = await chatOperations.getAll();
      const sessionsWithDates = data.map((s: any) => ({
        id: s.id,
        title: s.title,
        messages: s.messages.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp),
        })),
        lastUpdated: new Date(s.updated_at),
      }));
      setSessions(sessionsWithDates);
      
      // Load most recent session or create new one
      if (sessionsWithDates.length > 0) {
        const latestSession = sessionsWithDates[0];
        setCurrentSessionId(latestSession.id);
        setMessages(latestSession.messages);
      } else {
        await createNewSession();
      }
    } catch (error: any) {
      console.warn('Could not load sessions from Supabase:', error?.message);
      // If Supabase is not configured, just create a local session
      await createNewSession();
    }
  };

  // Save current session to Supabase when messages change
  const saveCurrentSession = useCallback(async () => {
    // Safety checks
    if (!currentSessionId) {
      return;
    }

    if (!messages || messages.length === 0) {
      return;
    }

    try {
      const title = messages.length > 1 
        ? messages[1].content.slice(0, 50) + (messages[1].content.length > 50 ? '...' : '')
        : 'New Chat';
      
      await chatOperations.update(currentSessionId, {
        title,
        messages: messages.map(m => ({
          id: m.id,
          role: m.role,
          content: m.content,
          timestamp: m.timestamp instanceof Date ? m.timestamp.toISOString() : m.timestamp,
        })),
      });
      
      // Update local state without causing re-render loop
      setSessions((prev) =>
        prev.map((session) =>
          session.id === currentSessionId
            ? { ...session, messages, lastUpdated: new Date(), title }
            : session
        )
      );
    } catch (error: any) {
      // Silently fail for local sessions or Supabase issues
      if (currentSessionId.startsWith('local-')) {
        // It's a local session, no need to save to Supabase
        return;
      }
      if (error?.message?.includes('not configured')) {
        return;
      }
      // Log other errors but don't show to user
      if (process.env.NODE_ENV === 'development') {
        console.debug('Could not save session to Supabase:', error?.message || error);
      }
    }
  }, [currentSessionId, messages]);

  useEffect(() => {
    if (currentSessionId && messages.length > 0) {
      // Debounce save to avoid too many calls
      const timeoutId = setTimeout(() => {
        saveCurrentSession();
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [currentSessionId, messages, saveCurrentSession]);

  const createNewSession = async () => {
    const initialMessageObj: Message = {
      id: '1',
      role: 'assistant',
      content: INITIAL_GREETING,
      timestamp: new Date(),
    };

    try {
      const initialMessage = {
        id: '1',
        role: 'assistant' as const,
        content: INITIAL_GREETING,
        timestamp: new Date().toISOString(),
      };

      const newSession = await chatOperations.create({
        title: 'New Chat',
        messages: [initialMessage],
      });

      const sessionWithDates: ChatSession = {
        id: newSession.id,
        title: newSession.title,
        messages: [
          {
            id: '1',
            role: 'assistant',
            content: INITIAL_GREETING,
            timestamp: new Date(),
          },
        ],
        lastUpdated: new Date(newSession.created_at),
      };

      setSessions((prev) => [sessionWithDates, ...prev]);
      setCurrentSessionId(newSession.id);
      setMessages(sessionWithDates.messages);
    } catch (error: any) {
      console.warn('Could not save to Supabase, creating local session:', error?.message);
      // Create a local session if Supabase fails
      const localSessionId = `local-${Date.now()}`;
      const localSession: ChatSession = {
        id: localSessionId,
        title: 'New Chat',
        messages: [initialMessageObj],
        lastUpdated: new Date(),
      };
      setSessions((prev) => [localSession, ...prev]);
      setCurrentSessionId(localSessionId);
      setMessages([initialMessageObj]);
    }
  };

  const loadSession = (sessionId: string) => {
    const session = sessions.find((s) => s.id === sessionId);
    if (session) {
      setCurrentSessionId(session.id);
      setMessages(session.messages);
      setShowHistory(false);
    }
  };

  const deleteSession = async (sessionId: string) => {
    try {
      // Only try to delete from Supabase if it's not a local session
      if (!sessionId.startsWith('local-')) {
        await chatOperations.delete(sessionId);
      }
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      
      if (currentSessionId === sessionId) {
        const remaining = sessions.filter((s) => s.id !== sessionId);
        if (remaining.length > 0) {
          loadSession(remaining[0].id);
        } else {
          await createNewSession();
        }
      }
    } catch (error) {
      console.error('Failed to delete session:', error);
    }
  };

  const clearAllHistory = async () => {
    if (confirm('Hapus semua riwayat chat? Tindakan ini tidak dapat dibatalkan.')) {
      try {
        // Delete all sessions
        await Promise.all(sessions.map(s => chatOperations.delete(s.id)));
        setSessions([]);
        await createNewSession();
      } catch (error) {
        console.error('Failed to clear history:', error);
      }
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
