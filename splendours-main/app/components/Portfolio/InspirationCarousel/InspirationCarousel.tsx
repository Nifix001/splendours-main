"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface OverlappingImageSliderProps {
  className?: string;
}

const images: string[] = [
  "/images/Portfolio/Inspiration/Mobile/background-mobile-image1.png",
  "/images/Portfolio/Inspiration/Mobile/background-mobile-image2.png",
  "/images/Portfolio/Inspiration/Mobile/background-mobile-image3.png",
  "/images/Portfolio/Inspiration/Mobile/background-mobile-image4.png",
  "/images/Portfolio/Inspiration/Mobile/background-mobile-image5.png",
];

const OverlappingImageSlider: React.FC<OverlappingImageSliderProps> = ({ 
  className = "" 
}) => {
  const [index, setIndex] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, []);

  // Determine slide direction based on current index
  const getSlideDirection = (currentIndex: number): number => {
    // For the last image (index 4), slide from right to left
    // For all other images, slide from left to right
    return currentIndex === 4 ? 1 : -1;
  };

  return (
    <div 
      className={`relative w-[360px] h-[518px] flex justify-center items-center overflow-hidden rounded-2xl ${className}`}
    >
      {/* Previous Image with Fade Effect */}
      <motion.div
        key={`background-${index}`}
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        exit={{ opacity: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="absolute w-full h-full object-cover rounded-2xl"
      >
        <Image
          src={images[index]}
          alt={`Slider image ${index + 1}`}
          width={360}
          height={518}
          className="rounded-2xl object-cover"
          priority={index === 0}
        />
      </motion.div>

      <AnimatePresence>
        {/* New Image Sliding In */}
        <motion.div
          key={`foreground-${index}`}
          initial={{ x: `${getSlideDirection(index) * 100}%` }}
          animate={{ x: "0%" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute w-full h-full"
        >
          <Image
            src={images[(index + 1) % images.length]}
            alt={`Slider image ${((index + 1) % images.length) + 1}`}
            width={360}
            height={518}
            className="rounded-2xl object-cover"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default OverlappingImageSlider;