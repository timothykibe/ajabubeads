'use client';

import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Heart, Users, Lightbulb, Globe } from 'lucide-react';

export default function OurJourneyPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header cartCount={0} />

      {/* Hero */}
      <section className="relative py-16 md:py-24 px-4 lg:px-8 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-7xl mx-auto space-y-6 text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold">Our Story</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From a passion for handcrafted beauty to a global community celebrating ethical artistry
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-24 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="space-y-3">
              <h2 className="text-4xl font-serif font-bold">Our Mission</h2>
              <div className="w-16 h-1 bg-primary" />
            </div>

            <div className="space-y-4 text-lg text-foreground/90">
              <p>
                Ajabu Beads is more than jewelry—it's a celebration of ethical craftsmanship and 
                female empowerment. We partner with skilled artisans across Kenya to create beautiful, 
                sustainable pieces that tell stories.
              </p>

              <p>
                Every bead is carefully handcrafted using traditional techniques passed down through 
                generations. We believe that beautiful jewelry can make a positive impact on communities 
                while preserving cultural heritage.
              </p>

              <p>
                Our commitment is simple: create products that are good for our customers, good for 
                our artisans, and good for our planet.
              </p>
            </div>

            <Link href="/shop">
              <Button>Explore Our Collection</Button>
            </Link>
          </div>

          <div className="relative h-96 rounded-lg overflow-hidden">
            <Image
              src="/hero/hero-3.jpg"
              alt="Our artisans at work"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 md:py-24 px-4 lg:px-8 bg-secondary/5">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-4xl font-serif font-bold">Our Core Values</h2>
            <div className="w-16 h-1 bg-primary mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Heart,
                title: 'Ethical Practices',
                description: 'Fair wages, safe working conditions, and respect for every artisan',
              },
              {
                icon: Users,
                title: 'Community Impact',
                description: 'Supporting local communities and preserving traditional craftsmanship',
              },
              {
                icon: Lightbulb,
                title: 'Innovation',
                description: 'Blending traditional techniques with modern design sensibilities',
              },
              {
                icon: Globe,
                title: 'Sustainability',
                description: 'Environmentally responsible practices throughout our supply chain',
              },
            ].map((value, idx) => (
              <div key={idx} className="bg-card border border-border rounded-lg p-8 text-center space-y-4">
                <value.icon className="w-12 h-12 text-primary mx-auto" />
                <h3 className="text-xl font-semibold">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 md:py-24 px-4 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-4xl font-serif font-bold">Our Timeline</h2>
            <div className="w-16 h-1 bg-primary mx-auto" />
          </div>

          <div className="space-y-8">
            {[
              {
                year: '2015',
                title: 'The Beginning',
                description: 'Ajabu Beads was founded with a vision to celebrate Kenyan artistry and create opportunities for local craftspeople.',
              },
              {
                year: '2018',
                title: 'Going Global',
                description: 'Expanded internationally and partnered with ethical distributors around the world to bring our beads to global markets.',
              },
              {
                year: '2020',
                title: 'Digital Transformation',
                description: 'Launched our online store to connect directly with customers, ensuring maximum support reaches our artisans.',
              },
              {
                year: '2024',
                title: 'Today',
                description: 'Working with over 200 artisans, we continue to grow while maintaining our commitment to ethical practices and quality.',
              },
            ].map((event, idx) => (
              <div key={idx} className="flex gap-6 md:gap-12 items-start">
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-serif font-bold text-lg">
                    {event.year}
                  </div>
                  {idx < 3 && <div className="w-1 h-16 bg-primary/30 mt-4" />}
                </div>

                <div className="pt-2 space-y-2">
                  <h3 className="text-2xl font-serif font-bold">{event.title}</h3>
                  <p className="text-muted-foreground text-lg">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Numbers Section */}
      <section className="py-16 md:py-24 px-4 lg:px-8 bg-primary/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '200+', label: 'Artisans Supported' },
              { number: '50K+', label: 'Happy Customers' },
              { number: '15+', label: 'Countries Reached' },
              { number: '100%', label: 'Ethical Sourcing' },
            ].map((stat, idx) => (
              <div key={idx} className="text-center space-y-2">
                <p className="text-4xl md:text-5xl font-serif font-bold text-primary">{stat.number}</p>
                <p className="text-muted-foreground font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 lg:px-8 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-3">
            <h2 className="text-4xl font-serif font-bold">Join Our Story</h2>
            <p className="text-lg text-muted-foreground">
              Every purchase supports our mission of ethical artistry and community empowerment
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop">
              <Button size="lg">Shop Now</Button>
            </Link>
            <Link href="/blog">
              <Button size="lg" variant="outline">
                Read Our Blog
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
