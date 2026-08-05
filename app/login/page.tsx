'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Lock, Eye, EyeOff, Mail, Phone, CheckCircle2, UserPlus, LogIn, ArrowLeft, Car, VolumeX, Thermometer } from 'lucide-react';
import Image from 'next/image';
import logoImg from '../../public/logo.png';
import { apiFetch } from '@/lib/api';

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [step, setStep] = useState<1 | 2 | 3>(1);

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

  // Onboarding Step 3 VIP Preferences
  const [onboardingVehicle, setOnboardingVehicle] = useState('VIP Business Van');
  const [onboardingQuietRide, setOnboardingQuietRide] = useState('Yes');
  const [onboardingTemp, setOnboardingTemp] = useState('21°C');
  const [onboardingMeetGreet, setOnboardingMeetGreet] = useState('');

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
      const res = await apiFetch('/login', {
        method: 'POST',
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

          const currentEmail = user.email || email;
          const userProfileKey = `customerProfile_${currentEmail.toLowerCase().trim()}`;
          const existingProfile = JSON.parse(localStorage.getItem(userProfileKey) || localStorage.getItem('customerProfile') || '{}');

          const nameParts = (user.name || '').split(' ');
          const updatedProfile = {
            ...existingProfile,
            firstName: nameParts[0] || existingProfile.firstName || '',
            lastName: nameParts.slice(1).join(' ') || existingProfile.lastName || '',
            email: currentEmail,
            phone: user.phone || existingProfile.phone || '',
          };

          localStorage.setItem('customerProfile', JSON.stringify(updatedProfile));
          localStorage.setItem(userProfileKey, JSON.stringify(updatedProfile));

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
      const res = await apiFetch('/register', {
        method: 'POST',
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

        // Set default meet & greet name and smoothly transition to Step 3 onboarding inside the card
        setOnboardingMeetGreet(`${firstName} ${lastName}`.trim());
        setStep(3);
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

  const handleCompleteOnboarding = (skip = false) => {
    const currentEmail = email.toLowerCase().trim();
    const userProfileKey = `customerProfile_${currentEmail}`;

    const profileData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: currentEmail,
      phone: phone.trim(),
      preferredVehicle: skip ? 'VIP Business Van' : onboardingVehicle,
      quietRide: skip ? 'Yes' : onboardingQuietRide,
      temperature: skip ? '21°C' : onboardingTemp,
      childSeat: 'None',
      meetGreetName: skip
        ? `${firstName} ${lastName}`.trim()
        : (onboardingMeetGreet.trim() || `${firstName} ${lastName}`.trim()),
      specialRequests: '',
    };

    localStorage.setItem('customerProfile', JSON.stringify(profileData));
    localStorage.setItem(userProfileKey, JSON.stringify(profileData));

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('customerProfileUpdated'));
    }

    router.push('/portal');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className={`bg-white p-8 sm:p-10 rounded-2xl shadow-xl w-full border border-gray-200 ${step === 3 ? 'max-w-lg' : 'max-w-md'
        }`}>

        {/* Logo */}
        <div className="text-center mb-6 flex flex-col items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/admin_logo.png"
            alt="TRANSFER VIP Logo"
            className="w-[200px] h-auto mb-2 object-contain"
          />
        </div>

        {/* Top Tab Switcher: Sign In vs Register (Hidden on Step 3 Onboarding) */}
        {step !== 3 && (
          <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError('');
                setSuccessMsg('');
                setPassword('');
                setRegPassword('');
                setConfirmPassword('');
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 cursor-pointer ${mode === 'login' ? 'bg-[#aa2d29] text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setError('');
                setSuccessMsg('');
                setPassword('');
                setRegPassword('');
                setConfirmPassword('');
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 cursor-pointer ${mode === 'register' ? 'bg-[#aa2d29] text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-semibold text-center border border-red-200 mb-5">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-50 text-emerald-700 p-3 rounded-xl text-xs font-semibold text-center border border-emerald-200 mb-5 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* STEP 1: EMAIL FIRST */}
        {step === 1 && (
          <form onSubmit={handleNextStep} className="space-y-4" autoComplete="on">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  id="step1-email"
                  autoComplete="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-[#aa2d29] bg-gray-50 hover:bg-white text-gray-900"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#aa2d29] text-white font-bold py-2.5 rounded-xl hover:bg-[#8e2622] text-sm mt-2 cursor-pointer"
            >
              Next
            </button>
          </form>
        )}

        {/* STEP 2: PASSWORD (IF SIGN IN) OR REGISTRATION (IF REGISTER) */}
        {step === 2 && (
          <div>
            {/* Display Entered Email with Back/Change option */}
            <div className="relative mb-4">
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400 z-10" />
              <input
                type="email"
                name="email"
                id="step2-email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-16 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-[#aa2d29] bg-gray-50 hover:bg-white text-gray-900 font-medium"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setStep(1)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#aa2d29] font-bold hover:underline shrink-0 z-10 cursor-pointer"
              >
                Change
              </button>
            </div>

            {mode === 'login' ? (
              /* SIGN IN STEP 2: PASSWORD */
              <form onSubmit={handleLogin} className="space-y-4" autoComplete="on">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      id="login-password"
                      autoComplete="current-password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-[#aa2d29] bg-gray-50 hover:bg-white text-gray-900"
                      required
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#aa2d29] text-white font-bold py-2.5 rounded-xl hover:bg-[#8e2622] disabled:opacity-60 disabled:cursor-not-allowed text-sm cursor-pointer"
                >
                  {loading ? 'Authenticating...' : 'Sign In'}
                </button>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => setError('To reset your password, please contact support.')}
                    className="text-xs text-gray-400 hover:text-[#aa2d29] font-medium cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
              </form>
            ) : (
              /* REGISTER STEP 2: DETAILS & PASSWORD */
              <form onSubmit={handleRegister} className="space-y-3" autoComplete="off">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      name="given-name"
                      id="reg-first-name"
                      autoComplete="given-name"
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-[#aa2d29] bg-gray-50 hover:bg-white text-gray-900"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      name="family-name"
                      id="reg-last-name"
                      autoComplete="family-name"
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-[#aa2d29] bg-gray-50 hover:bg-white text-gray-900"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                      type="tel"
                      name="tel"
                      id="reg-phone"
                      inputMode="tel"
                      autoComplete="tel"
                      data-lpignore="true"
                      data-form-type="other"
                      placeholder="Phone Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-[#aa2d29] bg-gray-50 hover:bg-white text-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="new-password"
                      id="reg-password"
                      autoComplete="new-password"
                      data-lpignore="true"
                      placeholder="Password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-[#aa2d29] bg-gray-50 hover:bg-white text-gray-900"
                      required
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-2.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirm-new-password"
                      id="reg-confirm-password"
                      autoComplete="new-password"
                      data-lpignore="true"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full pl-10 pr-10 py-2 text-sm rounded-xl border focus:outline-none bg-gray-50 hover:bg-white text-gray-900 ${confirmPassword && confirmPassword !== regPassword
                          ? 'border-red-400'
                          : confirmPassword && confirmPassword === regPassword
                            ? 'border-emerald-400'
                            : 'border-gray-200 focus:border-[#aa2d29]'
                        }`}
                      required
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-2.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    {confirmPassword && (
                      <div className={`absolute right-10 top-1/2 -translate-y-1/2 ${confirmPassword === regPassword ? 'text-emerald-500' : 'text-red-400'
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
                  className="w-full bg-[#aa2d29] text-white font-bold py-2.5 rounded-xl hover:bg-[#8e2622] disabled:opacity-60 disabled:cursor-not-allowed text-sm mt-1 cursor-pointer"
                >
                  {loading ? 'Creating VIP Account...' : 'Register VIP Account'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* STEP 3: VIP PREFERENCES SETUP */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">Set Up Your Preferences</h2>
              <p className="text-xs text-gray-500 mt-1">Select your standard ride preferences for upcoming transfers.</p>
            </div>

            {/* Preferred Vehicle - All 4 Vehicles */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Car className="w-4 h-4 text-gray-400" /> Preferred Vehicle
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'VIP Business Van', label: 'VIP Business Van', sub: 'Mercedes V-Class' },
                  { id: 'Executive Sedan', label: 'Executive Sedan', sub: 'Mercedes E-Class' },
                  { id: 'Premium SUV', label: 'Premium SUV', sub: 'Mercedes GLS' },
                  { id: 'First Class Sedan', label: 'First Class Sedan', sub: 'Mercedes S-Class' },
                ].map((v) => {
                  const isSelected = onboardingVehicle === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setOnboardingVehicle(v.id)}
                      className={`p-3 rounded-xl border text-left cursor-pointer select-none ${isSelected
                          ? 'border-[#aa2d29] bg-rose-50 text-[#aa2d29]'
                          : 'border-gray-200 hover:border-gray-300 bg-white text-gray-800'
                        }`}
                    >
                      <div className="text-xs font-bold leading-tight">{v.label}</div>
                      <div className={`text-[11px] mt-0.5 ${isSelected ? 'text-[#aa2d29]' : 'text-gray-500'}`}>
                        {v.sub}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quiet Ride & Temperature */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Quiet Ride */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <VolumeX className="w-4 h-4 text-gray-400" /> Quiet Ride Mode
                </label>
                <div className="flex bg-gray-100 p-1 rounded-xl">
                  {[
                    { val: 'Yes', label: 'Yes (Silent)' },
                    { val: 'No', label: 'No (Standard)' },
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => setOnboardingQuietRide(opt.val)}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg cursor-pointer ${onboardingQuietRide === opt.val
                          ? 'bg-[#aa2d29] text-white'
                          : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4 Cabin Temperatures */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Thermometer className="w-4 h-4 text-gray-400" /> Cabin Temperature
                </label>
                <div className="flex bg-gray-100 p-1 rounded-xl gap-0.5">
                  {['20°C', '21°C', '22°C', '23°C'].map((temp) => (
                    <button
                      key={temp}
                      type="button"
                      onClick={() => setOnboardingTemp(temp)}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg cursor-pointer ${onboardingTemp === temp
                          ? 'bg-[#aa2d29] text-white'
                          : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                      {temp}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Airport Meet & Greet Sign */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Airport Meet & Greet Sign Name
              </label>
              <input
                type="text"
                placeholder="e.g. Mr. Thomas Shelby"
                value={onboardingMeetGreet}
                onChange={(e) => setOnboardingMeetGreet(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-[#aa2d29] bg-gray-50 hover:bg-white text-gray-900 font-medium"
              />
            </div>

            {/* Actions */}
            <div className="pt-2 space-y-2 text-center">
              <button
                type="button"
                onClick={() => handleCompleteOnboarding(false)}
                className="w-full bg-[#aa2d29] text-white font-bold py-2.5 rounded-xl hover:bg-[#8e2622] cursor-pointer text-sm"
              >
                Save Preferences & Continue
              </button>
              <button
                type="button"
                onClick={() => handleCompleteOnboarding(true)}
                className="text-xs text-gray-400 hover:text-gray-600 font-medium block w-full py-1 cursor-pointer"
              >
                Skip for now
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
