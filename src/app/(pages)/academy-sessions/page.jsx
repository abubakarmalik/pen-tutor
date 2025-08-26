import Image from "next/image"
import HeroImg from "@/assets/images/pages/academy-sessions/acadmey-hero.png"
import Meeting from "@/assets/images/pages/academy-sessions/academy-meeting.png"

export default function AcademySessionsPage() {
    return (
        <div className="min-h-screen" style={{ backgroundColor: "#E0F7F7" }}>
            {/* Hero Section */}
            <section className="container mx-auto px-4 py-16">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                    <div className="flex-1">
                        <Image
                            src={HeroImg}
                            alt="Online Academy Sessions Illustration"
                            width={500}
                            height={400}
                            className="w-full h-auto"
                        />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: "#313D6A" }}>
                            Online Academy Sessions
                        </h1>
                    </div>
                </div>
            </section>

            {/* Academy Sessions Description */}
            <section className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-2xl font-bold mb-8" style={{ color: "#313D6A" }}>
                        ACADEMY SESSIONS
                    </h2>
                    <p className="text-gray-700 text-lg leading-relaxed">
                        Pen Tutor is a platform providing education in all types of modes to make quality education accessible to
                        every child. Pen Tutor arrange highly professional and engaging Online Academy Sessions. These academy
                        sessions fulfill the basic study needs of every student. Our We focus on the problem of each student. Pen
                        tutor aim is to facilitate the students with a better learning platform to engage the students in a
                        challenging atmosphere to give a boost to the efforts towards their dreams.
                    </p>
                </div>
            </section>

            {/* Unique Strategy Section */}
            <section className="container mx-auto px-4 py-16">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-2xl font-bold text-center mb-12" style={{ color: "#313D6A" }}>
                        PEN TUTOR UNIQUE STRATEGY OF ONLINE ACADEMY SESSIONS
                    </h2>

                    <div className="grid lg:grid-cols-2 gap-12 items-start mb-12">
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: "#313D6A" }}></div>
                                <p className="text-gray-700 leading-relaxed">
                                    Pen Tutor Online Academy session characteristics are engaging environment, challenging the atmosphere,
                                    provoking knowledge, skill development and self-determination.
                                </p>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: "#313D6A" }}></div>
                                <p className="text-gray-700 leading-relaxed">
                                    Pen Tutor environment offers many advantages to the learner. This includes self-direction, active
                                    learning, executive functioning and self-regulatory skills. We ensure the active involvement of every
                                    student in the entire learning session, well- planned task orientation with achievable study goals.
                                </p>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: "#313D6A" }}></div>
                                <p className="text-gray-700 leading-relaxed">
                                    Our well organized online academy sessions increase self-development, self-motivation, investigation
                                    of issues, the curiosity of knowledge, critical thinking abilities, and time
                                </p>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: "#313D6A" }}></div>
                                <p className="text-gray-700 leading-relaxed">
                                    management skills in students. Our certified staff able the students to test their thinking, deep
                                    learning skills, achieve higher order activities like the investigation of issues, evaluation of
                                    problems and creative learning methods.
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <Image
                                src={Meeting}
                                alt="Online Academy Learning Platform"
                                width={500}
                                height={400}
                                className="w-full h-auto max-w-md"
                            />
                        </div>
                    </div>

                    {/* Additional Benefits */}
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: "#313D6A" }}></div>
                            <p className="text-gray-700 leading-relaxed">
                                Our academy's precise schedule, test schedules, weekly assessments and feedbacks, regular and organize
                                work hours to ensure the progress of students. Pen Tutor coaches are enlisted with multidisciplinary
                                abilities in all study fields to fulfil the learning needs of students.
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: "#313D6A" }}></div>
                            <p className="text-gray-700 leading-relaxed">
                                Member of entire class often experiences a sense of belongingness which empowers to make positive
                                changes. It Adds to the installation of ambition and self-advocacy that can be gained seeing from
                                similar students making positive changes.
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: "#313D6A" }}></div>
                            <p className="text-gray-700 leading-relaxed">
                                Online academy sessions are more engaging and more profitable. A competitive and challenging environment
                                makes the student improve themselves in real terms.
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: "#313D6A" }}></div>
                            <p className="text-gray-700 leading-relaxed">
                                Our discussion base studies make students learn innovative learning methods and boost up their
                                creativity. Academy sessions are profitable in economic terms and enlist you with a number of skills.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
