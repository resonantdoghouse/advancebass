"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCcw, Moon, Sun, Crop, Download, X, Wand2, Maximize2, Minimize2, ChevronLeft, ChevronRight, Move } from "lucide-react";
import ReactCrop, { Crop as CropType, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useTheme } from "next-themes";

interface TranscriptionImageViewerProps {
  images: { src: string; alt: string }[];
}

export function TranscriptionImageViewer({ images }: TranscriptionImageViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSharpened, setIsSharpened] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCropMode, setIsCropMode] = useState(false);
  const [crop, setCrop] = useState<CropType>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const { resolvedTheme } = useTheme();

  const currentImage = images[currentIndex] || { src: '', alt: '' };

  // Initialize dark mode based on global theme
  useEffect(() => {
    if (resolvedTheme === 'dark') {
      setIsDarkMode(true);
    } else {
      setIsDarkMode(false);
    }
  }, [resolvedTheme]);

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isCropMode) return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape' && isFullscreen) document.exitFullscreen();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCropMode, isFullscreen, currentIndex, images.length]);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => {
    setZoom((prev) => {
      const newZoom = Math.max(prev - 0.25, 0.5);
      if (newZoom <= 1) setPan({ x: 0, y: 0 }); // Reset pan if zoomed out
      return newZoom;
    });
  };
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setIsSharpened(false);
    setCrop(undefined);
    setCompletedCrop(undefined);
  };

  const handleRecenter = () => {
    setPan({ x: 0, y: 0 });
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setZoom(1);
      setPan({ x: 0, y: 0 });
      setCrop(undefined);
    }
  };

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setZoom(1);
      setPan({ x: 0, y: 0 });
      setCrop(undefined);
    }
  };

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const toggleSharpen = () => setIsSharpened(!isSharpened);

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      try {
        await containerRef.current.requestFullscreen();
      } catch (err) {
        console.error("Error attempting to enable fullscreen:", err);
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      }
    }
  };

  const toggleCropMode = () => {
    if (isFullscreen) {
      document.exitFullscreen().catch(() => { });
    }
    setIsCropMode(!isCropMode);
    setCrop(undefined);
    setCompletedCrop(undefined);
    if (!isCropMode) {
      setZoom(1);
      setPan({ x: 0, y: 0 });
    }
  };

  // Panning Event Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isCropMode) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    // Capture pointer to track movement outside container
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || isCropMode) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as Element).releasePointerCapture(e.pointerId);
  };

  const downloadCroppedImage = async () => {
    if (!completedCrop || !imgRef.current) return;

    const image = imgRef.current;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY
    );

    if (isDarkMode) {
      ctx.globalCompositeOperation = 'difference';
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'source-over';
    }

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/png')
    );

    if (blob) {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `transcription-p${currentIndex + 1}-snippet.png`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div ref={containerRef} className={`space-y-4 my-8 border rounded-lg p-4 bg-background ${isFullscreen ? 'fixed inset-0 z-50 overflow-auto flex flex-col justify-center' : ''}`}>

      {/* SVG Filter Definition */}
      <svg style={{ display: 'none' }}>
        <defs>
          <filter id="sharpen">
            <feConvolveMatrix
              order="3,3"
              preserveAlpha="true"
              kernelMatrix="0 -1 0 -1 5 -1 0 -1 0"
            />
          </filter>
        </defs>
      </svg>

      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4 shrink-0">

        {/* Left Controls: Zoom & Pagination */}
        <div className="flex items-center gap-2">
          {images.length > 1 && (
            <div className="flex items-center gap-1 mr-2 bg-muted/30 p-1 rounded-md">
              <Button variant="ghost" size="icon" onClick={handlePrev} disabled={currentIndex === 0 || isCropMode} title="Previous Page">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium w-16 text-center tabular-nums">
                {currentIndex + 1} / {images.length}
              </span>
              <Button variant="ghost" size="icon" onClick={handleNext} disabled={currentIndex === images.length - 1 || isCropMode} title="Next Page">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" onClick={handleZoomOut} disabled={isCropMode} title="Zoom Out">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center text-sm tabular-nums">{Math.round(zoom * 100)}%</span>
            <Button variant="outline" size="icon" onClick={handleZoomIn} disabled={isCropMode} title="Zoom In">
              <ZoomIn className="h-4 w-4" />
            </Button>

            <Button variant="ghost" size="icon" onClick={handleRecenter} disabled={isCropMode || (pan.x === 0 && pan.y === 0)} title="Recenter Image">
              <Move className="h-4 w-4" />
            </Button>

            <Button variant="ghost" size="icon" onClick={handleReset} title="Reset View">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Right Controls: Tools */}
        <div className="flex items-center gap-2">
          <Button
            variant={isSharpened ? "default" : "outline"}
            size="icon"
            onClick={toggleSharpen}
            title="Toggle Sharpening"
            className={isSharpened ? "bg-blue-600 hover:bg-blue-700" : ""}
          >
            <Wand2 className="h-4 w-4" />
          </Button>

          <Button
            variant={isDarkMode ? "default" : "outline"}
            size="icon"
            onClick={toggleDarkMode}
            title="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          <Button
            variant={isFullscreen ? "default" : "outline"}
            size="icon"
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>

          <div className="h-6 w-px bg-border mx-2" />

          {!isCropMode ? (
            <Button variant="outline" onClick={toggleCropMode} className="gap-2">
              <Crop className="h-4 w-4" /> Crop
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggleCropMode} title="Cancel Crop">
                <X className="h-4 w-4" />
              </Button>
              <Button variant="default" onClick={downloadCroppedImage} disabled={!completedCrop} className="gap-2">
                <Download className="h-4 w-4" /> Export
              </Button>
            </div>
          )}
        </div>
      </div>

      <div
        className={`relative overflow-hidden flex justify-center bg-muted/20 rounded p-4 touch-none ${isFullscreen ? 'flex-1 items-center bg-black/90' : 'min-h-[200px]'}`}
        style={{ cursor: isCropMode ? 'default' : isDragging ? 'grabbing' : 'grab' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'top center',
            transition: isDragging ? 'none' : isCropMode ? 'none' : 'transform 0.2s ease-out',
            filter: [
              isDarkMode ? 'invert(1) hue-rotate(180deg)' : '',
              isSharpened ? 'url(#sharpen)' : ''
            ].filter(Boolean).join(' ') || 'none'
          }}
          className="inline-block"
        >
          {isCropMode ? (
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
            >
              <img
                ref={imgRef}
                src={currentImage.src}
                alt={currentImage.alt}
                className="max-w-full h-auto shadow-sm"
                style={{ display: 'block' }} // Remove bottom gap
              />
            </ReactCrop>
          ) : (
            <img
              src={currentImage.src}
              alt={currentImage.alt}
              className="max-w-full h-auto shadow-sm pointer-events-none select-none"
              draggable={false}
            />
          )}
        </div>
      </div>

      {isCropMode && !isFullscreen && (
        <p className="text-xs text-muted-foreground text-center">
          Drag to select an area to export.
        </p>
      )}
    </div>
  );
}
