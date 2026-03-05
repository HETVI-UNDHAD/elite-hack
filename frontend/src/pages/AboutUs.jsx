const AboutUs = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">About EventNexus</h1>
        
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            EventNexus is a comprehensive event management platform designed to streamline the process of organizing, 
            managing, and participating in events. We aim to make event coordination effortless for organizers while 
            providing participants with a seamless registration and attendance experience.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">What We Offer</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold text-primary-600 mb-2">For Organizers</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Easy event creation and management</li>
                <li>Team registration support</li>
                <li>Real-time attendance tracking</li>
                <li>Analytics and insights</li>
                <li>QR code-based check-ins</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-primary-600 mb-2">For Participants</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Browse and discover events</li>
                <li>Individual or team registration</li>
                <li>Team creation and management</li>
                <li>Registration status tracking</li>
                <li>Digital attendance records</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Us</h2>
          <p className="text-gray-600 leading-relaxed">
            Have questions or need support? Reach out to us at{' '}
            <a href="mailto:support@eventnexus.com" className="text-primary-600 hover:underline">
              support@eventnexus.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
