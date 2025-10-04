import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send, MessageCircle } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });
  
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would send the form data to a server
    console.log('Form submitted:', formData);
    setFormSubmitted(true);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-[#84f4e6]/30">
          <div className="p-6 border-b border-[#84f4e6]/20 bg-gradient-to-r from-[#1a5059] to-[#5c986a]">
            <h1 className="text-3xl font-bold text-white">Contact Us</h1>
            <p className="mt-2 text-[#84f4e6]">
              Get in touch with our team to learn more about Axiomatics
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Contact Information */}
            <div className="bg-gradient-to-br from-[#5c986a] to-[#84f4e6] text-white p-8">
              <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                  <MapPin className="h-6 w-6 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Our Office</h3>
                    <p className="mt-1 text-white">Smart Village, Cairo-Alexandria Desert Road, Giza Governorate, Egypt</p>
                  </div>
                </div>
                
                <div className="flex items-start bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                  <Phone className="h-6 w-6 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Phone</h3>
                    <p className="mt-1 text-white">+20 2 3535 0700</p>
                    <p className="text-white">Monday to Friday, 9am to 5pm</p>
                  </div>
                </div>
                
                <div className="flex items-start bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                  <Mail className="h-6 w-6 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="mt-1 text-white">info@axiomatics-solar.eg</p>
                    <p className="text-white">support@axiomatics-solar.eg</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-12">
                <h3 className="font-medium mb-4">Connect With Us</h3>
                <div className="flex space-x-4">
                  <a href="#" className="bg-white/20 backdrop-blur-sm p-3 rounded-xl hover:bg-white/30 transition-all transform hover:scale-110">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                    </svg>
                  </a>
                  <a href="#" className="bg-white/20 backdrop-blur-sm p-3 rounded-xl hover:bg-white/30 transition-all transform hover:scale-110">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10zm5.5 16.5h-2.25v-3.313c0-.839-.016-1.92-1.172-1.92-1.172 0-1.352.914-1.352 1.859v3.375h-2.25v-6.75h2.156v.984h.031c.3-.57 1.031-1.172 2.125-1.172 2.281 0 2.703 1.5 2.703 3.453v3.484z M7 9.75a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm1.125 6.75h-2.25v-6.75h2.25v6.75z" />
                    </svg>
                  </a>
                  <a href="#" className="bg-white/20 backdrop-blur-sm p-3 rounded-xl hover:bg-white/30 transition-all transform hover:scale-110">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                    </svg>
                  </a>
                  <a href="#" className="bg-white/20 backdrop-blur-sm p-3 rounded-xl hover:bg-white/30 transition-all transform hover:scale-110">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="p-8 bg-gradient-to-br from-white to-[#c5d9a9]/10">
              {formSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#5c986a] to-[#84f4e6] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold text-[#1a5059] mb-2">Thank You!</h2>
                  <p className="text-gray-600">
                    Your message has been sent successfully. Our team will get back to you shortly.
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-semibold text-[#1a5059] mb-6">Send Us a Message</h2>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-[#84f4e6]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5c986a] focus:border-transparent transition-all"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-[#84f4e6]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5c986a] focus:border-transparent transition-all"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-[#84f4e6]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5c986a] focus:border-transparent transition-all"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                          Company Name
                        </label>
                        <input
                          type="text"
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-[#84f4e6]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5c986a] focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Your Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        value={formData.message}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-[#84f4e6]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5c986a] focus:border-transparent transition-all"
                        required
                      ></textarea>
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-[#5c986a] to-[#84f4e6] hover:from-[#4a7d56] hover:to-[#6cd9c7] text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center transition-all transform hover:scale-105 shadow-lg"
                    >
                      <Send className="mr-2 h-5 w-5" />
                      Send Message
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Map Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-[#84f4e6]/30">
          <div className="p-6 border-b border-[#84f4e6]/20 bg-gradient-to-r from-[#1a5059] to-[#5c986a]">
            <h2 className="text-2xl font-semibold text-white">Our Location</h2>
          </div>
          <div className="h-96 bg-gradient-to-br from-[#c5d9a9]/20 to-white flex items-center justify-center">
            <div className="text-center p-8">
              <MapPin className="h-12 w-12 text-[#5c986a] mx-auto mb-4" />
              <p className="text-gray-600 mb-2">
                Interactive map would be displayed here in the production version.
              </p>
              <p className="text-[#1a5059] font-semibold">
                Smart Village, Cairo-Alexandria Desert Road, Giza Governorate, Egypt
              </p>
            </div>
          </div>
        </div>
        
        {/* Live Chat Section */}
        <div className="fixed bottom-6 right-6">
          <button className="bg-gradient-to-r from-[#5c986a] to-[#84f4e6] hover:from-[#4a7d56] hover:to-[#6cd9c7] text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-all transform hover:scale-110 animate-pulse">
            <MessageCircle className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;