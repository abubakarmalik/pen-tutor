'use client';
import { useState } from 'react';
import { Search, X, Sparkles, TrendingUp } from 'lucide-react';
import searchbg from '@/assets/images/blog/search-bg.jpg';

export default function SearchBlog({ onSearch }) {
  const [q, setQ] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    onSearch?.(q);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      submit(e);
    }
  };

  const clearSearch = () => {
    setQ('');
  };

  const popularTags = [
    'Web Development',
    'React',
    'JavaScript',
    'Career Tips',
    'Tutorials',
  ];

  return (
    <div className="pb-16 lg:pb-24 mt-8 lg:mt-12 relative">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#F5BB07]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#313D6A]/10 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="max-w-5xl mx-auto px-4 relative z-10">
        {/* Header with animated badge */}
        <div className="flex justify-center mb-8">
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#F5BB07] to-[#F5C94D] rounded-full blur opacity-75 group-hover:opacity-100 transition duration-500 animate-pulse" />
            <div className="relative bg-gradient-to-r from-[#F5BB07] to-[#F5C94D] text-[#313D6A] text-xl sm:text-2xl font-bold px-10 py-4 rounded-full shadow-2xl flex items-center gap-3 transform hover:scale-105 transition-all duration-300 cursor-pointer">
              <Sparkles className="w-6 h-6 animate-pulse" />
              <span className="relative">
                Discover Amazing Content
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#313D6A]/30 rounded-full" />
              </span>
            </div>
          </div>
        </div>

        {/* Main search card */}
        <div className="relative group">
          {/* Animated border gradient */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#F5BB07] via-[#F5C94D] to-[#F5BB07] rounded-[2rem] opacity-75 blur-sm group-hover:opacity-100 transition duration-500 animate-pulse" />

          <div className="relative bg-white rounded-[2rem] shadow-2xl overflow-hidden">
            {/* Top decorative bar */}
            <div className="h-2 bg-gradient-to-r from-[#313D6A] via-[#F5BB07] to-[#313D6A]" />

            <div className="p-8 sm:p-10">
              {/* Search input container */}
              <div className="relative mb-8">
                <div className="relative h-[200px] rounded-3xl overflow-hidden shadow-2xl">
                  {/* Background with parallax effect */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transform group-hover:scale-105 transition-transform duration-700"
                    style={{
                      backgroundImage: `url(${searchbg.src})`,
                    }}
                  />

                  {/* Multi-layer overlay for depth */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#313D6A]/80 via-[#313D6A]/60 to-[#313D6A]/70" />
                  <div className="absolute inset-0 backdrop-blur-[2px]" />

                  {/* Animated particles */}
                  <div className="absolute top-8 left-[10%] w-3 h-3 bg-[#F5BB07] rounded-full animate-bounce opacity-60" />
                  <div className="absolute top-16 right-[15%] w-2 h-2 bg-[#F5C94D] rounded-full animate-bounce delay-300 opacity-50" />
                  <div className="absolute bottom-12 left-[20%] w-2.5 h-2.5 bg-[#F5BB07] rounded-full animate-bounce delay-500 opacity-40" />

                  {/* Decorative circles with animation */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-[#F5BB07]/30 rounded-full blur-3xl animate-pulse" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#F5C94D]/20 rounded-full blur-3xl animate-pulse delay-1000" />

                  {/* Search input area */}
                  <div className="relative z-10 h-full flex items-center justify-center px-6 md:px-12">
                    <div
                      className={`
                        relative w-full max-w-2xl
                        transition-all duration-500 ease-out
                        ${isFocused ? 'scale-110' : 'scale-100'}
                      `}
                    >
                      {/* Animated search icon */}
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 transition-all duration-300 pointer-events-none">
                        <Search
                          size={24}
                          className={`transition-all duration-300 ${
                            isFocused
                              ? 'text-[#F5BB07] scale-110 rotate-12'
                              : 'text-gray-400 scale-100 rotate-0'
                          }`}
                        />
                      </div>

                      {/* Premium input field */}
                      <input
                        type="text"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="Search for courses, topics, or skills..."
                        className="
                          w-full h-16 pl-16 pr-16
                          bg-white/98 backdrop-blur-md
                          text-gray-800 placeholder-gray-400
                          rounded-3xl
                          shadow-[0_20px_60px_rgba(0,0,0,0.3)]
                          outline-none
                          border-4 border-transparent
                          focus:border-[#F5BB07]
                          focus:shadow-[0_20px_60px_rgba(245,187,7,0.4)]
                          transition-all duration-500
                          text-base md:text-lg font-medium
                        "
                      />

                      {/* Clear button with animation */}
                      {q && (
                        <button
                          type="button"
                          onClick={clearSearch}
                          className="
                            absolute right-6 top-1/2 -translate-y-1/2
                            w-8 h-8 flex items-center justify-center
                            bg-gray-100 hover:bg-[#F5BB07] rounded-full
                            text-gray-400 hover:text-white
                            transition-all duration-300
                            hover:scale-110 hover:rotate-90
                            shadow-md
                          "
                        >
                          <X size={18} />
                        </button>
                      )}

                      {/* Multi-layer glow effect */}
                      <div
                        className={`
                          absolute inset-0 rounded-3xl
                          bg-gradient-to-r from-[#F5BB07]/30 via-[#F5C94D]/30 to-[#F5BB07]/30
                          blur-2xl
                          transition-opacity duration-500
                          ${isFocused ? 'opacity-100' : 'opacity-0'}
                          -z-10
                        `}
                      />
                      <div
                        className={`
                          absolute inset-0 rounded-3xl
                          bg-gradient-to-l from-[#F5BB07]/20 to-[#313D6A]/10
                          blur-xl
                          transition-opacity duration-500
                          ${isFocused ? 'opacity-100' : 'opacity-0'}
                          -z-10
                        `}
                      />
                    </div>
                  </div>

                  {/* Bottom accent with animation */}
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-[#F5BB07] to-transparent opacity-80" />
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#F5BB07] via-transparent to-[#F5BB07] opacity-40 animate-pulse" />
                </div>
              </div>

              {/* Search button with premium effects */}
              <div className="flex justify-center mb-8">
                <button
                  onClick={submit}
                  className="group/btn relative bg-gradient-to-r from-[#F5BB07] via-[#F5C94D] to-[#F5BB07] text-[#313D6A] font-bold text-lg px-12 py-5 rounded-full shadow-2xl hover:shadow-[0_20px_60px_rgba(245,187,7,0.5)] transition-all duration-500 transform hover:scale-110 hover:-translate-y-2 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    <Search className="w-6 h-6 group-hover/btn:rotate-12 transition-transform duration-300" />
                    <span className="font-extrabold tracking-wide">
                      Search Articles
                    </span>
                  </span>

                  {/* Multiple shine effects */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/20 to-transparent transform skew-x-12 translate-x-full group-hover/btn:-translate-x-full transition-transform duration-1200 delay-100" />

                  {/* Glow effect */}
                  <div className="absolute inset-0 rounded-full bg-[#F5BB07] opacity-0 group-hover/btn:opacity-50 blur-xl transition-opacity duration-500" />
                </button>
              </div>

              {/* Popular tags section */}
              <div className="relative">
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <div className="flex items-center gap-2 text-sm text-[#313D6A] font-bold px-4 py-2 bg-gradient-to-r from-[#F5BB07]/20 to-[#F5C94D]/20 rounded-full">
                    <TrendingUp className="w-4 h-4" />
                    <span>Trending:</span>
                  </div>
                  {popularTags.map((tag, idx) => (
                    <button
                      key={tag}
                      onClick={() => onSearch?.(tag)}
                      style={{ animationDelay: `${idx * 100}ms` }}
                      className="group/tag relative text-sm font-semibold bg-white hover:bg-gradient-to-r hover:from-[#F5BB07] hover:to-[#F5C94D] text-[#313D6A] px-5 py-2.5 rounded-full transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 border-2 border-[#F5BB07]/30 hover:border-[#F5BB07] overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center gap-1">
                        <span className="text-[#F5BB07] group-hover/tag:text-[#313D6A] transition-colors">
                          #
                        </span>
                        {tag}
                      </span>

                      {/* Hover shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover/tag:translate-x-full transition-transform duration-700" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom decorative bar */}
            <div className="h-2 bg-gradient-to-r from-[#313D6A] via-[#F5BB07] to-[#313D6A]" />
          </div>
        </div>

        {/* Floating helper text */}
        <div className="text-center mt-6 text-sm text-gray-500 font-medium animate-pulse">
          <span className="inline-flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#F5BB07]" />
            Press Enter to search instantly
          </span>
        </div>
      </div>
    </div>
  );
}
