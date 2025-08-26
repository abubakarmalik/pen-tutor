import { Button } from "@/components/ui/button"
import HeroBg from "@/assets/images/pages/online-tutoring/hero.png"
import Child from "@/assets/images/pages/online-tutoring/child.png"
import Session from "@/assets/images/pages/online-tutoring/small-session.png"
import Meeting from "@/assets/images/pages/online-tutoring/meeting.png"
import Image from "next/image"
import Link from "next/link"

export default function OnlineTutoring() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-gray-100 to-gray-200 py-16 px-4 md:py-24">
                <div className="max-w-7xl mx-auto">
                    <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
                        {/* Hero Image */}
                        <div className="order-2 lg:order-1">
                            <Image
                                width={600}
                                height={400}
                                src={HeroBg}
                                alt="Online tutoring illustration"
                                className="w-96 h-auto rounded-lg "
                            />
                        </div>

                        {/* Hero Content */}
                        <div className="order-1 lg:order-2 text-center lg:text-left">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6" style={{ color: "#313D6A" }}>
                                Online Tutoring Service
                            </h1>
                        </div>
                    </div>
                </div>
            </section>

            {/* Description Section */}
            <section className="py-16 px-4 bg-white">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-lg leading-relaxed mb-8 text-gray-700">
                        <strong>Pen Tutor</strong> provides the best home tuition services all over Pakistan.{" "}
                        <strong>Home Tuition</strong> has the ability to solve the problems of students face by face. Our{" "}
                        <strong>private home tutors</strong> have the capability to quickly identify the weak areas of your kids and{" "}
                        <strong>solve their problems in an efficient way.</strong>
                    </p>

                    <p className="text-lg leading-relaxed text-gray-700">
                        Pen Tutor provides the tutors of all the classes. Starting from{" "}
                        <strong>grade 1 to university studies</strong> we provide tutors of all subjects you need help in. We
                        provide tutors for <strong>English, Mathematics, Chemistry, Biology, Physics, and Urdu.</strong> we Also
                        provide individual course coaching for all types of courses including computer courses, language courses,
                        web development, and graphics. Individual test coaching is also provided by us
                    </p>

                    {/* Decorative dots */}
                    <div className="flex justify-center mt-12 space-x-2">
                        {[...Array(15)].map((_, i) => (
                            <div key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: "#313D6A" }}></div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Individual Group Sessions */}
            <section className="py-16 px-4 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: "#313D6A" }}>
                                Individual Group Sessions
                            </h2>
                            <p className="text-lg leading-relaxed text-gray-700 mb-8">
                                If you and your child are ready to take the next step in organizing his/her future plans and maximizing
                                their learning potential, contact us for certified teachers to make your dreams come true.
                            </p>
                            <Link href="/individual-sessions"
                                className="text-white font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
                                style={{ backgroundColor: "#F5BB07" }}
                            >
                                Read More
                            </Link>
                        </div>
                        <div>
                            <Image
                                width={500}
                                height={400}
                                src={Child}
                                alt="Student in individual study session"
                                className="w-96 h-auto rounded-lg"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Small Group Sessions */}
            <section className="py-16 px-4 bg-yellow-50">
                <div className="max-w-7xl mx-auto">
                    <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
                        <div className="order-2 lg:order-1">
                            <Image
                                width={500}
                                height={400}
                                src={Session}
                                alt="Small group online session"
                                className="w-96 h-auto rounded-lg"
                            />
                        </div>
                        <div className="order-1 lg:order-2">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: "#F5BB07" }}>
                                Small Group Sessions
                            </h2>
                            <p className="text-lg leading-relaxed text-gray-700 mb-8">
                                Pen Tutor is providing a greater opportunity for students to engage themselves in small group coaching
                                sessions to enhance their communication skills, digital skills, and leadership skills.
                            </p>
                            <Link
                                href="/small-group-sessions"
                                className="text-white font-semibold bg-[#313D6A] px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
                            >
                                Read More
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Academy Sessions */}
            <section className="py-16 px-4 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: "#313D6A" }}>
                                Academy Sessions
                            </h2>
                            <p className="text-lg leading-relaxed text-gray-700 mb-8">
                                Our competitive academy Session environment promotes the passion for learning and increases the interest
                                of students to their subjects, enhance problem-solving &critical thinking abilities.
                            </p>
                            <Link
                                href="/academy-sessions"
                                className="text-white font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
                                style={{ backgroundColor: "#F5BB07" }}
                            >
                                Read More
                            </Link>
                        </div>
                        <div>
                            <Image
                                width={500}
                                height={400}
                                src={Meeting}
                                alt="Academy classroom session"
                                className="w-96 h-auto rounded-lg"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
