import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, LogIn, Lock, Mail, Eye, EyeOff, Award, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { superAdminAPI, logoAPI } from '../services/api';

const SuperAdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [headerLogos, setHeaderLogos] = useState({ leftLogo: { url: '' }, rightLogo: { url: '' } });
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already logged in
    const token = localStorage.getItem('superToken');
    if (token) {
      navigate('/superadmin');
    }
    loadLogos();
  }, [navigate]);

  const loadLogos = async () => {
    try {
      const { data } = await logoAPI.getHeaderLogos();
      setHeaderLogos(data);
    } catch (error) {
      console.error('Failed to load logos:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await superAdminAPI.login(email, password);
      localStorage.setItem('superToken', data.token);
      localStorage.setItem('superAdmin', JSON.stringify(data.superAdmin));
      toast.success('Super Admin Login successful!');
      navigate('/superadmin');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - 50% - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-army-dark to-army relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-gold/20 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-gold/20 rounded-full"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-center">
          {/* Logos */}
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-white/10 border-2 border-gold/30 flex items-center justify-center p-1 shadow-xl">
              <img 
                src={headerLogos?.leftLogo?.url || 'https://placehold.co/100x100/1F3D2B/FFFFFF?text=Logo'} 
                alt="Logo"
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  e.target.src = 'https://placehold.co/100x100/1F3D2B/FFFFFF?text=Logo';
                }}
              />
            </div>
            <div className="text-left">
              <h1 className="text-white font-display font-bold text-2xl leading-tight">
                नेपाल राष्ट्रिय
                <br />
                <span className="text-gold">भूतपूर्व सैनिक संघ</span>
              </h1>
              <p className="text-white/50 text-xs font-medium tracking-wider mt-1">
                Nepal National Ex-Army Association
              </p>
            </div>
            <div className="w-20 h-20 rounded-full overflow-hidden bg-white/10 border-2 border-gold/30 flex items-center justify-center p-1 shadow-xl">
              <img 
                src={headerLogos?.rightLogo?.url || 'https://placehold.co/100x100/1F3D2B/FFFFFF?text=Flag'} 
                alt="Flag"
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  e.target.src = 'https://placehold.co/100x100/1F3D2B/FFFFFF?text=Flag';
                }}
              />
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-white/80 text-sm font-medium tracking-wider uppercase">
              Super Admin Access Portal
            </h2>
            <div className="w-20 h-0.5 bg-gold mx-auto mt-3"></div>
          </div>

          <div className="space-y-3 text-white/60 text-sm max-w-sm">
            <p className="leading-relaxed">
              Highest level administrative access with full system control and management capabilities.
            </p>
          </div>

          <div className="mt-6 inline-flex items-center gap-2 bg-red-500/20 text-red-300 text-xs px-4 py-1.5 rounded-full border border-red-500/30">
            <Shield className="h-3 w-3" />
            Super Admin Access Only
          </div>

          <div className="mt-8 flex items-center gap-6">
            <div className="flex items-center gap-2 text-white/40 text-xs">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
              Secure
            </div>
            <div className="flex items-center gap-2 text-white/40 text-xs">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
              Encrypted
            </div>
            <div className="flex items-center gap-2 text-white/40 text-xs">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
              Protected
            </div>
          </div>

          <div className="absolute bottom-8 text-white/20 text-xs">
            <p>© {new Date().getFullYear()} Nepal National Ex-Army Association</p>
          </div>
        </div>
      </div>

      {/* Right Side - 50% - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-army/10 border-2 border-gold/30 flex items-center justify-center p-1">
              <img 
                src={headerLogos?.leftLogo?.url || 'https://placehold.co/60x60/1F3D2B/FFFFFF?text=Logo'} 
                alt="Logo"
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  e.target.src = 'https://placehold.co/60x60/1F3D2B/FFFFFF?text=Logo';
                }}
              />
            </div>
            <div className="text-center">
              <h1 className="text-army font-display font-bold text-lg">Super Admin</h1>
              <p className="text-gray-400 text-xs">Nepal Army Association</p>
            </div>
            <div className="w-12 h-12 rounded-full overflow-hidden bg-army/10 border-2 border-gold/30 flex items-center justify-center p-1">
              <img 
                src={headerLogos?.rightLogo?.url || 'https://placehold.co/60x60/1F3D2B/FFFFFF?text=Flag'} 
                alt="Flag"
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  e.target.src = 'https://placehold.co/60x60/1F3D2B/FFFFFF?text=Flag';
                }}
              />
            </div>
          </div>

          <div className="text-center lg:text-left mb-8">
            <div className="hidden lg:flex items-center gap-3 mb-4">
              <div className="p-2 bg-gold/10 rounded-lg">
                <Shield className="h-6 w-6 text-gold" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-army">Super Admin Access</h2>
                <p className="text-gray-400 text-sm">Full system control and management</p>
              </div>
            </div>
            <div className="lg:hidden">
              <h2 className="text-2xl font-bold text-army">Super Admin Access</h2>
              <p className="text-gray-400 text-sm">Full system control and management</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold focus:border-transparent transition-all text-gray-700 placeholder-gray-400"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold focus:border-transparent transition-all text-gray-700 placeholder-gray-400"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-gold focus:ring-gold border-gray-300 rounded" />
                Remember me
              </label>
              <a href="#" className="text-sm text-gold hover:text-gold-dark transition-colors">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  Signing in...
                </>
              ) : (
                <>
                  <Shield className="h-5 w-5" />
                  Super Admin Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
              Protected by industry standard security
            </p>
            <div className="flex items-center justify-center gap-4 mt-3 text-gray-300 text-xs">
              <span className="flex items-center gap-1">
                <span className="w-1 h-1 bg-green-400 rounded-full"></span>
                SSL Secure
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1 h-1 bg-green-400 rounded-full"></span>
                256-bit Encryption
              </span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">
              <a href="/" className="text-gold hover:text-gold-dark transition-colors">
                ← Back to Homepage
              </a>
            </p>
            <p className="text-xs text-gray-400 mt-2">
              <a href="/admin/login" className="text-gold hover:text-gold-dark transition-colors">
                Admin Login →
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLogin;