'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import TutA from '@/assets/images/tutors/tut-a.webp';
import TutB from '@/assets/images/tutors/tut-b.webp';
import TutC from '@/assets/images/tutors/tut-c.webp';
import TutD from '@/assets/images/tutors/tut-d.webp';
import TutE from '@/assets/images/tutors/tut-e.webp';

const tutors = [
  {
    id: 1,
    name: 'M Hashmi',
    teacherId: 'PT149',
    subject: 'Mathematics',
    degree: 'Masters',
    specialization: 'Math, Physics',
    experience: '21 Years',
    rating: 4.8,
    students: 120,
    image: TutA,
  },
  {
    id: 2,
    name: 'Imrah Anjum',
    teacherId: 'PT150',
    subject: 'Physics',
    degree: 'Masters',
    specialization: 'Quantum Mechanics',
    experience: '12 Years',
    rating: 4.9,
    students: 200,
    image: TutB,
  },
  {
    id: 3,
    name: 'Qasim Iqbal',
    teacherId: 'PT151',
    subject: 'English',
    degree: 'Bachelor',
    specialization: 'Poetry',
    experience: '6 Years',
    rating: 4.7,
    students: 95,
    image: TutC,
  },
  {
    id: 4,
    name: 'Kashif liaqat',
    teacherId: 'PT152',
    subject: 'Chemistry',
    degree: 'Masters',
    specialization: 'Organic Chemistry',
    experience: '15 Years',
    rating: 4.8,
    students: 160,
    image: TutD,
  },
  {
    id: 5,
    name: 'Imran Nazir',
    teacherId: 'PT153',
    subject: 'Biology',
    degree: 'Masters',
    specialization: 'Genetics',
    experience: '9 Years',
    rating: 4.9,
    students: 180,
    image: TutE,
  },
];

export default function FeaturedTutors() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % tutors.length);
    setTimeout(() => setIsTransitioning(false), 800);
  }, [isTransitioning]);

  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + tutors.length) % tutors.length);
    setTimeout(() => setIsTransitioning(false), 800);
  }, [isTransitioning]);

  const goToSlide = (index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 800);
  };

  useEffect(() => {
    if (isPaused || isTransitioning) return;
    const iv = setInterval(() => nextSlide(), 5000);
    return () => clearInterval(iv);
  }, [isPaused, isTransitioning, nextSlide]);

  const getVisibleTutors = () => {
    return [-1, 0, 1].map((pos) => {
      const index = (currentIndex + pos + tutors.length) % tutors.length;
      return { ...tutors[index], position: pos };
    });
  };

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50/30 to-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-[#313D6A] mb-3">
            Featured Tutors
          </h2>
          <div className="mx-auto w-24 h-1 rounded-full bg-[#F5BB07]" />
          <p className="text-gray-600 mt-6 max-w-2xl mx-auto">
            Meet our exceptional educators who are passionate about helping
            students achieve their academic goals
          </p>
        </div>

        <div
          className="relative max-w-6xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="relative w-full flex items-center justify-center h-[560px] sm:h-[520px] md:h-[480px]">
            <button
              onClick={prevSlide}
              aria-label="Previous slide"
              disabled={isTransitioning}
              className="hidden md:flex items-center justify-center z-30 absolute left-6 w-14 h-14 rounded-full bg-white border-2 border-gray-200 shadow-lg hover:scale-105 transition-transform duration-300 ease-out"
            >
              <ChevronLeft className="w-6 h-6 text-[#313D6A]" />
            </button>

            <div className="w-full max-w-5xl relative flex items-center justify-center">
              {getVisibleTutors().map((tutor) => {
                const isCenter = tutor.position === 0;

                // Reduced center width to address "too wide" complaint
                const GAP = 320; // px horizontal gap from center to side cards
                const xOffset = isCenter
                  ? 0
                  : tutor.position === -1
                  ? -GAP
                  : GAP;
                const scale = isCenter ? 1 : 0.86;
                const opacity = isCenter ? 1 : 0.65;
                const cardWidth = isCenter ? 'w-[380px]' : 'w-[300px]'; // center width reduced
                const cardHeight = isCenter ? 'h-[420px]' : 'h-[360px]';
                const verticalOffset = isCenter ? 0 : 14; // push side cards slightly down so center stands out
                const responsiveHide = isCenter ? '' : 'hidden md:block';

                return (
                  <div
                    key={tutor.id}
                    className={`group absolute transform transition-transform transition-opacity duration-800 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                      isCenter ? 'z-40' : 'z-30'
                    } ${responsiveHide}`}
                    style={{
                      left: '50%',
                      top: '50%',
                      transform: `translate(-50%,-50%) translateX(${xOffset}px) translateY(${verticalOffset}px) scale(${scale})`,
                      opacity,
                      willChange: 'transform, opacity',
                    }}
                  >
                    <Card
                      className={`relative ${cardWidth} ${cardHeight} rounded-2xl overflow-visible px-6 py-8 transition-all duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none cursor-pointer select-none ${
                        isCenter
                          ? 'bg-white shadow-[0_20px_60px_rgba(49,61,106,0.10)] group-hover:-translate-y-1 group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:ring-2 group-hover:ring-[#F5BB07]/40 group-hover:ring-offset-2 group-hover:ring-offset-white'
                          : 'bg-white/95 shadow-md group-hover:-translate-y-0.5 group-hover:scale-[1.01] group-hover:shadow-xl group-hover:ring-2 group-hover:ring-[#F5BB07]/40 group-hover:ring-offset-2 group-hover:ring-offset-white'
                      }`}
                      style={{ willChange: 'transform, box-shadow' }}
                    >
                      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-600 bg-gradient-to-br from-[#F5BB07]/0 via-[#F5BB07]/5 to-transparent" />
                      <div className="absolute left-1/2 -top-18 transform -translate-x-1/2">
                        <div
                          className={`rounded-full p-[6px] ${
                            isCenter ? 'bg-white' : 'bg-white'
                          } bg-gradient-to-tr from-[#F5BB07]/20 via-white to-[#313D6A]/10 shadow-lg transition-all duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:shadow-[0_0_40px_rgba(245,187,7,0.35)] group-hover:scale-[1.03]`}
                        >
                          <div
                            className={`${
                              isCenter ? 'w-36 h-36' : 'w-28 h-28'
                            } rounded-full overflow-hidden`}
                          >
                            <Image
                              src={tutor.image || '/placeholder.svg'}
                              alt={tutor.name}
                              width={isCenter ? 144 : 112}
                              height={isCenter ? 144 : 112}
                              className="object-cover w-full h-full transition-transform duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                              style={{ willChange: 'transform' }}
                            />
                          </div>
                        </div>

                        {isCenter && (
                          <div className="mt-3 flex justify-center">
                            <div className="bg-[#F5BB07] text-md font-semibold px-3 py-1 rounded-md text-white shadow-sm">
                              ID: {tutor.teacherId}
                            </div>
                          </div>
                        )}
                      </div>

                      <CardContent className="pt-28 text-center flex flex-col items-center justify-between h-full">
                        <div className="space-y-3 transition-all duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] opacity-95 group-hover:opacity-100 group-hover:-translate-y-0.5">
                          {/* <h3 className={`text-[#313D6A] font-bold ${isCenter ? "text-lg" : "text-base"}`}>{tutor.name}</h3> */}

                          {isCenter ? (
                            <>
                              <p className="text-sm text-start font-semibold text-[#313D6A]">
                                {tutor.degree} in {tutor.subject}
                              </p>

                              <p className="text-sm text-start text-gray-600">
                                <span className="font-semibold">Bachelor:</span>{' '}
                                In Chemistry, Zoology & Botany
                              </p>

                              <p className="text-sm text-start text-gray-600">
                                <span className="font-semibold">
                                  Experience:
                                </span>
                                {tutor.experience}
                              </p>
                            </>
                          ) : (
                            <div className="space-y-1 transition-all duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] opacity-95 group-hover:opacity-100 group-hover:-translate-y-0.5">
                              <p className="text-sm font-semibold text-[#313D6A]">
                                {tutor.subject}
                              </p>
                              <p className="text-xs text-gray-500">
                                {tutor.experience}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="w-full mt-2">
                          <Button
                            className={`w-full rounded-md transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#F5BB07]/40 ${
                              isCenter
                                ? 'bg-[#313D6A] text-white'
                                : 'bg-[#313D6A] text-white'
                            }`}
                            size={isCenter ? 'default' : 'sm'}
                          >
                            View Profile
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>

            <button
              onClick={nextSlide}
              aria-label="Next slide"
              disabled={isTransitioning}
              className="hidden md:flex items-center justify-center z-30 absolute right-6 w-14 h-14 rounded-full bg-white border-2 border-gray-200 shadow-lg hover:scale-105 transition-transform duration-300 ease-out"
            >
              <ChevronRight className="w-6 h-6 text-[#313D6A]" />
            </button>
          </div>

          <div className="flex justify-center mt-8 space-x-3">
            {tutors.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                disabled={isTransitioning}
                aria-label={`Go to slide ${index + 1}`}
                className={`transition-all duration-400 ease-out rounded-full hover:scale-110 ${
                  currentIndex === index
                    ? 'w-10 h-2 bg-[#F5BB07] shadow-md'
                    : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
