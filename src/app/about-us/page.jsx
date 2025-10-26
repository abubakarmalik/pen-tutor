'use client';

import Image from 'next/image';

// Replace these with your real images
import bg1 from '@/assets/images/about-us/bg-1.svg';
import bg2 from '@/assets/images/about-us/bg-3.svg';
import bg3 from '@/assets/images/about-us/bg-2.svg';

const bands = [
  {
    title: `"PEN TUTOR COVERS THE GAP BETWEEN STUDENT AND HIS/HER ACADEMIC SUCCESS"`,
    alt: 'Students studying together',
    src: bg1,
    text: '', // no text on band 1 (matches screenshot)
  },
  {
    title: `"PEN TUTOR Methodology"`,
    alt: 'Tutor guiding a student',
    src: bg2,
    text: `Our motto is "learning with concept". We ensure the needs of students. Our tutors are highly qualified and trained. They assess student's weaknesses and strengths properly, design their effective methodology accordingly, and are committed to student's improvement and success in achieving his/her targets.\n\n"WE MAKE LEARNING INTERESTING, QUICK AND EASY"`,
  },
  {
    title: 'Our wide spectrum of services',
    alt: 'Stationery and learning materials',
    src: bg3,
    text: `Our tutors are specialized in their services for all types of courses at all levels. We provide the best tutors for all classes and all subjects. Preparation of all variety of national and international tests and exams is covered under the cap of Pen Tutor. Professional skill development sessions are also arranged by Pen Tutor. Our services are available on-campus and online.`,
  },
];

export default function PenTutorSections() {
  return (
    <section className="w-full">
      {bands.map((b, i) => (
        <div key={i} className="w-full">
          {/* Heading */}
          <div className="container mx-auto px-4">
            <h2 className="text-center text-xl sm:text-2xl md:text-3xl font-semibold tracking-wide my-10 text-[#F5BB07]">
              {b.title}
            </h2>
          </div>

          {/* Image Band */}
          <div className="relative w-full h-[200px] sm:h-[260px] md:h-[320px] lg:h-[360px] overflow-hidden">
            <Image
              src={b.src}
              alt={b.alt}
              fill
              sizes="100vw"
              className="object-cover"
              priority={false}
            />
            {/* Dark overlay for readability */}
            <div className="absolute inset-0 bg-black/10" aria-hidden="true" />

            {/* Centered overlay text (only when provided) */}
            {b.text ? (
              <div className="absolute inset-0 flex items-center justify-center px-6">
                <p className="max-w-5xl text-center text-gray-100 text-[13px] sm:text-sm md:text-base leading-relaxed whitespace-pre-line">
                  {b.text}
                </p>
              </div>
            ) : null}
          </div>

          {/* Spacer between bands (subtle, like screenshot) */}
          <div className="h-10 sm:h-12" />
        </div>
      ))}
    </section>
  );
}
