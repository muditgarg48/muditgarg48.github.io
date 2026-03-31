import React from "react";
import { Chrono } from "react-chrono";
import './EducationSection.css';

const EducationSection = ({education_history}) => {

    const themeSettings = {
        primary: 'var(--font-primary-color)',
        secondary: 'var(--font-highlight-color)',
        cardBgColor: 'var(--font-secondary-color)',
        cardDetailsBgColor: 'transparent',
        cardMediaBgColor: 'transparent',
        cardDetailsColor: 'var(--font-highlight-color)',
        cardSubtitleColor: 'var(--font-highlight-color)',
        cardTitleColor: 'var(--font-highlight-color)',
        titleColor: 'var(--font-highlight-color)',
        toolbarBgColor: 'var(--bg-color)',
        toolbarBtnBgColor: 'var(--secondary-color)',
        toolbarTextColor: 'var(--font-highlight-color)',
        nestedCardBgColor: 'var(--font-secondary-color)',
        nestedCardTitleColor: 'var(--font-highlight-color)'
    };
    const mediaSettings = {
        fit:'contain'
    };

    return (
        <div id="education-subsection">
            <div className="subsection-heading">
                Education History
            </div>
            &nbsp;
            <Chrono 
                mode="VERTICAL"
                mediaSettings={mediaSettings}
                slideShow
                slideItemDuration={3000}
                slideShowType="slide_from_sides"
                items={education_history}
                theme={themeSettings}
            />
        </div>
    );
}

export default EducationSection;