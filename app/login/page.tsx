'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Lock, Eye, EyeOff, Mail, Phone, CheckCircle2, UserPlus, LogIn, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import logoImg from '../../public/logo.png';

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [step, setStep] = useState<1 | 2>(1);

  // Common email state
  const [email, setEmail] = useState('');

  // Sign in state
  const [password, setPassword] = useState('');

  // Register additional state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    setStep(2);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.status === 'success') {
        localStorage.setItem('sanctum_token', data.token);
        const user = data.user || {};
        const role = data.role || 'customer';

        if (user.phone) localStorage.setItem('currentUserPhone', user.phone);
        if (user.profile_pic) localStorage.setItem('profilePic', user.profile_pic);

        if (role === 'admin') {
          localStorage.setItem('currentUser', user.name || email);
          localStorage.setItem('currentUserEmail', user.email || email);
          localStorage.setItem('currentUserRole', 'Admin');
          localStorage.setItem('userRole', 'admin');
          router.push('/dashboard');
        } else {
          localStorage.setItem('currentCustomer', user.name || email);
          localStorage.setItem('currentCustomerEmail', user.email || email);
          localStorage.setItem('currentUserRole', 'VIP Guest');
          localStorage.setItem('userRole', 'customer');

          const nameParts = (user.name || '').split(' ');
          localStorage.setItem('customerProfile', JSON.stringify({
            firstName: nameParts[0] || '',
            lastName: nameParts.slice(1).join(' ') || '',
            email: user.email || email,
            phone: user.phone || '',
          }));

          router.push('/portal');
        }
      } else {
        setError(data.message || 'Invalid email or password.');
      }
    } catch {
      setError('Cannot connect to server. Please check your connection.');
    } finally {

      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    if (regPassword !== confirmPassword) {
      setError('Passwords do not match. Please try again.');
      return;
    }
    if (regPassword.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }
    setLoading(true);

    try {
      const res = await fetch('http://127.0.0.1:8000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone,
          password: regPassword,
        }),
      });

      const data = await res.json();

      if (res.ok && data.status === 'success') {
        localStorage.setItem('sanctum_token', data.token);
        const user = data.user || {};
        localStorage.setItem('currentCustomer', user.name || `${firstName} ${lastName}`.trim());
        localStorage.setItem('currentCustomerEmail', user.email || email);
        localStorage.setItem('currentUserRole', 'VIP Guest');
        localStorage.setItem('userRole', 'customer');

        setSuccessMsg('Account created successfully! Redirecting...');
        setTimeout(() => {
          router.push('/portal');
        }, 1000);
      } else {
        // Surface backend validation errors (e.g. duplicate email)
        if (data.errors) {
          const messages = Object.values(data.errors).flat().join(' ');
          setError(messages);
        } else {
          setError(data.message || 'Registration failed. Please try again.');
        }
      }
    } catch {
      setError('Cannot connect to server. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-900 to-[#2a0e0d] p-4">
      <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100/80">
        
        {/* Logo */}
        <div className="text-center mb-6 flex flex-col items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/admin_logo.png"
            alt="TRANSFER VIP Logo"
            className="w-[210px] h-auto mb-4 object-contain"
          />
        </div>

        {/* Top Tab Switcher: Sign In vs Register */}
        <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 ${
              mode === 'login' ? 'bg-[#aa2d29] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(''); setSuccessMsg(''); }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 ${
              mode === 'register' ? 'bg-[#aa2d29] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create Account</span>
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-semibold text-center border border-red-200/60 mb-5">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-50 text-emerald-700 p-3 rounded-xl text-xs font-semibold text-center border border-emerald-200/60 mb-5 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* STEP 1: EMAIL FIRST */}
        {step === 1 ? (
          <form onSubmit={handleNextStep} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#aa2d29]/20 focus:border-[#aa2d29] bg-gray-50/50 hover:bg-white text-gray-900"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#aa2d29] text-white font-bold py-3 rounded-xl hover:bg-[#8e2622] active:scale-[0.98] transition-colors shadow-md shadow-[#aa2d29]/20 text-sm mt-2"
            >
              Next
            </button>
          </form>
        ) : (
          /* STEP 2: PASSWORD (IF SIGN IN) OR FULL REGISTRATION FORM (IF REGISTER) */
          <div>
            {/* Display Entered Email with Back/Change option */}
            <div className="relative mb-4">
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400 z-10" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-16 py-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#aa2d29]/20 focus:border-[#aa2d29] bg-gray-50/50 hover:bg-white text-gray-900 font-medium"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setStep(1)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#aa2d29] font-bold hover:underline shrink-0 z-10"
              >
                Change
              </button>
            </div>

            {mode === 'login' ? (
              /* SIGN IN STEP 2: PASSWORD */
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#aa2d29]/20 focus:border-[#aa2d29] bg-gray-50/50 hover:bg-white text-gray-900"
                      required
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#aa2d29] text-white font-bold py-3 rounded-xl hover:bg-[#8e2622] active:scale-[0.98] transition-colors shadow-md shadow-[#aa2d29]/20 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                >
                  {loading ? 'Authenticating...' : 'Sign In'}
                </button>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => setError('To reset your password, please contact support.')}
                    className="text-xs text-gray-400 hover:text-[#aa2d29] transition-colors font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
              </form>
            ) : (
              /* REGISTER STEP 2: DETAILS & PASSWORD */
              <form onSubmit={handleRegister} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#aa2d29]/20 focus:border-[#aa2d29] bg-gray-50/50 hover:bg-white text-gray-900"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#aa2d29]/20 focus:border-[#aa2d29] bg-gray-50/50 hover:bg-white text-gray-900"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Phone Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#aa2d29]/20 focus:border-[#aa2d29] bg-gray-50/50 hover:bg-white text-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#aa2d29]/20 focus:border-[#aa2d29] bg-gray-50/50 hover:bg-white text-gray-900"
                      required
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 bg-gray-50/50 hover:bg-white text-gray-900 transition-colors ${
                        confirmPassword && confirmPassword !== regPassword
                          ? 'border-red-400 focus:ring-red-200/40 focus:border-red-400'
                          : confirmPassword && confirmPassword === regPassword
                          ? 'border-emerald-400 focus:ring-emerald-200/40 focus:border-emerald-400'
                          : 'border-gray-200 focus:ring-[#aa2d29]/20 focus:border-[#aa2d29]'
                      }`}
                      required
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    {confirmPassword && (
                      <div className={`absolute right-10 top-1/2 -translate-y-1/2 ${
                        confirmPassword === regPassword ? 'text-emerald-500' : 'text-red-400'
                      }`}>
                        {confirmPassword === regPassword
                          ? <CheckCircle2 className="h-3.5 w-3.5" />
                          : <span className="text-xs font-bold leading-none">✕</span>
                        }
                      </div>
                    )}
                  </div>
                  {confirmPassword && confirmPassword !== regPassword && (
                    <p className="text-xs text-red-500 mt-1 font-medium">Passwords do not match</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#aa2d29] text-white font-bold py-3 rounded-xl hover:bg-[#8e2622] active:scale-[0.98] transition-colors shadow-md shadow-[#aa2d29]/20 disabled:opacity-60 disabled:cursor-not-allowed text-sm mt-1"
                >
                  {loading ? 'Creating VIP Account...' : 'Register VIP Account'}
                </button>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
