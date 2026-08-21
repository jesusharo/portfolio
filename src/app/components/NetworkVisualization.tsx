import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import { useEffect, useMemo, useRef } from 'react';
import svgPaths from '../../imports/svg-qeyvz6rlpu';
import { useNetworkState } from '../context/NetworkStateContext';

const CANVAS_WIDTH = 965;
const CANVAS_HEIGHT = 961.324;
const MOUSE_RADIUS = 250;
const MOUSE_FORCE = 28;
const GYRO_TILT_RANGE = 32;

type OrientationEventConstructor = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<'granted' | 'denied'>;
};

type MotionEventConstructor = typeof DeviceMotionEvent & {
  requestPermission?: () => Promise<'granted' | 'denied'>;
};

const SCALE_BY_STATE = {
  idle: 0.68,
  focused: 1.0,
  conversation: 1.3,
};

type Node = {
  className: string;
  index: number;
  x: number;
  y: number;
  viewBox: string;
  radius: number;
  color: string;
};

const nodes: Node[] = [
  { className: 'absolute aspect-[18/18] left-[17.71%] right-[79.24%] top-[295.93px]', index: 0, x: 185.6, y: 310.6, viewBox: '0 0 29.4095 29.4095', radius: 14.7048, color: '#3C3C3C' },
  { className: 'absolute aspect-[18/18] left-[70.48%] right-[26.48%] top-[40.44px]', index: 1, x: 694.8, y: 55.1, viewBox: '0 0 29.4095 29.4095', radius: 14.7048, color: '#3C3C3C' },
  { className: 'absolute aspect-[18/18] left-[96.95%] right-0 top-[387.84px]', index: 2, x: 950.3, y: 402.5, viewBox: '0 0 29.4095 29.4095', radius: 14.7048, color: '#3C3C3C' },
  { className: 'absolute aspect-[18/18] left-[6.48%] right-[90.48%] top-[371.3px]', index: 3, x: 77.2, y: 386, viewBox: '0 0 29.4095 29.4095', radius: 14.7048, color: '#3C3C3C' },
  { className: 'absolute aspect-[18/18] left-[78.67%] right-[18.29%] top-[158.08px]', index: 4, x: 773.9, y: 172.8, viewBox: '0 0 29.4095 29.4095', radius: 14.7048, color: '#686868' },
  { className: 'absolute aspect-[18/18] left-[15.43%] right-[81.52%] top-[582.68px]', index: 5, x: 163.6, y: 597.4, viewBox: '0 0 29.4095 29.4095', radius: 14.7048, color: '#3C3C3C' },
  { className: 'absolute aspect-[18/18] left-[65.71%] right-[32.76%] top-[136.02px]', index: 6, x: 641.5, y: 143.4, viewBox: '0 0 14.7048 14.7048', radius: 7.35238, color: '#3C3C3C' },
  { className: 'absolute aspect-[18/18] left-[89.33%] right-[9.14%] top-[193px]', index: 7, x: 869.4, y: 200.4, viewBox: '0 0 14.7048 14.7048', radius: 7.35238, color: '#3C3C3C' },
  { className: 'absolute aspect-[18/18] left-[82.1%] right-[16.38%] top-[347.4px]', index: 8, x: 799.6, y: 354.8, viewBox: '0 0 14.7048 14.7048', radius: 7.35238, color: '#3C3C3C' },
  { className: 'absolute aspect-[18/18] left-[96.19%] right-[2.29%] top-[619.44px]', index: 9, x: 935.6, y: 626.8, viewBox: '0 0 14.7048 14.7048', radius: 7.35238, color: '#3C3C3C' },
  { className: 'absolute aspect-[18/18] left-[80.95%] right-[17.52%] top-[619.44px]', index: 10, x: 788.5, y: 626.8, viewBox: '0 0 14.7048 14.7048', radius: 7.35238, color: '#3C3C3C' },
  { className: 'absolute aspect-[18/18] left-[83.62%] right-[14.86%] top-[744.43px]', index: 11, x: 814.3, y: 751.8, viewBox: '0 0 14.7048 14.7048', radius: 7.35238, color: '#3C3C3C' },
  { className: 'absolute aspect-[18/18] left-[66.48%] right-[32%] top-[915.37px]', index: 12, x: 648.9, y: 922.7, viewBox: '0 0 14.7048 14.7048', radius: 7.35238, color: '#3C3C3C' },
  { className: 'absolute aspect-[18/18] left-[56.76%] right-[41.71%] top-[799.57px]', index: 13, x: 555.1, y: 806.9, viewBox: '0 0 14.7048 14.7048', radius: 7.35238, color: '#3C3C3C' },
  { className: 'absolute aspect-[18/18] left-[46.86%] right-[51.62%] top-[882.29px]', index: 14, x: 459.6, y: 889.6, viewBox: '0 0 14.7048 14.7048', radius: 7.35238, color: '#3C3C3C' },
  { className: 'absolute aspect-[18/18] left-[34.29%] right-[64.19%] top-[777.51px]', index: 15, x: 338.3, y: 784.9, viewBox: '0 0 14.7048 14.7048', radius: 7.35238, color: '#3C3C3C' },
  { className: 'absolute aspect-[18/18] left-[23.05%] right-[75.43%] top-[696.64px]', index: 16, x: 229.8, y: 704, viewBox: '0 0 14.7048 14.7048', radius: 7.35238, color: '#686868' },
  { className: 'absolute aspect-[18/18] left-[14.1%] right-[84.38%] top-[454.01px]', index: 17, x: 143.4, y: 461.4, viewBox: '0 0 14.7048 14.7048', radius: 7.35238, color: '#3C3C3C' },
  { className: 'absolute aspect-[18/18] left-0 right-[98.48%] top-[509.15px]', index: 18, x: 7.4, y: 516.5, viewBox: '0 0 14.7048 14.7048', radius: 7.35238, color: '#3C3C3C' },
  { className: 'absolute aspect-[18/18] left-[89.33%] right-[9.14%] top-[749.94px]', index: 19, x: 869.4, y: 757.3, viewBox: '0 0 14.7048 14.7048', radius: 7.35238, color: '#686868' },
  { className: 'absolute aspect-[18/18] left-[31.43%] right-[67.05%] top-[62.5px]', index: 20, x: 310.7, y: 69.9, viewBox: '0 0 14.7048 14.7048', radius: 7.35238, color: '#3C3C3C' },
  { className: 'absolute aspect-[18/18] left-[12.57%] right-[85.9%] top-[150.72px]', index: 21, x: 128.7, y: 158.1, viewBox: '0 0 14.7048 14.7048', radius: 7.35238, color: '#3C3C3C' },
  { className: 'absolute aspect-[18/18] left-[26.1%] right-[72.38%] top-[207.7px]', index: 22, x: 259.2, y: 215.1, viewBox: '0 0 14.7048 14.7048', radius: 7.35238, color: '#686868' },
  { className: 'absolute aspect-[18/18] left-[47.62%] right-[51.62%] top-[810.6px]', index: 23, x: 463.2, y: 814.3, viewBox: '0 0 7.35238 7.35238', radius: 3.67619, color: '#3C3C3C' },
  { className: 'absolute aspect-[18/18] left-[81.71%] right-[17.52%] top-[255.5px]', index: 24, x: 792.2, y: 259.2, viewBox: '0 0 7.35238 7.35238', radius: 3.67619, color: '#3C3C3C' },
  { className: 'absolute aspect-[18/18] left-[1.52%] right-[97.71%] top-[362.1px]', index: 25, x: 18.3, y: 365.8, viewBox: '0 0 7.35238 7.35238', radius: 3.67619, color: '#3C3C3C' },
  { className: 'absolute aspect-[18/18] left-[37.14%] right-[61.52%] top-[9.19px]', index: 26, x: 364.8, y: 15.6, viewBox: '0 0 12.8667 12.8667', radius: 6.43333, color: '#3C3C3C' },
  { className: 'absolute aspect-[18/18] left-[75.81%] right-[22.86%] top-[698.48px]', index: 27, x: 738, y: 704.9, viewBox: '0 0 12.8667 12.8667', radius: 6.43333, color: '#3C3C3C' },
  { className: 'absolute aspect-[18/18] left-[20.76%] right-[74.67%] top-[845.52px]', index: 28, x: 222.4, y: 867.6, viewBox: '0 0 44.1143 44.1143', radius: 22.0571, color: '#3C3C3C' },
  { className: 'absolute aspect-[18/18] left-[84%] right-[12.95%] top-[498.12px]', index: 29, x: 825.3, y: 512.8, viewBox: '0 0 29.4095 29.4095', radius: 14.7048, color: '#3C3C3C' },
  { className: 'absolute aspect-[18/18] left-[50.1%] right-[49.14%] top-[128.67px]', index: 30, x: 487.1, y: 132.3, viewBox: '0 0 7.35238 7.35238', radius: 3.67619, color: '#3C3C3C' },
  { className: 'absolute aspect-[18/18] left-[34.86%] right-[63.24%] top-[849.2px]', index: 31, x: 345.6, y: 858.4, viewBox: '0 0 18.381 18.381', radius: 9.19048, color: '#686868' },
  { className: 'absolute aspect-[18/18] left-[20.38%] right-[78.86%] top-[764.65px]', index: 32, x: 200.3, y: 768.3, viewBox: '0 0 7.35238 7.35238', radius: 3.67619, color: '#3C3C3C' },
  { className: 'absolute aspect-[18/18] left-[67.24%] right-[30.86%] top-[759.13px]', index: 33, x: 658.1, y: 768.3, viewBox: '0 0 18.381 18.381', radius: 9.19048, color: '#3C3C3C' },
  { className: 'absolute aspect-[18/18] left-[11.81%] right-[87.43%] top-[237.11px]', index: 34, x: 117.6, y: 240.8, viewBox: '0 0 7.35238 7.35238', radius: 3.67619, color: '#3C3C3C' },
  { className: 'absolute aspect-[18/18] left-[6.48%] right-[92.76%] top-[566.13px]', index: 35, x: 66.2, y: 569.8, viewBox: '0 0 7.35238 7.35238', radius: 3.67619, color: '#3C3C3C' },
  { className: 'absolute aspect-[18/18] left-[4.38%] right-[94.86%] top-[661.71px]', index: 36, x: 45.9, y: 665.4, viewBox: '0 0 7.35238 7.35238', radius: 3.67619, color: '#3C3C3C' },
  { className: 'absolute aspect-[18/18] left-[95.43%] right-[3.05%] top-[303.29px]', index: 37, x: 928.3, y: 310.6, viewBox: '0 0 14.7048 14.7048', radius: 7.35238, color: '#3C3C3C' },
  { className: 'absolute aspect-[18/18] left-[45.71%] right-[52.38%] top-[942.94px]', index: 38, x: 450.3, y: 952.1, viewBox: '0 0 18.381 18.381', radius: 9.19048, color: '#3C3C3C' },
  { className: 'absolute aspect-[18/18] left-[9.9%] right-[88.19%] top-[749.94px]', index: 39, x: 104.7, y: 759.1, viewBox: '0 0 18.381 18.381', radius: 9.19048, color: '#3C3C3C' },
  { className: 'absolute aspect-[18/18] left-[87.81%] right-[11.43%] top-[669.07px]', index: 40, x: 851, y: 672.7, viewBox: '0 0 7.35238 7.35238', radius: 3.67619, color: '#3C3C3C' },
  { className: 'absolute aspect-[18/18] left-[79.05%] right-[17.9%] top-[830.82px]', index: 41, x: 777.5, y: 845.5, viewBox: '0 0 29.4095 29.4095', radius: 14.7048, color: '#3C3C3C' },
  { className: 'absolute aspect-[18/18] left-[92.57%] right-[5.9%] top-[454.01px]', index: 42, x: 900.7, y: 461.4, viewBox: '0 0 14.7048 14.7048', radius: 7.35238, color: '#686868' },
  { className: 'absolute inset-[12.24%_72.38%_86.62%_26.48%]', index: 43, x: 261, y: 123.2, viewBox: '0 0 11.0286 11.0286', radius: 5.51429, color: '#3C3C3C' },
  { className: 'absolute inset-[88.91%_42.67%_9.94%_56.19%]', index: 44, x: 547.7, y: 860.2, viewBox: '0 0 11.0286 11.0286', radius: 5.51429, color: '#686868' },
  { className: 'absolute inset-[0_47.81%_98.85%_51.05%]', index: 45, x: 498.3, y: 5.5, viewBox: '0 0 11.0286 11.0286', radius: 5.51429, color: '#3C3C3C' },
];

type FloatingNodeProps = {
  node: Node;
  fillOpacity: number;
  mouseX: ReturnType<typeof useMotionValue<number>>;
  mouseY: ReturnType<typeof useMotionValue<number>>;
  reduceMotion: boolean;
};

function FloatingNode({ node, fillOpacity, mouseX, mouseY, reduceMotion }: FloatingNodeProps) {
  const driftX = useMotionValue(0);
  const driftY = useMotionValue(0);
  const movement = useMemo(() => {
    const amplitude = reduceMotion ? 4 : 14 + Math.random() * 22;
    return {
      amplitudeX: amplitude * (0.8 + Math.random() * 0.4),
      amplitudeY: amplitude * (0.8 + Math.random() * 0.4),
      speedX: 0.00035 + Math.random() * 0.00022,
      speedY: 0.0003 + Math.random() * 0.00024,
      phaseX: Math.random() * Math.PI * 2,
      phaseY: Math.random() * Math.PI * 2,
    };
  }, []);

  useAnimationFrame((time) => {
    driftX.set(
      Math.sin(time * movement.speedX + movement.phaseX) * movement.amplitudeX
      + Math.sin(time * movement.speedX * 0.47 + movement.phaseY) * movement.amplitudeX * 0.28,
    );
    driftY.set(
      Math.cos(time * movement.speedY + movement.phaseY) * movement.amplitudeY
      + Math.sin(time * movement.speedY * 0.53 + movement.phaseX) * movement.amplitudeY * 0.28,
    );
  });

  const mouseReactionX = useTransform([mouseX, mouseY], ([x, y]) => {
    const deltaX = node.x - x;
    const deltaY = node.y - y;
    const distance = Math.hypot(deltaX, deltaY);
    if (distance === 0 || distance > MOUSE_RADIUS) return 0;
    const force = (1 - distance / MOUSE_RADIUS) ** 2;
    return (deltaX / distance) * force * MOUSE_FORCE;
  });

  const mouseReactionY = useTransform([mouseX, mouseY], ([x, y]) => {
    const deltaX = node.x - x;
    const deltaY = node.y - y;
    const distance = Math.hypot(deltaX, deltaY);
    if (distance === 0 || distance > MOUSE_RADIUS) return 0;
    const force = (1 - distance / MOUSE_RADIUS) ** 2;
    return (deltaY / distance) * force * MOUSE_FORCE;
  });

  return (
    <motion.div className={node.className} style={{ x: driftX, y: driftY }}>
      <motion.div className="absolute inset-0" style={{ x: mouseReactionX, y: mouseReactionY }}>
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox={node.viewBox}>
          <circle cx={node.radius} cy={node.radius} fill="white" fillOpacity={fillOpacity} r={node.radius} />
        </svg>
      </motion.div>
    </motion.div>
  );
}

export default function NetworkVisualization() {
  const { networkState } = useNetworkState();
  const scale = SCALE_BY_STATE[networkState];

  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion() ?? false;
  const mouseX = useMotionValue(CANVAS_WIDTH / 2);
  // Deterministic opacities seeded by node index — identical across all instances
  const nodeOpacities = useMemo(() => nodes.map((n) => {
    const t = Math.abs(Math.sin(n.index * 127.1 + 311.7));
    return 0.05 + t * 0.17;
  }), []);
  const mouseY = useMotionValue(CANVAS_HEIGHT / 2);
  const gyroOffsetX = useMotionValue(0);
  const gyroOffsetY = useMotionValue(0);
  const smoothGyroOffsetX = useSpring(gyroOffsetX, { stiffness: 90, damping: 22 });
  const smoothGyroOffsetY = useSpring(gyroOffsetY, { stiffness: 90, damping: 22 });
  const orientationBaseline = useRef<{ beta: number; gamma: number } | null>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const bounds = containerRef.current?.getBoundingClientRect();
      if (!bounds) return;
      mouseX.set(((event.clientX - bounds.left) / bounds.width) * CANVAS_WIDTH);
      mouseY.set(((event.clientY - bounds.top) / bounds.height) * CANVAS_HEIGHT);
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    if (
      reduceMotion ||
      typeof window === 'undefined' ||
      (!('DeviceOrientationEvent' in window) && !('DeviceMotionEvent' in window))
    ) {
      gyroOffsetX.set(0);
      gyroOffsetY.set(0);
      return;
    }

    let orientationEnabled = false;
    let hasOrientationSample = false;

    const clamp = (value: number) => Math.max(-1, Math.min(1, value));

    const handleTilt = (beta: number, gamma: number) => {
      if (!orientationBaseline.current) {
        orientationBaseline.current = { beta, gamma };
      }

      const { beta: baselineBeta, gamma: baselineGamma } = orientationBaseline.current;
      const tiltX = clamp((gamma - baselineGamma) / GYRO_TILT_RANGE);
      const tiltY = clamp((beta - baselineBeta) / GYRO_TILT_RANGE);

      // Feed the same reaction used by the desktop pointer interaction.
      mouseX.set(CANVAS_WIDTH / 2 + tiltX * CANVAS_WIDTH / 2);
      mouseY.set(CANVAS_HEIGHT / 2 + tiltY * CANVAS_HEIGHT / 2);
      gyroOffsetX.set(tiltX * 24);
      gyroOffsetY.set(tiltY * 24);
    };

    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.beta === null || event.gamma === null) return;
      hasOrientationSample = true;
      handleTilt(event.beta, event.gamma);
    };

    // Some tablets expose gravity through devicemotion but do not emit a
    // usable deviceorientation event. Convert it to the same tilt values.
    const handleMotion = (event: DeviceMotionEvent) => {
      if (hasOrientationSample) return;
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
      if (orientationEnabled) return;

      const OrientationEvent = window.DeviceOrientationEvent as OrientationEventConstructor | undefined;
      const MotionEvent = window.DeviceMotionEvent as MotionEventConstructor | undefined;
      const requesters = [
        typeof OrientationEvent?.requestPermission === 'function'
          ? OrientationEvent.requestPermission.bind(OrientationEvent)
          : null,
        typeof MotionEvent?.requestPermission === 'function'
          ? MotionEvent.requestPermission.bind(MotionEvent)
          : null,
      ].filter((requestPermission): requestPermission is () => Promise<'granted' | 'denied'> =>
        requestPermission !== null,
      );

      if (requesters.length > 0) {
        const permissions = await Promise.all(requesters.map(async requestPermission => {
          try {
            return await requestPermission();
          } catch {
            return 'denied' as const;
          }
        }));
        if (!permissions.some(permission => permission === 'granted')) return;
      }

      orientationEnabled = true;
      if ('DeviceOrientationEvent' in window) {
        window.addEventListener('deviceorientation', handleOrientation, { passive: true });
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

    const OrientationEvent = window.DeviceOrientationEvent as OrientationEventConstructor | undefined;
    const MotionEvent = window.DeviceMotionEvent as MotionEventConstructor | undefined;

    const needsGesture =
      typeof OrientationEvent?.requestPermission === 'function' ||
      typeof MotionEvent?.requestPermission === 'function';
    if (needsGesture) {
      // Try immediately, then retry on the first touch for iOS gesture-gated permission.
      void enableOrientation();
      window.addEventListener('touchstart', enableOrientation, { once: true, passive: true });
    } else {
      void enableOrientation();
    }

    const resetCalibration = () => {
      orientationBaseline.current = null;
    };
    window.addEventListener('orientationchange', resetCalibration, { passive: true });

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('deviceorientationabsolute', handleOrientation);
      window.removeEventListener('devicemotion', handleMotion);
      window.removeEventListener('touchstart', enableOrientation);
      window.removeEventListener('orientationchange', resetCalibration);
    };
  }, [gyroOffsetX, gyroOffsetY, mouseX, mouseY, reduceMotion]);

  return (
    <>
      <motion.div
        ref={containerRef}
        className="absolute h-[961.324px] left-[50%] -translate-x-1/2 top-[50%] -translate-y-1/2 w-[965px] pointer-events-none origin-center"
        animate={{ scale }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ filter: 'blur(8px)', x: smoothGyroOffsetX, y: smoothGyroOffsetY }}
      >
        <div className="absolute inset-[0.57%_1.43%_1.05%_0.57%]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 946.709 946.663">
            <path d={svgPaths.p11e15a00} stroke="white" strokeOpacity="0.08" strokeWidth="0.5" />
          </svg>
        </div>
        {nodes.map((node) => (
          <FloatingNode key={node.index} node={node} fillOpacity={nodeOpacities[node.index]} mouseX={mouseX} mouseY={mouseY} reduceMotion={reduceMotion} />
        ))}
      </motion.div>
    </>
  );
}
