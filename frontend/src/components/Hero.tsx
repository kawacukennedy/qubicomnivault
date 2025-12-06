import React from 'react';
import { Button } from './ui/Button';
import { motion } from 'framer-motion';

interface HeroProps {
  headline: string;
  subheadline: string;
  primaryCta: {
    label: string;
    action: () => void;
  };
  secondaryCta: {
    label: string;
    action: () => void;
  };
  visual: {
    src: string;
    alt: string;
  };
  className?: string;
}

const Hero: React.FC<HeroProps> = ({
  headline,
  subheadline,
  primaryCta,
  secondaryCta,
  visual,
  className,
}) => {
  return (
    <section className={`bg-gradient-to-br from-primary-50 to-neutral-50 py-20 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-center lg:text-left"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6 leading-tight">
              {headline}
            </h1>
            <p className="text-lg sm:text-xl text-neutral-600 mb-8 max-w-2xl">
              {subheadline}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                onClick={primaryCta.action}
                variant="solid"
                size="lg"
                className="px-8 py-3"
              >
                {primaryCta.label}
              </Button>
              <Button
                onClick={secondaryCta.action}
                variant="outline"
                size="lg"
                className="px-8 py-3"
              >
                {secondaryCta.label}
              </Button>
            </div>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary-200 rounded-large blur-3xl opacity-30"></div>
              <img
                src={visual.src}
                alt={visual.alt}
                className="relative w-full max-w-md h-auto rounded-large shadow-large"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export { Hero };