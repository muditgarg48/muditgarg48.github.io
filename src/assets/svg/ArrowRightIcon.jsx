const ArrowRightIcon = ({ size = 24, color = 'currentColor', strokeWidth = 2, className = '' }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke={color} 
        strokeWidth={strokeWidth} 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
);

export default ArrowRightIcon;