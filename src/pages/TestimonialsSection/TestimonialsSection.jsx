import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import SectionHeading from "../../components/SectionHeading/SectionHeading";
import QuoteIcon from "../../assets/svg/QuoteIcon";
import ArrowLeftIcon from "../../assets/svg/ArrowLeftIcon";
import ArrowRightIcon from "../../assets/svg/ArrowRightIcon";
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
                                            <QuoteIcon size={60} />
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
                                                <ArrowLeftIcon />
                                            </button>
                                            <button className="control-btn next" onClick={scrollNext}>
                                                <ArrowRightIcon />
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