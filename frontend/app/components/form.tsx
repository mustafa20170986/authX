// context/form.tsx
'use client';
import { useState } from 'react';
import { useAuth } from '../context/store';
import { useRouter } from 'next/navigation';

export default function Form() {
  const [email, setEmail] = useState<string>('');
  const [pass, setPass] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { login, signup } = useAuth();
  const router = useRouter();

  const handleAction = async (
    type: 'signup' | 'signin',
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      let userData;
      if (type === 'signup') {
        userData = await signup(email, pass);
      } else {
        userData = await login(email, pass);
      }

      // Role-based redirection handled directly in the form component
      if (userData?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="border-2 mt-[20%] rounded-md w-1/2 border-pink-300 backdrop-filter backdrop-blur-xl p-6 shadow-md">
        <h2 className="text-xl font-bold text-center text-pink-600 mb-4">
          Welcome
        </h2>

        {error && (
          <div className="bg-pink-300 text-white p-2 mb-4 rounded-md text-sm text-center">
            {error}
          </div>
        )}

        <form className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Email</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-md bg-pink-50 border border-pink-200 p-2 text-black focus:outline-none focus:ring-2 focus:ring-pink-300"
              placeholder="user@example.com"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="rounded-md bg-pink-50 border border-pink-200 p-2 text-black focus:outline-none focus:ring-2 focus:ring-pink-300"
              placeholder="********"
            />
          </div>

          <div className="flex gap-4 mt-4">
            <button
              type="button"
              className="bg-pink-400 text-white w-1/2 py-2 rounded-md hover:bg-pink-500 transition disabled:opacity-50 font-semibold"
              onClick={(e) => handleAction('signup', e)}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Sign Up'}
            </button>

            <button
              type="button"
              className="bg-white text-pink-500 border border-pink-400 w-1/2 py-2 rounded-md hover:bg-pink-50 transition disabled:opacity-50 font-semibold"
              onClick={(e) => handleAction('signin', e)}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
