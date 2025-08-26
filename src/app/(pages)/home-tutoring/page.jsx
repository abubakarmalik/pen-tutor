import HeroImg from "@/assets/images/pages/home-tutoring/home-hero.png"
import subjectImg from "@/assets/images/pages/home-tutoring/subjects.png"
import benifitsImg from "@/assets/images/pages/home-tutoring/benifits.png"
import Image from "next/image"


export default function HomeTutoringPage() {
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Hero Section */}
            <section className="relative py-16 px-4 md:py-24">
                <div className="max-w-7xl mx-auto">
                    <div className="container mx-auto justify-center grid lg:grid-cols-2 gap-12 items-end">
                        {/* Hero Image */}
                        <div className="order-2 lg:order-1">
                            <Image
                                src={HeroImg}
                                width={600}
                                height={400}
                                alt="Home tutoring illustration showing tutor helping student"
                                className="w-full h-auto rounded-lg"
                            />
                        </div>

                        {/* Hero Content */}
                        <div className="order-1 lg:order-2 text-center lg:text-left">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6" style={{ color: "#313D6A" }}>
                                Home Tutoring Service
                            </h1>
                        </div>
                    </div>
                </div>
            </section>

            {/* Description Section */}
            <section className="py-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-lg leading-relaxed text-gray-700">
                        <strong>Pen Tutor</strong> provides the best home tuition services all over Pakistan.{" "}
                        <strong>Home Tuition</strong> has the ability to solve the problems of students face by face. Our{" "}
                        <strong>private home tutors</strong> have the capability to quickly identify the weak areas of your kids and{" "}
                        <strong>solve their problems in an efficient way.</strong>
                    </p>
                </div>
            </section>

            {/* Three Main Sections */}
            <section className="py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-12">
                        {/* Subjects Section */}
                        <div className="text-center">
                            <div className="flex justify-center mb-8">
                                <Image
                                    src={subjectImg}
                                    width={100}
                                    height={100}
                                    alt="Subjects illustration showing different subjects"
                                    className="w-32 h-32 rounded-full flex items-center justify-center"
                                />
                            </div>
                            <h2 className="text-2xl font-bold mb-6" style={{ color: "#313D6A" }}>
                                SUBJECTS
                            </h2>
                            <p className="text-gray-700 leading-relaxed">
                                Pen Tutor provides the tutors of all the classes. Starting from grade 1 to university studies we provide
                                tutors of all subjects you need help in. We provide tutors for English, Mathematics, Chemistry, Biology,
                                Physics, and Urdu. We also provide individual course coaching for all types of courses including
                                computer courses, language courses, web development, and graphics. Individual test coaching is also
                                provided by us.
                            </p>
                        </div>

                        {/* Smart Learning Solutions Section */}
                        <div className="text-center">
                            <h2 className="text-2xl font-bold mb-6" style={{ color: "#313D6A" }}>
                                SMART LEARNING SOLUTIONS
                            </h2>
                            <p className="text-gray-700 leading-relaxed">
                                Students often face problems in the classroom to ask questions and get limited attention. At school,
                                there is limited time available for the teacher to meet the requirements of every individual student.
                                Home tuition is the best solution to this kind of problem. Our regular teachers give proper attention to
                                create interest of students in the subjects they lack and encourage them to ask questions. Our tutors
                                focus on the specific subjects and areas your child may be struggling with. We know how to get the best
                                out of a student.
                            </p>
                        </div>

                        {/* Benefits Section */}
                        <div className="text-center">
                            <div className="flex justify-center mb-8">
                                <Image
                                    src={benifitsImg}
                                    width={100}
                                    height={100}
                                    alt="Benefits illustration showing different benefits"
                                    className="w-32 h-32 flex items-center justify-center"
                                />
                            </div>
                            <h2 className="text-2xl font-bold mb-6" style={{ color: "#313D6A" }}>
                                BENEFITS OF HOME TUTORING WITH PEN TUTOR
                            </h2>
                            <p className="text-gray-700 leading-relaxed">
                                Our tutors create reliable contact with students and parents to understand the student problems. we
                                follow a precise class schedule, and also provide weekly progress reports and the right kind of exam
                                techniques. Our experienced teachers use the best emerging teaching methods to create interest of
                                students and turn their weaknesses into strengths. With many years of teaching experience, we know that
                                children make remarkable progress with home tutors in only a few weeks.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}