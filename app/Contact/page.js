"use client"
import React, { useState } from 'react';
import { Mail, MessageCircle, MapPin, Twitter, Linkedin, Instagram, Facebook } from 'lucide-react';


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

const HeroContact = () => (
  <section className="py-20 bg-gray-50 text-center mt-10">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
        Get in Touch
      </h1>
      <p className="text-lg text-gray-600">
       { `Have a question or feedback? We'd love to hear from you. Send us a message and we'll respond as soon as possible.`}
      </p>
    </div>
  </section>
);

const ContactMethods = () => (
  <section className="mt-16">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {contactMethods.map((method, index) => (
        <div
          key={index}
          className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center"
        >
          <div className="bg-indigo-100 rounded-full p-3 mb-4">
            <method.icon className="w-8 h-8 text-indigo-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {method.title}
          </h3>
          <p className="text-gray-600 text-sm mb-3">
            {method.description}
          </p>
          <a
            href={method.href}
            className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
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

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 sr-only">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 sr-only">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email (you@example.com)"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 sr-only">Subject</label>
          <input
            type="text"
            id="subject"
            name="subject"
            placeholder="Subject (What's this about?)"
            value={formData.subject}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 sr-only">Message</label>
          <textarea
            id="message"
            name="message"
            rows="5"
            placeholder="Tell us more..."
            value={formData.message}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          ></textarea>
        </div>
        <div>
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-200"
          >
            <svg
              className="-ml-1 mr-3 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            Send Message
          </button>
        </div>
      </form>
    </div>
  );
};

const FAQSection = () => (
  <div className="bg-white p-8 rounded-lg shadow-md">
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
    <div className="space-y-6">
      {faqs.map((faq, index) => (
        <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{faq.question}</h3>
          <p className="text-gray-600 text-base">
            {faq.answer}
            {faq.linkText && faq.href && (
              <a href={faq.href} className="text-indigo-600 hover:text-indigo-800 ml-1 font-medium">
                {faq.linkText}
              </a>
            )}
          </p>
        </div>
      ))}
    </div>
  </div>
);

const SocialLinks = () => (
  <div className="text-center">
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Connect with us</h2>
    <div className="flex justify-center space-x-6">
      {socialMedia.map((social, index) => (
        <a
          key={index}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-gray-700 transition-colors duration-200"
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
  return (
    <>
    
     <div className="bg-white text-gray-800 font-sans">
      <HeroContact />
      <div className='bg-gray-200 h-0.5 w-full'> </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <ContactMethods />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mt-20">
          <div>
            <ContactForm />
          </div>
          <div>
            <FAQSection />
          </div>
        </div>

        <div className="mt-20">
          <SocialLinks />
        </div>
      </div>
    </div>

    

    
    </>
   
  );
};

export default ContactPage;