import { useEffect, useRef, useState } from 'react';
import Globe from 'globe.gl';

interface Location {
  city: string;
  country: string;
  coords: [number, number];
}

export type GlobeSelectPayload = {
  city: string;
  country: string;
};

interface Globe3DProps {
  locations: Location[];
  onSelect: (location: GlobeSelectPayload) => void;
}

const BRAND_COLOR = '#5eb8e8';
const EARTH_IMG = 'https://unpkg.com/three-globe/example/img/earth-dark.jpg';
const BUMP_IMG = 'https://unpkg.com/three-globe/example/img/earth-topology.png';

function Globe3D({ locations, onSelect }: Globe3DProps) {
  const globeRef = useRef<HTMLDivElement>(null);
  const globeInstanceRef = useRef<ReturnType<typeof Globe> | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const container = globeRef.current;
    if (!container) return;

    let cancelled = false;
    let resizeObserver: ResizeObserver | null = null;

    const initGlobe = () => {
      if (cancelled || globeInstanceRef.current) return;
      const { width, height } = container.getBoundingClientRect();
      if (width < 48 || height < 48) return;

      const globe = new Globe(container)
        .globeImageUrl(EARTH_IMG)
        .bumpImageUrl(BUMP_IMG)
        .backgroundColor('rgba(0, 0, 0, 0)')
        .pointOfView({ lat: 20, lng: 0, altitude: 2.5 })
        .enablePointerInteraction(true)
        .width(width)
        .height(height);

      const pick = (d: Location) => {
        globe.pointOfView({ lat: d.coords[0], lng: d.coords[1], altitude: 1.5 }, 600);
        onSelect({ city: d.city, country: d.country });
      };

      globe
        .labelsData(locations)
        .labelLat((d: Location) => d.coords[0])
        .labelLng((d: Location) => d.coords[1])
        .labelText((d: Location) => d.city)
        .labelSize(1.0)
        .labelColor(() => BRAND_COLOR)
        .labelResolution(4)
        .onLabelClick((d: Location) => pick(d));

      globe
        .htmlElementsData(locations)
        .htmlLat((d: Location) => d.coords[0])
        .htmlLng((d: Location) => d.coords[1])
        .htmlElement((d: Location) => {
          const el = document.createElement('div');
          el.innerHTML = '●';
          el.style.color = BRAND_COLOR;
          el.style.fontSize = '12px';
          el.style.cursor = 'pointer';
          el.style.transition = 'transform 0.2s ease';
          el.onmouseenter = () => {
            el.style.transform = 'scale(1.4)';
          };
          el.onmouseleave = () => {
            el.style.transform = 'scale(1)';
          };
          el.onclick = () => pick(d);
          return el;
        });

      const handleResize = () => {
        const { width: w, height: h } = container.getBoundingClientRect();
        if (w > 0 && h > 0) globe.width(w).height(h);
      };

      resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(container);

      globeInstanceRef.current = globe;
      setIsLoaded(true);
    };

    initGlobe();
    if (!globeInstanceRef.current) {
      resizeObserver = new ResizeObserver(() => initGlobe());
      resizeObserver.observe(container);
    }

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      if (container) container.innerHTML = '';
      globeInstanceRef.current = null;
    };
  }, [locations, onSelect]);

  return (
    <div className='relative h-full min-h-[16rem] w-full'>
      {!isLoaded ? (
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='h-8 w-8 animate-spin rounded-full border-2 border-[var(--tt-brand)] border-t-transparent' />
        </div>
      ) : null}
      <div ref={globeRef} className='absolute inset-0 h-full w-full' />
    </div>
  );
}

export default Globe3D;
