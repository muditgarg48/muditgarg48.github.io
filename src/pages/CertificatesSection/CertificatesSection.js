import React, {useState, useEffect} from "react";
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

    useEffect(() => {
        filterCertificates(searchQuery);
    }, [searchQuery]);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value.toLowerCase());
    };

    const filterCertificates = (query) => {
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
    };

    function sortCertificatesByDate(certificates) {
        return certificates.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

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
                    filteredCertificates.map((certificate, index) => 
                        <Certificate certificate={certificate} key={index}/>
                ):
                <span>No certificates found!</span>
            }
            </div>
            <Certificatev1/>
        </div>
    );
}

const Certificatev1 = () => {
    
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
}

const Certificate = ({certificate}) => {

    const [pdfFile, setPdfFile] = useState(null);
    const [isFlipped, setIsFlipped] = useState(false);

    useEffect(() => {
        const loadPDF = async (certi) => {
            const documentEndPoint = 'https://muditgarg48.github.io/portfolio_data/documents/';
            const doc = await fetch(`${documentEndPoint}${certi}`);
            setPdfFile(doc.url);
        };

        loadPDF(certificate.file_name);
    }, [certificate.file_name]);
    
    return (
        <ReactCardFlip
        flipDirection="horizontal" 
        isFlipped={isFlipped}
        >
            <CertificateFront 
                certificate={certificate} 
                pdfFile={pdfFile} 
                isFlipped={isFlipped}
                setIsFlipped={setIsFlipped}/>
            <CertificateBack 
                certificate={certificate} 
                pdfFile={pdfFile} 
                isFlipped={isFlipped}
                setIsFlipped={setIsFlipped}/>
        </ReactCardFlip>
    );

}

const CertificateFront = ({certificate, pdfFile, isFlipped, setIsFlipped}) => {
    
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    return (
        <div className="certificate-front">
            <div className="certificate-title">{certificate.name}</div>
            {pdfFile ? (
                <Document file={pdfFile}>
                    <Page pageNumber={1} renderAnnotationLayer={false} renderTextLayer={false} width="280"/>
                </Document>
            ) : (
                <div>Loading PDF...</div>
            )}
            <div className="certificate-date">
                Issued on {formatDate(certificate.date)}
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
}

const CertificateBack = ({certificate, pdfFile, isFlipped, setIsFlipped}) => {
    
    const categories = certificate.cat;
    const topics = certificate.topics;

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
                    <a href={pdfFile} target="_blank" rel="noreferrer">
                        Open 
                        {/* <img src={share} height='25px' width='25px' alt='' /> */}
                    </a>
                </div>
            </div>
            <FlipButton isFlipped={isFlipped} setIsFlipped={setIsFlipped}/>
        </div>
    );
}

const FlipButton = ({isFlipped, setIsFlipped}) => {
    return (
        <div className="flip-button">
            <div onClick={() => setIsFlipped(!isFlipped)}>
                {isFlipped? "Less": "More"} Details
            </div>
        </div>
    );
}

export default CertificatesSection;