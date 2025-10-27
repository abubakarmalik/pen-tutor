'use client';
import { useState } from 'react';
import BG_IMG from '@/assets/images/blog/search-bg.png';

export default function SearchBlog({ onSearch }) {
  const [q, setQ] = useState('');

  const submit = (e) => {
    e.preventDefault();
    onSearch?.(q);
  };

  return (
    <>
      {/* SEARCH BAR (rounded blue bar with bg image + overlay) */}
      <div className="relative z-10 mx-auto w-[92%] md:w-5/6 lg:w-3/4">
        <div className="relative h-[150px] rounded-[56px] overflow-hidden shadow-[0_12px_24px_rgba(0,0,0,0.25)]">
          {/* background image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: BG_IMG }}
          />
          {/* dark blue overlay (tune /60 ↔ /70 if needed) */}
          <div className="absolute inset-0 bg-[#313D6A]/65" />

          {/* centered input */}
          <div className="relative z-10 h-full flex items-center justify-center px-8">
            <input
              type="text"
              placeholder="Enter Your Required Course"
              className="
                w-[88%]
                bg-white text-gray-800 placeholder-gray-500
                rounded-[18px] px-6 py-3
                shadow-[0_10px_18px_rgba(0,0,0,0.25)]
                outline-none ring-2 ring-[#F5BB07]
                focus:ring-4 focus:ring-[#F5BB07]/70
                transition
                text-center
              "
            />
          </div>
        </div>
      </div>
    </>
  );
}
