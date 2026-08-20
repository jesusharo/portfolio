import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { useReducedMotion } from 'motion/react';

interface Props {
  background: string;
  foreground?: string;
  alt: string;
  onOpen: () => void;
}

type OrientationEventConstructor = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<'granted' | 'denied'>;
};

const MAX_SHIFT = 14;
const GYRO_RANGE = 35;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export default function HeroParallax({ background, foreground, alt, onOpen }: Props) {
  const reduceMotion = useReducedMotion() ?? false;
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const hasParallax = Boolean(background && foreground) && !reduceMotion;

  useEffect(() => {
    if (!hasParallax || typeof window === 'undefined' || !('DeviceOrientationEvent' in window)) return;

    let enabled = false;
    const OrientationEvent = window.DeviceOrientationEvent as OrientationEventConstructor;
    const baseline = { beta: null as number | null, gamma: null as number | null };

    const scheduleUpdate = (x: number, y: number) => {
      targetRef.current = { x, y };
      if (frameRef.current !== null) return;
      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null;
        setOffset(targetRef.current);
      });
    };

    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.beta === null || event.gamma === null) return;
      if (baseline.beta === null || baseline.gamma === null) {
        baseline.beta = event.beta;
        baseline.gamma = event.gamma;
      }
      const x = clamp((event.gamma - baseline.gamma) / GYRO_RANGE, -1, 1) * MAX_SHIFT;
      const y = clamp((event.beta - baseline.beta) / GYRO_RANGE, -1, 1) * MAX_SHIFT;
      scheduleUpdate(x, y);
    };

    const enableOrientation = async () => {
      if (enabled) return;
      if (typeof OrientationEvent.requestPermission === 'function') {
        try {
          if (await OrientationEvent.requestPermission() !== 'granted') return;
        } catch {
          return;
        }
      }
      enabled = true;
      window.addEventListener('deviceorientation', handleOrientation, { passive: true });
    };

    void enableOrientation();
    window.addEventListener('touchstart', enableOrientation, { once: true, passive: true });

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('touchstart', enableOrientation);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    };
  }, [hasParallax]);

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!hasParallax || event.pointerType === 'touch') return;
    const bounds = containerRef.current?.getBoundingClientRect();
    if (!bounds) return;
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * MAX_SHIFT * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * MAX_SHIFT * 2;
    targetRef.current = { x, y };
    if (frameRef.current !== null) return;
    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = null;
      setOffset(targetRef.current);
    });
  }

  function resetPointer() {
    if (!hasParallax) return;
    targetRef.current = { x: 0, y: 0 };
    setOffset({ x: 0, y: 0 });
  }

  return (
    <div
      ref={containerRef}
      className="relative mx-auto max-w-[760px] rounded-[12px] cursor-zoom-in"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={event => {
        if (event.key === 'Enter' || event.key === ' ') onOpen();
      }}
      aria-label={`Open ${alt} image`}
    >
      {hasParallax && (
        <img
          src={background}
          alt=""
          aria-hidden="true"
          className="block w-full h-auto invisible pointer-events-none select-none"
        />
      )}
      <img
        src={background}
        alt={alt}
        className={`block w-full h-auto object-contain ${hasParallax ? 'absolute inset-0 h-full' : ''}`}
        style={hasParallax ? {
          transform: `translate3d(${offset.x * 0.45}px, ${offset.y * 0.45}px, 0) scale(1.05)`,
          transition: 'transform 180ms ease-out',
        } : undefined}
      />
      {foreground && (
        <img
          src={foreground}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 block w-full h-full object-contain pointer-events-none"
          style={hasParallax ? {
            transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(1.05)`,
            transition: 'transform 180ms ease-out',
          } : undefined}
        />
      )}
    </div>
  );
}