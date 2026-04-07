const AdviceIcon = ({ size = 24, color = 'currentColor', strokeWidth = 2, className = '' }) => (
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
        <path d="m12 14 4-4"/>
        <path d="m3.34 19 1.407-5.159a2 2 0 0 1 1.244-1.356L21 7l-5.5 12.5-3.5-3.5-4 4Z"/>
    </svg>
);

export default AdviceIcon;