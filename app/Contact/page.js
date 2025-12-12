"use client"
import React, { useState } from 'react';
import { Mail, MessageCircle, MapPin, Twitter, Linkedin, Instagram, Facebook } from 'lucide-react';
import Footer from '@/Components/Footer';
import { useTheme } from '@/context/ThemeContext';
import Navbar from '@/Components/Navbar';
import axios from 'axios';
import { toast } from 'react-toastify';

// --- DATA ---
const contactMethods = [
  {
    icon: Mail,
    title: 'Email Us',
    description: 'Our team will respond within 24 hours.',
    linkText: 'hello@daplink.com',
    href: 'mailto:hello@daplink.com',
  },
  {
    icon: MessageCircle,
    title: 'Live Chat',
    description: 'Chat with our support team.',
    linkText: 'Available 9am-5pm india',
    href: '#',
  },
  {
    icon: MapPin,
    title: 'Office',
    description: 'Visit us in person.',
    linkText: 'New Delhi',
    href: 'https://maps.google.com/?q=San+Francisco,+CA',
  },
];

const faqs = [
  {
    question: 'How quickly will I get a response?',
    answer: 'We typically respond to all inquiries within 24 hours during business days. For urgent matters, please use our live chat feature.',
  },
  {
    question: 'Do you offer phone support?',
    answer: 'Phone support is available for Premium plan subscribers. All users can reach us via email or live chat.',
  },
  {
    question: 'Where can I find help documentation?',
    answer: 'Visit our Learn page for comprehensive guides, tutorials, and documentation to help you get the most out of Daplink.',
    linkText: 'Visit the Learn page',
    href: '/learn',
  },
];

const socialMedia = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Facebook, href: '#', label: 'Facebook' },
];

// --- COMPONENTS ---

const HeroContact = ({ theme }) => (
  <section className={`py-20 text-center transition-colors duration-300 ${theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-gray-50'}`}>
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10"> 
      <h1 className={`text-4xl font-extrabold mb-4 transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        Get in Touch
      </h1>
      <p className={`text-lg transition-colors duration-300 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
        {`Have a question or feedback? We'd love to hear from you. Send us a message and we'll respond as soon as possible.`}
      </p>
    </div>
  </section>
);

const ContactMethods = ({ theme }) => (
  <section className="mt-16">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {contactMethods.map((method, index) => (
        <div
          key={index}
          className={`p-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center
            ${theme === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-white'}
          `}
        >
          <div className={`rounded-full p-3 mb-4 ${theme === 'dark' ? 'bg-indigo-900/50' : 'bg-indigo-100'}`}>
            <method.icon className="w-8 h-8 text-indigo-600" />
          </div>
          <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {method.title}
          </h3>
          <p className={`text-sm mb-3 transition-colors duration-300 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {method.description}
          </p>
          <a
            href={method.href}
            className="text-indigo-600 hover:text-indigo-500 font-medium text-sm"
            target={method.href.startsWith('http') ? '_blank' : '_self'}
            rel={method.href.startsWith('http') ? 'noopener noreferrer' : ''}
          >
            {method.linkText}
          </a>
        </div>
      ))}
    </div>
  </section>
);

const ContactForm = ({ theme }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
   moredetails: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // FIX: Use formData directly here
      const response = await axios.post(`/api/ContactusApi`, formData);

      const data = response.data;
      if (data) {
        setFormData({ name: '', email: '', subject: '', moredetails: '' });
        toast.success("Your query submitted successfully"); // Fixed spelling typo too
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  // Helper classes for inputs to reduce repetition
  const inputClasses = `mt-1 block w-full px-4 py-3 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-300 
    ${theme === 'dark' 
      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' 
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
    }`;

  return (
    <div className={`p-8 rounded-lg shadow-md transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      <h2 className={`text-2xl font-bold mb-6 transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        Send us a message
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="sr-only">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className={inputClasses}
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="sr-only">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email (you@example.com)"
            value={formData.email}
            onChange={handleChange}
            className={inputClasses}
            required
          />
        </div>
        <div>
          <label htmlFor="subject" className="sr-only">Subject</label>
          <input
            type="text"
            id="subject"
            name="subject"
            placeholder="Subject (What's this about?)"
            value={formData.subject}
            onChange={handleChange}
            className={inputClasses}
            required
          />
        </div>
        <div>
          <label htmlFor="moredetails" className="sr-only">More details</label>
          <textarea
            id="moredetails"
            name="moredetails"
            rows="5"
            placeholder="Tell us more..."
            value={formData.moredetails}
            onChange={handleChange}
            className={inputClasses}
            required
          ></textarea>
        </div>
        <div>
          <button
            type="submit"
            className={`w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
              ${theme === 'dark' 
                ? 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500' 
                : 'bg-gray-900 hover:bg-gray-800 focus:ring-gray-900'
              }`}
          >
            <Mail className="-ml-1 mr-3 h-5 w-5" />
            Send Message
          </button>
        </div>
      </form>
    </div>
  );
};

const FAQSection = ({ theme }) => (
  <div className={`p-8 rounded-lg shadow-md transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
    <h2 className={`text-2xl font-bold mb-6 transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
      Frequently Asked Questions
    </h2>
    <div className="space-y-6">
      {faqs.map((faq, index) => (
        <div key={index} className={`border-b pb-4 last:border-b-0 last:pb-0 ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
          <h3 className={`text-lg font-semibold mb-2 transition-colors duration-300 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
            {faq.question}
          </h3>
          <p className={`text-base transition-colors duration-300 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {faq.answer}
            {faq.linkText && faq.href && (
              <a href={faq.href} className="text-indigo-600 hover:text-indigo-500 ml-1 font-medium">
                {faq.linkText}
              </a>
            )}
          </p>
        </div>
      ))}
    </div>
  </div>
);

const SocialLinks = ({ theme }) => (
  <div className="text-center">
    <h2 className={`text-2xl font-bold mb-6 transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
      Connect with us
    </h2>
    <div className="flex justify-center space-x-6">
      {socialMedia.map((social, index) => (
        <a
          key={index}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`transition-colors duration-200 ${theme === 'dark' ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-700'}`}
          aria-label={social.label}
        >
          <social.icon className="w-8 h-8" />
        </a>
      ))}
    </div>
  </div>
);

// --- MAIN PAGE COMPONENT ---
const ContactPage = () => {
  const { theme } = useTheme();
  
  return (
    <>
      <Navbar />

      <div className={`font-sans min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-[#020202]' : 'bg-white'}`}>
        <HeroContact theme={theme} />
        
        {/* Separator Line */}
        <div className={`h-0.5 w-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <ContactMethods theme={theme} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mt-20">
            <div>
              <ContactForm theme={theme} />
            </div>
            <div>
              <FAQSection theme={theme} />
            </div>
          </div>

          <div className="mt-20">
            <SocialLinks theme={theme} />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ContactPage;