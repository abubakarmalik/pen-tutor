// terms.jsx
// Place this file in your Next.js project under `/pages/terms.jsx` (Pages Router)
// or copy the component into `app/terms/page.jsx` (App Router) as a server component.

export default function Terms() {
    return (
        <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto bg-white shadow-md rounded-2xl p-8 lg:p-12">
                <header className="mb-8">
                    <h1 className="text-3xl font-semibold text-gray-900">Terms &amp; Conditions</h1>
                    <p className="mt-2 text-sm text-gray-600">Effective date: September 2, 2025</p>
                </header>

                <article className="space-y-8 text-gray-800">
                    <section>
                        <h2 className="text-xl font-semibold">1. Introduction</h2>
                        <p className="mt-2">This Terms &amp; Conditions agreement (the “Agreement”) governs your access to and use of the services provided by <strong>Pen Tutor</strong> ("we", "us", "our"). By accessing or using the Pen Tutor website, mobile applications, and related services (collectively, the "Service"), you agree to be bound by this Agreement. If you do not agree with these terms, you must not use the Service.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">2. Interpretation and Definitions</h2>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            <li><strong>Service:</strong> the website, mobile applications, and any other online services provided by Pen Tutor.</li>
                            <li><strong>User:</strong> any person or legal entity accessing the Service, including Students and Tutors.</li>
                            <li><strong>Student:</strong> a User who books and participates in lessons, classes or tutoring sessions through the Service.</li>
                            <li><strong>Tutor:</strong> a User who offers, schedules, or provides lessons, classes or tutoring through the Service.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">3. Eligibility</h2>
                        <p className="mt-2">Pen Tutor permits registration by users of all ages. However, users under 18 years of age must register and use the Service with the involvement and consent of a parent or legal guardian. By registering on behalf of a minor you represent and warrant that you are that minor’s parent or legal guardian and you consent to this Agreement on the minor’s behalf.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">4. Account Registration and Security</h2>
                        <p className="mt-2">You must register for an account to use certain features of the Service. You agree to provide accurate, current and complete information during registration and to update such information to keep it accurate. You are responsible for safeguarding your account credentials and for all activity that occurs under your account. Notify us immediately at <a href="mailto:info@pentutor.com" className="text-indigo-600 hover:underline">info@pentutor.com</a> if you suspect unauthorized use of your account.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">5. Services, Bookings and Scheduling</h2>
                        <p className="mt-2">Pen Tutor operates an online service that connects Students with Tutors. Tutors set their own availability and, where permitted, their own per-session prices. Students book sessions through the Service in accordance with the booking, scheduling, and confirmation workflows implemented in the platform. The Service may provide tools for rescheduling and cancelling bookings; Users must follow the platform workflow when cancelling or rescheduling sessions.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">6. Payments and Off‑Platform Transfers</h2>
                        <p className="mt-2"><strong>6.1 On‑Platform Payments.</strong> Where available, payments for sessions are processed through third‑party payment processors engaged by Pen Tutor. By using these payment methods you agree to the payment processor’s terms and fees.</p>
                        <p className="mt-2"><strong>6.2 Per‑Session Model.</strong> Pen Tutor operates on a per‑session payment model for bookings made through the platform. Any platform fees, commissions, or applicable taxes will be disclosed during checkout.</p>
                        <p className="mt-2"><strong>6.3 Off‑Platform/Direct Transfers.</strong> Pen Tutor is not responsible for any direct, off‑platform transfers between Users (for example, payments made directly by a Student to a Tutor outside the Service). We strongly recommend that all payments for sessions booked through the Service be completed using platform-supported payment methods to preserve consumer protections.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">7. Free Trials; Refunds and Cancellations</h2>
                        <p className="mt-2"><strong>7.1 Free Trial Sessions.</strong> Pen Tutor may offer free trial sessions at its discretion. Free trials are subject to the platform’s trial terms and may be limited to one trial per User or other restrictions.</p>
                        <p className="mt-2"><strong>7.2 No Refunds After Payment.</strong> Except as required by applicable law or as otherwise stated in a specific product’s terms, all paid bookings are non‑refundable after payment has been completed. By booking a paid session you acknowledge and agree that payments are final, subject only to limited exceptions for technical payment errors, fraud, or where we determine at our sole discretion that a refund is appropriate.</p>
                        <p className="mt-2"><strong>7.3 Cancellation and Rescheduling.</strong> Cancellation and rescheduling rules (including any windows, penalties or credits) are governed by the specific class or Tutor policy displayed at checkout. If disagreements arise between Students and Tutors concerning cancellations, both parties should use the platform’s dispute workflow; Pen Tutor may, at its discretion, mediate and resolve disputes.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">8. Tutor Status, Verification and Responsibilities</h2>
                        <p className="mt-2"><strong>8.1 Independent Contractors.</strong> Tutors on Pen Tutor act as independent contractors and not as employees, agents or partners of Pen Tutor, unless explicitly agreed in writing.</p>
                        <p className="mt-2"><strong>8.2 Verification &amp; Screening.</strong> All Tutors undergo a thorough verification and interview process before being permitted to offer services on the platform. Verification activities may include identity verification, qualification checks and interviews. Successful completion of our checks does not constitute an endorsement or guarantee of teaching quality.</p>
                        <p className="mt-2"><strong>8.3 Tutor Obligations.</strong> Tutors are responsible for the content and delivery of their lessons, including ensuring that they hold any necessary qualifications to provide instruction in their subject area. Tutors must comply with these Terms and all applicable laws and regulations.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">9. Content Ownership and Licensing</h2>
                        <p className="mt-2"><strong>9.1 Tutor Materials.</strong> Tutors retain ownership of their original teaching materials (text, presentations, lesson plans, etc.). By uploading materials or delivering lessons through the Service, Tutors grant Pen Tutor a worldwide, non‑exclusive, royalty‑free license to host, reproduce, distribute and display those materials for the purpose of providing the Service and for internal business operations.</p>
                        <p className="mt-2"><strong>9.2 Student Recordings.</strong> Recording of lessons is strictly subject to the platform’s recording settings and the agreement of all parties. Students and Tutors must obtain consent before recording. Unauthorized recording, sharing, or distribution of lesson content is prohibited and may result in account suspension or termination.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">10. User Conduct and Prohibited Activities</h2>
                        <p className="mt-2">Users must not engage in any activity that: (a) interferes with or damages the Service; (b) violates applicable law or the rights of others; (c) is fraudulent, abusive, harassing, defamatory or discriminatory; or (d) involves sharing illegal or sexually explicit content. Pen Tutor may remove or refuse to display content and may restrict, suspend or terminate accounts that breach these terms.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">11. Reviews and User Feedback</h2>
                        <p className="mt-2">Users may post ratings and reviews of Tutors and sessions. Such feedback must be honest and based on actual experience. Pen Tutor reserves the right to remove or edit reviews that violate platform policies, are defamatory, or appear to be spam or fake.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">12. Intellectual Property</h2>
                        <p className="mt-2">All intellectual property rights in the Service (including trademarks, logos, website content and software) are owned by Pen Tutor or licensed to Pen Tutor. Users may not copy, modify, distribute, sell, or lease any part of the Service or included software without prior written consent.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">13. Privacy and Personal Data</h2>
                        <p className="mt-2">Our use of personal data is governed by our Privacy Policy, which describes how we collect, use and share personal information. By using the Service you consent to the collection and use of your information as described in the Privacy Policy. For privacy‑related questions contact <a href="mailto:info@pentutor.com" className="text-indigo-600 hover:underline">info@pentutor.com</a>.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">14. Disclaimers and No Professional Advice</h2>
                        <p className="mt-2">The Service is provided "as is" and "as available." Pen Tutor does not warrant that the Service will be uninterrupted or error‑free. Tutors are responsible for the content of their instruction and are not authorized to provide professional medical, legal, or other regulated advice unless they are properly qualified and licensed to do so in the relevant jurisdiction.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">15. Limitation of Liability</h2>
                        <p className="mt-2">To the fullest extent permitted by applicable law, Pen Tutor, its officers, directors, employees and agents shall not be liable for any indirect, incidental, special, punitive or consequential damages arising out of or in connection with your use of the Service. Where liability cannot be excluded, Pen Tutor’s aggregate liability shall be limited to the amount paid by the User to Pen Tutor in the twelve (12) months immediately preceding the claim.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">16. Indemnification</h2>
                        <p className="mt-2">You agree to indemnify, defend and hold harmless Pen Tutor and its affiliates from and against any claims, damages, losses or liabilities arising from (a) your use of the Service, (b) your violation of these Terms, or (c) your violation of any rights of a third party.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">17. Termination and Suspension</h2>
                        <p className="mt-2">Pen Tutor may suspend or terminate access to the Service, or specific accounts, for breach of these Terms or applicable law. Users may close their accounts at any time via account settings. Termination does not relieve either party of obligations that accrued prior to termination.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">18. Governing Law and Dispute Resolution</h2>
                        <p className="mt-2">This Agreement shall be governed by and construed in accordance with the laws of the Islamic Republic of Pakistan. For Users accessing the Service from the United Arab Emirates, UAE law will apply to matters arising within the UAE to the extent such application is required by local law.</p>
                        <p className="mt-2">Where possible, disputes should first be attempted to be resolved in good faith through direct negotiation or the platform’s dispute resolution workflow. If disputes cannot be resolved amicably, the parties agree to submit the dispute to arbitration in Pakistan (or in the UAE for disputes arising from operations in the UAE) under the rules of a mutually agreed arbitration provider. If arbitration is not available or enforceable, the parties may bring proceedings in the courts of the relevant jurisdiction.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">19. Changes to These Terms</h2>
                        <p className="mt-2">We may modify these Terms from time to time. If we make material changes we will provide notice via the Service or by email and update the effective date above. Continued use of the Service after changes are posted constitutes acceptance of the updated Terms.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">20. Contact and Legal Notices</h2>
                        <p className="mt-2">For support, privacy inquiries, or legal notices, contact us at:</p>
                        <address className="mt-2 not-italic text-sm text-gray-700">Pen Tutor — Legal &amp; Support<br />Email: <a href="mailto:info@pentutor.com" className="text-indigo-600 hover:underline">info@pentutor.com</a></address>
                    </section>

                    <section className="pt-6 border-t">
                        <h3 className="text-lg font-semibold">TL;DR</h3>
                        <ul className="list-disc list-inside mt-2 text-sm text-gray-700">
                            <li>Pen Tutor connects Students and Tutors for paid per‑session lessons.</li>
                            <li>Free trial sessions may be offered; paid sessions are generally non‑refundable.</li>
                            <li>Tutors are thoroughly screened and act as independent contractors.</li>
                            <li>Pen Tutor is not responsible for off‑platform direct transfers between Users.</li>
                            <li>By using the Service you agree to these Terms and to our Privacy Policy.</li>
                        </ul>
                    </section>
                </article>
            </div>
        </main>
    )
}
