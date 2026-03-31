import React from "react";
import { Link } from "react-scroll";
import AnimatedIcon from "../AnimatedIcon/AnimatedIcon";
import './ScrollFurther.css';
import scroll_icon from "../../assets/icons/scroll.json";

const ScrollFurther = ({next, side="left", text="Scroll Down to explore further"}) => {

    return (
        <Link to={next} smooth={true} duration={500} className={side} id="scroll_down">
            <AnimatedIcon icon={scroll_icon} class_name="nocss" icon_size={50}/>
            &nbsp;
            {text}
        </Link>
    );
}

export default ScrollFurther;