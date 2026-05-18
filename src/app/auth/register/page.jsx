'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import Button from '@/components/ui/Button';
import { Mail, Lock, Eye, EyeOff, User, Leaf, Store, ShoppingBag } from 'lucide-react';
import { isStrongPassword } from '@/lib/utils';

import { Suspense } from 'react';

function RegisterContent() {
  const { register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get('role') || 'buyer';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState(defaultRole);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const passwordStrength = password ? isStrongPassword(password) : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (passwordStrength && !passwordStrength.valid) {
      setError(passwordStrength.message);
      return;
    }

    setIsLoading(true);
    const result = await register(name, email, password, role);
    setIsLoading(false);

    if (result.success) {
      router.push(role === 'seller' ? '/dashboard' : '/');
      router.refresh();
    } else {
      setError(result.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-background">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 md:gap-16 items-center animate-fade-in-up">
        {/* Left Side - Text */}
        <div className="hidden md:block">
          <p className="font-ui text-sm font-bold tracking-[0.2em] text-cta uppercase mb-4">Join the Haven</p>
          <h2 className="font-display text-4xl lg:text-5xl text-primary leading-tight mb-6 uppercase">
            Where Makers and Buyers Meet.
          </h2>
          <p className="font-body text-text-muted leading-relaxed text-base">
            Create an account to follow your favorite makers, leave reviews, and manage orders. Sellers get a dashboard to list and grow their craft.
          </p>
        </div>

        {/* Right Side - Form */}
        <div className="w-full max-w-md mx-auto">
          {/* Mobile Header (Hidden on Desktop) */}
          <div className="text-center mb-8 md:hidden">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Leaf size={28} className="text-cta" />
            </div>
            <h1 className="font-display text-3xl text-primary uppercase mb-2">Join the Haven</h1>
            <p className="font-body text-text-muted">
              Create your account and start exploring
            </p>
          </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-card p-6 sm:p-8">
          {error && (
            <div className="bg-error-light text-error font-ui text-sm px-4 py-3 rounded-lg mb-6 animate-fade-in" role="alert">
              {error}
            </div>
          )}

          {/* Role Selector */}
          <div className="mb-6">
            <label className="font-ui text-sm font-medium text-text block mb-2">I want to</label>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setRole('buyer')}
                className={`flex flex-col sm:flex-row items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg border-2 transition-all ${
                  role === 'buyer'
                    ? 'border-cta bg-cta/5'
                    : 'border-border-light hover:border-border'
                }`}
              >
                <ShoppingBag size={20} className={role === 'buyer' ? 'text-cta' : 'text-text-muted'} />
                <div className="text-center sm:text-left">
                  <p className={`font-body text-sm font-semibold ${role === 'buyer' ? 'text-cta' : 'text-text'}`}>
                    Buy
                  </p>
                  <p className="hidden sm:block font-ui text-xs text-text-muted">Shop handmade</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setRole('seller')}
                className={`flex flex-col sm:flex-row items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg border-2 transition-all ${
                  role === 'seller'
                    ? 'border-cta bg-cta/5'
                    : 'border-border-light hover:border-border'
                }`}
              >
                <Store size={20} className={role === 'seller' ? 'text-cta' : 'text-text-muted'} />
                <div className="text-center sm:text-left">
                  <p className={`font-body text-sm font-semibold ${role === 'seller' ? 'text-cta' : 'text-text'}`}>
                    Sell
                  </p>
                  <p className="hidden sm:block font-ui text-xs text-text-muted">List products</p>
                </div>
              </button>
            </div>
          </div>

          {/* Name */}
          <div className="mb-5">
            <label htmlFor="name" className="font-ui text-sm font-medium text-text block mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                required
                autoComplete="name"
                className="w-full pl-10 pr-4 py-3 border border-border-light rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-5">
            <label htmlFor="email" className="font-ui text-sm font-medium text-text block mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="w-full pl-10 pr-4 py-3 border border-border-light rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-5">
            <label htmlFor="password" className="font-ui text-sm font-medium text-text block mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                required
                autoComplete="new-password"
                className="w-full pl-10 pr-12 py-3 border border-border-light rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {passwordStrength && (
              <p className={`font-ui text-xs mt-1.5 ${passwordStrength.valid ? 'text-success' : 'text-error'}`}>
                {passwordStrength.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label htmlFor="confirm-password" className="font-ui text-sm font-medium text-text block mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                autoComplete="new-password"
                className="w-full pl-10 pr-4 py-3 border border-border-light rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
              />
            </div>
          </div>

          <Button type="submit" isLoading={isLoading} className="w-full" size="lg">
            Create Account
          </Button>

          <p className="text-center font-body text-sm text-text-muted mt-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-accent font-semibold hover:text-accent-hover transition-colors">
              Sign in
            </Link>
          </p>
        </form>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>}>
      <RegisterContent />
    </Suspense>
  );
}
