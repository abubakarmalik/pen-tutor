'use client';

import React from 'react';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileText, DollarSign, Briefcase, Send, Sparkles } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

export default function JobApplyPage() {
  const searchParams = useSearchParams();
  const jobId = searchParams.get('job_id');

  const [formData, setFormData] = useState({
    cover_letter: '',
    proposed_rate: '',
  });
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!jobId) {
      toast.error('Job ID is required to apply');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        cover_letter: formData.cover_letter,
        proposed_rate: formData.proposed_rate || null,
      };

      await axios.post(
        `${API_URL}/api/job-board/jobs/${jobId}/apply/`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        },
      );
      toast.success('Application submitted successfully!');

      // Reset form
      setFormData({
        cover_letter: '',
        proposed_rate: '',
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#FFFCE0] via-[#FFF9D0] to-[#FFF5C0]">
      {/* Enhanced decorative background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute top-10 left-10 w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-[#F5BB07]/30 to-[#F5BB07]/10 blur-2xl animate-pulse" />
        <div className="absolute top-20 right-20 w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-[#F5BB07]/20 to-[#F5BB07]/5 blur-xl animate-pulse delay-75" />
        <div className="absolute bottom-32 left-16 w-40 h-40 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-[#F5BB07]/25 to-[#F5BB07]/10 blur-3xl animate-pulse delay-150" />
        <div className="absolute bottom-20 right-32 w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-[#F5BB07]/30 to-[#F5BB07]/10 blur-2xl animate-pulse delay-300" />

        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 20px 20px, #F5BB07 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16 max-w-5xl">
        {/* Enhanced Header with animation */}
        <div className="text-center mb-8 md:mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center gap-3 md:gap-4 mb-4 md:mb-6 bg-white/60 backdrop-blur-sm px-6 md:px-8 py-3 md:py-4 rounded-2xl shadow">
            <div className="bg-gradient-to-br from-[#F5BB07] to-[#E5AB00] p-2 md:p-3 rounded-xl shadow">
              <Briefcase className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Apply for Job
            </h1>
            <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-[#F5BB07] animate-pulse" />
          </div>

          <p className="text-gray-600 text-base sm:text-lg md:text-xl max-w-2xl mx-auto px-4">
            Submit your application and take the next step in your teaching
            journey
          </p>

          {jobId && (
            <div className="mt-4 inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <p className="text-gray-600 text-sm font-medium">
                Job ID: {jobId}
              </p>
            </div>
          )}
        </div>

        {/* Enhanced Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 shadow border border-white/20 hover:shadow-lg transition-shadow duration-300">
            {/* Cover Letter Section */}
            <div className="space-y-4 mb-8 md:mb-10">
              <div className="flex items-start gap-3">
                <div className="bg-gradient-to-br from-[#F5BB07] to-[#E5AB00] p-2 rounded-lg shadow flex-shrink-0 mt-1">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <Label
                    htmlFor="cover_letter"
                    className="text-gray-800 font-semibold text-lg block mb-1"
                  >
                    Cover Letter
                  </Label>
                  <p className="text-sm md:text-base text-gray-500">
                    Share your passion and explain why you're the perfect match
                  </p>
                </div>
              </div>

              <div className="relative">
                <Textarea
                  id="cover_letter"
                  placeholder="I am excited to apply for this position because... &#10;&#10;My relevant experience includes... &#10;&#10;What makes me unique is..."
                  value={formData.cover_letter}
                  onChange={(e) =>
                    handleInputChange('cover_letter', e.target.value)
                  }
                  className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 focus:border-[#F5BB07] focus:ring-2 focus:ring-[#F5BB07]/20 rounded-xl min-h-[200px] md:min-h-[250px] text-base transition-all duration-200 resize-none"
                  required
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-white/80 px-2 py-1 rounded-md">
                  {formData.cover_letter.length} characters
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="relative mb-8 md:mb-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-sm text-gray-400 font-medium">
                  Optional
                </span>
              </div>
            </div>

            {/* Proposed Rate Section */}
            <div className="space-y-4 mb-10 md:mb-12">
              <div className="flex items-start gap-3">
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-2 rounded-lg shadow flex-shrink-0 mt-1">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <Label
                    htmlFor="proposed_rate"
                    className="text-gray-800 font-semibold text-lg block mb-1"
                  >
                    Proposed Rate
                  </Label>
                  <p className="text-sm md:text-base text-gray-500">
                    Leave blank to accept the student's budget
                  </p>
                </div>
              </div>

              <div className="relative max-w-md">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-lg pointer-events-none">
                  $
                </div>
                <Input
                  id="proposed_rate"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="000.00"
                  value={formData.proposed_rate}
                  onChange={(e) =>
                    handleInputChange('proposed_rate', e.target.value)
                  }
                  className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 rounded-xl pl-10 pr-4 h-14 text-lg transition-all duration-200"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="space-y-4">
              <Button
                type="submit"
                disabled={isSubmitting || !jobId}
                className="
                    w-full sm:w-auto sm:min-w-[300px]
                    mx-auto block
                    px-10 md:px-14 py-4 md:py-5
                    text-base md:text-lg font-semibold text-white
                    rounded-full
                    shadow-md hover:shadow-lg
                    bg-[#F6CF5D]
                    hover:bg-[#fdcf46]
                    transition-all duration-300
                    flex items-center justify-center gap-3
                    transform hover:scale-[1.03] active:scale-[0.98]
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                "
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Submitting Application...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Application
                  </>
                )}
              </Button>

              {!jobId && (
                <div className="text-center bg-red-50 border-2 border-red-200 rounded-xl p-4 animate-pulse">
                  <p className="text-red-600 text-sm md:text-base font-medium">
                    ⚠️ Job ID is required to submit an application
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Help Text */}
          <div className="text-center text-gray-500 text-xs md:text-sm bg-white/60 backdrop-blur-sm rounded-2xl p-4 md:p-6 max-w-2xl mx-auto">
            <p>
              By submitting this application, you agree to be contacted by the
              student regarding this opportunity. Make sure your profile is up
              to date for the best chance of success.
            </p>
          </div>
        </form>
      </div>

      {/* Bottom decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F5BB07]/5 to-transparent pointer-events-none" />
    </div>
  );
}
