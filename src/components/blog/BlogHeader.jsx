'use client';
import Image from 'next/image';
import { TrendingUp, BookOpen, Users } from 'lucide-react';
import STUDENT_IMG from '@/assets/images/blog/student.svg';

export default function BlogHeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-[#FFFCE0] via-[#FFF9CC] to-[#FFFADB] overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large decorative circles */}
        <div className="absolute -left-20 top-20 w-72 h-72 rounded-full bg-[#F5BB07]/10 blur-3xl animate-pulse" />
        <div className="absolute -right-32 top-32 w-96 h-96 rounded-full bg-[#313D6A]/5 blur-3xl animate-pulse delay-1000" />

        {/* Decorative rings */}
        <div
          className="absolute left-10 top-16 w-48 h-48 rounded-full border-4 border-dashed border-[#F5BB07]/30 animate-spin"
          style={{ animationDuration: '20s' }}
        />
        <div
          className="absolute right-24 bottom-20 w-64 h-64 rounded-full border-4 border-dashed border-[#313D6A]/20 animate-spin"
          style={{ animationDuration: '25s', animationDirection: 'reverse' }}
        />

        {/* Floating dots */}
        <div
          className="absolute left-1/4 top-1/3 w-3 h-3 rounded-full bg-[#F5BB07] animate-bounce"
          style={{ animationDuration: '3s' }}
        />
        <div
          className="absolute right-1/3 top-1/4 w-2 h-2 rounded-full bg-[#313D6A] animate-bounce delay-500"
          style={{ animationDuration: '3.5s' }}
        />
        <div
          className="absolute left-1/2 bottom-1/3 w-4 h-4 rounded-full bg-[#F5BB07]/50 animate-bounce delay-1000"
          style={{ animationDuration: '4s' }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-7xl">
        {/* Header Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center pt-12 pb-8 lg:pt-16 lg:pb-12">
          {/* Left Column - Text Content */}
          <div className="order-2 lg:order-1 space-y-6">
            {/* Blog Title */}
            <div className="space-y-3">
              <div className="inline-block">
                <span className="bg-[#313D6A] text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                  📚 Knowledge Hub
                </span>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-[#313D6A] leading-tight">
                Our{' '}
                <span className="relative inline-block">
                  <span className="relative z-10">Blog</span>
                  <span className="absolute bottom-2 left-0 w-full h-4 bg-[#F5BB07] -rotate-1"></span>
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-700 max-w-xl">
                Discover insights, tutorials, and success stories from our
                learning community
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 py-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                <div className="flex items-center justify-center w-10 h-10 bg-[#F5BB07] rounded-full mb-2 mx-auto">
                  <BookOpen className="w-5 h-5 text-[#313D6A]" />
                </div>
                <div className="text-2xl font-bold text-[#313D6A] text-center">
                  500+
                </div>
                <div className="text-xs text-gray-600 text-center">
                  Articles
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                <div className="flex items-center justify-center w-10 h-10 bg-[#313D6A] rounded-full mb-2 mx-auto">
                  <Users className="w-5 h-5 text-[#F5BB07]" />
                </div>
                <div className="text-2xl font-bold text-[#313D6A] text-center">
                  50K+
                </div>
                <div className="text-xs text-gray-600 text-center">Readers</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                <div className="flex items-center justify-center w-10 h-10 bg-[#F5BB07] rounded-full mb-2 mx-auto">
                  <TrendingUp className="w-5 h-5 text-[#313D6A]" />
                </div>
                <div className="text-2xl font-bold text-[#313D6A] text-center">
                  Daily
                </div>
                <div className="text-xs text-gray-600 text-center">Updates</div>
              </div>
            </div>
          </div>

          {/* Right Column - Student Image */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative w-full h-64 sm:h-80 lg:h-[400px]">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#F5BB07]/20 to-[#313D6A]/20 rounded-[3rem] transform rotate-3"></div>
              <div className="absolute inset-0 bg-white/50 backdrop-blur-sm rounded-[3rem] transform -rotate-3"></div>

              {/* Image container */}
              <div className="relative w-full h-full rounded-[3rem] overflow-hidden shadow-2xl">
                <Image
                  src={STUDENT_IMG}
                  alt="Student on laptop"
                  fill
                  className="object-cover object-center"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
