import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import BubbleQuote from '../../components/BubbleQuote/BubbleQuote';
import './TestimonialCarousel.css';

const TestimonialCarousel = ({ testimonials }) => {
    if (!testimonials || testimonials.length === 0) return null;

    return (
        <div className="experience-testimonials">
            <Carousel
                showArrows={true}
                infiniteLoop={true}
                showStatus={false}
                showThumbs={false}
                useKeyboardArrows={true}
                autoPlay={testimonials.length > 1}
                interval={6000}
                stopOnHover={true}
                swipeable={true}
                emulateTouch={true}
                className="testimonial-carousel"
            >
                {testimonials.map((item, index) => (
                    <div key={index} className="testimonial-slide">
                        <BubbleQuote
                            quote={item.testimonial}
                            by={item.by}
                            links={item.links}
                        />
                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export default TestimonialCarousel;