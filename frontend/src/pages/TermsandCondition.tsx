

const TermsAndConditions = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">JobSprout Terms & Conditions</h1>
      <p className="text-sm text-gray-600 mb-2">Last Updated: [Date]</p>
      <ol className="list-decimal pl-6 space-y-4">
        <li>
          <strong>Conditions of Use:</strong> JobSprout ("the Platform") is offered to you conditioned on your acceptance of these terms. By accessing or using the Platform, you agree to be bound by these Terms & Conditions.
        </li>
        <li>
          <strong>Overview:</strong> Your use constitutes agreement to all terms herein. If you disagree, you must immediately cease using the Platform.
        </li>
        <li>
          <strong>Modifications:</strong> JobSprout reserves the right to modify these terms, features, or pricing at any time. Continued use after changes constitutes acceptance.
        </li>
        <li>
          <strong>Account Registration:</strong> You must provide accurate information during sign-up. You are responsible for maintaining account security (username/password) and all activities under your account. Misuse of accounts (e.g., impersonation, unauthorized access) is strictly prohibited.
        </li>
        <li>
          <strong>License Grant:</strong> JobSprout grants you a limited, non-exclusive, non-transferable license to access and use the Platform for personal/job-seeking purposes only. You may not reverse-engineer, modify, or create derivative works of the Platform or use automated tools to scrape data or overload servers.
        </li>
        <li>
          <strong>User Content:</strong> You retain ownership of resumes/profile data but grant JobSprout a global license to store/process this content. Prohibited content includes viruses, illegal material, or content violating third-party rights.
        </li>
        <li>
          <strong>Third-Party Services:</strong> The Platform integrates with Firebase (authentication/data storage), Azure Blob Storage (resume storage), and JSearch API (job listings). Your data may be subject to these providers' policies.
        </li>
        <li>
          <strong>Fees & Subscriptions:</strong> Premium features may require payment. All fees are non-refundable unless required by law. We reserve the right to correct pricing errors and cancel erroneous orders.
        </li>
        <li>
          <strong>Privacy:</strong> We collect personal data (emails, resumes, job applications) solely to operate the Platform. Data is encrypted and stored in Firebase/Azure. Read our full Privacy Policy.
        </li>
        <li>
          <strong>Disclaimer of Warranties:</strong> Job listings are sourced from third-party APIs; we do not verify their accuracy. The Platform is provided "as-is" without warranties of performance or uptime.
        </li>
        <li>
          <strong>Limitation of Liability:</strong> JobSprout is not liable for loss of resume data or job application details or indirect damages arising from Platform use.
        </li>
        <li>
          <strong>Indemnification:</strong> You agree to indemnify JobSprout against claims related to your misuse of the Platform or violation of these terms.
        </li>
        <li>
          <strong>Termination:</strong> We may suspend/terminate accounts for security risks (e.g., brute-force attacks) or violations of these terms. Upon termination, all licenses end and stored data may be deleted.
        </li>
        <li>
          <strong>Governing Law:</strong> These terms are governed by the laws of [Your Jurisdiction, e.g., Indonesia].
        </li>
        <li>
          <strong>Contact:</strong> For questions or data deletion requests, contact us at: [Your Email Address] [Your Physical Address (if applicable)].
        </li>
      </ol>
    </div>
  );
};

export default TermsAndConditions;