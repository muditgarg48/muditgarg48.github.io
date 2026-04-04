import React, { useState, useEffect, useCallback, useRef, useMemo, memo } from "react";
import './CertificatesSection.css';
import SectionHeading from "../../components/SectionHeading/SectionHeading";
import FilterBar from "../../components/FilterBar/FilterBar";
import useFiltering from "../../hooks/useFiltering";

import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

const CertificatesSection = ({ certificates_data }) => {
    // 1. Extract years for FilterBar
    const years = useMemo(() => {
        const uniqueYears = [...new Set(certificates_data.map(cert => cert.date.split('-')[0]))];
        return ['All', ...uniqueYears.sort((a, b) => b - a)];
    }, [certificates_data]);

    // 2. Setup filtering logic
    const filteringConfig = useMemo(() => ({
        searchFields: ['name', 'issuing_auth', 'topics'],
        filterLogic: years.reduce((acc, year) => {
            if (year !== 'All') {
                acc[year] = (item) => item.date.startsWith(year);
            }
            return acc;
        }, {}),
        sortLogic: {
            'Newest': (a, b) => new Date(b.date) - new Date(a.date),
            'Oldest': (a, b) => new Date(a.date) - new Date(b.date),
            'Alphabetical': (a, b) => a.name.localeCompare(b.name)
        }
    }), [years]);

    const {
        searchTerm, setSearchTerm,
        sortBy, setSortBy,
        filter, setFilter,
        filteredData: filteredList
    } = useFiltering(certificates_data, filteringConfig);

    // 3. One flipped card at a time logic
    const [flippedCardId, setFlippedCardId] = useState(null);

    const toggleFlip = useCallback((id) => {
        setFlippedCardId(prev => prev === id ? null : id);
    }, []);

    return (
        <div id="certificates-section">
            <div className="certificates-header">
                <SectionHeading section_name="CERTIFICATES" />
            </div>

            <FilterBar 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                sortBy={sortBy}
                setSortBy={setSortBy}
                sortOptions={['Newest', 'Oldest', 'Alphabetical']}
                filter={filter}
                setFilter={setFilter}
                filterOptions={years}
                placeholder="Search certificates..."
            />

            <div id="certificates-grid">
                {filteredList.length > 0 ? (
                    filteredList.map((certificate) => (
                        <CertificateCard 
                            certificate={certificate} 
                            key={certificate.cert_id || certificate.file_name}
                            isFlipped={flippedCardId === (certificate.cert_id || certificate.file_name)}
                            onFlip={() => toggleFlip(certificate.cert_id || certificate.file_name)}
                        />
                    ))
                ) : (
                    <div className="no-results">No certificates found matching your criteria.</div>
                )}
            </div>
            
            {/* Legacy button removed for final cleanup phase */}
        </div>
    );
};

const CertificateCard = memo(({ certificate, isFlipped, onFlip }) => {
    const [pdfFile, setPdfFile] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const certificateRef = useRef(null);

    // 1. Intersection Observer for lazy-loading PDFs
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { rootMargin: '100px' }
        );

        if (certificateRef.current) observer.observe(certificateRef.current);
        return () => observer.disconnect();
    }, []);

    // 2. Load PDF once visible
    useEffect(() => {
        if (isVisible && !pdfFile && !isLoading) {
            setIsLoading(true);
            const loadPDF = async (certi) => {
                try {
                    const documentEndPoint = 'https://muditgarg48.github.io/portfolio_data/documents/';
                    const doc = await fetch(`${documentEndPoint}${certi}`);
                    setPdfFile(doc.url);
                } catch (error) {
                    console.error('Error loading PDF:', error);
                } finally {
                    setIsLoading(false);
                }
            };
            loadPDF(certificate.file_name);
        }
    }, [isVisible, certificate.file_name, pdfFile, isLoading]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    return (
        <div 
            ref={certificateRef} 
            className={`certificate-card-container ${isFlipped ? 'flipped' : ''}`}
        >
            <div className="certificate-card-inner">
                {/* Front Side */}
                <div className="certificate-card-front">
                    <div className="certificate-title-group">
                        <h3>{certificate.name}</h3>
                        <p className="issued-date">Issued on {formatDate(certificate.date)}</p>
                    </div>

                    <div className="certificate-preview">
                        {pdfFile && isVisible ? (
                            <Document file={pdfFile} loading={<div className="preview-loader">Loading Certificate...</div>}>
                                <Page pageNumber={1} renderAnnotationLayer={false} renderTextLayer={false} width={320} />
                            </Document>
                        ) : (
                            <div className="preview-placeholder">
                                <span>📄 Preview unavailable until visible</span>
                            </div>
                        )}
                    </div>

                    <button className="flip-btn" onClick={onFlip}>
                        MORE DETAILS
                    </button>
                </div>

                {/* Back Side */}
                <div className="certificate-card-back">
                    <div className="back-content">
                        <h3>{certificate.name}</h3>
                        
                        <div className="back-section">
                            <label>ISSUING AUTHORITY</label>
                            <div className="pill-container">
                                {certificate.issuing_auth.map(auth => (
                                    <span key={auth} className="cert-pill pro">{auth}</span>
                                ))}
                            </div>
                        </div>

                        <div className="back-section">
                            <label>TOPICS & SKILLS</label>
                            <div className="pill-container">
                                {certificate.topics.map(topic => (
                                    <span key={topic} className="cert-pill">{topic}</span>
                                ))}
                            </div>
                        </div>

                        <div className="cert-actions">
                            <a href={certificate.verification_link} target="_blank" rel="noreferrer" className="action-btn verify">
                                VERIFY
                            </a>
                            <a href={pdfFile || `https://muditgarg48.github.io/portfolio_data/documents/${certificate.file_name}`} target="_blank" rel="noreferrer" className="action-btn open">
                                OPEN PDF
                            </a>
                        </div>
                    </div>

                    <button className="flip-btn" onClick={onFlip}>
                        BACK
                    </button>
                </div>
            </div>
        </div>
    );
});

// Clean mapping: Old components CertificateFront, CertificateBack, and FlipButton are now integrated into CertificateCard.

export default CertificatesSection;