import * as fabric from 'fabric';
import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { Button } from '../ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import assets from '../../constants/icon';

/**
 * This component provides a collaborative whiteboard
 * synchronized in real-time across multiple users using
 * Fabric.js (for canvas drawing) and Socket.IO (for communication).
 *
 * Features:
 *  - Real-time drawing synchronization
 *  - Drawing, erasing, and editing modes
 *  - Adding text boxes and sticky notes
 *  - Clear-all canvas functionality
 *
 * @param {string} roomId - The unique ID of the whiteboard room.
 */
function Whiteboard({ roomId }) {
    const canvasRef = useRef(null); // HTML canvas reference
    const fabricRef = useRef(null); // Fabric.js canvas instance
    const socketRef = useRef(null); // Socket.IO connection reference

    const isApplyingRemoteRef = useRef(false); // Prevents feedback loops
    const eraserHandlersRef = useRef({ bound: false, onDown: null }); // Tracks eraser events
    const snapshotTimerRef = useRef(null); // Debounce timer for snapshot emission

    const [brushColor, setBrushColor] = useState('#000000');
    const [isEraserMode, setIsEraserMode] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        if (!roomId) return;

        const socket = io(import.meta.env.VITE_WEBSOCKET_URL + '/whiteboard', {
            transports: ['websocket'],
        });
        socketRef.current = socket;

        // Join whiteboard room
        socket.emit('join-whiteboard', roomId);

        // Listen for remote canvas data
        socket.on('canvas-data', (dataUrl) => {
            const canvas = fabricRef.current;
            if (!canvas || !dataUrl) return;

            isApplyingRemoteRef.current = true;

            const imgEl = new Image();
            imgEl.crossOrigin = 'anonymous';
            imgEl.src = dataUrl;

            imgEl.onload = () => {
                const fabricImg = new fabric.Image(imgEl);
                const w = canvas.getWidth();
                const h = canvas.getHeight();
                const s = Math.min(w / fabricImg.width, h / fabricImg.height);

                fabricImg.set({
                    left: (w - fabricImg.width * s) / 2,
                    top: (h - fabricImg.height * s) / 2,
                    scaleX: s,
                    scaleY: s,
                    selectable: false,
                    evented: false,
                });

                requestAnimationFrame(() => {
                    canvas.clear();
                    canvas.backgroundImage = fabricImg;
                    canvas.backgroundColor = 'white';
                    canvas.renderAll();
                    isApplyingRemoteRef.current = false;
                });
            };
        });

        return () => {
            socket.disconnect();
        };
    }, [roomId]);

    useEffect(() => {
        const el = canvasRef.current;
        if (!el || !el.parentElement) return;

        const parent = el.parentElement;

        // Create Fabric canvas
        const canvas = new fabric.Canvas(el, {
            backgroundColor: 'white',
            width: parent.clientWidth,
            height: parent.clientHeight,
            isDrawingMode: true,
            selection: false,
        });

        // Initialize drawing brush
        const brush = new fabric.PencilBrush(canvas);
        brush.width = 5;
        brush.color = brushColor;
        canvas.freeDrawingBrush = brush;

        fabricRef.current = canvas;

        /** Adjusts canvas size dynamically on window resize */
        const handleResize = () => {
            canvas.setWidth(parent.clientWidth);
            canvas.setHeight(parent.clientHeight);
            canvas.requestRenderAll();
        };
        window.addEventListener('resize', handleResize);

        /** Debounce snapshot emission */
        const scheduleSnapshot = (delay = 200) => {
            if (isApplyingRemoteRef.current) return;
            if (snapshotTimerRef.current) clearTimeout(snapshotTimerRef.current);
            snapshotTimerRef.current = setTimeout(emitSnapshot, delay);
        };

        // Capture drawing modifications
        canvas.on('path:created', () => scheduleSnapshot());
        canvas.on('object:modified', () => scheduleSnapshot());
        canvas.on('object:removed', () => scheduleSnapshot());
        canvas.on('text:changed', () => scheduleSnapshot(300));
        canvas.on('editing:exited', () => scheduleSnapshot());

        return () => {
            if (snapshotTimerRef.current) clearTimeout(snapshotTimerRef.current);
            window.removeEventListener('resize', handleResize);
            canvas.dispose();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Emits current canvas snapshot to peers
    const emitSnapshot = () => {
        const canvas = fabricRef.current;
        const socket = socketRef.current;
        if (!canvas || !socket) return;
        const data = canvas.toDataURL({ format: 'png' });
        socket.emit('drawing-data', data);
    };

    // Eraser Mode (attach / detach)
    const attachEraser = () => {
        const c = fabricRef.current;
        if (!c || eraserHandlersRef.current.bound) return;
        const onDown = (e) => {
            if (e.target) {
                c.remove(e.target);
                c.requestRenderAll();
                emitSnapshot();
            }
        };
        c.on('mouse:down', onDown);
        eraserHandlersRef.current = { bound: true, onDown };
    };

    const detachEraser = () => {
        const c = fabricRef.current;
        if (!c || !eraserHandlersRef.current.bound) return;
        c.off('mouse:down', eraserHandlersRef.current.onDown);
        eraserHandlersRef.current = { bound: false, onDown: null };
    };

    // Toggles between eraser and drawing
    const toggleEraser = () => {
        const c = fabricRef.current;
        if (!c) return;
        if (isEraserMode) {
            detachEraser();
            setIsEraserMode(false);
            setMode(isEditMode);
        } else {
            detachEraser();
            c.isDrawingMode = false;
            c.selection = false;
            c.discardActiveObject();
            c.forEachObject((o) => (o.selectable = false));
            attachEraser();
            setIsEraserMode(true);
        }
    };

    // Switches between Edit / Draw
    const setMode = (editMode) => {
        const c = fabricRef.current;
        if (!c) return;

        detachEraser();
        setIsEraserMode(false);

        if (editMode) {
            c.isDrawingMode = false;
            c.selection = true;
            c.forEachObject((o) => (o.selectable = true));
        } else {
            c.isDrawingMode = true;
            c.selection = false;
            c.forEachObject((o) => (o.selectable = false));
        }

        c.requestRenderAll();
        setIsEditMode(editMode);
    };

    const toggleDrawEdit = () => setMode(!isEditMode);

    // Clears all canvas items
    const clearAll = () => {
        const c = fabricRef.current;
        if (!c) return;
        c.clear();
        c.backgroundColor = 'white';
        setMode(false);
        emitSnapshot();
    };

    // Adds editable textbox to canvas
    const addTextbox = () => {
        const c = fabricRef.current;
        if (!c) return;
        const textbox = new fabric.IText('Double-click to edit', {
            left: 100,
            top: 100,
            width: 220,
            fontSize: 20,
            fill: '#000',
        });
        c.add(textbox);
        setMode(true);
        c.setActiveObject(textbox);
        textbox.enterEditing();
        emitSnapshot();
    };

    // Adds sticky note to canvas
    const addStickyNote = () => {
        const c = fabricRef.current;
        if (!c) return;
        const rect = new fabric.Rect({
            width: 200,
            height: 160,
            fill: '#fffecb',
            stroke: '#bfb76f',
            strokeWidth: 2,
            rx: 10,
            ry: 10,
        });
        const text = new fabric.IText('Double click to edit...', {
            fontSize: 16,
            fill: '#333',
            left: 12,
            top: 12,
            width: 176,
        });
        const group = new fabric.Group([rect, text], {
            left: 100,
            top: 100,
            hasControls: true,
            lockRotation: true,
            objectCaching: false,
            subTargetCheck: true,
        });
        c.add(group);
        setMode(true);
        c.setActiveObject(group);

        c.on('mouse:down', (opt) => {
            const target = opt.subTargets && opt.subTargets[0];
            if (target && target.type === 'i-text') {
                c.setActiveObject(target);
                target.enterEditing();
            }
        });
        emitSnapshot();
    };

    return (
        <div className="flex flex-col gap-2 h-full">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-5 p-2 bg-gray-100 rounded-md border border-gray-300">
                <div className="flex items-center gap-3 flex-wrap">
                    <label className="flex items-center gap-2">
                        <FontAwesomeIcon icon={assets.icon.palette} />
                        <input
                            type="color"
                            value={brushColor}
                            onChange={(e) => setBrushColor(e.target.value)}
                            className="w-10 h-6 border-none cursor-pointer"
                        />
                    </label>

                    <Button
                        onClick={toggleEraser}
                        className={`px-3 py-1 rounded-md ${
                            isEraserMode ? 'bg-red-400' : 'bg-white border text-black'
                        } hover:bg-red-400 hover:text-white`}
                    >
                        <FontAwesomeIcon icon={assets.icon.eraser} />
                    </Button>

                    <Button
                        onClick={addStickyNote}
                        className="px-3 py-1 rounded-md bg-white text-black border hover:bg-red-400 hover:text-white"
                    >
                        <FontAwesomeIcon icon={assets.icon.sticky} />
                    </Button>

                    <Button
                        onClick={addTextbox}
                        className="px-3 py-1 rounded-md bg-white border text-black hover:bg-red-400 hover:text-white"
                    >
                        <FontAwesomeIcon icon={assets.icon.text} />
                    </Button>

                    <Button
                        onClick={clearAll}
                        className="px-3 py-1 rounded-md bg-white border text-black hover:bg-red-400 hover:text-white"
                    >
                        <FontAwesomeIcon icon={assets.icon.trash} />
                    </Button>
                </div>

                <Button
                    onClick={toggleDrawEdit}
                    className={`px-3 py-1 rounded-md ${
                        isEditMode ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
                    } hover:opacity-80`}
                >
                    {isEditMode ? (
                        <>
                            <FontAwesomeIcon icon={assets.icon.edit} /> Editing
                        </>
                    ) : (
                        <>✏️ Drawing</>
                    )}
                </Button>
            </div>

            {/* Canvas board */}
            <div className="border border-gray-300 rounded-xl bg-white flex-1 overflow-hidden">
                <canvas ref={canvasRef} className="w-full h-full" />
            </div>
        </div>
    );
}

export default Whiteboard;
