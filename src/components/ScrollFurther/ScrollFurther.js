import React from "react";
import { Link } from "react-scroll";
import AnimatedIcon from "../AnimatedIcon/AnimatedIcon";
import './ScrollFurther.css';

const ScrollFurther = ({next, side="left", text="Scroll Down to explore further"}) => {

    const scroll_icon = require('../../assets/icons/scroll.json');

    return (
        <div id="scroll_down" className={side}>
            <Link to={next} smooth={true} duration={500}>
                <AnimatedIcon icon={scroll_icon} class_name="nocss" icon_size={50}/>
            </Link>
            &nbsp;
            {text}
        </div>
    );
}

export default ScrollFurther;