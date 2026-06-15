import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  ScrollRestoration,
  Outlet,
} from 'react-router-dom';
import { Toaster } from 'sonner';
import RouteGuard from './route-guard';
import { protectedRoutesPaths, publicRoutesPaths } from './routes';
import AppLayout from '@/layout/app-layout';
import AuthPage from '@/pages/auth';

import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/components/auth-provider';
import { QueryProvider } from '@/components/query-provider';
import SettingPage from '@/pages/settings';
import SignOutPage from '@/pages/auth/sign-out';

const RootLayout = () => (
  <QueryProvider>
    <TooltipProvider>
      <AuthProvider>
        <ScrollRestoration />
        <Outlet />
        <Toaster position="bottom-right" richColors />
      </AuthProvider>
    </TooltipProvider>
  </QueryProvider>
);

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<RootLayout />}>



      {/* Protected routes */}
      <Route element={<RouteGuard requireAuth={true} />}>
        <Route element={<AppLayout />}>
          {protectedRoutesPaths?.map(({ path, element: Element }) => (
            <Route key={path} path={path} element={<Element />} />
          ))}
          <Route path="account/settings" element={<SettingPage />} />
          <Route path="account/security" element={<SettingPage />} />
        </Route>
        <Route path="auth/sign-out" element={<SignOutPage />} />
      </Route>

      {/* Auth*/}
      <Route element={<RouteGuard requireAuth={false} />}>
        <Route path="auth/sign-in" element={<AuthPage />} />
        <Route path="auth/sign-up" element={<AuthPage />} />
        <Route path="auth/forgot-password" element={<AuthPage />} />
        <Route path="auth/reset-password" element={<AuthPage />} />
        <Route path="auth/callback" element={<AuthPage />} />
      </Route>


      <Route>
        {publicRoutesPaths?.map(({ path, element: Element }) => (
          <Route key={path} path={path} element={<Element />} />
        ))}
      </Route>

      <Route path="*" element={<>Not Found</>} />
    </Route>
  )
);
