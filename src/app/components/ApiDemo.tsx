'use client';

import { useState } from 'react';

export default function ApiDemo() {
  const [token, setToken] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [customId, setCustomId] = useState<string>('');
  const [mediaId, setMediaId] = useState<string>('');
  const [newName, setNewName] = useState<string>('');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Handle signup
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const userData = {
        username: formData.get('username'),
        email: formData.get('email'),
        password: formData.get('password'),
      };
      
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const data = await res.json();
      setResponse(data);
      
      if (data.token) {
        setToken(data.token);
      }
    } catch (error) {
      setResponse({ error: 'An error occurred during signup' });
    } finally {
      setLoading(false);
    }
  };

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const userData = {
        email: formData.get('email'),
        password: formData.get('password'),
      };
      
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const data = await res.json();
      setResponse(data);
      
      if (data.token) {
        setToken(data.token);
      }
    } catch (error) {
      setResponse({ error: 'An error occurred during login' });
    } finally {
      setLoading(false);
    }
  };

  // Handle file upload
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !token) return;
    
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (customId) {
        formData.append('customId', customId);
      }
      
      const res = await fetch('/api/media/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      
      const data = await res.json();
      setResponse(data);
      
      if (data.media?.id) {
        setMediaId(data.media.id);
      }
    } catch (error) {
      setResponse({ error: 'An error occurred during upload' });
    } finally {
      setLoading(false);
    }
  };

  // Handle file deletion
  const handleDelete = async () => {
    if (!mediaId || !token) return;
    
    setLoading(true);
    
    try {
      const res = await fetch(`/api/media/delete?id=${mediaId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await res.json();
      setResponse(data);
      
      if (data.success) {
        setMediaId('');
      }
    } catch (error) {
      setResponse({ error: 'An error occurred during deletion' });
    } finally {
      setLoading(false);
    }
  };

  // Handle file rename
  const handleRename = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaId || !newName || !token) return;
    
    setLoading(true);
    
    try {
      const res = await fetch('/api/media/rename', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: mediaId,
          newName,
        }),
      });
      
      const data = await res.json();
      setResponse(data);
    } catch (error) {
      setResponse({ error: 'An error occurred during rename' });
    } finally {
      setLoading(false);
    }
  };

  // Handle file replacement
  const handleReplace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !mediaId || !token) return;
    
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('id', mediaId);
      
      const res = await fetch('/api/media/replace', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      
      const data = await res.json();
      setResponse(data);
    } catch (error) {
      setResponse({ error: 'An error occurred during replacement' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">API Demo</h2>
      
      {/* Authentication Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Signup Form */}
        <div className="p-4 border rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Signup</h3>
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <input 
                type="text" 
                name="username" 
                className="w-full p-2 border rounded" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input 
                type="email" 
                name="email" 
                className="w-full p-2 border rounded" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input 
                type="password" 
                name="password" 
                className="w-full p-2 border rounded" 
                required 
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Signup'}
            </button>
          </form>
        </div>
        
        {/* Login Form */}
        <div className="p-4 border rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Login</h3>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input 
                type="email" 
                name="email" 
                className="w-full p-2 border rounded" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input 
                type="password" 
                name="password" 
                className="w-full p-2 border rounded" 
                required 
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
      
      {/* Token Display */}
      {token && (
        <div className="mb-8 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Your Token</h3>
          <p className="text-xs break-all">{token}</p>
        </div>
      )}
      
      {/* Media Operations Section */}
      {token && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Upload Form */}
          <div className="p-4 border rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Upload Media</h3>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">File</label>
                <input 
                  type="file" 
                  onChange={(e) => setFile(e.target.files?.[0] || null)} 
                  className="w-full p-2 border rounded" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Custom ID (optional)</label>
                <input 
                  type="text" 
                  value={customId}
                  onChange={(e) => setCustomId(e.target.value)} 
                  className="w-full p-2 border rounded" 
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600"
                disabled={loading || !file}
              >
                {loading ? 'Uploading...' : 'Upload'}
              </button>
            </form>
          </div>
          
          {/* Media Operations */}
          <div className="p-4 border rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Media Operations</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Media ID</label>
                <input 
                  type="text" 
                  value={mediaId}
                  onChange={(e) => setMediaId(e.target.value)} 
                  className="w-full p-2 border rounded" 
                  placeholder="Enter media ID" 
                />
              </div>
              
              {/* Delete Button */}
              <button 
                onClick={handleDelete} 
                className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
                disabled={loading || !mediaId}
              >
                {loading ? 'Processing...' : 'Delete Media'}
              </button>
              
              {/* Rename Form */}
              <div className="mt-4">
                <h4 className="text-lg font-medium mb-2">Rename Media</h4>
                <form onSubmit={handleRename} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">New Name</label>
                    <input 
                      type="text" 
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)} 
                      className="w-full p-2 border rounded" 
                      required 
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
                    disabled={loading || !mediaId || !newName}
                  >
                    {loading ? 'Processing...' : 'Rename'}
                  </button>
                </form>
              </div>
              
              {/* Replace Form */}
              <div className="mt-4">
                <h4 className="text-lg font-medium mb-2">Replace Media</h4>
                <form onSubmit={handleReplace} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">New File</label>
                    <input 
                      type="file" 
                      onChange={(e) => setFile(e.target.files?.[0] || null)} 
                      className="w-full p-2 border rounded" 
                      required 
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="w-full bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600"
                    disabled={loading || !mediaId || !file}
                  >
                    {loading ? 'Processing...' : 'Replace'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Response Display */}
      {response && (
        <div className="p-4 bg-gray-100 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">API Response</h3>
          <pre className="bg-black text-green-400 p-4 rounded overflow-x-auto">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}