// Refactored Settings - Under 150 lines, matching mobile design
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Shield, LogOut, Bell, Moon, DollarSign, User, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

export function Settings() {
  const { user, logout, updatePreferences } = useAuth();
  const navigate = useNavigate();
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    'Notification' in window && Notification.permission === 'granted'
  );

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/');
  };

  const handleCurrencyChange = (currency: string) => {
    updatePreferences({ currency });
    toast.success(`Currency changed to ${currency}`);
  };

  const handleDarkModeToggle = (enabled: boolean) => {
    updatePreferences({ darkMode: enabled });
    toast.info('Dark mode coming soon!');
  };

  const handleNotificationToggle = async (enabled: boolean) => {
    if (enabled && 'Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === 'granted');
      toast.success(permission === 'granted' ? 'Notifications enabled!' : 'Permission denied');
    } else {
      setNotificationsEnabled(false);
      toast.info('Notifications disabled');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-24">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header with Dark Mode Toggle */}
        <div className="flex items-center justify-between pt-2">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Dark Mode</span>
            <Switch
              checked={user?.preferences.darkMode}
              onCheckedChange={handleDarkModeToggle}
            />
          </div>
        </div>

        {/* Profile Section */}
        <div className="bg-white rounded-2xl p-4">
          <h2 className="font-semibold text-gray-900 mb-4">Profile</h2>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Hello, {user?.fullName}</p>
            </div>
          </div>
        </div>

        {/* Account Section */}
        <div className="bg-white rounded-2xl p-4">
          <h2 className="font-semibold text-gray-900 mb-4">Account</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Email</p>
                <p className="text-sm font-medium text-gray-900">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="bg-white rounded-2xl p-4">
          <h2 className="font-semibold text-gray-900 mb-4">Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-gray-400" />
                <Label className="text-sm">Reminders Enabled</Label>
              </div>
              <Switch checked={notificationsEnabled} onCheckedChange={handleNotificationToggle} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <DollarSign className="w-5 h-5 text-gray-400" />
                <Label className="text-sm">Currency</Label>
              </div>
              <Select value={user?.preferences.currency} onValueChange={handleCurrencyChange}>
                <SelectTrigger className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="THB">THB (฿)</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-white rounded-2xl p-4">
          <h2 className="font-semibold text-gray-900 mb-4">Support</h2>
          <div className="space-y-3">
            <button className="w-full text-left text-sm text-gray-700 py-2">Help & FAQ</button>
            <button className="w-full text-left text-sm text-gray-700 py-2">Contact Us</button>
            <button className="w-full text-left text-sm text-gray-700 py-2">Privacy Policy</button>
          </div>
        </div>

        {/* Logout Button */}
        <Button 
          variant="destructive" 
          className="w-full bg-red-500 hover:bg-red-600" 
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Log Out
        </Button>
      </div>
    </div>
  );
}
