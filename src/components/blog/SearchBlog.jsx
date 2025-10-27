'use client';

export default function SearchBlog() {
  return (
    <section className="relative bg-[#FFFCE0] flex flex-col items-center justify-center py-10">
      {/* Header Button */}
      <div className="bg-[#F5BB07] text-[#313D6A] font-bold text-xl px-6 py-2 rounded-t-lg -mb-3 z-10 shadow-md">
        Search Blog
      </div>

      {/* Background Bar */}
      <div className="relative w-[90%] md:w-3/4 lg:w-2/3 bg-[#313D6A] rounded-b-[3rem] rounded-t-[3rem] px-6 py-8 shadow-xl overflow-hidden">
        {/* Inner Image Overlay (optional background blur or pattern) */}
        <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-cover bg-center opacity-10"></div>

        {/* Input */}
        <div className="relative z-10 flex flex-col items-center gap-4">
          <input
            type="text"
            placeholder="Enter Your Required Course"
            className="w-full md:w-4/5 px-6 py-3 text-gray-700 rounded-full shadow-inner focus:outline-none focus:ring-4 focus:ring-[#F5BB07] text-center text-base md:text-lg"
          />
          <button className="bg-[#F5BB07] text-[#313D6A] font-bold px-8 py-2 rounded-full hover:bg-[#F5BB07]/90 transition">
            Search
          </button>
        </div>
      </div>
    </section>
  );
}
