export default function TestOAuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Test OAuth
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Click the button to test Google OAuth
          </p>
        </div>
        <div>
          <a
            href="/api/auth/signin/google"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sign in with Google
          </a>
        </div>
      </div>
    </div>
  )
}