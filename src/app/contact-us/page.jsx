'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add your form submission logic here
    alert('Message sent successfully!');
    setFormData({ name: '', email: '', mobile: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-7xl shadow-lg p-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Get in Touch
          </h1>
          <p className="max-w-4xl mx-auto text-sm md:text-base text-gray-600 mb-6 px-4">
            We're always looking for ways to improve our platform and content. Tell us what you think - we would appreciate the opportunity to act on your feedback!
          </p>
          <h2 className="text-xl md:text-2xl font-semibold text-yellow-500">
            Send us a Message
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter Your Name"
              required
              className="w-full px-4 py-3 bg-gray-50 border-0 rounded text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-gray-400"
            />
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Your Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter Your Email"
              required
              className="w-full px-4 py-3 bg-gray-50 border-0 rounded text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-gray-400"
            />
          </div>

          {/* Mobile Field */}
          <div>
            <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
              Your Mobile Number
            </label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Enter Your Mobile Number"
              required
              className="w-full px-4 py-3 bg-gray-50 border-0 rounded text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-gray-400"
            />
          </div>

          {/* Message Field */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Your Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Please Type Your Message"
              required
              rows="5"
              className="w-full px-4 py-3 bg-gray-50 border-0 rounded text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-gray-400 resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-2">
            <button
              type="submit"
              className="px-8 py-2.5 bg-yellow-500 text-white font-medium rounded hover:bg-yellow-600 transition-colors duration-200 text-sm"
            >
              Submit Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}