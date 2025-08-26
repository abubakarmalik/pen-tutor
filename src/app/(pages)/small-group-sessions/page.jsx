import HeroImg from "@/assets/images/pages/small-group-sessions/online-small-hero.png"
import girl from "@/assets/images/pages/small-group-sessions/girl-talk.png"
import Image from "next/image"

export default function SmallGroupSessionsPage() {
    return (
        <div className="min-h-screen" style={{ backgroundColor: "#F3F0FF" }}>
            {/* Hero Section */}
            <section className="px-4 py-16 md:py-24">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8" style={{ color: "#313D6A" }}>
                                Online Small Group Sessions
                            </h1>
                        </div>
                        <div className="flex justify-center">
                            <Image
                                width={500}
                                height={400}
                                src={HeroImg}
                                alt="Online small group sessions illustration"
                                className="w-full max-w-md h-auto"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Small Group Coaching Section */}
            <section className="px-4 py-16">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-8" style={{ color: "#313D6A" }}>
                        SMALL GROUP COACHING SESSION
                    </h2>
                    <p className="text-gray-700 text-lg leading-relaxed">
                        Pen Tutor is providing a greater opportunity for students to engage themselves in small group coaching
                        sessions to enhance their study skills, critical thinking abilities and self-directed learning. Pen Tutor
                        arranges small group coaching sessions that help students to do what is needed to move closer to their
                        goals. Our small group coaching sessions enhance academic skill development and improve communication
                        skills. Pen Tutor's aim is to facilitate the students with a better learning platform to engage themselves
                        in a challenging environment to uplift their dream of learning.
                    </p>
                </div>
            </section>

            {/* Unique Strategies Section */}
            <section className="px-4 py-16">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-16" style={{ color: "#313D6A" }}>
                        PEN TUTOR SMALL COACHING SESSIONS UNIQUE STRATEGIES
                    </h2>

                    <div className="grid md:grid-cols-2 gap-12 items-start">
                        {/* Left Column - Bullet Points */}
                        <div className="space-y-6">
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: "#313D6A" }}></div>
                                <p className="text-gray-700 leading-relaxed">
                                    Pen Tutor's small coaching sessions create a flexible but challenging environment for the student to
                                    work on their skills individually plus collectively to get maximum out of them.
                                </p>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: "#313D6A" }}></div>
                                <p className="text-gray-700 leading-relaxed">
                                    Our small coaching session tutors create a competitive environment, make students committed to work,
                                    create more structured and manageable work outlines.
                                </p>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: "#313D6A" }}></div>
                                <p className="text-gray-700 leading-relaxed">
                                    Our small group teaching sessions enhance the student interest, increase transfer of concepts to
                                    innovative ideas, teamwork ability, retention of knowledge, and skill development. It helps students
                                    develop self-motivation, investigate critical issues, allow them to test their thinking abilities and
                                    knowledge power.
                                </p>
                            </div>
                        </div>

                        {/* Right Column - Illustration */}
                        <div className="flex justify-center">
                            <Image
                                width={500}
                                height={400}
                                src={girl}
                                alt="Small group online session illustration"
                                className="w-full max-w-sm h-auto"
                            />
                        </div>
                    </div>

                    {/* Additional Points */}
                    <div className="mt-12 space-y-6">
                        <div className="flex items-start gap-3">
                            <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: "#313D6A" }}></div>
                            <p className="text-gray-700 leading-relaxed">
                                When all the students follow a precise schedule, it makes them committed to work and they can not leave
                                the work undone.
                            </p>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: "#313D6A" }}></div>
                            <p className="text-gray-700 leading-relaxed">
                                Pen tutor teachers are trained to help students get through every situation and lead them to right path.
                                Our small group coaching helps students to make them able to manage emotions that arise from daily work
                                stress and the demands of tough college life. With effective tools for stress management and emotion
                                control, it is easier for students to keep themselves motivated and persist.
                            </p>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: "#313D6A" }}></div>
                            <p className="text-gray-700 leading-relaxed">
                                Executive functioning, self-determination, learning new skills, improved academic performances are the
                                heritage of Pen Tutor small group coaching sessions. Our weekly assessment test contributes to student's
                                growth in the management of self manage academic, social and emotional facets of their lives.
                            </p>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: "#313D6A" }}></div>
                            <p className="text-gray-700 leading-relaxed">
                                Our coaching sessions ensure the active involvement of the learners in entire study cycles, well-planned
                                task orientation with achievable specific goals and objectives in a given time period.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Enrollment Section */}
            <section className="px-4 py-16">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-8" style={{ color: "#313D6A" }}>
                        ENROLL YOURSELF FOR BETTER EXPERIENCE
                    </h2>
                    <p className="text-gray-700 text-lg leading-relaxed">
                        We are providing exactly what your child needs. Our certified staff is equipped with all the essential
                        teaching techniques to make your child successive in his/her academic career. We offer you the most suitable
                        economic fee packages to let your child be a part of Pen Tutor's great academic environment. We provide all
                        what your child needs to be successful in his/her academic future.
                    </p>
                </div>
            </section>
        </div>
    )
}
