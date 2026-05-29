'use client';

import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Mail, Phone } from 'lucide-react';

export default function VisitUsPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header cartCount={0} />

      {/* Hero */}
      <section className="relative py-16 md:py-24 px-4 lg:px-8 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-7xl mx-auto space-y-6 text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold">Visit Our Workshop</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the magic of handcrafted jewelry. Meet our artisans and see where the magic happens.
          </p>
        </div>
      </section>

      {/* Workshop Tours */}
      <section className="py-16 md:py-24 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative h-96 rounded-lg overflow-hidden">
            <Image
              src="/hero/hero-4.jpg"
              alt="Workshop tour"
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <h2 className="text-4xl font-serif font-bold">Workshop Tours</h2>
              <div className="w-16 h-1 bg-primary" />
            </div>

            <div className="space-y-4 text-lg text-foreground/90">
              <p>
                Get behind the scenes and witness the artistry firsthand. Our guided workshop tours 
                take you through the entire beadmaking process—from design to finished jewelry.
              </p>

              <p>
                Meet our skilled artisans, learn about our techniques, and understand the passion that 
                goes into every single piece. Tours include refreshments and a special 15% discount on 
                workshop purchases.
              </p>

              <div className="bg-secondary/30 border border-border rounded-lg p-4 space-y-2">
                <h4 className="font-semibold">Tour Duration</h4>
                <p className="text-muted-foreground">Approximately 2-3 hours</p>
                
                <h4 className="font-semibold pt-2">Group Size</h4>
                <p className="text-muted-foreground">2-10 people (bookings for larger groups available)</p>
                
                <h4 className="font-semibold pt-2">Price</h4>
                <p className="text-muted-foreground">KES 2,500 per person</p>
              </div>
            </div>

            <Link href="/contact">
              <Button>Book Your Tour</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 md:py-24 px-4 lg:px-8 bg-secondary/5">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-4xl font-serif font-bold">Get in Touch</h2>
            <div className="w-16 h-1 bg-primary mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: MapPin,
                title: 'Location',
                details: ['123 Artisan Lane', 'Nairobi, Kenya'],
              },
              {
                icon: Phone,
                title: 'Phone',
                details: ['+254 712 345 678', '+254 020 2222 222'],
              },
              {
                icon: Mail,
                title: 'Email',
                details: ['hello@ajubeads.com', 'tours@ajubeads.com'],
              },
              {
                icon: Clock,
                title: 'Hours',
                details: ['Mon-Fri: 9AM - 5PM', 'Sat: 10AM - 3PM'],
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-card border border-border rounded-lg p-6 space-y-4">
                <item.icon className="w-8 h-8 text-primary" />
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <div className="space-y-1">
                  {item.details.map((detail, i) => (
                    <p key={i} className="text-muted-foreground">
                      {detail}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 md:py-24 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-4xl font-serif font-bold">Workshop Gallery</h2>
            <div className="w-16 h-1 bg-primary mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div key={idx} className="relative h-64 rounded-lg overflow-hidden bg-muted group">
                <Image
                  src={`/hero/hero-${(idx % 4) + 1}.jpg`}
                  alt={`Workshop gallery ${idx}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Virtual Tour Section */}
      <section className="py-16 md:py-24 px-4 lg:px-8 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-3">
            <h2 className="text-4xl font-serif font-bold">Can't Visit in Person?</h2>
            <p className="text-lg text-muted-foreground">
              Take our virtual workshop tour and experience the magic from anywhere in the world
            </p>
          </div>

          <Button size="lg">Start Virtual Tour</Button>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 md:py-24 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-serif font-bold">Find Us</h2>
          </div>

          <div className="rounded-lg overflow-hidden border border-border h-96 bg-muted">
            <iframe
              width="100%"
              height="100%"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8198817486044!2d36.77713097352095!3d-1.3133203623574124!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1d8d8d8d8d8d%3A0x8d8d8d8d8d8d8d8d!2sNairobi%2C%20Kenya!5e0!3m2!1sen!2ske!4v1234567890"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 lg:px-8 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-3">
            <h2 className="text-4xl font-serif font-bold">Experience the Magic</h2>
            <p className="text-lg text-muted-foreground">
              Book your workshop tour today and become part of our artisan community
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg">Book Tour</Button>
            </Link>
            <Link href="/our-journey">
              <Button size="lg" variant="outline">
                Learn Our Story
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
