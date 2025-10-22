// pages/HelpSupport.js
import React, { useState } from 'react';
import { 
  FiHelpCircle, 
  FiMail, 
  FiMessageSquare, 
  FiBook, 
  FiSearch,
  FiChevronDown,
  FiChevronUp,
  FiExternalLink,
  FiVideo,
  FiFileText,
  FiUsers,
  FiPhone,
  FiClock,
  FiCheckCircle,
  FiStar,
  FiUser,
   
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

const HelpSupport = () => {
  const [activeCategory, setActiveCategory] = useState('general');
  const [openFaqs, setOpenFaqs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('faq');

  // FAQ Data
  const faqCategories = [
    {
      id: 'general',
      name: 'General',
      icon: FiHelpCircle,
      questions: [
        {
          question: 'How do I create my first invoice?',
          answer: 'To create your first invoice, go to the Invoices page and click the "New Invoice" button. Fill in the customer details, add items, set the due date, and click "Save". You can then send the invoice to your customer via email or download it as a PDF.',
          steps: [
            'Navigate to Invoices section',
            'Click "New Invoice" button',
            'Select customer or add new one',
            'Add products/services',
            'Set payment terms and due date',
            'Review and save'
          ]
        },
        {
          question: 'How can I add customers to my account?',
          answer: 'You can add customers by going to the Customers page and clicking "Add Customer". Fill in their basic information like name, email, phone, and address. You can also import multiple customers using our Excel template.',
          steps: [
            'Go to Customers page',
            'Click "Add Customer"',
            'Fill in customer details',
            'Save the information'
          ]
        },
        {
          question: 'Is my data secure with Devure?',
          answer: 'Yes, we take data security very seriously. All your data is encrypted using industry-standard AES-256 encryption. We regularly backup your data and our servers are monitored 24/7 for any security threats.'
        },
        {
          question: 'Can I use Devure on mobile devices?',
          answer: 'Yes! Devure is fully responsive and works perfectly on smartphones and tablets. You can access all features through your mobile browser.'
        }
      ]
    },
    {
      id: 'billing',
      name: 'Billing & Payments',
      icon: FiBook,
      questions: [
        {
          question: 'How do I update my payment method?',
          answer: 'You can update your payment method by going to Settings > Billing. Click on "Payment Methods" and then "Add New Payment Method". You can add credit/debit cards or connect your bank account for automatic payments.'
        },
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit and debit cards (Visa, MasterCard, American Express), PayPal, bank transfers, and UPI payments. International payments are also supported through our payment partners.'
        },
        {
          question: 'Can I change my subscription plan?',
          answer: 'Yes, you can upgrade or downgrade your subscription at any time. Go to Settings > Billing and click on "Change Plan". Your new plan will take effect immediately, and we\'ll prorate any differences in pricing.'
        }
      ]
    },
    {
      id: 'technical',
      name: 'Technical Support',
      icon: FiUsers,
      questions: [
        {
          question: 'The page is loading slowly. What should I do?',
          answer: 'If you\'re experiencing slow performance, try these steps: 1) Clear your browser cache, 2) Check your internet connection, 3) Try using a different browser, 4) Disable any browser extensions that might interfere. If the issue persists, contact our support team.',
          steps: [
            'Clear browser cache and cookies',
            'Check internet connection speed',
            'Try different web browser',
            'Disable interfering extensions',
            'Contact support if issue continues'
          ]
        },
        {
          question: 'How do I export my data?',
          answer: 'You can export your data by going to the respective section (Invoices, Customers, Products) and clicking the "Export" button. Choose your preferred format (Excel, CSV, or PDF) and the data range you want to export.'
        }
      ]
    },
    {
      id: 'account',
      name: 'Account Management',
      icon: FiUser,
      questions: [
        {
          question: 'How do I reset my password?',
          answer: 'Click on "Forgot Password" on the login page. Enter your email address and we\'ll send you a password reset link. Follow the instructions in the email to set a new password.'
        },
        {
          question: 'Can I have multiple users on one account?',
          answer: 'Yes, our Business and Enterprise plans support multiple users. You can add team members and assign them different roles and permissions from the Settings > Team section.'
        }
      ]
    }
  ];

  // Contact methods
  const contactMethods = [
    {
      icon: FiMail,
      title: 'Email Support',
      description: 'Send us an email and we\'ll respond within 24 hours',
      details: 'support@devure.com',
      action: 'mailto:support@devure.com',
      responseTime: 'Within 24 hours'
    },
    {
      icon: FiMessageSquare,
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      details: 'Available 9AM - 6PM IST',
      action: '#chat',
      status: 'online',
      responseTime: 'Instant'
    },
    {
      icon: FiPhone,
      title: 'Phone Support',
      description: 'Talk directly with our support specialists',
      details: '+91-XXX-XXXX-XXX',
      action: 'tel:+911234567890',
      responseTime: 'Immediate'
    },
    {
    icon: FaWhatsapp, // WhatsApp icon
    title: 'WhatsApp',
    description: 'Message us on WhatsApp for quick support',
    details: '+91-9520680204',
  action: 'https://wa.me/919520680204?text=Hello%20Devure%20Support%2C%20I%20need%20help%20with...', // WhatsApp link
    responseTime: 'Within 1 hour'
  }
  ];

  // Resources
  const resources = [
    {
      icon: FiVideo,
      title: 'Video Tutorials',
      description: 'Step-by-step video guides for all features',
      count: '15+ videos',
      link: '#tutorials',
      color: 'bg-red-500'
    },
    {
      icon: FiFileText,
      title: 'Documentation',
      description: 'Detailed technical documentation',
      count: '50+ articles',
      link: '#docs',
      color: 'bg-blue-500'
    },
    {
      icon: FiUsers,
      title: 'Community Forum',
      description: 'Connect with other Devure users',
      count: '2k+ members',
      link: '#community',
      color: 'bg-green-500'
    },
    {
      icon: FiBook,
      title: 'Knowledge Base',
      description: 'Comprehensive help articles',
      count: '100+ guides',
      link: '#knowledge-base',
      color: 'bg-purple-500'
    }
  ];

  // Testimonials
  const testimonials = [
    {
      name: 'Raj Sharma',
      role: 'Small Business Owner',
      content: 'The support team helped me set up my entire invoicing system in less than an hour. Amazing service!',
      rating: 5
    },
    {
      name: 'Priya Patel',
      role: 'Freelancer',
      content: 'Quick responses and always helpful. They even scheduled a call to walk me through complex features.',
      rating: 5
    },
    {
      name: 'Amit Kumar',
      role: 'Agency Owner',
      content: 'The knowledge base articles saved me hours of work. Very comprehensive and easy to follow.',
      rating: 4
    }
  ];

  // Toggle FAQ open/close
  const toggleFaq = (faqIndex) => {
    setOpenFaqs(prev => 
      prev.includes(faqIndex) 
        ? prev.filter(item => item !== faqIndex)
        : [...prev, faqIndex]
    );
  };

  // Filter FAQs based on search
  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(q =>
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FiStar
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <FiHelpCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
                <p className="text-gray-600">We're here to help you succeed</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How can we help you?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Find answers to common questions, browse documentation, or contact our support team.
          </p>
          
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('faq')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors duration-200 ${
              activeTab === 'faq'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            FAQ & Documentation
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors duration-200 ${
              activeTab === 'contact'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Contact Support
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors duration-200 ${
              activeTab === 'resources'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Resources
          </button>
        </div>

        {/* FAQ Section */}
        {activeTab === 'faq' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Categories */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                <nav className="space-y-2">
                  {faqCategories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors duration-200 ${
                          activeCategory === category.id
                            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{category.name}</span>
                      </button>
                    );
                  })}
                </nav>

                {/* Quick Help */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Need Quick Help?</h4>
                  <div className="space-y-2">
                    <a href="#getting-started" className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700">
                      <FiExternalLink className="h-4 w-4" />
                      <span>Getting Started Guide</span>
                    </a>
                    <a href="#video-tutorials" className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700">
                      <FiVideo className="h-4 w-4" />
                      <span>Video Tutorials</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {faqCategories.find(cat => cat.id === activeCategory)?.name} Questions
                  </h2>
                  <p className="text-gray-600 mt-2">
                    Find answers to common questions about {faqCategories.find(cat => cat.id === activeCategory)?.name.toLowerCase()}.
                  </p>
                </div>

                <div className="divide-y divide-gray-200">
                  {filteredCategories
                    .find(cat => cat.id === activeCategory)
                    ?.questions.map((faq, index) => (
                      <div key={index} className="p-6 hover:bg-gray-50 transition-colors duration-150">
                        <button
                          onClick={() => toggleFaq(index)}
                          className="w-full flex items-center justify-between text-left"
                        >
                          <h3 className="text-lg font-semibold text-gray-900 pr-4">
                            {faq.question}
                          </h3>
                          {openFaqs.includes(index) ? (
                            <FiChevronUp className="h-5 w-5 text-gray-400 flex-shrink-0" />
                          ) : (
                            <FiChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                          )}
                        </button>
                        
                        {openFaqs.includes(index) && (
                          <div className="mt-4 text-gray-600">
                            <p className="mb-4">{faq.answer}</p>
                            
                            {faq.steps && (
                              <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-3">Steps:</h4>
                                <ol className="list-decimal list-inside space-y-2">
                                  {faq.steps.map((step, stepIndex) => (
                                    <li key={stepIndex} className="text-gray-700">
                                      {step}
                                    </li>
                                  ))}
                                </ol>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  }
                </div>

                {/* Empty State */}
                {filteredCategories.find(cat => cat.id === activeCategory)?.questions.length === 0 && (
                  <div className="p-8 text-center">
                    <FiSearch className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
                    <p className="text-gray-600">
                      Try adjusting your search terms or browse different categories.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Contact Section */}
        {activeTab === 'contact' && (
          <div className="space-y-8">
            {/* Contact Methods */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {contactMethods.map((method, index) => {
                const Icon = method.icon;
                return (
                  <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow duration-200">
                    <div className={`inline-flex p-3 rounded-lg ${
                      method.status === 'online' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                    } mb-4`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{method.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{method.description}</p>
                    <p className="text-sm font-medium text-gray-900 mb-2">{method.details}</p>
                    <div className="flex items-center justify-center space-x-1 text-sm text-gray-500 mb-4">
                      <FiClock className="h-4 w-4" />
                      <span>{method.responseTime}</span>
                    </div>
                    <a
                      href={method.action}
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                    >
                      <span>Contact Now</span>
                      <FiExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                );
              })}
            </div>

            {/* Support Hours */}
            <div className="bg-blue-50 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <FiClock className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Support Hours</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-900">Monday - Friday</p>
                  <p className="text-gray-600">9:00 AM - 6:00 PM IST</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Saturday</p>
                  <p className="text-gray-600">10:00 AM - 2:00 PM IST</p>
                </div>
              </div>
            </div>

            {/* Testimonials */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">What Our Customers Say</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center space-x-1 mb-3">
                      {renderStars(testimonial.rating)}
                    </div>
                    <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Resources Section */}
        {activeTab === 'resources' && (
          <div className="space-y-8">
            {/* Resources Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {resources.map((resource, index) => {
                const Icon = resource.icon;
                return (
                  <a
                    key={index}
                    href={resource.link}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 group"
                  >
                    <div className={`inline-flex p-3 rounded-lg ${resource.color} text-white mb-4 group-hover:scale-110 transition-transform duration-200`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{resource.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{resource.description}</p>
                    <p className="text-sm font-medium text-blue-600">{resource.count}</p>
                  </a>
                );
              })}
            </div>

            {/* Quick Start Guide */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 text-white">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Getting Started Guide</h2>
                <p className="text-blue-100">
                  New to Devure? Follow our step-by-step guide to set up your account
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-white/20 rounded-lg p-4 mb-3">
                    <FiCheckCircle className="h-8 w-8 text-white mx-auto" />
                  </div>
                  <h4 className="font-semibold mb-2">1. Setup Your Profile</h4>
                  <p className="text-blue-100 text-sm">Complete your business profile and settings</p>
                </div>
                <div className="text-center">
                  <div className="bg-white/20 rounded-lg p-4 mb-3">
                    <FiUsers className="h-8 w-8 text-white mx-auto" />
                  </div>
                  <h4 className="font-semibold mb-2">2. Add Customers</h4>
                  <p className="text-blue-100 text-sm">Import or add your customer database</p>
                </div>
                <div className="text-center">
                  <div className="bg-white/20 rounded-lg p-4 mb-3">
                    <FiFileText className="h-8 w-8 text-white mx-auto" />
                  </div>
                  <h4 className="font-semibold mb-2">3. Create Invoices</h4>
                  <p className="text-blue-100 text-sm">Start creating and sending invoices</p>
                </div>
              </div>

              <div className="text-center mt-8">
                <a
                  href="#getting-started"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-semibold"
                >
                  <span>View Complete Guide</span>
                  <FiExternalLink className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Emergency Support */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <FiHelpCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Need Immediate Help?
              </h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Our support team is here to help you get the most out of Devure. 
                We're committed to providing you with the best possible experience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:support@devure.com"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                >
                  <FiMail className="h-5 w-5" />
                  <span>Email Support</span>
                </a>
                 <a
                 href="https://wa.me/919520680204?text=Hello%20Devure%20Support%2C%20I%20need%20help%20with..."
                   className="inline-flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
                 >
      <FaWhatsapp className="h-5 w-5" />
      <span>WhatsApp</span>
    </a>
                <a
                  href="tel:+919520680204"
                  className="inline-flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                >
                  <FiPhone className="h-5 w-5" />
                  <span>Call Now</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Our dedicated support team is ready to help you succeed with Devure.
          </p>
          <a
            href="mailto:support@devure.com"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold text-lg"
          >
                  <a
        href="https://wa.me/919520680204?text=Hello%20Devure%20Support%2C%20I%20need%20help%20with..."
        className="inline-flex items-center space-x-2 px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold text-lg"
      >
        <FaWhatsapp className="h-6 w-6" />
        <span>WhatsApp</span>
      </a>
            <FiMail className="h-6 w-6" />
            <span>Contact Support Team</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;