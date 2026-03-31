import React from 'react';
import AnimatedCursor from "react-animated-cursor"

function CustomCursor() {
  return (
    <AnimatedCursor
        innerSize={8}
        outerSize={20}
        innerScale={1}
        outerScale={2}
        outerAlpha={0}
        hasBlendMode={true}
        innerStyle={{
          backgroundColor: 'var(--font-highlight-color)'
        }}
        outerStyle={{
          background: 'rgba(0, 172, 240, 0.3058823529411765)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(1.1px)',
        }}
      />
  )
}

export default CustomCursor;