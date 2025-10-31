'use client';

import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  Users,
  Video,
  BookOpen,
  Clock,
  MapPin,
  Calendar,
  Star,
  Sparkles,
  TrendingUp,
  Award,
} from 'lucide-react';
import { useState, useEffect } from 'react';

import ChildPlay from '@/assets/images/home/childs-play.png';
import Meeting from '@/assets/images/pages/our-services/services-meeting.png';
import Image from 'next/image';
import Link from 'next/link';

export default function ServicesPage() {
  const [groupSessionsIndex, setGroupSessionsIndex] = useState(0);
  const [resourcesIndex, setResourcesIndex] = useState(0);
  const [courses, setCourses] = useState([]);
  const [isVisible, setIsVisible] = useState({});

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 },
    );

    document.querySelectorAll('[data-animate]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const groupSessions = [
    {
      title: 'O-Level Chemistry Crash Course with Past Papers',
      courseId: '15',
      instructor: 'PT139',
      startDate: '28-Feb-2022',
      duration: '2 Months',
      fee: '$500',
      location: 'On-Campus',
      schedule: 'Days: Mon, Wed, Fri',
      time: '04:00 PM - 06:00 PM (GMT +5)',
      image: '/placeholder.svg?height=60&width=60',
    },
    {
      title: 'A-Level Physics Intensive Course',
      courseId: '16',
      instructor: 'PT140',
      startDate: '15-Mar-2022',
      duration: '3 Months',
      fee: '$600',
      location: 'Online',
      schedule: 'Days: Tue, Thu, Sat',
      time: '05:00 PM - 07:00 PM (GMT +5)',
      image: '/placeholder.svg?height=60&width=60',
    },
  ];

  const resources = [
    {
      title: 'English Past Paper 2021',
      image: '/placeholder.svg?height=200&width=280',
      bgColor: 'from-yellow-500 to-orange-500',
    },
    {
      title: "Maths O-Level MCQ's Notes",
      image: '/placeholder.svg?height=200&width=280',
      bgColor: 'from-teal-500 to-cyan-500',
    },
    {
      title: 'Chemistry Past Paper Notes',
      image: '/placeholder.svg?height=200&width=280',
      bgColor: 'from-indigo-500 to-purple-500',
    },
  ];

  const nextGroupSession = () =>
    setGroupSessionsIndex((p) => (p + 1) % groupSessions.length);
  const prevGroupSession = () =>
    setGroupSessionsIndex(
      (p) => (p - 1 + groupSessions.length) % groupSessions.length,
    );
  const nextResource = () =>
    setResourcesIndex((p) => (p + 1) % resources.length);
  const prevResource = () =>
    setResourcesIndex((p) => (p - 1 + resources.length) % resources.length);

  const SectionHeading = ({ title, pillBg = 'bg-[#313D6A]', icon: Icon }) => (
    <div className="relative w-full mb-16">
      <div className="flex items-center justify-center">
        <div className="relative group">
          <div
            className={`absolute -inset-1 ${pillBg} rounded-full blur opacity-75 group-hover:opacity-100 transition duration-500 animate-pulse`}
          ></div>
          <div
            className={`relative ${pillBg} text-white font-bold rounded-full px-10 py-4 shadow-2xl flex items-center gap-3`}
          >
            {Icon && <Icon className="w-6 h-6" />}
            <span className="text-2xl md:text-3xl tracking-wide">{title}</span>
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#F5BB07]/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#313D6A]/5 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Home Tutoring Section */}
      <section
        className="relative pt-20 pb-24 overflow-hidden"
        id="home-tutoring"
        data-animate
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white to-blue-50/30"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionHeading
            title="Home Tutoring"
            pillBg="bg-gradient-to-r from-[#313D6A] to-blue-900"
            icon={Users}
          />

          <div className="grid gap-16 lg:grid-cols-2 items-center">
            <div className="space-y-6 transform transition-all duration-700 hover:scale-105">
              <div className="inline-flex items-center gap-2 bg-[#313D6A]/10 px-4 py-2 rounded-full">
                <Award className="w-5 h-5 text-[#313D6A]" />
                <span className="text-sm font-semibold text-[#313D6A]">
                  Premium Learning Experience
                </span>
              </div>

              <h3 className="text-4xl md:text-5xl font-extrabold text-[#313D6A] leading-tight">
                Personalized Home Tutoring
              </h3>

              <p className="text-lg leading-relaxed text-gray-700">
                If you are looking for qualified home tutors, your search ends
                here. Pen Tutor is providing tutors for all the classes and all
                subjects your child needs help in. Our experienced tutors are
                available to give your child 100% personalized attention and the
                freedom to ask questions resulting in improved performance.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-md">
                  <Star className="w-5 h-5 text-[#F5BB07]" />
                  <span className="text-sm font-semibold">Expert Tutors</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-md">
                  <Users className="w-5 h-5 text-[#313D6A]" />
                  <span className="text-sm font-semibold">
                    1-on-1 Attention
                  </span>
                </div>
              </div>

              <Link
                href="/home-tutoring"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#313D6A] to-blue-900 text-white font-bold px-8 py-4 rounded-full hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group"
              >
                Explore Home Tutoring
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="flex justify-center">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-[#313D6A] to-blue-900 rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition duration-500"></div>
                <div className="relative rounded-full overflow-hidden w-80 h-80 md:w-96 md:h-96 shadow-2xl ring-8 ring-white">
                  <Image
                    src={ChildPlay}
                    alt="Home tutoring session"
                    fill
                    className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Online Tutoring Section */}
      <section
        className="relative pt-20 pb-24 overflow-hidden"
        id="online-tutoring"
        data-animate
      >
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/50 to-white"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionHeading
            title="Online Tutoring"
            pillBg="bg-gradient-to-r from-[#F5BB07] to-yellow-500"
            icon={Video}
          />

          <div className="grid gap-16 lg:grid-cols-2 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-[#F5BB07] to-yellow-500 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition duration-500"></div>
                <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-8 ring-white">
                  <Image
                    src={Meeting}
                    alt="Online tutoring session"
                    className="w-full h-auto object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-6 transform transition-all duration-700">
              <div className="inline-flex items-center gap-2 bg-[#F5BB07]/10 px-4 py-2 rounded-full">
                <TrendingUp className="w-5 h-5 text-[#F5BB07]" />
                <span className="text-sm font-semibold text-[#F5BB07]">
                  Learn From Anywhere
                </span>
              </div>

              <h3 className="text-4xl md:text-5xl font-extrabold text-[#F5BB07] leading-tight">
                Interactive Online Sessions
              </h3>

              <p className="text-lg leading-relaxed text-gray-700">
                If you are looking for qualified Online tutors, your search ends
                here. Pen Tutor is providing tutors for all the classes and all
                subjects your child needs help in. Our experienced tutors are
                available to give your child 100% personalized attention and the
                freedom to ask questions resulting in improved performance.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-md">
                  <Video className="w-5 h-5 text-[#F5BB07]" />
                  <span className="text-sm font-semibold">Live Sessions</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-md">
                  <Clock className="w-5 h-5 text-[#313D6A]" />
                  <span className="text-sm font-semibold">
                    Flexible Schedule
                  </span>
                </div>
              </div>

              <Link
                href="/online-tutoring"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#F5BB07] to-yellow-500 text-white font-bold px-8 py-4 rounded-full hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group"
              >
                Start Online Learning
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Session Types */}
      <section className="relative pt-20 pb-24" id="session-types" data-animate>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Session Types"
            pillBg="bg-gradient-to-r from-[#313D6A] to-blue-900"
            icon={BookOpen}
          />

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: 'Individual Sessions',
                desc: 'Personalized 1:1 attention',
                color: 'from-yellow-400 to-orange-400',
                icon: Users,
              },
              {
                title: 'Small Group Sessions',
                desc: 'Collaborative small groups',
                color: 'from-blue-400 to-indigo-400',
                icon: Users,
              },
              {
                title: 'Academy Sessions',
                desc: 'Structured classroom-style',
                color: 'from-green-400 to-teal-400',
                icon: BookOpen,
              },
            ].map((session, idx) => (
              <div key={idx} className="group relative">
                <div
                  className={`absolute -inset-1 bg-gradient-to-r ${session.color} rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-500`}
                ></div>
                <div className="relative bg-white rounded-3xl shadow-xl p-8 transform group-hover:-translate-y-2 transition-all duration-300">
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`w-20 h-20 bg-gradient-to-br ${session.color} rounded-full flex items-center justify-center shadow-lg`}
                    >
                      <session.icon className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#313D6A] mb-1">
                        {session.title}
                      </h3>
                      <p className="text-sm text-gray-600">{session.desc}</p>
                    </div>
                  </div>
                  <div className="h-1 bg-gradient-to-r from-[#F5BB07] to-transparent rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Group Sessions Carousel */}
      <section
        className="relative pt-20 pb-24 bg-gradient-to-b from-gray-50 to-white"
        id="group-sessions"
        data-animate
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Group Sessions"
            pillBg="bg-gradient-to-r from-[#313D6A] to-blue-900"
            icon={Users}
          />

          <div className="flex items-center justify-center gap-6 flex-wrap">
            <button
              onClick={prevGroupSession}
              className="w-14 h-14 rounded-full bg-gradient-to-r from-[#F5BB07] to-yellow-500 flex items-center justify-center shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>

            <div className="relative group max-w-2xl w-full">
              <div className="absolute -inset-2 bg-gradient-to-r from-[#313D6A] to-[#F5BB07] rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 md:p-10">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 bg-[#F5BB07]/10 px-4 py-2 rounded-full mb-3">
                    <BookOpen className="w-4 h-4 text-[#F5BB07]" />
                    <span className="text-sm font-semibold text-[#F5BB07]">
                      Course ID: {groupSessions[groupSessionsIndex].courseId}
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-[#313D6A]">
                    {groupSessions[groupSessionsIndex].title}
                  </h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
                    <Calendar className="w-5 h-5 text-[#F5BB07]" />
                    <div>
                      <p className="text-xs text-gray-500">Starts</p>
                      <p className="font-bold text-[#313D6A]">
                        {groupSessions[groupSessionsIndex].startDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
                    <Clock className="w-5 h-5 text-[#313D6A]" />
                    <div>
                      <p className="text-xs text-gray-500">Duration</p>
                      <p className="font-bold text-[#313D6A]">
                        {groupSessions[groupSessionsIndex].duration}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
                    <MapPin className="w-5 h-5 text-[#F5BB07]" />
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="font-bold text-[#313D6A]">
                        {groupSessions[groupSessionsIndex].location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
                    <Star className="w-5 h-5 text-[#F5BB07]" />
                    <div>
                      <p className="text-xs text-gray-500">Fee</p>
                      <p className="font-bold text-[#313D6A]">
                        {groupSessions[groupSessionsIndex].fee}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-[#313D6A]/5 to-[#F5BB07]/5 p-4 rounded-xl mb-6">
                  <p className="font-bold text-[#313D6A] mb-2">
                    Course Schedule
                  </p>
                  <p className="text-sm text-gray-700">
                    {groupSessions[groupSessionsIndex].schedule}
                  </p>
                  <p className="text-sm text-gray-700">
                    Time: {groupSessions[groupSessionsIndex].time}
                  </p>
                </div>

                <div className="flex gap-4">
                  <button className="flex-1 bg-gradient-to-r from-[#F5BB07] to-yellow-500 text-white font-bold py-4 rounded-xl hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                    View Course
                  </button>
                  <button className="flex-1 bg-gradient-to-r from-[#313D6A] to-blue-900 text-white font-bold py-4 rounded-xl hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                    Enroll Now
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={nextGroupSession}
              className="w-14 h-14 rounded-full bg-gradient-to-r from-[#313D6A] to-blue-900 flex items-center justify-center shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </section>

      {/* Online Courses */}
      <section
        className="relative pt-20 pb-24"
        id="online-courses"
        data-animate
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Online Courses"
            pillBg="bg-gradient-to-r from-[#F5BB07] to-yellow-500"
            icon={Video}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <div key={index} className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#F5BB07] to-yellow-500 rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
                <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden transform group-hover:-translate-y-2 transition-all duration-300">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={course.thumbnail || '/placeholder.svg'}
                      alt={course.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4 bg-[#F5BB07] text-white px-3 py-1 rounded-full text-sm font-bold">
                      {course.price} PKR
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg text-[#313D6A] mb-3 line-clamp-2">
                      {course.title}
                    </h3>
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{course.total_enrollments} Students</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Video className="w-4 h-4" />
                        <span>{course.total_videos} Lectures</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 bg-white border-4 border-[#F5BB07] text-[#F5BB07] font-bold px-10 py-4 rounded-full hover:bg-[#F5BB07] hover:text-white transform hover:scale-105 transition-all duration-300 shadow-xl"
            >
              View All Courses
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Online Resources */}
      <section
        className="relative pt-20 pb-24 bg-gradient-to-b from-gray-50 to-white"
        id="resources"
        data-animate
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Online Resources"
            pillBg="bg-gradient-to-r from-[#313D6A] to-blue-900"
            icon={BookOpen}
          />

          <div className="flex items-center justify-center gap-6 flex-wrap">
            <button
              onClick={prevResource}
              className="w-14 h-14 rounded-full bg-gradient-to-r from-[#F5BB07] to-yellow-500 flex items-center justify-center shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>

            <div className="flex gap-6 overflow-hidden max-w-4xl">
              {resources.map((resource, index) => (
                <div
                  key={index}
                  className={`relative group min-w-[280px] transform transition-all duration-500 ${
                    index === resourcesIndex
                      ? 'scale-110 z-10'
                      : 'scale-90 opacity-60'
                  }`}
                >
                  <div
                    className={`absolute -inset-2 bg-gradient-to-r ${resource.bgColor} rounded-3xl blur opacity-50 group-hover:opacity-100 transition duration-500`}
                  ></div>
                  <div
                    className={`relative bg-gradient-to-r ${resource.bgColor} rounded-3xl p-8 text-white text-center shadow-2xl h-64 flex items-center justify-center`}
                  >
                    <div>
                      <BookOpen className="w-12 h-12 mx-auto mb-4" />
                      <h3 className="text-xl font-bold">{resource.title}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={nextResource}
              className="w-14 h-14 rounded-full bg-gradient-to-r from-[#313D6A] to-blue-900 flex items-center justify-center shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </div>

          <div className="text-center mt-12">
            <button className="inline-flex items-center gap-2 bg-white border-4 border-[#F5BB07] text-[#F5BB07] font-bold px-10 py-4 rounded-full hover:bg-[#F5BB07] hover:text-white transform hover:scale-105 transition-all duration-300 shadow-xl">
              View All Resources
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
