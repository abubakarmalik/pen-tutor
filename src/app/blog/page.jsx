'use client';

import BlogHeader from '@/components/blog/BlogHeader';
import BlogSection from '@/components/blog/BlogSection';
import SearchBlog from '@/components/blog/SearchBlog';
import { Search } from 'lucide-react';

export default function BlogPage() {
  const handleSearch = (query) => {
    console.log('Search query:', query);
  };

  return (
    <>
      <BlogHeader />
      <SearchBlog onSearch={handleSearch} />
      <BlogSection />
    </>
  );
}
