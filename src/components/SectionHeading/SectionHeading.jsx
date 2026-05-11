import React from 'react';
import './SectionHeading.css';

function SectionHeading({section_name}) {
  return (
    <h2 id="heading">
        {section_name}
    </h2>
  )
}

export default SectionHeading;