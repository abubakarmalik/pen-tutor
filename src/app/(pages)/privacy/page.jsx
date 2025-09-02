// privacy.jsx
// Place this file in your Next.js project under `/pages/privacy.jsx` (Pages Router)
// or copy the component into `app/privacy/page.jsx` (App Router) as a server component.

export default function Privacy() {
    return (
        <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto bg-white shadow-md rounded-2xl p-8 lg:p-12">
                <header className="mb-8">
                    <h1 className="text-3xl font-semibold text-gray-900">Privacy Policy</h1>
                    <p className="mt-2 text-sm text-gray-600">Effective date: September 2, 2025</p>
                </header>

                <article className="space-y-8 text-gray-800">
                    <section>
                        <h2 className="text-xl font-semibold">1. Introduction</h2>
                        <p className="mt-2">This Privacy Policy explains how <strong>Pen Tutor</strong> ("we", "us", "our") collects, uses, discloses, and protects personal information when you use our website, mobile applications, and related services (collectively, the "Service"). By accessing or using the Service you consent to the practices described in this Policy.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">2. Information We Collect</h2>
                        <p className="mt-2">We collect information you provide directly and information collected automatically when you use the Service. Examples include:</p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            <li><strong>Account &amp; profile information:</strong> name, email address, phone number, profile photo, biography, qualifications (for Tutors), and other registration details.</li>
                            <li><strong>Payment &amp; billing information:</strong> payment card or bank details provided to our payment processors when you purchase sessions. Note: Pen Tutor does not store raw payment card numbers unless required by our payment processor integrations; we rely on third‑party payment providers to handle payment data.</li>
                            <li><strong>Session data:</strong> booking details, session date/time, subject, duration, messages exchanged between Users, and any files or materials uploaded for lessons.</li>
                            <li><strong>Communications:</strong> correspondence with support, dispute submissions, and feedback/reviews.</li>
                            <li><strong>Usage &amp; device data:</strong> IP address, device type, browser, operating system, pages visited, and usage logs collected via cookies and similar technologies.</li>
                            <li><strong>Recordings:</strong> lesson recordings where recording is enabled and consent is provided by all parties. Recording rules are subject to platform settings and separate consent mechanisms.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">3. How We Use Your Information</h2>
                        <p className="mt-2">We use personal data for purposes including but not limited to:</p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>Providing, operating, and improving the Service;</li>
                            <li>Processing payments and preventing fraud;</li>
                            <li>Managing bookings, scheduling and sending reminders;</li>
                            <li>Verifying Tutor credentials and performing background checks where applicable;</li>
                            <li>Communicating with Users and responding to support requests;</li>
                            <li>Personalizing the user experience and delivering relevant content;</li>
                            <li>Complying with legal obligations and enforcing our Terms &amp; Conditions; and</li>
                            <li>Analyzing usage to measure and improve the Service.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">4. Sharing and Disclosure</h2>
                        <p className="mt-2">We may share personal information as follows:</p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            <li><strong>With Tutors and Students:</strong> necessary booking and contact details are shared between Students and Tutors to enable lessons.</li>
                            <li><strong>Service providers:</strong> third‑party providers that perform services on our behalf (payment processors, video conferencing providers, hosting, analytics, email delivery). These providers are contractually limited to use information only as necessary to provide their services.</li>
                            <li><strong>Legal disclosures:</strong> where required by law, regulation, legal process, or to respond to lawful requests by public authorities.</li>
                            <li><strong>Business transfers:</strong> in connection with a merger, acquisition, reorganization or sale of assets, personal data may be transferred as part of that transaction.</li>
                            <li><strong>With consent:</strong> where you have provided consent for additional disclosures or sharing.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">5. Third‑Party Services and Links</h2>
                        <p className="mt-2">The Service may integrate or link to third‑party services (such as payment processors, video conferencing tools, analytics and social platforms). These third parties have their own privacy policies and may collect information independently. We recommend reviewing third‑party privacy notices before use. Pen Tutor is not responsible for the privacy practices of third parties.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">6. Cookies and Tracking Technologies</h2>
                        <p className="mt-2">We use cookies and similar technologies to operate the Service, remember preferences, and analyze usage. You can control cookies through your browser settings, but disabling cookies may affect functionality.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">7. Data Retention</h2>
                        <p className="mt-2">We retain personal data as long as necessary to provide the Service, fulfill legal obligations, resolve disputes, and enforce our agreements. When data is no longer required we will delete or anonymize it subject to applicable law.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">8. Security</h2>
                        <p className="mt-2">We implement reasonable technical and organizational measures to protect personal information. However, no method of transmission or storage is 100% secure. We cannot guarantee absolute security and encourage Users to take steps to protect their account credentials.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">9. Your Rights</h2>
                        <p className="mt-2">Depending on your jurisdiction, you may have rights over your personal data, including the right to access, correct, update, port, restrict or delete your data. To exercise any rights or for privacy inquiries, contact us at <a href="mailto:info@pentutor.com" className="text-indigo-600 hover:underline">info@pentutor.com</a>. We will respond in accordance with applicable law.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">10. Minors</h2>
                        <p className="mt-2">The Service may be used by minors with parental or guardian consent. If you are a parent or guardian and become aware your child has provided us with personal information without your consent, contact us at <a href="mailto:info@pentutor.com" className="text-indigo-600 hover:underline">info@pentutor.com</a> and we will take steps to remove the information where appropriate.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">11. International Data Transfers</h2>
                        <p className="mt-2">Pen Tutor operates in Pakistan and the UAE and may transfer personal data between these and other countries as needed to provide the Service. We apply safeguards required by applicable law to protect data transferred internationally.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">12. Changes to this Policy</h2>
                        <p className="mt-2">We may update this Privacy Policy from time to time. We will post the revised Policy on the Service with an updated effective date. Continued use of the Service after changes constitutes acceptance of the updated Policy.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">13. Contact</h2>
                        <p className="mt-2">If you have questions or requests regarding this Privacy Policy, contact us at:</p>
                        <address className="mt-2 not-italic text-sm text-gray-700">Pen Tutor — Privacy Team<br />Email: <a href="mailto:info@pentutor.com" className="text-indigo-600 hover:underline">info@pentutor.com</a></address>
                    </section>

                    <section className="pt-6 border-t">
                        <p className="text-sm text-gray-600">This Privacy Policy works together with our <a href="/terms" className="text-indigo-600 hover:underline">Terms &amp; Conditions</a>. Please review both documents carefully.</p>
                    </section>
                </article>
            </div>
        </main>
    )
}
