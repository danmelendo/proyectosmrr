import { useState, useRef, useCallback } from "react";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

const BeforeAfterSlider = ({
  beforeImage,
  afterImage,
  beforeLabel = "Antes",
  afterLabel = "Después",
}: BeforeAfterSliderProps) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPosition(percentage);
    },
    []
  );

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleClick = (e: React.MouseEvent) => {
    handleMove(e.clientX);
  };

  return (
    <section className="py-20 bg-secondary" aria-labelledby="before-after-heading">
      <div className="container mx-auto px-4">
        <header className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-gold font-medium">Resultados Reales</span>
          <h2 id="before-after-heading" className="text-3xl md:text-4xl font-bold text-foreground mt-2">
            Antes y Después
          </h2>
          <p className="text-muted-foreground mt-4">
            Desliza para ver la transformación completa de nuestras reformas
          </p>
        </header>

        <div className="max-w-4xl mx-auto">
          <div
            ref={containerRef}
            className="relative w-full aspect-[16/10] rounded-xl overflow-hidden cursor-ew-resize shadow-card select-none"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
            onClick={handleClick}
            role="slider"
            aria-valuenow={Math.round(sliderPosition)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Comparador antes y después"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") {
                setSliderPosition((prev) => Math.max(0, prev - 5));
              } else if (e.key === "ArrowRight") {
                setSliderPosition((prev) => Math.min(100, prev + 5));
              }
            }}
          >
            {/* After Image (Background) */}
            <img
              src={afterImage}
              alt="Después de la reforma"
              className="absolute inset-0 w-full h-full object-cover"
              draggable={false}
            />

            {/* Before Image (Clipped) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <img
                src={beforeImage}
                alt="Antes de la reforma"
                className="absolute inset-0 w-full h-full object-cover"
                draggable={false}
              />
            </div>

            {/* Slider Line */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-10"
              style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
            >
              {/* Slider Handle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
                <div className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4 text-forest rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <svg
                    className="w-4 h-4 text-forest"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Labels */}
            <div
              className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium z-20 transition-opacity duration-300"
              style={{ opacity: sliderPosition > 15 ? 1 : 0 }}
            >
              {beforeLabel}
            </div>
            <div
              className="absolute top-4 right-4 bg-gold/90 backdrop-blur-sm text-forest px-3 py-1.5 rounded-full text-sm font-medium z-20 transition-opacity duration-300"
              style={{ opacity: sliderPosition < 85 ? 1 : 0 }}
            >
              {afterLabel}
            </div>
          </div>

          {/* Instructions */}
          <p className="text-center text-muted-foreground text-sm mt-4">
            Arrastra el control deslizante o haz clic en cualquier punto para comparar
          </p>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfterSlider;
