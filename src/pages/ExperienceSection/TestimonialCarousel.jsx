import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import AutoHeight from 'embla-carousel-auto-height';
import BubbleQuote from '../../components/BubbleQuote/BubbleQuote';
import ChevronLeftIcon from "../../assets/svg/ChevronLeftIcon";
import ChevronRightIcon from "../../assets/svg/ChevronRightIcon";
import './TestimonialCarousel.css';

const TestimonialCarousel = ({ testimonials }) => {

    const [emblaRef, emblaApi] = useEmblaCarousel(
        { loop: false, align: 'start' },
        [
            Autoplay({ delay: 6000, stopOnInteraction: true }),
            AutoHeight()
        ]
    );

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState([]);
    const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
    const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    const scrollTo = useCallback((index) => {
        if (emblaApi) emblaApi.scrollTo(index);
    }, [emblaApi]);

    const onInit = useCallback((emblaApi) => {
        if (emblaApi) {
            setScrollSnaps(emblaApi.scrollSnapList());
        }
    }, []);

    const onSelect = useCallback((emblaApi) => {
        if (emblaApi) {
            setSelectedIndex(emblaApi.selectedScrollSnap());
            setPrevBtnDisabled(!emblaApi.canScrollPrev());
            setNextBtnDisabled(!emblaApi.canScrollNext());
        }
    }, []);

    useEffect(() => {
        if (!emblaApi) return;
        onInit(emblaApi);
        onSelect(emblaApi);
        emblaApi.on('reInit', onInit);
        emblaApi.on('reInit', onSelect);
        emblaApi.on('select', onSelect);
    }, [emblaApi, onInit, onSelect]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft') scrollPrev();
            else if (e.key === 'ArrowRight') scrollNext();
        };

        const currentRef = emblaRef.current;
        if (currentRef) {
            currentRef.setAttribute('tabindex', '0');
            currentRef.addEventListener('keydown', handleKeyDown);
            return () => {
                currentRef.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [emblaRef, scrollPrev, scrollNext]);

    if (!testimonials || testimonials.length === 0) return null;

    return (
        <div className="testimonial-section-wrapper">
            <div className="embla-testimonials" ref={emblaRef}>
                <div className="embla__container align-items-start">
                    {testimonials.map((item, index) => (
                        <div key={index} className="embla__slide_testimonial">
                            <BubbleQuote
                                quote={item.testimonial}
                                by={item.by}
                                links={item.links}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="testimonial-controls">
                <div className="embla__arrows">
                    <button 
                        className="embla__arrow" 
                        onClick={scrollPrev} 
                        disabled={prevBtnDisabled} 
                        aria-label="Previous slide"
                    >
                        <ChevronLeftIcon />
                    </button>
                    <button 
                        className="embla__arrow" 
                        onClick={scrollNext} 
                        disabled={nextBtnDisabled} 
                        aria-label="Next slide"
                    >
                        <ChevronRightIcon />
                    </button>
                </div>
                
                <div className="embla__dots">
                    {scrollSnaps.map((_, index) => (
                        <button
                            key={index}
                            className={`embla__dot ${index === selectedIndex ? "is-selected" : ""}`}
                            type="button"
                            onClick={() => scrollTo(index)}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TestimonialCarousel;