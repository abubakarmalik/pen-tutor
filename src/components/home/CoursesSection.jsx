"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import axios from "axios";
import Link from "next/link";

// Default export component: responsive courses section that follows the provided design
export default function CoursesSection() {

    const [courses, setCourses] = useState([]);
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const fetchCourses = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/courses`);
            console.log(res);
            setCourses(res.data.results);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    // const items = Array.from({ length: 6 }).map((_, i) => ({
    //     id: i + 1,
    //     title: "Adobe Photoshop: Beginner To Advance",
    //     rating: 4.8,
    //     reviews: { length: 579 },
    //     price: "20K PKR",
    //     videos: { length: 46 },
    //     quizzes: { length: 46 },
    //     thumbnail: "./sample.png",
    // }));

    return (
        <section className="bg-white py-12">
            {/* top divider */}
            <div className="w-full border-t-2 border-yellow-400/90"></div>

            <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12">

                <header className="text-center my-8">
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight flex items-center justify-center gap-3">
                        <span className="text-slate-700">Online</span>
                        <span className="text-yellow-400">Courses</span>
                    </h2>
                </header>

                {/* cards grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((c) => (
                        // {items.map((c) => (
                        <Card key={c.id} className="flex flex-row py-2 px-3 items-center gap-4 rounded-lg shadow-md">
                            <Link href={`/courses/details/${c.id}`} className="relative w-32 h-24 flex-shrink-0 rounded-md overflow-hidden">
                                <Image
                                    // src={c.thumbnail ? `${API_URL}${c.thumbnail}` : "/sample.png"}
                                    src={c.thumbnail ? c.thumbnail : "/sample.png"}
                                    alt={c.title}
                                    layout="fill"
                                    objectFit="cover"
                                    className="rounded-md w-full h-full"
                                />
                            </Link>

                            <CardContent className="p-0">
                                <h3 className="text-sm md:text-base font-semibold text-slate-800 leading-tight">
                                    {c.title}
                                </h3>

                                <div className="mt-2 flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2 text-xs md:text-sm">
                                        <span className="inline-flex items-center gap-1 text-amber-500">
                                            <Star size={14} />
                                            <strong className="text-sm">{c.rating}</strong>
                                            <span className="text-slate-400">({c.reviews.length})</span>
                                        </span>
                                    </div>

                                    <div className="text-sm font-semibold text-pink-500">{c.price}</div>
                                </div>

                                <div className="mt-3 text-xs text-slate-500 flex items-center gap-4">
                                    <span>{c.videos.length} Videos</span>
                                    <span className="inline-block">{c.quizzes.length} Quizzes</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* View All button centered */}
                <div className="flex justify-center mt-12">
                    <Link href="/courses">
                        <Button
                            variant="outline"
                            className="border-2 cursor-pointer border-yellow-300 text-yellow-500 hover:bg-yellow-50 px-8 py-4 rounded-lg text-lg font-semibold shadow-sm"
                        >
                            View All
                        </Button>
                    </Link>
                </div>

            </div>

            {/* bottom divider */}
            <div className="w-full border-t-2 border-yellow-400/90 mt-12"></div>
        </section>
    );
}
