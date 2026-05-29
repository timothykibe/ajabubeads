'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    image: '/hero/slide-1.jpg',
    title: 'Handcrafted Elegance',
    subtitle: 'Discover the art of African beadwork',
  },
  {
    id: 2,
    image: '/hero/slide-2.jpg',
    title: 'Timeless Beauty',
    subtitle: 'Bracelets that tell stories',
  },
  {
    id: 3,
    image: '/hero/slide-3.jpg',
    title: 'Authentic Artistry',
    subtitle: 'Every bead crafted with passion',
  },
  {
    id: 4,
    image: '/hero/slide-4.jpg',
    title: 'Cultural Heritage',
    subtitle: 'African tradition meets modern style',
  },
  {
    id: 5,
    image: '/hero/slide-5.jpg',
    title: 'Colorful Expression',
    subtitle: 'Wear your story with pride',
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoPlay]);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
    setAutoPlay(false);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    setAutoPlay(false);
  };

  const goToSlide = (index: number) => {
    setCurrent(index);
    setAutoPlay(false);
  };

  return (
    <div
      className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden bg-background"
      onMouseEnter={() => setAutoPlay(false)}
      onMouseLeave={() => setAutoPlay(true)}
    >
      {/* Slides */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === current ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === current}
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/30" />

            {/* Text Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-4 drop-shadow-lg">
                {slide.title}
              </h2>
              <p className="text-lg md:text-xl text-white/90 drop-shadow-lg max-w-2xl">
                {slide.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 bg-primary/80 hover:bg-primary text-white p-3 md:p-4 rounded-full transition-all duration-300 hover:scale-110"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 bg-primary/80 hover:bg-primary text-white p-3 md:p-4 rounded-full transition-all duration-300 hover:scale-110"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === current
                ? 'bg-primary w-8 h-3'
                : 'bg-white/50 hover:bg-white/80 w-3 h-3'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
