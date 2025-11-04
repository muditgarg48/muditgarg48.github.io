import React, {useState, useEffect, useCallback, useRef, useMemo, memo} from "react";
import './CertificatesSection.css';
import SectionHeading from "../../components/SectionHeading/SectionHeading";
import AnimatedIcon from "../../components/AnimatedIcon/AnimatedIcon";

import { Document, Page, pdfjs } from 'react-pdf';
import ReactCardFlip from 'react-card-flip';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

const CertificatesSection = ({certificates_data}) => {
    
    // const certificates_data = require('../../assets/data/certificates_data.json');

    const [searchQuery, setSearchQuery] = useState('');
    const [filteredCertificates, setFilteredCertificates] = useState(certificates_data);

    function sortCertificatesByDate(certificates) {
        return certificates.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    const filterCertificates = useCallback((query) => {
        const filtered = certificates_data.filter((cert) => {
            return (
                cert.name.toLowerCase().includes(query) ||
                cert.file_name.toLowerCase().includes(query) ||
                cert.cat.some((category) => category.toLowerCase().includes(query)) ||
                cert.issuing_auth.some((auth) => auth.toLowerCase().includes(query)) ||
                cert.date.includes(query) ||
                cert.cert_id.toLowerCase().includes(query) ||
                cert.verification_link.toLowerCase().includes(query) ||
                cert.topics.some((topic) => topic.toLowerCase().includes(query))
            );
        });
        setFilteredCertificates(sortCertificatesByDate(filtered));
    }, [certificates_data]);

    useEffect(() => {
        filterCertificates(searchQuery);
    }, [searchQuery, filterCertificates]);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value.toLowerCase());
    };

    const search_icon = require('../../assets/icons/search.json');
    const clear_query = require('../../assets/icons/fill_bin.json');

    return (
        <div id="certificates-section">
            <SectionHeading section_name="CERTIFICATES"/>
            <div id="search-bar">
                <AnimatedIcon icon={search_icon} class_name="nocss"/>
                <input
                    type="text"
                    placeholder="Search certificates by anything ..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    id="search-input"
                    />
                <AnimatedIcon icon={clear_query} class_name="nocss" onClick={() => setSearchQuery('')}/>
            </div>
            <div id="certificates">
                {
                    filteredCertificates.length > 0?
                    filteredCertificates.map((certificate) => 
                        <Certificate certificate={certificate} key={certificate.cert_id || certificate.file_name}/>
                ):
                <span>No certificates found!</span>
            }
            </div>
            <Certificatev1/>
        </div>
    );
}

const Certificatev1 = memo(() => {
    
    const legacy = require('../../assets/icons/legacy.json');
    
    return (
        <div id="v1-button">
            <div id="v1-button-content">
                <a href="https://muditgarg48.github.io/my_certificates_web/" target="_blank" rel="noreferrer">
                    <AnimatedIcon icon={legacy}/>
                    LEGACY VERSION
                </a>
                <div id="legacy-tech">
                    POWERED BY
                    &nbsp;
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flutter/flutter-original.svg" alt="flutter"/>
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/dart/dart-original.svg" alt="dart"/>
                </div>
            </div>
        </div>
    )
});

const Certificate = memo(({certificate}) => {

    const [pdfFile, setPdfFile] = useState(null);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const certificateRef = useRef(null);

    // Intersection Observer for lazy loading
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
            {
                rootMargin: '50px', // Start loading 50px before it becomes visible
                threshold: 0.1
            }
        );

        if (certificateRef.current) {
            observer.observe(certificateRef.current);
        }

        return () => {
            if (certificateRef.current) {
                observer.unobserve(certificateRef.current);
            }
        };
    }, []);

    // Load PDF only when certificate becomes visible
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
    
    return (
        <div ref={certificateRef}>
            <ReactCardFlip
            flipDirection="horizontal" 
            isFlipped={isFlipped}
            >
                <CertificateFront 
                    certificate={certificate} 
                    pdfFile={pdfFile} 
                    isVisible={isVisible}
                    isLoading={isLoading}
                    isFlipped={isFlipped}
                    setIsFlipped={setIsFlipped}/>
                <CertificateBack 
                    certificate={certificate} 
                    pdfFile={pdfFile} 
                    isFlipped={isFlipped}
                    setIsFlipped={setIsFlipped}/>
            </ReactCardFlip>
        </div>
    );

});

const CertificateFront = memo(({certificate, pdfFile, isVisible, isLoading, isFlipped, setIsFlipped}) => {
    
    const formatDate = useCallback((dateString) => {
        const options = { year: 'numeric', month: 'short', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }, []);

    const formattedDate = useMemo(() => formatDate(certificate.date), [certificate.date, formatDate]);

    // Thumbnail placeholder component
    const CertificateThumbnail = () => (
        <div className="certificate-thumbnail">
            <div className="thumbnail-icon">📄</div>
            <div className="thumbnail-text">{certificate.name}</div>
            {isLoading && <div className="thumbnail-loading">Loading...</div>}
        </div>
    );

    return (
        <div className="certificate-front">
            <div className="certificate-title">{certificate.name}</div>
            {pdfFile && isVisible ? (
                <Document file={pdfFile} loading={<CertificateThumbnail />}>
                    <Page pageNumber={1} renderAnnotationLayer={false} renderTextLayer={false} width="280"/>
                </Document>
            ) : (
                <CertificateThumbnail />
            )}
            <div className="certificate-date">
                Issued on {formattedDate}
            </div>
            <div className='certificate-issuing-auth'>
                {certificate.issuing_auth.map(authority => (
                    <span key={authority} className='certificate-auth'>{authority} </span>
                ))}
            </div>
            <div className="certificate-icons">
                <FlipButton isFlipped={isFlipped} setIsFlipped={setIsFlipped}/>
            </div>
        </div>
    );
});

const CertificateBack = memo(({certificate, pdfFile, isFlipped, setIsFlipped}) => {
    
    const categories = useMemo(() => certificate.cat, [certificate.cat]);
    const topics = useMemo(() => certificate.topics, [certificate.topics]);

    // Get PDF URL directly from document endpoint if pdfFile is not loaded yet
    const pdfUrl = pdfFile || `https://muditgarg48.github.io/portfolio_data/documents/${certificate.file_name}`;

    return (
        <div className="certificate-back">
            <div className='certificate-categories'>
                {categories.map(category => (
                    <span key={category} className='certificate-category'>{category}</span>
                ))}
            </div>
            <div className='certificate-topics'>
                {topics.map(topic => (
                    <span key={topic} className='certificate-topic'>{topic}</span>
                ))}
            </div>
            {/* <div className="certificate-id">
                Certificate ID: {certificate.cert_id}
            </div> */}
            <div className="certificate-icons">
                <div className="verify-button">
                    <a href={certificate.verification_link} target="_blank" rel="noreferrer">
                        Verify
                    </a>
                </div>
                <div className='open-button'>
                    <a href={pdfUrl} target="_blank" rel="noreferrer">
                        Open 
                        {/* <img src={share} height='25px' width='25px' alt='' /> */}
                    </a>
                </div>
            </div>
            <FlipButton isFlipped={isFlipped} setIsFlipped={setIsFlipped}/>
        </div>
    );
});

const FlipButton = memo(({isFlipped, setIsFlipped}) => {
    const handleClick = useCallback(() => {
        setIsFlipped(!isFlipped);
    }, [isFlipped, setIsFlipped]);

    return (
        <div className="flip-button">
            <div onClick={handleClick}>
                {isFlipped? "Less": "More"} Details
            </div>
        </div>
    );
});

export default CertificatesSection;