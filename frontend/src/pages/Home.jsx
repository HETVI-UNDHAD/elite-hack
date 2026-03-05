import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();

  const stats = [
    { number: '6000+', label: 'Students Joined', desc: 'Active learners participating in events across various domains' },
    { number: '90%', label: 'Attendance Rate', desc: 'High engagement with seamless registration and tracking' },
    { number: '85%', label: 'Time Saved', desc: 'Automated workflows reducing manual coordination efforts' },
    { number: '15+', label: 'Organizations', desc: 'Trusted by colleges, companies, and communities nationwide' }
  ];

  const features = [
    { icon: '🎯', title: 'Smart Event Creation', desc: 'Intuitive interface for creating events with custom registration forms' },
    { icon: '👥', title: 'Team Management', desc: 'Seamless team formation with invite codes and approval workflows' },
    { icon: '📱', title: 'Easy Registration', desc: 'Simple sign-up process with instant confirmation and updates' },
    { icon: '📊', title: 'Analytics Dashboard', desc: 'Comprehensive insights on registrations and participation' },
    { icon: '🔔', title: 'Notifications', desc: 'Automated email updates for registrations and event changes' },
    { icon: '🔒', title: 'Secure Access', desc: 'Role-based permissions with JWT authentication' }
  ];

  const testimonials = [
    { name: 'Priya Sharma', role: 'Event Coordinator', text: 'EventNexus transformed how we manage our college tech fests. The team registration feature saved us countless hours!' },
    { name: 'Rahul Verma', role: 'Student', text: 'Registering for events has never been easier. I love the QR code attendance feature!' },
    { name: 'Dr. Amit Patel', role: 'Department Head', text: 'The analytics dashboard gives us real-time insights. Highly recommend for any organization.' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm font-semibold mb-4">TRUSTED BY 6,000+ PARTICIPANTS ACROSS INDIA</p>
          <h1 className="text-5xl font-bold mb-6">Intelligent Event Management for All</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            From seamless registration systems for organizations to hassle-free event participation for attendees,
            we enable communities to thrive through accessible, future-focused event experiences
          </p>
          {!user && (
            <div className="flex gap-4 justify-center">
              <Link to="/register" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 shadow-lg">
                Get Started
              </Link>
              <Link to="/login" className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all">
                Login to EventNexus
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <h3 className="text-4xl font-bold text-blue-600 mb-2">{stat.number}</h3>
                <p className="font-semibold text-gray-800 mb-2">{stat.label}</p>
                <p className="text-sm text-gray-600">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-4">Why Choose EventNexus</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Comprehensive event management designed to transform your experience with industry-leading features
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="card text-center hover:shadow-lg transition">
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Success Stories</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-white p-6 rounded-lg shadow">
                <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Let's Build the Future of Events Together</h2>
          <p className="text-lg mb-8">Join thousands of organizers and participants transforming event management</p>
          {!user && (
            <Link to="/register" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 inline-block shadow-lg">
              Get Started Today
            </Link>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">EventNexus</h3>
              <p className="text-gray-400">Intelligent event management bridging the gap between organizers and participants</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <div className="space-y-2">
                <Link to="/about" className="block text-gray-400 hover:text-white">About Us</Link>
                <Link to="/login" className="block text-gray-400 hover:text-white">Contact Us</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <Link to="/register" className="block text-gray-400 hover:text-white">Register</Link>
                <Link to="/login" className="block text-gray-400 hover:text-white">Login</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-6 text-center text-gray-400">
            <p>© 2025 EventNexus. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
