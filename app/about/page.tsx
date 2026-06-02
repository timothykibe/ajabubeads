'use client';

import Header from '@/components/header';
import Footer from '@/components/footer';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function About() {
  return (
    <main className="min-h-screen bg-background">
      <Header cartCount={0} />

      {/* Hero */}
      <div className="bg-primary text-primary-foreground py-12 md:py-20 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-serif font-bold">
            Our Story
          </h1>
          <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
            A celebration of African artistry and ethical craftsmanship
          </p>
        </div>
      </div>
        {/* to update and make this page better */}
      {/* About Section */}
      <div className="py-12 md:py-20 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative h-96 md:h-full min-h-[400px]">
            <Image
              src="/products/bracelet-2.jpg"
              alt="Ajabu Beads Artisans"
              fill
              className="object-cover rounded-lg"
            />
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-serif font-bold">
              Handcrafted with Purpose
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Ajabu Beads is a celebration of African and Indian artistry. Founded on the principle that beautiful jewelry should tell a story and support artisans, we create handcrafted beads and bracelets that honor tradition while embracing contemporary design.
              </p>
              <p>
                Each piece is carefully crafted by artisans across Kenya and the East African region. We partner directly with our makers, ensuring fair wages, sustainable practices, and a positive impact on their communities.
              </p>
              <p>
                From the clay we select to the techniques we employ, every decision is thoughtfully made to honor the heritage and support the communities that make Ajabu possible.
              </p>
            </div>

            <Link href="/shop">
              <Button>Shop Our Collection</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Values */}
      <section className="py-12 md:py-20 px-4 lg:px-8 bg-secondary/10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-serif font-bold text-center mb-12">
            Our Values
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-lg border border-border space-y-4">
              <h3 className="text-xl font-semibold">Tradition</h3>
              <p className="text-muted-foreground">
                We honor the traditional techniques and cultural heritage that have been passed down through generations of African artisans.
              </p>
            </div>

            <div className="bg-card p-8 rounded-lg border border-border space-y-4">
              <h3 className="text-xl font-semibold">Sustainability</h3>
              <p className="text-muted-foreground">
                Our commitment to ethical practices ensures that both people and the planet benefit from every purchase.
              </p>
            </div>

            <div className="bg-card p-8 rounded-lg border border-border space-y-4">
              <h3 className="text-xl font-semibold">Quality</h3>
              <p className="text-muted-foreground">
                We use only the finest materials and employ traditional craftsmanship to create jewelry that lasts.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
