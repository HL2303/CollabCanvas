// src/components/Canvas.jsx
import React, { useRef, useEffect, useState } from 'react';
import { Brush, Eraser, Trash2 } from 'lucide-react';

const Canvas = ({ socket, drawingHistory }) => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [tool, setTool] = useState('pen');
    const [color, setColor] = useState('#000000'); // Default color is now black
    const [lineWidth, setLineWidth] = useState(5);
    const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });

    const drawLine = (context, x0, y0, x1, y1, drawColor, width, toolType) => {
        context.beginPath();
        context.moveTo(x0, y0);
        context.lineTo(x1, y1);
        context.strokeStyle = toolType === 'eraser' ? '#FFFFFF' : drawColor; // Eraser is now white
        context.lineWidth = width;
        context.lineCap = 'round';
        context.stroke();
        context.closePath();
    };
    
    const redrawCanvas = (context) => {
        const canvas = canvasRef.current;
        context.fillStyle = '#FFFFFF'; // Set background to white
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        drawingHistory.forEach((data) => {
            if (data.type === 'draw') {
                drawLine(context, data.x0, data.y0, data.x1, data.y1, data.color, data.lineWidth, data.tool);
            }
        });
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        redrawCanvas(context);
    }, [drawingHistory]);

    const startDrawing = (e) => {
        const { offsetX, offsetY } = e.nativeEvent;
        setIsDrawing(true);
        setLastPosition({ x: offsetX, y: offsetY });
    };

    const draw = (e) => {
        if (!isDrawing) return;
        
        const { offsetX, offsetY } = e.nativeEvent;

        // Draw locally for immediate feedback
        const context = canvasRef.current.getContext('2d');
        drawLine(context, lastPosition.x, lastPosition.y, offsetX, offsetY, color, lineWidth, tool);
        
        // Send drawing data to the server
        if (socket?.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                type: 'draw',
                x0: lastPosition.x,
                y0: lastPosition.y,
                x1: offsetX,
                y1: offsetY,
                tool: tool,
                color: color,
                lineWidth: lineWidth,
            }));
        }

        setLastPosition({ x: offsetX, y: offsetY });
    };

    const stopDrawing = () => setIsDrawing(false);

    const handleClearCanvas = () => {
        if (socket?.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: 'clear' }));
        }
    };

    return (
        <div className="flex flex-col items-center">
            <div className="flex items-center gap-4 p-2 mb-4 bg-gray-900/50 border border-gray-800 rounded-lg shadow-md">
                <button onClick={() => setTool('pen')} title="Pen" className={`p-2 rounded-md ${tool === 'pen' ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 text-gray-300'}`}>
                    <Brush className="w-5 h-5" />
                </button>
                <button onClick={() => setTool('eraser')} title="Eraser" className={`p-2 rounded-md ${tool === 'eraser' ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 text-gray-300'}`}>
                    <Eraser className="w-5 h-5" />
                </button>
                
                <div className="h-6 w-px bg-gray-700" />

                <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-8 h-8 bg-transparent border-none cursor-pointer" disabled={tool === 'eraser'} />
                
                <div className="flex items-center">
                    <input type="range" min="1" max="50" value={lineWidth} onChange={(e) => setLineWidth(e.target.value)} className="w-24 cursor-pointer" />
                    <span className="ml-3 text-sm w-6 text-center text-gray-300">{lineWidth}</span>
                </div>

                <div className="h-6 w-px bg-gray-700" />

                <button onClick={handleClearCanvas} title="Clear Canvas" className="p-2 rounded-md hover:bg-gray-700 text-gray-300">
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>
            
            <canvas
                ref={canvasRef}
                width={window.innerWidth * 0.6}
                height={window.innerHeight * 0.7}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="bg-white rounded-lg shadow-lg cursor-crosshair border border-gray-800"
            />
        </div>
    );
};

export default Canvas;
