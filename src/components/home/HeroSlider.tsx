"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { MobileImageCarousel } from "../ui/MobileImageCarousel";

interface HeroSlide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  description: string;
  cta: {
    text: string;
    link: string;
  };
}

const slides: HeroSlide[] = [
  {
    id: 1,
    image: "/images/elephants.jpg",
    title: "Explore Authentic Zimbabwe",
    subtitle: "Your Trusted Digital Gateway",
    description:
      "Discover genuine Zimbabwean experiences with local communities. From magnificent wildlife to rich cultural heritage, explore the real Zimbabwe with verified local providers.",
    cta: {
      text: "Start Exploring",
      link: "/explore",
    },
  },
  {
    id: 2,
    image: "/images/gonarezhou.jpg",
    title: "Experience Local Culture",
    subtitle: "Connect with Community Guides",
    description:
      "Get authentic local insights from verified Community Guides. Experience Zimbabwe through the eyes of passionate locals who know the hidden gems.",
    cta: {
      text: "Ask a Local",
      link: "/community-guides",
    },
  },
  {
    id: 3,
    image: "/images/african-bush-camps-somalisa-camp-604482-original.jpg",
    title: "Enjoy Seamless Booking",
    subtitle: "Trusted & Secure Platform",
    description:
      "Book accommodations, activities, and experiences with confidence. Our verified service providers ensure your peace of mind with transparent, fair policies.",
    cta: {
      text: "Book Now",
      link: "/trip-planner",
    },
  },
  {
    id: 4,
    image: "/images/Boma-Dinner-Victoria-Falls-1.jpg",
    title: "Plan Your Perfect Trip",
    subtitle: "Visual Timeline Builder",
    description:
      "Create your personalized Zimbabwe itinerary with our intelligent Trip Planner. Track your budget, get logistics assistance, and book everything in one place.",
    cta: {
      text: "Start Planning",
      link: "/trip-planner",
    },
  },
  {
    id: 5,
    image: "/images/bungee.jpeg",
    title: "Shop Local Treasures",
    subtitle: "Support Local Artisans",
    description:
      "Discover authentic Zimbabwean crafts, art, and products. Choose pickup or shipping, all secured with our trusted marketplace system.",
    cta: {
      text: "Shop Now",
      link: "/shop",
    },
  },
  {
    id: 6,
    image: "/images/rafting.jpg",
    title: "White Water Rafting",
    subtitle: "Zambezi River Rapids",
    description:
      "Navigate the world-famous Grade 5 rapids of the Zambezi River. An exhilarating adventure for thrill-seekers and nature lovers.",
    cta: {
      text: "Book Rafting Trip",
      link: "/activities/white-water-rafting",
    },
  },
  {
    id: 7,
    image: "/images/hero/victoria-falls.jpg",
    title: "Discover Victoria Falls",
    subtitle: "The Smoke That Thunders",
    description:
      "Experience one of the Seven Natural Wonders of the World with breathtaking views, adventure activities, and unforgettable moments.",
    cta: {
      text: "Explore Victoria Falls",
      link: "/destinations/victoria-falls",
    },
  },
  {
    id: 8,
    image: "/images/hwange-national-park.jpg",
    title: "Hwange National Park",
    subtitle: "Zimbabwe's Largest Game Reserve",
    description:
      "Explore the vast wilderness of Hwange, home to over 100 mammal species and 400 bird species. A true African safari adventure awaits.",
    cta: {
      text: "Discover Hwange",
      link: "/destinations/hwange-national-park",
    },
  },
  {
    id: 9,
    image: "/images/hero/lake-kariba.jpg",
    title: "Lake Kariba Escapes",
    subtitle: "Africa's Paradise",
    description:
      "Relax on houseboats, enjoy world-class fishing, and witness spectacular sunsets over one of the world's largest man-made lakes.",
    cta: {
      text: "Plan Your Getaway",
      link: "/destinations/lake-kariba",
    },
  },
  {
    id: 10,
    image: "/images/nyanga.jpg",
    title: "Nyanga Mountains",
    subtitle: "Highlands Adventure",
    description:
      "Escape to the cool mountain air of Zimbabwe's highest peak. Perfect for hiking, trout fishing, and breathtaking mountain vistas.",
    cta: {
      text: "Plan Mountain Trip",
      link: "/destinations/nyanga",
    },
  },
  {
    id: 11,
    image: "/images/hero/great-zimbabwe.jpg",
    title: "Ancient Heritage",
    subtitle: "Great Zimbabwe Ruins",
    description:
      "Step back in time and explore the magnificent stone ruins that gave our nation its name. A UNESCO World Heritage Site awaits.",
    cta: {
      text: "Discover History",
      link: "/destinations/great-zimbabwe",
    },
  },
  {
    id: 12,
    image: "/images/safariCamp1.jpg",
    title: "Safari Adventures",
    subtitle: "Wildlife at its Best",
    description:
      "Embark on an extraordinary safari journey through Zimbabwe's pristine national parks and witness the Big Five in their natural habitat.",
    cta: {
      text: "Book Safari",
      link: "/activities/safari",
    },
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Debug: Log slides length on component mount
  useEffect(() => {
    console.log(`HeroSlider mounted with ${slides.length} slides`);
  }, []);

  // Auto-advance slides (only for desktop)
  useEffect(() => {
    if (!isPlaying || isMobile) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        const nextSlide = (prev + 1) % slides.length;
        console.log(
          `Auto-advancing from slide ${prev} to slide ${nextSlide} (total slides: ${slides.length})`
        );
        return nextSlide;
      });
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isPlaying, isMobile]);

  // Preload images
  useEffect(() => {
    const imagePromises = slides.map((slide, index) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          console.log(`Image ${index + 1} loaded: ${slide.image}`);
          resolve(img);
        };
        img.onerror = () => {
          console.error(`Failed to load image ${index + 1}: ${slide.image}`);
          resolve(img); // Still resolve to not block the loading
        };
        img.src = slide.image;
      });
    });

    Promise.all(imagePromises).then(() => {
      console.log(`All ${slides.length} images processed`);
      setIsLoaded(true);
    });
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Transform slides for mobile carousel
  const carouselData = slides.map((slide) => ({
    id: slide.id.toString(),
    image: slide.image,
    title: slide.title,
    subtitle: slide.subtitle,
  }));

  if (!isLoaded) {
    return (
      <div
        className={`hero-slider ${isMobile ? "h-[400px]" : "h-[600px]"} bg-gradient-to-br from-off2zim-earth/20 to-off2zim-stone/20 flex items-center justify-center`}
      >
        <div className="w-12 h-12 border-b-2 rounded-full animate-spin border-off2zim-primary"></div>
      </div>
    );
  }

  // Mobile version with MobileImageCarousel
  if (isMobile) {
    return (
      <div className="hero-slider relative">
        <div className="relative">
          <MobileImageCarousel
            data={carouselData}
            height={400}
            autoPlay={true}
            duration={6000}
            activeIndex={currentSlide}
            onSlideChange={setCurrentSlide}
          />

          {/* Mobile Slogan Overlay */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
            <div className="bg-black/30 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20">
              <h2 className="text-white text-sm font-bold tracking-wide text-center">
                Off2Zim - <span className="text-off2zim-sunset">Explore</span> |{" "}
                <span className="text-off2zim-primary">Experience</span> |{" "}
                <span className="text-off2zim-earth">Enjoy</span>
              </h2>
            </div>
          </div>

          {/* Mobile overlay content */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white pointer-events-none">
            <div className="max-w-sm">
              <h3 className="mb-1 text-sm font-medium text-off2zim-sunset opacity-90">
                {slides[currentSlide]?.subtitle}
              </h3>
              <h1 className="mb-2 text-2xl font-bold leading-tight">
                {slides[currentSlide]?.title}
              </h1>
              <p className="mb-3 text-sm text-gray-200 line-clamp-2">
                {slides[currentSlide]?.description}
              </p>
              <a
                href={slides[currentSlide]?.cta.link}
                className="inline-block px-4 py-2 text-sm font-medium text-white transition-colors duration-300 bg-off2zim-primary hover:bg-off2zim-primary/90 rounded-lg pointer-events-auto"
              >
                {slides[currentSlide]?.cta.text}
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop version (original design)
  return (
    <div className="hero-slider relative h-[600px] overflow-hidden">
      {/* Off2Zim Slogan Overlay */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20">
        <div className="bg-black/20 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/20">
          <h2 className="text-white text-xl md:text-2xl font-bold tracking-wider">
            Off2Zim - <span className="text-off2zim-sunset">Explore</span> |{" "}
            <span className="text-off2zim-primary">Experience</span> |{" "}
            <span className="text-off2zim-earth">Enjoy</span>
          </h2>
        </div>
      </div>

      {/* Slides */}
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 transition-transform duration-[6000ms]"
              style={{
                backgroundImage: `url(${slide.image})`,
                transform: index === currentSlide ? "scale(1.05)" : "scale(1)",
              }}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-40" />

            {/* Content */}
            <div className="relative flex items-center h-full">
              <div className="container px-4 mx-auto">
                <div className="max-w-2xl text-white">
                  <div
                    className={`transform transition-all duration-1000 delay-300 ${
                      index === currentSlide
                        ? "translate-y-0 opacity-100"
                        : "translate-y-8 opacity-0"
                    }`}
                  >
                    <h3 className="mb-2 text-lg font-medium text-off2zim-sunset">
                      {slide.subtitle}
                    </h3>
                    <h1 className="mb-4 text-5xl font-bold leading-tight md:text-6xl">
                      {slide.title}
                    </h1>
                    <p className="mb-8 text-xl leading-relaxed text-gray-200">
                      {slide.description}
                    </p>
                    <a
                      href={slide.cta.link}
                      className="inline-block px-8 py-3 font-medium text-white transition-colors duration-300 transform bg-off2zim-primary hover:bg-off2zim-primary/90 rounded-xl hover:scale-105"
                    >
                      {slide.cta.text}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute z-10 p-3 text-white transition-all duration-300 transform -translate-y-1/2 bg-black bg-opacity-50 left-4 top-1/2 hover:bg-opacity-70 rounded-xl"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={goToNext}
        className="absolute z-10 p-3 text-white transition-all duration-300 transform -translate-y-1/2 bg-black bg-opacity-50 right-4 top-1/2 hover:bg-opacity-70 rounded-xl"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Play/Pause Button */}
      <button
        onClick={togglePlayPause}
        className="absolute z-10 p-2 text-white transition-all duration-300 bg-black bg-opacity-50 top-4 right-4 hover:bg-opacity-70 rounded-xl"
        aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
      >
        {isPlaying ? (
          <Pause className="w-5 h-5" />
        ) : (
          <Play className="w-5 h-5" />
        )}
      </button>

      {/* Dots Indicator */}
      <div className="absolute z-10 flex space-x-3 transform -translate-x-1/2 bottom-6 left-1/2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-white scale-125"
                : "bg-white bg-opacity-50 hover:bg-opacity-75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black bg-opacity-30">
        <div
          className={`h-full bg-off2zim-primary transition-all duration-300 ${
            isPlaying ? "animate-pulse" : ""
          }`}
          style={{
            width: `${((currentSlide + 1) / slides.length) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}
