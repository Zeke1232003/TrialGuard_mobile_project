import { RouterProvider } from 'react-router';
import { router } from './routes';
import { SubscriptionProvider } from './context/SubscriptionContext';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <RouterProvider router={router} />
        <Toaster />
      </SubscriptionProvider>
    </AuthProvider>
  );
}
