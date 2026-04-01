import AnimatedIcon from '../AnimatedIcon/AnimatedIcon';
import './BubbleQuote.css';
import redirect from "../../assets/icons/redirect.json";

const BubbleQuote = ({ quote, by, links = [], style = {} }) => {

    return (
        <div className="bubble-quote-container" style={style}>
            <div className="bubble-quote-backdrop">“</div>
            <div className="bubble-quote-content">
                <div className="bubble-quote-text">
                    "{quote}"
                </div>

                <div className="bubble-quote-footer">
                    {by && (
                        <div className="bubble-quote-author-info">
                            <div className="bubble-quote-author">
                                <span className="highlight">&mdash;</span> {typeof by === 'string' ? by : by.name}
                            </div>
                            {by.role && <div className="bubble-quote-author-role">{by.role}</div>}
                        </div>
                    )}
                    
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
                </div>
            </div>
        </div>
    );
};

export default BubbleQuote;