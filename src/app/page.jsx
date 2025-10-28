import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { FaArrowRightLong } from 'react-icons/fa6';
import FeaturedTutors from '@/components/home/FeaturedTutors';
import Footer from '@/components/Footer';
import stdBags from '@/assets/images/student_with_bags.png';
import lady from '@/assets/images/home/teacher-smile.png';
import studentSmiling from '@/assets/images/home/std-smiling.png';
import whyChooseUS from '@/assets/images/why-choose-us.png';
import Link from 'next/link';
import QueryForm from '@/components/home/query-form';
import OurServices from '@/components/home/our-services';
import GroupSessions from '@/components/home/GroupSessions';
import CoursesSection from '@/components/home/CoursesSection';
import Banner from '@/components/home/Banner';
import { CheckCircle2, ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-yellow-100 to-tertiary overflow-hidden">
        <div className="container max-w-7xl mx-auto px-3 sm:px-0 py-10 md:py-14 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-8 md:gap-10 lg:gap-12 min-h-[55vh] md:min-h-[50vh]">
            {/* Text */}
            <div className="flex flex-col h-full items-center lg:items-start justify-center text-center lg:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-[#313D6A] tracking-tight">
                Welcome To Pen Tutor
              </h1>
              <p className="mt-5 text-sm sm:text-base text-[#313D6A] max-w-xl leading-relaxed">
                Your trusted learning companion, connecting students with expert
                tutors for all academic levels—so you can learn faster, smarter,
                and with confidence.
              </p>
                <Link href="/courses">
                        <Button
                            variant="outline"
                            className="border-2 mt-[25px] sm:mt-[30px] cursor-pointer border-[#313D6A] text-white bg-[#313D6A] px-8 py-5 rounded-lg text-lg font-semibold shadow-sm"
                        >
                            View All
                        </Button>
                    </Link>
            </div>

            {/* Image + BG Circle */}
            <div className="relative flex justify-center lg:justify-end items-center">
              {/* decorative circle */}
              <div
                aria-hidden="true"
                className="
            pointer-events-none absolute rounded-full opacity-50 bg-yellow-400
            w-40 h-40 sm:w-52 sm:h-52 md:w-72 md:h-72 lg:w-96 lg:h-96 xl:w-[28rem] xl:h-[28rem]
            top-1/2 -translate-y-1/2
            translate-x-4 sm:translate-x-8 md:translate-x-10 lg:translate-x-12 xl:translate-x-16
          "
              />
              <Image
                src={stdBags}
                alt="Students with backpacks"
                priority
                className="
            relative z-10 h-auto object-contain
            max-w-[260px] sm:max-w-[340px] md:max-w-[420px] lg:max-w-[520px] xl:max-w-[600px]
          "
                sizes="(min-width:1280px) 600px, (min-width:1024px) 520px, (min-width:768px) 420px, (min-width:640px) 340px, 260px"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Query Form Section */}
      <QueryForm />
      {/* For Students Section */}


      
     <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="mx-auto px-3 sm:px-0">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Image + Background Boxes */}
            <div className="relative flex justify-center items-center min-h-[300px] sm:min-h-[350px] lg:min-h-[450px] order-2 lg:order-1">
              {/* Decorative circles */}
              <div className="absolute top-8 right-8 w-16 h-16 sm:w-20 sm:h-20 bg-yellow-200/40 rounded-full blur-xl"></div>
              <div className="absolute bottom-12 left-8 w-20 h-20 sm:w-24 sm:h-24 bg-yellow-300/30 rounded-full blur-xl"></div>
              
              {/* Background Box */}
              <div className="absolute w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-3xl rotate-6 shadow-2xl"></div>

              {/* Image */}
              <Image
                src={studentSmiling}
                alt="Female student with tablet"
                className="relative z-10 w-40 sm:w-56 lg:w-72 h-auto object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Text Section */}
            <div className="space-y-5 sm:space-y-6 order-1 lg:order-2">
              <div className="inline-block px-4 py-1.5 bg-yellow-100 text-yellow-700 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wide">
                For Students
              </div>
              
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Find Your Perfect
                <span className="block text-yellow-500 mt-1">Tutor Today</span>
              </h2>
              
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl">
                Connect with thousands of qualified tutors in your area. Start your learning journey with personalized guidance.
              </p>

              <ul className="space-y-3 sm:space-y-4">
                <li className="flex items-start space-x-3 group">
                  <CheckCircle2 className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <span className="text-sm sm:text-base text-gray-700 font-medium">
                    Browse verified tutors in your local area
                  </span>
                </li>
                <li className="flex items-start space-x-3 group">
                  <CheckCircle2 className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <span className="text-sm sm:text-base text-gray-700 font-medium">
                    Contact directly & arrange flexible lessons
                  </span>
                </li>
                <li className="flex items-start space-x-3 group">
                  <CheckCircle2 className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <span className="text-sm sm:text-base text-gray-700 font-medium">
                    Get personalized learning at affordable rates
                  </span>
                </li>
              </ul>

              <Link
                href="/online-tutoring"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
              >
                <span>Explore Tutors</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* For Tutors Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Text Section */}
            <div className="space-y-5 sm:space-y-6">
              <div className="inline-block px-4 py-1.5 bg-slate-100 text-slate-700 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wide">
                For Tutors
              </div>
              
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Grow Your Tutoring
                <span className="block text-slate-800 mt-1">Business Online</span>
              </h2>
              
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl">
                Join our community of expert tutors. Reach more students and build your reputation with our powerful platform.
              </p>

              <ul className="space-y-3 sm:space-y-4">
                <li className="flex items-start space-x-3 group">
                  <CheckCircle2 className="w-6 h-6 text-slate-700 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <span className="text-sm sm:text-base text-gray-700 font-medium">
                    Create your professional tutor profile
                  </span>
                </li>
                <li className="flex items-start space-x-3 group">
                  <CheckCircle2 className="w-6 h-6 text-slate-700 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <span className="text-sm sm:text-base text-gray-700 font-medium">
                    Connect with motivated students nearby
                  </span>
                </li>
                <li className="flex items-start space-x-3 group">
                  <CheckCircle2 className="w-6 h-6 text-slate-700 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <span className="text-sm sm:text-base text-gray-700 font-medium">
                    Manage your schedule with flexibility
                  </span>
                </li>
              </ul>

              <Button className="inline-flex items-center gap-2 bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-slate-950 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group h-auto">
                <span>Join as Tutor</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Image + Background Box */}
            <div className="relative flex justify-center items-center min-h-[300px] sm:min-h-[350px] lg:min-h-[450px]">
              {/* Decorative circles */}
              <div className="absolute top-8 left-8 w-16 h-16 sm:w-20 sm:h-20 bg-slate-200/40 rounded-full blur-xl"></div>
              <div className="absolute bottom-12 right-8 w-20 h-20 sm:w-24 sm:h-24 bg-slate-300/30 rounded-full blur-xl"></div>
              
              {/* Background Box */}
              <div className="absolute w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 bg-gradient-to-br from-slate-700 to-slate-900 rounded-3xl -rotate-6 shadow-2xl"></div>

              {/* Image */}
              <Image
                src={lady}
                alt="Professional female tutor"
                className="relative z-10 w-44 sm:w-56 lg:w-72 h-auto object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tutors Section */}
      <FeaturedTutors />
      <OurServices />
      <GroupSessions />
      {/* Why Choose Pen Tutor Section */}
      <section className="py-16">
        <div className="mx-auto px-4">
          <Card className="max-w-7xl mx-auto">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-center text-slate-800 mb-8">
                Why Choose Pen Tutor
              </h2>
              <div className="">
                <div className="space-y-6">
                  <p className="text-gray-600 leading-relaxed">
                    {/* Pen Tutor is a 'Network of Trained Tutors' committed to provide you highly qualified & experienced Online & Home tutoring services, individual and group sessions anywhere, anytime. */}
                    {/* Pen Tutor provides the best conceptual study environment. Our staff is equipped with unique teaching techniques and methodologies. Our mode of teaching is flexible, engaging and advanced. We keep the deficiencies and needs of students in focus to cover the gaps. we provide the best and right Tutors. */}
                    Pen Tutor is your personalized tutoring service to fit your
                    needs. Our goal is to provide a world-class education to
                    anyone, anywhere. We focus on skill mastering to help
                    learners establish strong basics so there is no limit to
                    what they can pursue next!
                  </p>
                  <ul className="space-y-3">
                    {[
                      'Conceptual Study Environment',
                      'Expert Tutors',
                      'Affordable Pricing',
                      'Flexible Schedules',
                      'Safe Learning Environment',
                      'Regular Updates',
                      '24/7 Support',
                    ].map((item, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
  
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Banner />
    </div>
  );
}
