import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create Supabase client with safety check
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey && supabase);
};

// Database Types
export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  due_date: string | null;
  category: string;
  created_at: string;
  updated_at: string;
  user_id?: string;
}

export interface Report {
  id: string;
  title: string;
  content: string;
  author: string;
  doc_number: string;
  template_type: string;
  work_category: string;
  created_at: string;
  updated_at: string;
  user_id?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: any[];
  created_at: string;
  updated_at: string;
  user_id?: string;
}

// Task Operations
export const taskOperations = {
  async getAll() {
    if (!supabase) throw new Error('Supabase is not configured');
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Task[];
  },

  async create(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) {
    if (!supabase) throw new Error('Supabase is not configured');
    const { data, error } = await supabase
      .from('tasks')
      .insert([task])
      .select()
      .single();
    
    if (error) throw error;
    return data as Task;
  },

  async update(id: string, updates: Partial<Task>) {
    if (!supabase) throw new Error('Supabase is not configured');
    const { data, error } = await supabase
      .from('tasks')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Task;
  },

  async delete(id: string) {
    if (!supabase) throw new Error('Supabase is not configured');
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },
};

// Report Operations
export const reportOperations = {
  async getAll() {
    if (!supabase) throw new Error('Supabase is not configured');
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Report[];
  },

  async create(report: Omit<Report, 'id' | 'created_at' | 'updated_at'>) {
    if (!supabase) throw new Error('Supabase is not configured');
    const { data, error } = await supabase
      .from('reports')
      .insert([report])
      .select()
      .single();
    
    if (error) throw error;
    return data as Report;
  },

  async delete(id: string) {
    if (!supabase) throw new Error('Supabase is not configured');
    const { error } = await supabase
      .from('reports')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },
};

// Chat Session Operations
export const chatOperations = {
  async getAll() {
    if (!supabase) throw new Error('Supabase is not configured');
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .order('updated_at', { ascending: false });
    
    if (error) throw error;
    return data as ChatSession[];
  },

  async create(session: Omit<ChatSession, 'id' | 'created_at' | 'updated_at'>) {
    if (!supabase) throw new Error('Supabase is not configured');
    const { data, error } = await supabase
      .from('chat_sessions')
      .insert([session])
      .select()
      .single();
    
    if (error) throw error;
    return data as ChatSession;
  },

  async update(id: string, updates: Partial<ChatSession>) {
    if (!supabase) throw new Error('Supabase is not configured');
    const { data, error } = await supabase
      .from('chat_sessions')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as ChatSession;
  },

  async delete(id: string) {
    if (!supabase) throw new Error('Supabase is not configured');
    const { error } = await supabase
      .from('chat_sessions')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },
};
