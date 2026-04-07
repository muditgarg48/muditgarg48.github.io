import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import SectionHeading from "../../components/SectionHeading/SectionHeading";
import './TestimonialsSection.css';

const TestimonialsSection = ({ testimonials }) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 6000, stopOnInteraction: false })]);

    const scrollPrev = React.useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = React.useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    if (!testimonials || testimonials.length === 0) return null;

    return (
        <div id="testimonials-section">
            <div className="testimonials-content">
                <SectionHeading section_name="TESTIMONIALS" />
                
                <div className="testimonials-carousel-wrapper" ref={emblaRef}>
                    <div className="testimonials-carousel-container">
                        {testimonials.map((testimonial, index) => (
                            <div className="testimonial-slide" key={index}>
                                <div className="testimonial-modern-layout">
                                    <div className="testimonial-visual-column">
                                        <div className="visual-graphic-circle">
                                            {testimonial.avatar ? (
                                                <img src={testimonial.avatar} alt={testimonial.name} className="visual-avatar" />
                                            ) : (
                                                <div className="visual-placeholder-graphic">
                                                    <span>{testimonial.name?.[0]}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="testimonial-text-column">
                                        <div className="quote-icon-modern">
                                            <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C14.9124 8 14.017 7.10457 14.017 6V5C14.017 3.89543 14.9124 3 16.017 3H19.017C21.2261 3 23.017 4.79086 23.017 7V15C23.017 18.3137 20.3307 21 17.017 21H14.017ZM1 21L1 18C1 16.8954 1.89543 16 3 16H6C6.55228 16 7 15.5523 7 15V9C7 8.44772 6.55228 8 6 8H3C1.89543 8 1 7.10457 1 6V5C1 3.89543 1.89543 3 3 3H6C8.20914 3 10 4.79086 10 7V15C10 18.3137 7.31371 21 4 21H1Z" />
                                            </svg>
                                        </div>
                                        
                                        <p className="testimonial-quote-modern">"{testimonial.quote}"</p>
                                        
                                        <div className="testimonial-branding">
                                            <h3 className="branding-business">{testimonial.name}</h3>
                                            <div className="branding-meta">
                                                <span className="meta-name">{testimonial.business}</span>
                                                {testimonial.designation && (
                                                    <span className="meta-designation">({testimonial.designation})</span>
                                                )}
                                                {testimonial.date && (
                                                    <span className="meta-date">• {testimonial.date}</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="testimonial-controls">
                                            <button className="control-btn prev" onClick={scrollPrev}>
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                                            </button>
                                            <button className="control-btn next" onClick={scrollNext}>
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestimonialsSection;