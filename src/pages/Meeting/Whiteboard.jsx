import * as fabric from 'fabric';
import { useEffect, useRef } from 'react';

function Whiteboard() {
    const canvasref = useRef(null);

    useEffect(() => {
        const canvasEl = canvasref.current;
        const container = canvasEl.parentElement;

        const width = container.clientWidth;
        const height = container.clientHeight;

        canvasEl.width = width;
        canvasEl.height = height;

        const fabricCanvas = new fabric.Canvas(canvasEl, {
            backgroundColor: 'white',
            width: width,
            height: height,
            isDrawingMode: true,
        });

        fabricCanvas.freeDrawingBrush = new fabric.PencilBrush(fabricCanvas);
        fabricCanvas.freeDrawingBrush.width = 5;
        fabricCanvas.freeDrawingBrush.color = '#000000';

        return () => {
            fabricCanvas.dispose();
        };
    }, []);

    return (
        <div className="border border-gray-300 rounded-xl h-5/6 mt-4 bg-white">
            <canvas className="rounded-xl h-full" ref={canvasref}></canvas>
        </div>
    );
}

export default Whiteboard;
