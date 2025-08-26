import { Button } from "@/components/ui/button"
import HeroBg from "@/assets/images/pages/individual-sessions/onine-hero.png"
import Child from "@/assets/images/pages/online-tutoring/child.png"
import Image from "next/image"
import Link from "next/link"

export default function IndividualSessionsPage() {
    return (
        <div className="min-h-screen" style={{ backgroundColor: "#FFFCE0" }}>
            {/* Hero Section */}
            <section className="container mx-auto py-16 px-4 md:py-24">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Hero Image */}
                        <div className="order-2 lg:order-1">
                            <Image
                                width={600}
                                height={400}
                                src={HeroBg}
                                alt="Online individual tutoring illustration"
                                className="w-full h-auto"
                            />
                        </div>

                        {/* Hero Content */}
                        <div className="order-1 lg:order-2 text-center lg:text-left">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6" style={{ color: "#313D6A" }}>
                                Online Individual Group Sessions
                            </h1>
                        </div>
                    </div>
                </div>
            </section>

            {/* Description Section */}
            <section className="py-8 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-lg leading-relaxed text-gray-700">
                        Pen tutor is a platform providing all types of national and international educational facilities. In this
                        modern era every day brings a new challenge for students to cope with. Pen tutor is the best guideline for
                        every student engaged in any kind of study area. It is difficult to find the best online tutor for yourself.
                        Pen tutor offer you trained and highly professional teachers to organize your workload.
                    </p>
                </div>
            </section>

            {/* Individual Coaching Section */}
            <section className="py-12 px-4">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-8" style={{ color: "#313D6A" }}>
                        INDIVIDUAL COACHING
                    </h2>

                    <div className="mb-12">
                        <p className="text-lg leading-relaxed text-gray-700 text-center max-w-5xl mx-auto">
                            It is by nature that no two students are the same and hence they pursue different life goals. Every child
                            needs guidance in his/her life to make the right decision since start. Pen tutor makes students able to
                            make strategies to help them in their work and assignments. Students often face the teacher's divided
                            attention in classrooms. Sometimes students are shy to ask questions and engage in a collective
                            environment. Pen Tutor Individual coaching is the best opportunity for students to learn without any
                            barrier. Pen Tutor teachers give their 100% attention to students to understand their problems.
                        </p>
                    </div>

                    {/* Student Image */}
                    <div className="mb-12 flex justify-center">
                        <Image
                            width={600}
                            height={400}
                            src={Child}
                            alt="Student studying at computer"
                            className="h-96 object-cover max-w-2xl rounded-md"
                        />
                    </div>

                    {/* Two Column Content */}
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Left Column */}
                        <div>
                            <h3 className="text-2xl font-bold mb-6" style={{ color: "#313D6A" }}>
                                Our Individual online Pen Tutor coaches focus on the following key areas to ensure student success.
                            </h3>

                            <ul className="space-y-4 text-gray-700">
                                <li className="flex items-start">
                                    <span
                                        className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                                        style={{ backgroundColor: "#313D6A" }}
                                    ></span>
                                    <span>
                                        <strong>Analyzing student weaknesses and struggling points.</strong> Then making a layout to
                                        overcome the lacking areas. Turning the weaknesses into strengths. Pen Tutor coaches motivate the
                                        students to get through hard study problems.
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <span
                                        className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                                        style={{ backgroundColor: "#313D6A" }}
                                    ></span>
                                    <span>
                                        <strong>Allowing students to set their list of goals and habits by</strong> developing a clear
                                        understanding of what they want from the future. This helps them to make better future decisions.
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <span
                                        className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                                        style={{ backgroundColor: "#313D6A" }}
                                    ></span>
                                    <span>
                                        <strong>Being more able to focus on their work with individual tutors,</strong> achieve their
                                        homework, and study with goals with less anxiety and depression.
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <span
                                        className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                                        style={{ backgroundColor: "#313D6A" }}
                                    ></span>
                                    <span>
                                        <strong>Maximum space is given to them to maximize their</strong> comfort and success. This
                                        fertilizes their work capabilities and enhance their vision making their mind more productive.
                                    </span>
                                </li>
                            </ul>
                        </div>

                        {/* Right Column */}
                        <div>
                            <ul className="space-y-4 text-gray-700">
                                <li className="flex items-start">
                                    <span
                                        className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                                        style={{ backgroundColor: "#313D6A" }}
                                    ></span>
                                    <span>
                                        <strong>Less distractive environment leads to creativity and</strong> command on subjects. Learn how
                                        to prioritize work plans and study hard to achieve learning goals. Being more organized with an
                                        effective tutor guide following a proper schedule is a key to success.
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <span
                                        className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                                        style={{ backgroundColor: "#313D6A" }}
                                    ></span>
                                    <span>
                                        <strong>100 % attention of tutor and an interactive environment</strong> is an effective and
                                        successful way as needed increase self-advocacy skills.
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <span
                                        className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                                        style={{ backgroundColor: "#313D6A" }}
                                    ></span>
                                    <span>
                                        <strong>Students can not always solve complex study problems</strong> on their own. They always need
                                        the right tutor to get them through all these problems and guide them to the right path. Pen Tutor
                                        teachers are the best qualified and trained teachers to help your kids in their study problems and
                                        enhance their understanding of the subject they feel tough. Daily sessions, test schedules and
                                        regular feedbacks enhance student motivation. When students feel success, they put more effort into
                                        their work and try harder happily and confidently. This program is designed for students to learn
                                        new skills, develop routines and eventually transform them into habits so they are able to execute
                                        themselves in right time.
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
