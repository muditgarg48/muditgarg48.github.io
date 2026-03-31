import React from 'react';
import './SectionHeading.css';

function SectionHeading({section_name}) {
  return (
    <div id="heading">
        {section_name}
    </div>
  )
}

export default SectionHeading;