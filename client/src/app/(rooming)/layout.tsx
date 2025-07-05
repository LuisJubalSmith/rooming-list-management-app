'use client';
import { ReactNode, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { login } from '@/actions';

export default function RoomingListManagementLayout({
  children,
}: {
  children: ReactNode;
}) {
  useEffect(() => {
    login();
  }, []);
  return (
    <main className='min-h-screen'>
      <div className='px-0 sm:px-10'>
        {children}
        <ToastContainer position='top-right' autoClose={3000} />
      </div>
    </main>
  );
}
