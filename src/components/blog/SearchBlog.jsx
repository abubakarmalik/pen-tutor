'use client';
import { useState } from 'react';

export default function SearchBlog({ onSearch, bgImage = '/images/blog-bg-placeholder.jpg' }) {
  const [q, setQ] = useState('');

  const submit = (e) => {
    e.preventDefault();
    onSearch?.(q);
  };

  return (
    <section className="relative bg-[#FFFCE0] py-10 flex flex-col items-center">
      {/* Top label pill */}
      <div className="z-20 -mb-5">
        <span className="inline-block bg-[#F5BB07] text-[#313D6A] font-extrabold text-lg md:text-xl px-8 py-3 rounded-t-[1.25rem] shadow">
          Search Blog
        </span>
      </div>

      {/* Big rounded bar with bg image + dark overlay */}
      <div className="relative w-[92%] sm:w-5/6 lg:w-3/4 xl:w-2/3">
        <div
          className="relative rounded-[3rem] shadow-2xl overflow-hidden"
          style={{ boxShadow: '0 10px 20px rgba(0,0,0,0.25)' }}
        >
          {/* background image */}
          <div
            className="h-40 sm:h-44 md:h-48 w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${bgImage})` }}
          />
          {/* dark overlay */}
          <div className="absolute inset-0 rounded-[3rem] bg-[#313D6A]/70" />

          {/* input */}
          <form
            onSubmit={submit}
            className="absolute inset-0 flex items-center justify-center px-6 md:px-10"
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Enter Your Required Course"
              className="
                w-full md:w-[85%] 
                bg-white/98 text-gray-800 placeholder-gray-500
                rounded-[1.25rem] px-6 py-3 md:py-4
                shadow-[0_8px_20px_rgba(0,0,0,0.25)]
                outline-none ring-2 ring-[#F5BB07]
                focus:ring-4 focus:ring-[#F5BB07]/70
                transition
              "
            />
          </form>
        </div>
      </div>

      {/* Bottom Search button pill */}
      <button
        onClick={submit}
        className="mt-4 md:mt-6 bg-[#F5BB07] text-[#313D6A] font-extrabold text-lg md:text-xl px-10 md:px-14 py-3 rounded-full shadow hover:bg-[#F5BB07]/90 transition"
      >
        Search
      </button>
    </section>
  );
}
