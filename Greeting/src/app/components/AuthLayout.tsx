// Refactored Auth Layout - Mobile-first design
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Shield } from 'lucide-react';
import { toast } from 'sonner';

export function AuthLayout() {
  const { isAuthenticated, login, register } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        toast.success('Welcome back!');
      } else {
        await register(formData.fullName, formData.email, formData.password);
        toast.success('Account created!');
      }
      navigate('/app');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Authentication failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* App Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-500 rounded-2xl mb-4 shadow-lg">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">TrialGuard</h1>
          <p className="text-gray-600 mt-2 text-sm">Never forget subscriptions</p>
        </div>

        {/* Auth Form */}
        <div className="bg-white rounded-3xl p-6 shadow-xl">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="Enter your name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required={!isLogin}
                  className="rounded-xl"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="student@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="rounded-xl"
              />
            </div>

            <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-600 rounded-xl py-6">
              {isLogin ? 'Log In' : 'Sign Up'}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-teal-600 hover:text-teal-700 font-medium"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
            </button>
          </div>

          {isLogin && (
            <div className="mt-6 p-3 bg-teal-50 rounded-xl border border-teal-200">
              <p className="text-xs text-gray-600 mb-1 font-medium">Demo Account:</p>
              <p className="text-xs text-gray-700">📧 demo@student.com</p>
              <p className="text-xs text-gray-700">🔑 demo123</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
