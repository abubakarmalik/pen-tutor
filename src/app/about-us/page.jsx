import React from 'react';
import { GraduationCap, Target, Users, BookOpen, Award, Clock, Brain, TrendingUp } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptMCAxNGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI0Y1QkIwNyIgc3Ryb2tlLXdpZHRoPSIuNSIgb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-10"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-500 rounded-full mb-6">
              <GraduationCap className="w-10 h-10 text-gray-900" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Bridging the Gap Between <span className="text-yellow-400">Students</span> and <span className="text-yellow-400">Success</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              PEN TUTOR is a comprehensive learning management platform dedicated to making education accessible, engaging, and effective for learners at every level.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105">
                Start Learning
              </button>
              <button className="border-2 border-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-lg font-semibold transition-all">
                Explore Courses
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '10,000+', label: 'Students Taught' },
              { number: '500+', label: 'Expert Tutors' },
              { number: '95%', label: 'Success Rate' },
              { number: '24/7', label: 'Support Available' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Our Mission: <span className="text-yellow-500">Learning with Concept</span>
                </h2>
                <p className="text-gray-700 text-lg mb-4 leading-relaxed">
                  At PEN TUTOR, we believe that true education goes beyond memorization. Our motto is "learning with concept" – ensuring students don't just know the answers, but understand the why behind them.
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Our highly qualified and trained tutors assess each student's unique strengths and weaknesses, designing effective methodologies that are committed to improvement and success in achieving their academic targets.
                </p>
              </div>
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl p-8 text-gray-900 shadow-xl">
                <div className="space-y-6">
                  <div className="flex items-start">
                    <Target className="w-8 h-8 mr-4 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-xl mb-2">Personalized Approach</h3>
                      <p className="text-gray-800">Tailored learning paths designed for individual success</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Brain className="w-8 h-8 mr-4 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-xl mb-2">Concept-Based Learning</h3>
                      <p className="text-gray-800">Deep understanding, not just surface-level memorization</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Award className="w-8 h-8 mr-4 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-xl mb-2">Expert Tutors</h3>
                      <p className="text-gray-800">Qualified professionals dedicated to your growth</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              The PEN TUTOR Methodology
            </h2>
            <p className="text-xl text-gray-600">
              We Make Learning <span className="text-yellow-500 font-semibold">Interesting, Quick, and Easy</span>
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: <Users className="w-12 h-12" />,
                title: 'Assess Individual Needs',
                description: 'We begin by understanding each student\'s unique learning style, strengths, and areas for improvement.'
              },
              {
                icon: <BookOpen className="w-12 h-12" />,
                title: 'Customized Learning Plans',
                description: 'Our tutors design effective methodologies tailored to your specific academic goals and challenges.'
              },
              {
                icon: <TrendingUp className="w-12 h-12" />,
                title: 'Continuous Progress Tracking',
                description: 'Regular assessments and feedback ensure steady improvement and achievement of learning targets.'
              }
            ].map((step, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center text-yellow-600 mb-6">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Wide Spectrum of Services
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive educational solutions for every learning need
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: <GraduationCap className="w-8 h-8" />,
                title: 'All Subjects & Levels',
                description: 'Specialized tutoring for all courses, grades, and academic levels with expert instructors.'
              },
              {
                icon: <BookOpen className="w-8 h-8" />,
                title: 'Test Preparation',
                description: 'Comprehensive prep for national and international exams including SAT, ACT, A-Levels, and more.'
              },
              {
                icon: <Award className="w-8 h-8" />,
                title: 'Professional Skills',
                description: 'Skill development sessions covering technical, creative, and professional competencies.'
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: 'Flexible Learning',
                description: 'Choose between on-campus and online sessions based on your convenience and preference.'
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: 'Personalized Schedule',
                description: 'Learning plans designed around your availability with 24/7 support and resources.'
              },
              {
                icon: <Brain className="w-8 h-8" />,
                title: 'Interactive Platform',
                description: 'State-of-the-art LMS with engaging content, progress tracking, and collaborative tools.'
              }
            ].map((service, index) => (
              <div key={index} className="bg-white border-2 border-gray-100 rounded-xl p-6 hover:border-yellow-400 transition-all hover:shadow-lg group">
                <div className="bg-gray-100 group-hover:bg-yellow-100 w-14 h-14 rounded-lg flex items-center justify-center text-gray-700 group-hover:text-yellow-600 mb-4 transition-colors">
                  {service.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Students Choose PEN TUTOR
            </h2>
            <p className="text-xl text-gray-300">
              Join thousands of successful learners who have achieved their academic goals with us
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: 'Qualified Expert Tutors',
                description: 'All our tutors are highly qualified, trained, and passionate about education with proven track records.'
              },
              {
                title: 'Proven Results',
                description: 'Our students consistently achieve higher grades and improved confidence in their academic abilities.'
              },
              {
                title: 'Flexible Learning Options',
                description: 'Study at your pace with both on-campus and online options available to fit your lifestyle.'
              },
              {
                title: 'Comprehensive Support',
                description: 'From enrollment to exam day, our team provides continuous guidance and support every step of the way.'
              }
            ].map((reason, index) => (
              <div key={index} className="flex items-start">
                <div className="bg-yellow-500 rounded-full p-2 mr-4 flex-shrink-0 mt-1">
                  <svg className="w-5 h-5 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{reason.title}</h3>
                  <p className="text-gray-300">{reason.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-yellow-400 to-yellow-500">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-xl text-gray-800 mb-8">
              Join PEN TUTOR today and experience education that truly makes a difference
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg">
                Get Started Now
              </button>
              <button className="bg-white hover:bg-gray-100 text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all shadow-lg">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}