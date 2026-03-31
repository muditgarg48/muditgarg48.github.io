import { Player } from "@lordicon/react";
import React, {useRef} from "react";
import './AnimatedIcon.css';

const AnimatedIcon = ({class_name="contact_icon", icon, link='', icon_size=30, onClick=null}) => {
    
    const playerRef = useRef(null);

    const playIcon = () => {
        playerRef.current.playFromBeginning();
    }

    const iconPlayer = <Player ref={playerRef} size={icon_size} icon={icon}/>;

    return (
        link === ''?
            <div onMouseEnter={playIcon} className={class_name} onClick={onClick}>
                {iconPlayer}
            </div>:
            <a href={link} onMouseEnter={playIcon} className={class_name} target="_blank" rel="noreferrer">
                {iconPlayer}
            </a>
    )
}

export default AnimatedIcon;