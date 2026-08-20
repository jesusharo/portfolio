import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';

interface Props {
  background: string;
  foreground?: string;
  alt: string;
}

type OrientationEventConstructor = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<'granted' | 'denied'>;
};

type MotionEventConstructor = typeof DeviceMotionEvent & {
  requestPermission?: () => Promise<'granted' | 'denied'>;
};

const MAX_SHIFT = 14;
const GYRO_RANGE = 35;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export default function HeroParallax({ background, foreground, alt }: Props) {
  const reduceMotion = useReducedMotion() ?? false;
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const hasParallax = Boolean(background && foreground) && !reduceMotion;

  useEffect(() => {
    if (
      !hasParallax ||
      typeof window === 'undefined' ||
      (!('DeviceOrientationEvent' in window) && !('DeviceMotionEvent' in window))
    ) return;

    let enabled = false;
    const OrientationEvent = window.DeviceOrientationEvent as OrientationEventConstructor | undefined;
    const MotionEvent = window.DeviceMotionEvent as MotionEventConstructor | undefined;
    const baseline = { beta: null as number | null, gamma: null as number | null };

    const scheduleUpdate = (x: number, y: number) => {
      targetRef.current = { x, y };
      if (frameRef.current !== null) return;
      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null;
        setOffset(targetRef.current);
      });
    };

    const handleTilt = (beta: number, gamma: number) => {
      if (baseline.beta === null || baseline.gamma === null) {
        baseline.beta = beta;
        baseline.gamma = gamma;
      }
      const x = clamp((gamma - baseline.gamma) / GYRO_RANGE, -1, 1) * MAX_SHIFT;
      const y = clamp((beta - baseline.beta) / GYRO_RANGE, -1, 1) * MAX_SHIFT;
      scheduleUpdate(x, y);
    };

    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.beta === null || event.gamma === null) return;
      handleTilt(event.beta, event.gamma);
    };

    // A number of mobile browsers expose gravity through devicemotion but
    // do not emit usable deviceorientation events. Convert the gravity vector
    // into the same beta/gamma values used by the orientation handler.
    const handleMotion = (event: DeviceMotionEvent) => {
      const acceleration = event.accelerationIncludingGravity;
      if (
        !acceleration ||
        acceleration.x === null ||
        acceleration.y === null ||
        acceleration.z === null
      ) return;

      const gamma = Math.atan2(
        acceleration.x,
        Math.sqrt(acceleration.y ** 2 + acceleration.z ** 2),
      ) * (180 / Math.PI);
      const beta = Math.atan2(acceleration.y, acceleration.z) * (180 / Math.PI);
      handleTilt(beta, gamma);
    };

    const enableOrientation = async () => {
      if (enabled) return;
      const requestPermission =
        typeof OrientationEvent?.requestPermission === 'function'
          ? OrientationEvent.requestPermission.bind(OrientationEvent)
          : typeof MotionEvent?.requestPermission === 'function'
            ? MotionEvent.requestPermission.bind(MotionEvent)
            : null;

      if (requestPermission) {
        try {
          if (await requestPermission() !== 'granted') return;
        } catch {
          return;
        }
      }
      enabled = true;
      if ('DeviceOrientationEvent' in window) {
        window.addEventListener('deviceorientation', handleOrientation, { passive: true });
        // Some Android browsers expose the higher-fidelity absolute stream
        // instead of (or in addition to) the standard orientation event.
        window.addEventListener(
          'deviceorientationabsolute',
          handleOrientation,
          { passive: true } as AddEventListenerOptions,
        );
      }
      if ('DeviceMotionEvent' in window) {
        window.addEventListener('devicemotion', handleMotion, { passive: true });
      }
    };

    // iOS only allows requestPermission() from a user gesture. Try once on
    // mount for browsers that allow it, then retry from the first real gesture.
    const needsGesture =
      typeof OrientationEvent?.requestPermission === 'function' ||
      typeof MotionEvent?.requestPermission === 'function';
    if (needsGesture) {
      void enableOrientation();
      window.addEventListener('touchstart', enableOrientation, { once: true, passive: true });
      window.addEventListener('pointerdown', enableOrientation, { once: true, passive: true });
    } else {
      void enableOrientation();
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('deviceorientationabsolute', handleOrientation);
      window.removeEventListener('devicemotion', handleMotion);
      window.removeEventListener('touchstart', enableOrientation);
      window.removeEventListener('pointerdown', enableOrientation);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    };
  }, [hasParallax]);

  useEffect(() => {
    if (!hasParallax || typeof window === 'undefined') return;

    const handleGlobalPointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      const x = (event.clientX / window.innerWidth - 0.5) * MAX_SHIFT * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * MAX_SHIFT * 2;
      targetRef.current = {
        x: clamp(x, -MAX_SHIFT, MAX_SHIFT),
        y: clamp(y, -MAX_SHIFT, MAX_SHIFT),
      };
      if (frameRef.current !== null) return;
      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null;
        setOffset(targetRef.current);
      });
    };

    const resetPointer = () => {
      targetRef.current = { x: 0, y: 0 };
      setOffset({ x: 0, y: 0 });
    };

    window.addEventListener('pointermove', handleGlobalPointerMove, { passive: true });
    window.addEventListener('blur', resetPointer);
    return () => {
      window.removeEventListener('pointermove', handleGlobalPointerMove);
      window.removeEventListener('blur', resetPointer);
    };
  }, [hasParallax]);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto max-w-[760px] rounded-[12px]"
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
