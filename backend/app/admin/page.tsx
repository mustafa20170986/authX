// app/admin/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/store';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    async function verifySession() {
      const token = localStorage.getItem('access_token');

      if (!token) {
        logout();
        router.push('/home');
        return;
      }

      try {
        // Hit your protected backend route to verify token validity
        const res = await fetch('http://localhost:2017/auth/admin', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          // Token expired or invalid
          logout();
          router.push('/home');
          return;
        }

        // If valid, stop loading and show the page
        setIsLoading(false);
      } catch (err) {
        logout();
        router.push('/auth');
      }
    }

    verifySession();
  }, [logout, router]);

  // Show a clean loading state or blank screen to prevent the "flash"
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <p className="text-pink-600 font-medium animate-pulse">
          Verifying session...
        </p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-pink-600">Hello Admin</h1>
      <p className="mt-2 text-gray-700">Logged in as: {user?.email}</p>
      <button
        onClick={logout}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
      >
        Sign Out
      </button>
    </div>
  );
}
