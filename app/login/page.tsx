'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import logoImg from '../../public/logo.png';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      localStorage.setItem('currentUser', 'Admin');
      setError('');
      router.push('/dashboard');
    } else {
      setError('Invalid username or password!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-100">
        <div className="text-center mb-8 flex flex-col items-center justify-center">
          <Image
            alt="Logo"
            src={logoImg}
            className="w-full max-w-[280px] h-auto mb-6 object-contain translate-x-4"
          />
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Login</h1>
          <p className="text-gray-500 mt-2 text-sm">Enter your details to access your account.</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center border border-red-100">
              {error}
            </div>
          )}

          <div className="relative">
            <User className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#aa2d29] focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#aa2d29] focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>



          <button
            type="submit"
            className="w-full bg-[#aa2d29] text-white font-medium py-3 rounded-lg hover:bg-[#8e2622] transition-all duration-200 active:scale-[0.98] shadow-md"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
