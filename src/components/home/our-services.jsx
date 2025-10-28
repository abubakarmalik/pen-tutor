import Image from "next/image"

import ChildPlay from "@/assets/images/home/childs-play.png"
import Child from "@/assets/images/home/child.png"
import Link from "next/link"

export default function OurServices() {
    return (
        <section className="relative min-h-screen bg-gradient-to-br from-amber-50 to-yellow-50 py-16 px-8 overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-yellow-100 to-yellow-300 rounded-full opacity-60 blur-"></div>

                {/* Medium yellow circle - bottom left */}
                <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-[#F5BB07] rounded-full opacity-40 blur-"></div>

                {/* Small accent circles */}
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#F5BB07] rounded-full opacity-30 blur-xl"></div>
                <div className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-[#F5BB07] rounded-full opacity-25 blur-lg"></div>

                {/* Geometric shapes */}
                <div className="absolute top-1/2 right-10 w-16 h-16 bg-[#F5BB07] opacity-20 rotate-45 rounded-lg"></div>
                <div className="absolute bottom-1/4 left-10 w-12 h-12 bg-[#313D6A] opacity-15 rotate-12 rounded-full"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl text-[#F5BB07] font-bold  mb-4">
                        Our <span className="text-[#313D6A]">Services</span>
                    </h2>
                </div>

                {/* Services Container */}
                <div className="space-y-20 lg:space-y-32">
                    {/* Home Tutoring Service */}
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                        {/* Image Container */}
                        <div className="relative order-2 lg:order-1">
                            <div className="relative h-64 md:h-80 lg:h-96 rounded-xl overflow-hidden">
                                <Image
                                    src={ChildPlay}
                                    alt="Children studying together for home tutoring"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="order-1 lg:order-2 space-y-6">
                            <div className="relative">
                                <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#313D6A] mb-6">Home Tutoring</h3>
                                {/* Small decorative circle */}
                                <div className="absolute -top-2 -right-8 w-6 h-6 bg-[#F5BB07] rounded-full opacity-70"></div>
                            </div>

                            <p className="text-gray-700 text-lg md:text-xl leading-relaxed">
                                If you are looking for qualified home tutors, your search ends here. Pen Tutor is providing tutors for
                                all the classes and all subjects your child needs help in. Our experienced tutors are available to give
                                your child 100% personalized attention and the freedom to ask questions resulting in improved
                                performance.
                            </p>

                            <Link href="/home-tutoring" className="bg-[#313D6A] hover:bg-[#313D6A]/90 text-white px-8 py-3 text-lg rounded-md shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                Read More
                            </Link>
                        </div>
                    </div>

                    {/* Online Tutoring Service */}
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                        {/* Content */}
                        <div className="space-y-6">
                            <div className="relative">
                                <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                                    <span className="text-[#313D6A]">Online </span>
                                    <span className="text-[#F5BB07]">Tutoring</span>
                                </h3>
                                {/* Small decorative circle */}
                                <div className="absolute -top-2 -left-8 w-6 h-6 bg-[#F5BB07] rounded-full opacity-70"></div>
                            </div>

                            <p className="text-gray-700 text-lg md:text-xl leading-relaxed">
                                If you are looking for qualified Online tutors, your search ends here. Pen Tutor is providing tutors for
                                all the classes and all subjects your child needs help in. Our experienced tutors are available to give
                                your child 100% personalized attention and the freedom to ask questions resulting in improved
                                performance.
                            </p>

                            <Link href="/online-tutoring" className="bg-[#313D6A] hover:bg-[#313D6A]/90 text-white px-8 py-3 text-lg rounded-md shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                Read More
                            </Link>
                        </div>

                        {/* Image Container */}
                        <div className="relative">

                            <div className="relative h-64 md:h-80 lg:h-96 rounded-xl overflow-hidden">
                                <Image
                                    src={Child}
                                    alt="Child using computer for online tutoring"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            {/* </div> */}
                            {/* </div> */}
                            {/* Decorative elements around image */}
                            <div className="absolute -top-6 -left-4 w-10 h-10 bg-[#F5BB07] rounded-full opacity-70"></div>
                            <div className="absolute -bottom-4 -right-6 w-8 h-8 bg-[#313D6A] rounded-full opacity-80"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
