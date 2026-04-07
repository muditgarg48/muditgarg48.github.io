const GraduationIcon = ({ size = 32, color = 'currentColor', strokeWidth = 1.5, className = '' }) => (
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
        <path d="M22 10L12 5L2 10L12 15L22 10Z"/>
        <path d="M6 12.5V16C6 16 8.5 19 12 19C15.5 19 18 16 18 16V12.5"/>
    </svg>
);

export default GraduationIcon;