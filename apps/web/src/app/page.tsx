export default function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome to HDS Pseudo
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Clean Architecture Monorepo
          </p>
          <div className="space-x-4">
            <a
              href="/login"
              className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Login
            </a>
            <a
              href="/register"
              className="inline-block px-6 py-3 bg-gray-200 text-gray-900 font-medium rounded-lg hover:bg-gray-300 transition-colors"
            >
              Register
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
