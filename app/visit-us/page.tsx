'use client';

import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Mail, Phone, Heart, Store, Coffee, Sparkles, Navigation } from 'lucide-react';

export default function VisitUsPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header cartCount={0} />

      {/* Hero Section – welcoming and experiential */}
      <section className="relative py-20 md:py-28 px-4 lg:px-8 bg-gradient-to-br from-primary/5 via-secondary/5 to-background overflow-hidden">
        <div className="max-w-7xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-4 backdrop-blur-sm">
            <Heart className="h-4 w-4" />
            Visit Our World
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight">
            Step Into <span className="text-primary">Ajabu</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover our handcrafted jewelry in person. Two Nairobi locations where artistry meets warmth.
          </p>
        </div>
        {/* Decorative background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Two Shops – Creative side-by-side story */}
      <section className="py-16 md:py-24 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Ngara Shop */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 space-y-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  <Store className="h-4 w-4" />
                  Flagship Workshop & Boutique
                </div>
                <h2 className="text-4xl md:text-5xl font-serif font-bold">Ngara</h2>
                <div className="w-16 h-1 bg-primary rounded-full" />
              </div>
              <div className="space-y-4 text-lg text-foreground/90 leading-relaxed">
                <p>
                  Nestled in the vibrant heart of Ngara, our flagship space is more than a shop—it's a living workshop. 
                  Watch artisans shape beads by hand, explore our full collection, and feel the energy of creation all around you.
                </p>
                <div className="flex items-start gap-3 text-muted-foreground">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <span>123 Ajabu Lane, Ngara, Nairobi (opposite Ngara Market)</span>
                </div>
                <div className="flex items-start gap-3 text-muted-foreground">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <span>Mon–Sat: 10am – 6pm | Sun: 11am – 4pm</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="https://maps.google.com/?q=Ngara+Nairobi+Ajabu+Beads" target="_blank">
                  <Button variant="outline" className="rounded-full gap-2">
                    <Navigation className="h-4 w-4" />
                    Get Directions
                  </Button>
                </Link>
                <Link href="/contact?shop=ngara">
                  <Button variant="link" className="gap-2">
                    Ask a question →
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative order-1 lg:order-2">
              <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/locations/ngara-shop.jpg"
                  alt="Ajabu Beads Ngara shop front"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-5 -right-5 w-28 h-28 bg-primary/10 rounded-full -z-10" />
            </div>
          </div>

          {/* Arena Shop */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative order-1">
              <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/locations/arena-shop.jpg"
                  alt="Ajabu Beads Arena Mall shop"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -top-5 -left-5 w-28 h-28 bg-secondary/20 rounded-full -z-10" />
            </div>
            <div className="order-2 space-y-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-secondary/20 px-3 py-1 text-sm font-medium text-secondary-foreground">
                  <Sparkles className="h-4 w-4" />
                  Boutique at Arena Mall
                </div>
                <h2 className="text-4xl md:text-5xl font-serif font-bold">Arena</h2>
                <div className="w-16 h-1 bg-primary rounded-full" />
              </div>
              <div className="space-y-4 text-lg text-foreground/90 leading-relaxed">
                <p>
                  Our Arena Mall boutique offers a curated selection of bestsellers and exclusive pieces. 
                  It's the perfect stop for a quick gift, a styling consultation, or to simply immerse yourself in the beauty of handcrafted beads.
                </p>
                <div className="flex items-start gap-3 text-muted-foreground">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <span>Level 2, Arena Mall, Along Mombasa Road, Nairobi</span>
                </div>
                <div className="flex items-start gap-3 text-muted-foreground">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <span>Daily: 10am – 8pm (including public holidays)</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="https://maps.google.com/?q=Arena+Mall+Nairobi" target="_blank">
                  <Button variant="outline" className="rounded-full gap-2">
                    <Navigation className="h-4 w-4" />
                    Get Directions
                  </Button>
                </Link>
                <Link href="/contact?shop=arena">
                  <Button variant="link" className="gap-2">
                    Inquire about a piece →
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What to Expect – Experience-oriented */}
      <section className="py-16 md:py-24 px-4 lg:px-8 bg-secondary/5">
        <div className="max-w-7xl mx-auto text-center space-y-12">
          <div className="space-y-3">
            <span className="text-sm font-medium text-primary uppercase tracking-wider">Your Visit</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold">What Awaits You</h2>
            <div className="w-20 h-1 bg-primary rounded-full mx-auto" />
            <p className="text-muted-foreground max-w-2xl mx-auto mt-4">
              More than shopping — an experience that lingers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Coffee,
                title: 'Meet the Makers',
                description: 'Watch live beadmaking demonstrations and chat with the artisans behind your favorite pieces.',
              },
              {
                icon: Heart,
                title: 'Try & Feel',
                description: 'See the true colors, touch the textures, and find the perfect piece that speaks to you.',
              },
              {
                icon: Sparkles,
                title: 'Exclusive Finds',
                description: 'Certain collections and one‑of‑a‑kind pieces are only available in our physical shops.',
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-border p-8 space-y-4 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary mx-auto">
                  <item.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workshop Gallery – behind the scenes */}
      <section className="py-16 md:py-24 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-sm font-medium text-primary uppercase tracking-wider">Behind the Beads</span>
            <h2 className="text-4xl font-serif font-bold">Moments from Our Spaces</h2>
            <div className="w-20 h-1 bg-primary rounded-full mx-auto" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div key={idx} className="group relative aspect-square rounded-xl overflow-hidden bg-muted shadow-md">
                <Image
                  src={`/gallery/shop-${idx}.jpg`}
                  alt={`Ajabu Beads shop ambiance ${idx}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-white text-sm font-medium">Experience the craft</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Virtual Experience – creative alternative to in-person */}
      <section className="py-20 md:py-28 px-4 lg:px-8 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              Can't Travel to Nairobi?
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold">Virtual Studio Tour</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the warmth of Ajabu from anywhere. Book a 15‑minute live video walkthrough with our team.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact?subject=virtual-tour">
              <Button size="lg" className="rounded-full px-8">Request a Virtual Visit</Button>
            </Link>
            <Link href="/our-journey">
              <Button size="lg" variant="outline" className="rounded-full px-8">Read Our Story</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Map Section – both locations */}
      <section className="py-16 md:py-24 px-4 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-serif font-bold">Find Your Nearest Ajabu</h2>
            <div className="w-16 h-1 bg-primary rounded-full mx-auto" />
            <p className="text-muted-foreground">Both locations are easily accessible by public transport and have nearby parking.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Ngara Map */}
            <div className="rounded-2xl overflow-hidden border border-border shadow-sm">
              <div className="h-64 w-full bg-muted relative">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.824525905196!2d36.777073!3d-1.313375!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1d1c8b7e2fcd%3A0x73d3b5a5d5f5a5f5!2sNgara%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1710000000000"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>
              <div className="p-5 bg-gray-50">
                <h3 className="font-serif text-xl font-bold">Ajabu Ngara</h3>
                <p className="text-muted-foreground mt-1">123 Ajabu Lane, Ngara, Nairobi</p>
                <Link href="https://maps.google.com/?q=Ngara+Nairobi" target="_blank" className="inline-flex items-center gap-1 text-sm text-primary mt-3 hover:underline">
                  Open in Google Maps →
                </Link>
              </div>
            </div>

            {/* Arena Map */}
            <div className="rounded-2xl overflow-hidden border border-border shadow-sm">
              <div className="h-64 w-full bg-muted relative">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.765855741759!2d36.850844!3d-1.324154!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1c1f7c5a2f19%3A0x8a8a8a8a8a8a8a8a!2sArena%20Mall%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1710000000001"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>
              <div className="p-5 bg-gray-50">
                <h3 className="font-serif text-xl font-bold">Ajabu Arena</h3>
                <p className="text-muted-foreground mt-1">Level 2, Arena Mall, Along Mombasa Road</p>
                <Link href="https://maps.google.com/?q=Arena+Mall+Nairobi" target="_blank" className="inline-flex items-center gap-1 text-sm text-primary mt-3 hover:underline">
                  Open in Google Maps →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & support - simple footer-like */}
      <section className="py-12 md:py-16 px-4 lg:px-8 border-t border-border">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div>
            <p className="text-sm text-muted-foreground">Questions before you visit?</p>
            <div className="flex items-center gap-2 justify-center md:justify-start mt-1">
              <Mail className="h-4 w-4 text-primary" />
              <a href="mailto:hello@ajabubeads.co.ke" className="text-primary hover:underline">hello@ajabubeads.co.ke</a>
              <span className="text-muted-foreground mx-1">|</span>
              <Phone className="h-4 w-4 text-primary" />
              <a href="tel:+254712345678" className="text-primary hover:underline">+254 712 345 678</a>
            </div>
          </div>
          <div className="flex gap-4">
            <Link href="/contact">
              <Button variant="outline" className="rounded-full">Contact Us</Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}