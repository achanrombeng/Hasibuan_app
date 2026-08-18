import useDFlip, { DFlipOptions } from '@/hooks/useDFlip';
import { useRef } from 'react';

interface DearFlipViewerProps {
    pdfURL: string;
    options?: DFlipOptions;
    className?: string;
}

const DearFlipViewer: React.FC<DearFlipViewerProps> = ({
    pdfURL,
    options = {},
    className = '',
}) => {
    const containerRef = useRef<HTMLDivElement>(null);

    // Use the custom hook
    useDFlip(containerRef as React.RefObject<HTMLDivElement>, pdfURL, options);

    return (
        <div
            ref={containerRef}
            className={`dflip-container ${className}`}
            data-pdf-url={pdfURL}
            style={{ width: '100%', height: '100%' }}
        />
    );
};

export default DearFlipViewer;
