import React, { JSX, useEffect, useRef, useState } from 'react';

type CanvasProps = {
    shape: string;
    size: number;
    color: string;
    setSvgString: React.Dispatch<React.SetStateAction<string>>;
    setShapeCount?: (count: number) => void;
};

const Canvas: React.FC<CanvasProps> = ({ shape, size, color, setSvgString, setShapeCount }) => {

    const [SVGElements, setSVGElements] = useState<JSX.Element[]>([]);
    const svgRef = useRef<SVGSVGElement>(null);
    // Shape IDs are numeric: the server's validateUpload only accepts digits
    const nextShapeId = useRef(0);
    const removeElement = (id: string) => {
        setSVGElements(prev => prev.filter((el: JSX.Element) => { return el.props.id !== id; }));
    };
    const handleCanvasClick = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        nextShapeId.current += 1;
        const generatedID = nextShapeId.current.toString();
        let newElement: JSX.Element | null = null;
        const rect = (event.currentTarget as SVGSVGElement).getBoundingClientRect();
        const x: number = event.clientX - rect.left;
        const y: number = event.clientY - rect.top;
        if (shape === 'erase') {
            const target = event.target as SVGElement;
            if (target.id) {
                removeElement(target.id);
            }
            return;
        }
        else if (shape === 'circle') {
            newElement = <circle cx={x} cy={y} r={size / 2} fill={color} id={generatedID} key={generatedID} />;
        }
        else if (shape === 'square') {
            newElement = <rect x={x - size / 2} y={y - size / 2} fill={color} width={size} height={size} id={generatedID} key={generatedID} />;
        }
        if (newElement !== null) {
            setSVGElements(previousElements => ([...previousElements, newElement]));
        }
    };

    useEffect(() => {
        const svgElement = svgRef.current;
        const serializer = new XMLSerializer();
        if (svgElement) {
            setSvgString(serializer.serializeToString(svgElement));
        }
    }, [SVGElements, setSvgString]);

    useEffect(() => {
        setShapeCount?.(SVGElements.length);
    }, [SVGElements, setShapeCount]);

    return (<svg
        ref={svgRef}
        width="400"
        height="400"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        onClick={handleCanvasClick}
    >
        <rect width="100%" height="100%" fill="white" />
        {SVGElements}
    </svg>);
};

export default Canvas;
