import Image from "next/image";
import React from "react";
import { Button } from "@/components/ui/button";
import BannerImage from "@/assets/images/home/banner.png";
import Link from "next/link";

// CTA component: "Ready To Join?" banner
// Props: backgroundImage (string url) - optional. Replace sampleImage with your actual asset path.
export default function Banner() {

    return (
        <section className="max-w-7xl mx-auto py-12">
            <div className="container mx-auto px-6 relative rounded-2xl overflow-hidden">
                {/* Background image */}
                <div className="absolute inset-0">
                    <Image
                        src={BannerImage}
                        alt="People celebrating - CTA background"
                        layout="responsive"
                        objectFit="cover"
                        className="object-center w-full h-full"
                        priority
                    />
                </div>

                {/* dark overlay to match screenshot */}
                <div className="absolute inset-0 bg-slate-900/45" />

                {/* decorative teal circle (left) */}
                <div className="absolute -left-12 top-6 w-36 h-36 rounded-full bg-teal-300/80 blur-sm" />

                {/* dotted decorative SVG (top center) */}
                <div className="absolute left-1/2 transform -translate-x-1/2 top-6 opacity-30">
                    <svg width="96" height="24" viewBox="0 0 96 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g fill="white">
                            {Array.from({ length: 12 }).map((_, i) => (
                                <circle key={i} cx={4 + i * 8} cy={12} r="2" />
                            ))}
                        </g>
                    </svg>
                </div>

                {/* content */}
                <div className="relative z-10 px-6 py-12 md:py-16 md:px-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex-1 text-white">
                        <h2 className="text-3xl md:text-5xl font-extrabold leading-tight">Ready To<br />Join?</h2>
                    </div>

                    <div className="flex-shrink-0">
                        <Link href="/register">
                            <Button className="bg-yellow-400 hover:bg-yellow-500 text-white rounded-lg px-8 py-7 text-lg font-semibold shadow-md hover:brightness-95">
                                Register Now
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
