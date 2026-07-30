"use client";

import React, { useState } from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { ScrollReveal, StaggerContainer, staggerItem } from "@/components/animations/animation-utils";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setIsSuccess(false), 5000);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  return (
    <DashboardLayout 
      title="Contact Us" 
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Contact" }
      ]}
      fullBleed={true}
    >
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden bg-[#0B0F17]">
        {/* Abstract Background Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-[#1B4332]/20 to-[#2D6A4F]/5 blur-3xl opacity-50" />
          <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-[#E85D04]/10 to-transparent blur-3xl opacity-50" />
        </div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white text-sm font-medium mb-6"
              >
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                We're Here to Help
              </motion.div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6 leading-tight">
                Get in Touch with Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">Travel Experts</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-8">
                Whether you have a question about our AI trip planner, need assistance with your bookings, or just want to share your travel experiences, our team is ready to listen.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative -mt-10 mb-24 z-20">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Contact Form */}
            <div className="lg:col-span-7 xl:col-span-8">
              <ScrollReveal direction="up" delay={0.1}>
                <Card className="p-6 md:p-10 bg-white/80 dark:bg-[#121826]/80 backdrop-blur-xl border border-gray-100 dark:border-gray-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-charcoal dark:text-white mb-2">Send us a Message</h2>
                    <p className="text-text-muted">Fill out the form below and we'll get back to you within 24 hours.</p>
                  </div>

                  {isSuccess ? (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-xl flex flex-col items-center justify-center text-center py-12"
                    >
                      <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mb-4 text-green-600 dark:text-green-400">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-green-800 dark:text-green-400 mb-2">Message Sent Successfully!</h3>
                      <p className="text-green-600 dark:text-green-500/80">Thank you for reaching out. We will get back to you shortly.</p>
                      <Button 
                        variant="secondary" 
                        className="mt-6 border-green-200 text-green-700 hover:bg-green-50"
                        onClick={() => setIsSuccess(false)}
                      >
                        Send Another Message
                      </Button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input 
                          id="name"
                          label="Full Name"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          leftIcon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          }
                        />
                        <Input 
                          id="email"
                          type="email"
                          label="Email Address"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          leftIcon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          }
                        />
                      </div>
                      <Input 
                        id="subject"
                        label="Subject"
                        placeholder="How can we help you?"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        leftIcon={
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        }
                      />
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="message" className="text-sm font-medium text-[#2D3436] dark:text-gray-300">Message</label>
                        <textarea
                          id="message"
                          rows={6}
                          required
                          value={formData.message}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1A2332] px-4 py-3 text-sm text-[#2D3436] dark:text-white transition-all duration-200 outline-none placeholder:text-gray-400 focus:border-[#1B4332] dark:focus:border-green-500 focus:ring-2 focus:ring-[#1B4332]/20 resize-none"
                          placeholder="Tell us more about your query..."
                        />
                      </div>
                      <Button 
                        type="submit" 
                        size="lg"
                        className="w-full sm:w-auto px-8"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            Send Message
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </span>
                        )}
                      </Button>
                    </form>
                  )}
                </Card>
              </ScrollReveal>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-5 xl:col-span-4">
              <StaggerContainer>
                <div className="flex flex-col gap-6">
                  {/* Info Card 1 */}
                  <motion.div variants={staggerItem}>
                    <Card className="p-6 bg-white dark:bg-[#121826] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow group">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#1B4332]/10 dark:bg-green-500/10 flex items-center justify-center text-[#1B4332] dark:text-green-400 group-hover:scale-110 transition-transform">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-bold text-charcoal dark:text-white mb-1">Email Us</h3>
                          <p className="text-sm text-text-muted mb-2">Our friendly team is here to help.</p>
                          <a href="mailto:hello@tourplanning.com" className="text-[#1B4332] dark:text-green-400 font-medium hover:underline">hello@tourplanning.com</a>
                        </div>
                      </div>
                    </Card>
                  </motion.div>

                  {/* Info Card 2 */}
                  <motion.div variants={staggerItem}>
                    <Card className="p-6 bg-white dark:bg-[#121826] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow group">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#E85D04]/10 dark:bg-orange-500/10 flex items-center justify-center text-[#E85D04] dark:text-orange-400 group-hover:scale-110 transition-transform">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-bold text-charcoal dark:text-white mb-1">Visit Us</h3>
                          <p className="text-sm text-text-muted mb-2">Come say hello at our office HQ.</p>
                          <address className="text-charcoal dark:text-gray-300 text-sm not-italic font-medium">
                            100 Travel Boulevard<br />
                            Tech Park, Suite 400<br />
                            San Francisco, CA 94103
                          </address>
                        </div>
                      </div>
                    </Card>
                  </motion.div>

                  {/* Info Card 3 */}
                  <motion.div variants={staggerItem}>
                    <Card className="p-6 bg-white dark:bg-[#121826] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow group">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-bold text-charcoal dark:text-white mb-1">Call Us</h3>
                          <p className="text-sm text-text-muted mb-2">Mon-Fri from 8am to 5pm.</p>
                          <a href="tel:+18001234567" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">+1 (800) 123-4567</a>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </div>
              </StaggerContainer>
            </div>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}
