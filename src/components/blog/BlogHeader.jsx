'use client';
import Image from 'next/image';
import studentImg from '@/assets/images/blog/student.svg';

export default function BlogHeader() {
  return (
    <section className="relative bg-[#FFFCE0] overflow-hidden">
      {/* Decorative Rings */}
      <div className="absolute top-0 left-0 w-48 h-48 border-[12px] border-[#F5BB07] rounded-full -translate-x-1/2 translate-y-8 opacity-70" />
      <div className="absolute top-10 right-10 w-64 h-64 border-[12px] border-[#F5BB07] rounded-full opacity-70" />

      {/* Content */}
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-12 relative z-10">
        {/* Left: Title */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-[#313D6A] mb-6 md:mb-0">
          BLOG
        </h1>

        {/* Right: Image */}
        <div className="relative w-full md:w-1/2 max-w-md">
          <Image
            src={studentImg}
            alt="Student using laptop"
            className="object-contain w-full h-auto"
            priority
          />
        </div>
      </div>
    </section>
  );
}
