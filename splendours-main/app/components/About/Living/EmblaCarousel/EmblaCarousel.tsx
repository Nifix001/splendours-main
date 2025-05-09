import React, { useCallback, useEffect, useState } from 'react';
import { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import { LazyLoadImage } from './EmblaCarouselLazyLoadImage';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { Button, Typography } from '@mui/material';

import data from "./EmblaData.json";
import './embla.css'

interface Resource {
  imageUrl?: string;
  name?: string;
  subname?: string;
}

type PropType = {
  slides: number[];
  options?: EmblaOptionsType;
};

const EmblaCarousel: React.FC<PropType> = ({ options }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const [slidesInView, setSlidesInView] = useState<number[]>([]);

  const updateSlidesInView = useCallback((emblaApi: EmblaCarouselType) => {
    setSlidesInView((slidesInView) => {
      if (slidesInView.length === emblaApi.slideNodes().length) {
        emblaApi.off('slidesInView', updateSlidesInView);
      }
      const inView = emblaApi
        .slidesInView()
        .filter((index) => !slidesInView.includes(index));
      return slidesInView.concat(inView);
    });
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    updateSlidesInView(emblaApi);
    emblaApi.on('slidesInView', updateSlidesInView);
    emblaApi.on('reInit', updateSlidesInView);
  }, [emblaApi, updateSlidesInView]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {data.resources
            .filter((resource: Resource) => resource.imageUrl)
            .map((resource: Resource, index: number) => (
              <LazyLoadImage
                key={index}
                index={index}
                imgSrc={resource.imageUrl!}
                name={resource.name || 'Unnamed'}
                subname={resource.subname || 'Unnamed'}
                inView={slidesInView.indexOf(index) > -1}
              />
            ))}
        </div>
      </div>
      <Button
        className="embla__button embla__button--prev -ml-[8px]"
        onClick={scrollPrev}
      >
        <NavigateBeforeIcon fontSize="large" />
        <Typography
         variant="h3"
         color="white"
         sx={{
             fontWeight: 400,
             fontFamily: 'var(--font-montserrat)',
             lineHeight: '0.9',
             opacity: 0.8,
             fontSize: '14px',
             width: 'max-content',
             position: 'relative',
             letterSpacing: '0.3em',
             left: '0px',
             top: '0px'
         }}
        >
          PRE
        </Typography>

      </Button>
      <Button
        className="embla__button embla__button--next -mr-[8px]"
        onClick={scrollNext}
      >
        <Typography
        variant="h3"
        color="white"
        sx={{
            fontWeight: 400,
            fontFamily: 'var(--font-montserrat)',
            lineHeight: '0.9',
            opacity: 0.8,
            fontSize: '14px',
            width: 'max-content',
            letterSpacing: '0.3em',
            position: 'relative',
            left: '0px',
            top: '0px'
        }}
        >
          NEXT
        </Typography>
        <NavigateNextIcon fontSize="large" />
      </Button>
    </div>
  );
};

export default EmblaCarousel;
