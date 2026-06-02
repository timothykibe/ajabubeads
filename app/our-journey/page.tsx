'use client';

import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Heart, Users, Sparkles, Globe, TrendingUp, Shield, Zap, Package, MapPin, ArrowRight } from 'lucide-react';

export default function OurJourneyPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header cartCount={0} />

      {/* Hero Section – Inspired by Kazuri's "thoughtful celebration" of artistry */}
      <section className="relative py-20 md:py-28 px-4 lg:px-8 bg-gradient-to-br from-primary/5 via-secondary/5 to-background overflow-hidden">
        <div className="max-w-7xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-4 backdrop-blur-sm">
            <Heart className="h-4 w-4" />
            Our Story
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight">
            A Story of <span className="text-primary">Beauty & Impact</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            From a passion for handcrafted artistry to a movement empowering women and preserving heritage across Kenya.
          </p>
        </div>
        {/* Decorative background element */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Mission Section – More dynamic layout inspired by Kazuri's "humanity at the heart" mission */}
      <section className="py-20 md:py-28 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 order-2 lg:order-1">
            <div className="space-y-3">
              <span className="text-sm font-medium text-primary uppercase tracking-wider">Our Mission</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold">More Than Jewelry</h2>
              <div className="w-20 h-1 bg-primary rounded-full" />
            </div>

            <div className="space-y-5 text-lg text-foreground/90 leading-relaxed">
              <p>
                <strong className="text-primary">Ajabu</strong> — which means <em>wonder</em> in Swahili — is a celebration of ethical craftsmanship, female empowerment, and cultural preservation.
              </p>
              <p>
                We partner with skilled artisans across Kenya, from the slopes of Mount Kenya to the bustling workshops of Nairobi, to create beautiful, sustainable pieces. Every bead is carefully handcrafted using traditional techniques, blending vibrant African patterns with timeless elegance.
              </p>
              <p>
                Our commitment is simple: to create products that are as good for our artisans and our planet as they are beautiful. We believe that when you wear Ajabu, you carry a piece of a larger story—a story of dignity, creativity, and positive impact.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/shop">
                <Button size="lg" className="rounded-full">Explore Our Collection</Button>
              </Link>
              <Link href="/impact">
                <Button size="lg" variant="outline" className="rounded-full">See Our Impact</Button>
              </Link>
            </div>
          </div>

          <div className="relative order-1 lg:order-2">
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/hero/hero-3.jpg"
                alt="Our master artisans carefully handcrafting Ajabu beads"
                fill
                className="object-cover"
              />
            </div>
            {/* Decorative frame effect */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 border-2 border-primary/20 rounded-2xl -z-10" />
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary/5 rounded-full -z-10" />
          </div>
        </div>
      </section>

      {/* Core Values – Elevated with a stronger nod to Kazuri's key pillars */}
      <section className="py-20 md:py-28 px-4 lg:px-8 bg-secondary/5">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-sm font-medium text-primary uppercase tracking-wider">What We Stand For</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold">Our Core Values</h2>
            <div className="w-20 h-1 bg-primary rounded-full mx-auto" />
            <p className="text-muted-foreground max-w-2xl mx-auto mt-4">
              Inspired by the resilience of Kenyan women and the beauty of our land.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Heart,
                title: 'Ethical Empowerment',
                description: 'Fair wages, safe spaces, and a deep respect for every artisan’s skill and story.',
                color: 'text-rose-500',
                bg: 'bg-rose-50',
              },
              {
                icon: Users,
                title: 'Community Impact',
                description: 'Direct investment in local communities, preserving traditional craftsmanship for future generations.',
                color: 'text-blue-500',
                bg: 'bg-blue-50',
              },
              {
                icon: Sparkles,
                title: 'Artisan Innovation',
                description: 'Bridging timeless African techniques with contemporary designs that captivate the world.',
                color: 'text-amber-500',
                bg: 'bg-amber-50',
              },
              {
                icon: Globe,
                title: 'Planet First',
                description: 'Eco-friendly practices, from natural clays to sustainable packaging, honoring Mother Earth.',
                color: 'text-emerald-500',
                bg: 'bg-emerald-50',
              },
            ].map((value, idx) => (
              <div key={idx} className="group bg-white border border-border rounded-2xl p-8 space-y-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className={`w-14 h-14 rounded-full ${value.bg} flex items-center justify-center transition-all duration-300 group-hover:scale-110`}>
                  <value.icon className={`h-7 w-7 ${value.color}`} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Artisan Spotlight – NEW section bringing the human element front and center */}
      <section className="py-20 md:py-28 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-3 mb-12">
            <span className="text-sm font-medium text-primary uppercase tracking-wider">Behind Every Bead</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold">Meet Our Artisans</h2>
            <div className="w-20 h-1 bg-primary rounded-full mx-auto" />
            <p className="text-muted-foreground max-w-2xl mx-auto mt-4">
              The hands and hearts that bring our jewelry to life. Every purchase directly supports their craft and community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Grace Wanjiku',
                role: 'Master Bead Artist & Workshop Lead',
                years: '12 years',
                image: '/artisans/grace.jpg',
                quote: 'Each bead I shape carries a piece of my heritage. When you wear Ajabu, you wear a story of hope and tradition.',
                location: 'Nairobi',
              },
              {
                name: 'Esther Muthoni',
                role: 'Ceramic Specialist & Kiln Master',
                years: '8 years',
                image: '/artisans/esther.jpg',
                quote: 'The clay from Mount Kenya connects me to my ancestors. I pour my heart into every piece, knowing it will bring joy to someone far away.',
                location: 'Nyeri',
              },
              {
                name: 'Beatrice Atieno',
                role: 'Senior Designer & Pattern Curator',
                years: '10 years',
                image: '/artisans/beatrice.jpg',
                quote: 'I love blending traditional Luo patterns with modern styles. It keeps our culture alive and relevant, bead by bead.',
                location: 'Kisumu',
              },
            ].map((artisan, idx) => (
              <div key={idx} className="group bg-white rounded-2xl border border-border overflow-hidden transition-all duration-300 hover:shadow-xl">
                <div className="aspect-square relative overflow-hidden">
                  <Image
                    src={artisan.image}
                    alt={`${artisan.name}, ${artisan.role} at Ajabu Beads`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-semibold text-xl text-gray-900">{artisan.name}</h3>
                  <p className="text-sm text-primary font-medium mt-1">{artisan.role}</p>
                  <div className="flex items-center justify-center gap-2 mt-2 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{artisan.location}</span>
                    <span>•</span>
                    <span>{artisan.years} experience</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm text-gray-600 italic leading-relaxed">“{artisan.quote}”</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/artisans">
              <Button variant="outline" className="rounded-full">
                Learn More About Our Artisans
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Timeline – Enhanced with icons and a more visual approach */}
      <section className="py-20 md:py-28 px-4 lg:px-8 bg-secondary/5">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-sm font-medium text-primary uppercase tracking-wider">Our Path Forward</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold">The Ajabu Journey</h2>
            <div className="w-20 h-1 bg-primary rounded-full mx-auto" />
            <p className="text-muted-foreground max-w-2xl mx-auto mt-4">
              From a small dream to a growing movement. Every milestone reflects our commitment to artistry and impact.
            </p>
          </div>

          <div className="relative">
            {/* Vertical Timeline Line */}
            <div className="absolute left-[27px] md:left-1/2 top-0 bottom-0 w-0.5 bg-primary/20 hidden sm:block" />

            <div className="space-y-12">
              {[
                {
                  year: '2015',
                  title: 'A Seed is Planted',
                  description: 'Ajabu Beads begins as a small workshop in Nairobi with a vision: to celebrate Kenyan artistry and create fair-wage opportunities for local craftspeople.',
                  icon: TrendingUp,
                  side: 'left',
                },
                {
                  year: '2018',
                  title: 'Finding Our Voice',
                  description: 'Our unique style gains recognition, blending Maasai beadwork traditions with contemporary design. We partner with our first international retailers.',
                  icon: Globe,
                  side: 'right',
                },
                {
                  year: '2021',
                  title: 'Digital Heartbeat',
                  description: 'We launch our online store, connecting directly with customers worldwide and ensuring more resources flow back to our artisan community.',
                  icon: Zap,
                  side: 'left',
                },
                {
                  year: '2024',
                  title: 'A Growing Family',
                  description: 'Our network expands to support over 200 artisans across Kenya. We open our second workshop and launch a training program for young women.',
                  icon: Users,
                  side: 'right',
                },
                {
                  year: 'Today',
                  title: 'Writing Tomorrow\'s Story',
                  description: 'Continuing to grow while staying rooted in our values. Fair wages. Sustainable materials. Beautiful art. This is just the beginning.',
                  icon: Heart,
                  side: 'left',
                },
              ].map((event, idx) => (
                <div key={idx} className={`relative flex flex-col md:flex-row items-start gap-6 md:gap-8 ${
                  event.side === 'right' ? 'md:flex-row-reverse' : ''
                }`}>
                  {/* Timeline Icon/Year */}
                  <div className="flex-shrink-0 w-14 h-14 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shadow-lg z-10 mx-auto md:mx-0">
                    {event.year}
                  </div>
                  <div className="flex-1 bg-white rounded-2xl border border-border p-6 shadow-sm transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-full bg-primary/10">
                        <event.icon className="h-4 w-4 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold">{event.title}</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Impact Numbers – More dynamic and engaging */}
      <section className="py-20 md:py-28 px-4 lg:px-8 bg-gradient-to-br from-primary/10 via-primary/5 to-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-3 mb-12">
            <span className="text-sm font-medium text-primary uppercase tracking-wider">Our Impact So Far</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold">By the Numbers</h2>
            <div className="w-20 h-1 bg-primary rounded-full mx-auto" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '250+', label: 'Artisans Supported', icon: Users, suffix: '' },
              { number: '75K+', label: 'Happy Customers', icon: Heart, suffix: '' },
              { number: '20+', label: 'Countries Reached', icon: Globe, suffix: '' },
              { number: '100%', label: 'Ethically Sourced', icon: Shield, suffix: '' },
            ].map((stat, idx) => (
              <div key={idx} className="text-center space-y-3 group">
                <div className="flex justify-center">
                  <div className="p-4 rounded-full bg-white shadow-md group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <p className="text-4xl md:text-5xl font-serif font-bold text-primary">{stat.number}</p>
                <p className="text-muted-foreground font-medium text-sm uppercase tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/impact">
              <Button variant="link" className="text-primary gap-2">
                See Our Full Impact Report <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Media & Recognition – NEW section for social proof */}
      <section className="py-16 md:py-24 px-4 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-3 mb-12">
            <span className="text-sm font-medium text-primary uppercase tracking-wider">As Featured In</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold">Media & Recognition</h2>
            <div className="w-20 h-1 bg-primary rounded-full mx-auto" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-70">
            <div className="font-serif text-xl font-semibold text-gray-400">VOGUE</div>
            <div className="font-serif text-xl font-semibold text-gray-400">BAZAAR</div>
            <div className="font-serif text-xl font-semibold text-gray-400">CNN Style</div>
            <div className="font-serif text-xl font-semibold text-gray-400">ELLE</div>
          </div>
        </div>
      </section>

      {/* CTA Section – More compelling and action-driven */}
      <section className="py-20 md:py-28 px-4 lg:px-8 bg-gradient-to-r from-primary/5 via-secondary/5 to-background border-y border-border">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mx-auto mb-4">
              <Heart className="h-4 w-4" />
              Join the Movement
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold">Become Part of Our Story</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              With every purchase, you're not just buying a beautiful piece of jewelry—you're empowering an artisan, preserving a tradition, and making a difference.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop">
              <Button size="lg" className="rounded-full px-8">Shop Now</Button>
            </Link>
            <Link href="/about/contact">
              <Button size="lg" variant="outline" className="rounded-full px-8">
                Partner With Us
              </Button>
            </Link>
          </div>

          <p className="text-sm text-muted-foreground">
            Free shipping on orders over KES 5,000 • 30-day returns • Ethically made
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}