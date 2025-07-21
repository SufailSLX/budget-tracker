import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, ChevronLeft, TrendingUp, PieChart, Shield, DollarSign, BarChart3, Target } from 'lucide-react';

const slides = [
  {
    id: 1,
    title: "Welcome to Expense Tracker",
    subtitle: "Your Smart Financial Companion",
    description: "Take control of your finances with our intuitive expense tracking system. Monitor your spending, set budgets, and achieve your financial goals.",
    icon: DollarSign,
    features: ["Real-time expense tracking", "Smart categorization", "Visual spending insights"]
  },
  {
    id: 2,
    title: "Key Benefits",
    subtitle: "Why Choose Our Tracker?",
    description: "Experience smarter budgeting with detailed transaction insights and automated categorization that saves you time.",
    icon: TrendingUp,
    features: ["Automated expense categorization", "Monthly spending reports", "Budget goal tracking"]
  },
  {
    id: 3,
    title: "Getting Started",
    subtitle: "Begin Your Financial Journey",
    description: "Ready to transform how you manage money? Let's set up your account and start tracking your expenses today.",
    icon: Target,
    features: ["Quick 2-minute setup", "Secure data protection", "Mobile-friendly interface"]
  }
];

interface OnboardingSlidesProps {
  onComplete: () => void;
}

export function OnboardingSlides({ onComplete }: OnboardingSlidesProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate slide entrance
    if (contentRef.current) {
      gsap.fromTo(contentRef.current,
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
      );
    }
  }, [currentSlide]);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      gsap.to(contentRef.current, {
        x: -50,
        opacity: 0,
        duration: 0.3,
        ease: "power3.in",
        onComplete: () => {
          setCurrentSlide(prev => prev + 1);
        }
      });
    } else {
      // Last slide - proceed to registration
      gsap.to(slideRef.current, {
        scale: 0.95,
        opacity: 0,
        duration: 0.5,
        ease: "power3.in",
        onComplete: onComplete
      });
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      gsap.to(contentRef.current, {
        x: 50,
        opacity: 0,
        duration: 0.3,
        ease: "power3.in",
        onComplete: () => {
          setCurrentSlide(prev => prev - 1);
        }
      });
    }
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div ref={slideRef} className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-card border-border shadow-elegant">
        <CardContent className="p-8">
          <div ref={contentRef} className="text-center space-y-8">
            {/* Progress indicators */}
            <div className="flex justify-center space-x-2 mb-6">
              {slides.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'bg-primary scale-125' : 'bg-muted'
                  }`}
                />
              ))}
            </div>

            {/* Icon */}
            <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Icon className="w-10 h-10 text-primary" />
            </div>

            {/* Content */}
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-foreground">{slide.title}</h1>
              <h2 className="text-xl text-primary font-medium">{slide.subtitle}</h2>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-md mx-auto">
                {slide.description}
              </p>
            </div>

            {/* Features */}
            <div className="space-y-3">
              {slide.features.map((feature, index) => (
                <div key={index} className="flex items-center justify-center space-x-2 text-muted-foreground">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-8">
              <Button
                variant="ghost"
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className="transition-all duration-300"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <span className="text-sm text-muted-foreground">
                {currentSlide + 1} of {slides.length}
              </span>

              <Button
                onClick={nextSlide}
                className="transition-all duration-300 hover:shadow-glow"
              >
                {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}