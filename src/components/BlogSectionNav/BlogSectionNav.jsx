"use client";

import { useEffect, useRef, useState } from 'react';
import './BlogSectionNav.css';

const SCROLL_GAP = 16;

const BlogSectionNav = ({ sections, headerOffset = 0 }) => {
  const [activeId, setActiveId] = useState(null);
  const visibleSectionsRef = useRef(new Map());

  useEffect(() => {
    if (sections.length === 0) return;

    visibleSectionsRef.current = new Map();

    const observers = sections.map(({ id }) => {
      const element = document.getElementById(id);
      if (!element) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            visibleSectionsRef.current.set(id, entry.boundingClientRect.top);
          } else {
            visibleSectionsRef.current.delete(id);
          }

          if (visibleSectionsRef.current.size === 0) {
            setActiveId(null);
          } else {
            const topmost = [...visibleSectionsRef.current.entries()]
              .sort((a, b) => a[1] - b[1])[0];
            setActiveId(topmost[0]);
          }
        },
        { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
      );

      observer.observe(element);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, [sections]);

  const resolveScrollOffset = () => {
    const header = document.querySelector('.blog-detail-header');
    const liveHeight = header?.getBoundingClientRect().height ?? 0;
    return Math.max(headerOffset, liveHeight) + SCROLL_GAP;
  };

  const getTargetScrollTop = (element) => {
    const offset = resolveScrollOffset();
    return Math.max(0, window.scrollY + element.getBoundingClientRect().top - offset);
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (!element) return;

    window.scrollTo({ top: getTargetScrollTop(element), behavior: 'smooth' });

    const correctPosition = () => {
      const correctedTop = getTargetScrollTop(element);
      if (Math.abs(window.scrollY - correctedTop) > 2) {
        window.scrollTo({ top: correctedTop, behavior: 'auto' });
      }
    };

    if ('onscrollend' in window) {
      window.addEventListener('scrollend', correctPosition, { once: true });
    } else {
      setTimeout(correctPosition, 500);
    }
  };

  if (sections.length === 0) return null;

  return (
    <nav className="blog-section-nav" aria-label="Blog sections">
      <div className="blog-section-nav-pills">
        {sections.map(({ id, label }) => (
          <div key={id} className="blog-section-nav-item">
            <button
              type="button"
              className={`blog-section-nav-pill ${activeId === id ? 'active' : ''}`}
              onClick={() => scrollToSection(id)}
              aria-label={`Jump to section: ${label}`}
              aria-current={activeId === id ? 'true' : undefined}
            />
            <span className="blog-section-nav-label" aria-hidden="true">
              {label}
            </span>
          </div>
        ))}
      </div>
    </nav>
  );
};

export default BlogSectionNav;
