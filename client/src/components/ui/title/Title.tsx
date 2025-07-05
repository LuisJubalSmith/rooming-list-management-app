'use client';
import { titleFont } from '@/config/fonts';
import React from 'react';

interface Props {
  title: string;
  subtitle?: string;
  className?: string;
}

export const Title = ({ title, subtitle, className = '' }: Props) => {
  return (
    <div
      className={`mt-3 flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-4 ${className}`}
    >
      <h1
        className={`${titleFont.className} antialiased text-2xl sm:text-3xl md:text-4xl font-semibold`}
      >
        {title}
      </h1>
      {subtitle && (
        <h3 className='text-base sm:text-lg md:text-xl text-gray-600'>
          {subtitle}
        </h3>
      )}
    </div>
  );
};
