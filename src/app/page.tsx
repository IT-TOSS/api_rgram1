import ApiDemo from './components/ApiDemo';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <h1 className="text-4xl font-bold mb-8">Swayam Media API</h1>
      <p className="text-xl mb-4 text-center">API endpoints for media management with authentication</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 mb-12 w-full max-w-4xl">
        <div className="p-6 border rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Authentication</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><code>/api/auth/signup</code> - Register a new user</li>
            <li><code>/api/auth/login</code> - Login and get token</li>
          </ul>
        </div>
        <div className="p-6 border rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Media Management</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><code>/api/media/upload</code> - Upload media files</li>
            <li><code>/api/media/delete</code> - Delete media files</li>
            <li><code>/api/media/rename</code> - Rename media files</li>
            <li><code>/api/media/replace</code> - Replace media files</li>
          </ul>
        </div>
      </div>
      
      {/* API Demo Component */}
      <div className="w-full max-w-4xl">
        <ApiDemo />
      </div>
    </main>
  );
}