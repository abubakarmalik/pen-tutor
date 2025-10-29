'use client';
import Image from 'next/image';
import STUDENT_IMG from '@/assets/images/blog/student.svg';
import SearchBlog from './SearchBlog';

export default function BlogHeader({ onSearch }) {
  return (
    <>
      <section className="relative bg-[#FFFCE0] overflow-hidden">
        {/* RINGS */}
        <div className="pointer-events-none absolute -left-24 top-24 w-64 h-64 rounded-full border-[18px] border-[#F5BB07] opacity-80" />
        <div className="pointer-events-none absolute right-10 top-6 w-[440px] h-[440px] rounded-full border-[22px] border-[#F5BB07] opacity-90" />

        {/* ROW: Title + Student */}
        <div className="container mx-auto px-6 pt-14 pb-8 relative z-10 flex items-center justify-between">
          <h1 className="text-[56px] leading-none font-extrabold tracking-tight text-[#313D6A]">
            BLOG
          </h1>

          <div className="relative w-[500px] h-[340px] -mr-4">
            <Image
              src={STUDENT_IMG}
              alt="Student on laptop"
              fill
              className="object-contain object-bottom"
              priority
            />
          </div>
        </div>

        {/* SEARCH LABEL (gold pill overlapping bar) */}
        <div className="relative z-20 flex justify-center -mt-1">
          <div className="bg-[#F5BB07] text-[#313D6A] text-xl md:text-2xl font-extrabold px-10 py-4 rounded-t-[28px] rounded-b-none shadow-md">
            Search Blog
          </div>
        </div>
        <SearchBlog />
      </section>
      {/* SEARCH BUTTON (gold pill) */}
      <div className="relative z-20 flex justify-center pt-0 pb-8">
        <button
          onClick={(e) => {
            e.preventDefault();
            const q = document.querySelector('#blog-search-input')?.value;
            onSearch?.(q || '');
          }}
          className="bg-[#F5BB07] text-[#313D6A] font-extrabold text-xl px-12 py-3 rounded-full shadow hover:bg-[#F5BB07]/90 transition"
        >
          Search
        </button>
      </div>
    </>
  );
}
