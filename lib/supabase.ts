
// Supabase Project Credentials
const SUPABASE_URL = 'https://tjmztkfhbbytytthaoei.supabase.co';
// Using the key provided by the user
const SUPABASE_KEY = 'sb_publishable_N_VoHqkA5lNERhp6ALkxvQ_q2AVsKRa'; 

/**
 * Generic helper for Supabase REST API calls
 */
export const supabaseRequest = async (table: string, method: string = 'GET', body?: any) => {
  try {
    const url = `${SUPABASE_URL}/rest/v1/${table}`;
    
    const headers: Record<string, string> = {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
    };

    // If we are creating data, we usually don't need the full object back for this app's logic
    if (method === 'POST') {
      headers['Prefer'] = 'return=minimal';
    }

    const options: RequestInit = {
      method,
      headers,
    };

    if (body && (method === 'POST' || method === 'PATCH' || method === 'PUT')) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorData = await response.text();
      console.warn(`Supabase API Error (${response.status}):`, errorData);
      return { error: true, message: errorData, status: response.status };
    }

    // Success - handle empty responses from 'return=minimal'
    const text = await response.text();
    return text ? JSON.parse(text) : { success: true };
  } catch (error) {
    console.error('Supabase Connection Failed:', error);
    return { error: true, message: 'Connection failed' };
  }
};
