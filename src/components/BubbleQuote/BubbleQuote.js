import AnimatedIcon from '../AnimatedIcon/AnimatedIcon';
import './BubbleQuote.css';

const BubbleQuote = ({ quote, by, links = [], style = {} }) => {
    const redirect = require('../../assets/icons/redirect.json');

    return (
        <div className="bubble-quote-container" style={style}>
            <div className="bubble-quote-content">
                <div className="bubble-quote-text">
                    "{quote}"
                </div>

                <div className="bubble-quote-footer">
                    {links && links.length > 0 && (
                        <div className="bubble-quote-links">
                            {links.map((linkObj, index) => (
                                <a
                                    key={index}
                                    href={linkObj.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bubble-quote-link"
                                >
                                    {linkObj.title || "Link"}
                                    <AnimatedIcon icon={redirect} class_name="nocss" icon_size={16} />
                                </a>
                            ))}
                        </div>
                    )}

                    {by && <div className="bubble-quote-author">&mdash; {by}</div>}
                </div>
            </div>
        </div>
    );
};

export default BubbleQuote;