import React, { JSX, useState } from 'react';

type CanvasProps = { shape: string, size: number, color: string }

const Canvas: React.FC<CanvasProps> = ({ shape, size, color }) => {

    const [SVGElements, setSVGElements] = useState<JSX.Element[]>([]);
    const removeElement = (id: string) => {
        setSVGElements(prev => prev.filter((el: JSX.Element) => { return el.props.id !== id; }));
    };
    const handleCanvasClick = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        const generatedID = Date.now().toString();
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
            newElement = <circle cx={x} cy={y} r={size / 2} fill={color} id={generatedID} />;
        }
        else if (shape === 'square') {
            newElement = <rect x={x - size / 2} y={y - size / 2} fill={color} width={size} height={size} id={generatedID} />;
        }
        if (newElement !== null) {
            setSVGElements(previousElements => ([...previousElements, newElement]));
        }
    };

    return (<svg className='canvas'
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        onClick={handleCanvasClick}
    >
        <rect id="canvas" width="100%" height="100%" fill="white" />
        {SVGElements.map(item => item)}
    </svg>);
};

export default Canvas;
