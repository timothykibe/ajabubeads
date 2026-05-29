'use client';

import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function Contact() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header cartCount={0} />

      {/* Hero */}
      <div className="bg-primary text-primary-foreground py-12 md:py-20 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-serif font-bold">
            Get in Touch
          </h1>
          <p className="text-lg text-primary-foreground/90">
            We love hearing from our customers. Reach out anytime.
          </p>
        </div>
      </div>

      {/* Contact */}
      <div className="flex-1 py-12 md:py-20 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Form */}
          <div className="space-y-6">
            <h2 className="text-2xl font-serif font-bold">Send us a Message</h2>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  rows={5}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Your message..."
                />
              </div>

              <Button className="w-full py-6 text-base">Send Message</Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-serif font-bold mb-6">Contact Information</h2>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <Phone className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Phone</h3>
                  <p className="text-muted-foreground">+254 712 345 678</p>
                  <p className="text-sm text-muted-foreground">Mon-Fri, 9am-5pm EAT</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Mail className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <p className="text-muted-foreground">hello@ajubeads.com</p>
                  <p className="text-sm text-muted-foreground">We typically respond within 24 hours</p>
                </div>
              </div>

              <div className="flex gap-4">
                <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Visit Us</h3>
                  <p className="text-muted-foreground">Nairobi, Kenya</p>
                  <p className="text-sm text-muted-foreground">By appointment</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Clock className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Business Hours</h3>
                  <div className="text-muted-foreground text-sm space-y-1">
                    <p>Monday - Friday: 9am - 5pm</p>
                    <p>Saturday: 10am - 3pm</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-secondary/10 p-6 rounded-lg">
              <h3 className="font-semibold mb-4">Common Questions</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium mb-1">How long does shipping take?</p>
                  <p className="text-muted-foreground">2-5 business days within Kenya</p>
                </div>
                <div>
                  <p className="font-medium mb-1">What is your return policy?</p>
                  <p className="text-muted-foreground">30 days for unused items in original packaging</p>
                </div>
                <div>
                  <p className="font-medium mb-1">Do you ship internationally?</p>
                  <p className="text-muted-foreground">Yes, to East Africa. Contact us for details.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
