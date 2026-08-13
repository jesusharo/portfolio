import { motion } from 'motion/react';
import svgPaths from "../../imports/svg-qeyvz6rlpu";

// Helper para generar valores de animación únicos para cada nodo
const getFloatingAnimation = (index: number) => {
  const baseDelay = (index * 0.1) % 2;
  const xRange = 3 + (index % 5);
  const yRange = 3 + ((index * 3) % 5);
  const duration = 4 + (index % 3);
  
  return {
    x: [0, xRange, -xRange, 0],
    y: [0, yRange, -yRange, 0],
    transition: {
      duration,
      repeat: Infinity,
      ease: "easeInOut",
      delay: baseDelay
    }
  };
};

export default function NetworkVisualization() {
  return (
    <div className="absolute h-[961.324px] left-[50%] -translate-x-1/2 top-[50%] -translate-y-1/2 w-[965px] opacity-100 pointer-events-none" data-name="animation">
      {/* SVG de líneas - estático */}
      <div className="absolute inset-[0.57%_1.43%_1.05%_0.57%]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 946.709 946.663">
          <path d={svgPaths.p11e15a00} id="Vector 62" stroke="#5F5F5F" strokeOpacity="0.5" strokeWidth="0.5" />
        </svg>
      </div>
      
      {/* Nodos animados */}
      <motion.div 
        className="absolute aspect-[18/18] left-[17.71%] right-[79.24%] top-[295.93px]"
        animate={getFloatingAnimation(0)}
      >
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 29.4095 29.4095">
          <circle cx="14.7048" cy="14.7048" fill="#3C3C3C" id="Ellipse 1" r="14.7048" />
        </svg>
      </motion.div>
      
      <motion.div 
        className="absolute aspect-[18/18] left-[70.48%] right-[26.48%] top-[40.44px]"
        animate={getFloatingAnimation(1)}
      >
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 29.4095 29.4095">
          <circle cx="14.7048" cy="14.7048" fill="#3C3C3C" id="Ellipse 1" r="14.7048" />
        </svg>
      </motion.div>
      
      <motion.div 
        className="absolute aspect-[18/18] left-[96.95%] right-0 top-[387.84px]"
        animate={getFloatingAnimation(2)}
      >
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 29.4095 29.4095">
          <circle cx="14.7048" cy="14.7048" fill="#3C3C3C" id="Ellipse 1" r="14.7048" />
        </svg>
      </motion.div>
      
      <motion.div 
        className="absolute aspect-[18/18] left-[6.48%] right-[90.48%] top-[371.3px]"
        animate={getFloatingAnimation(3)}
      >
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 29.4095 29.4095">
          <circle cx="14.7048" cy="14.7048" fill="#3C3C3C" id="Ellipse 1" r="14.7048" />
        </svg>
      </motion.div>
      
      <motion.div 
        className="absolute aspect-[18/18] left-[78.67%] right-[18.29%] top-[158.08px]"
        animate={getFloatingAnimation(4)}
      >
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 29.4095 29.4095">
          <circle cx="14.7048" cy="14.7048" fill="#686868" id="Ellipse 47" r="14.7048" />
        </svg>
      </motion.div>
      
      <motion.div 
        className="absolute aspect-[18/18] left-[15.43%] right-[81.52%] top-[582.68px]"
        animate={getFloatingAnimation(5)}
      >
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 29.4095 29.4095">
          <circle cx="14.7048" cy="14.7048" fill="#3C3C3C" id="Ellipse 1" r="14.7048" />
        </svg>
      </motion.div>
      
      <motion.div 
        className="absolute aspect-[18/18] left-[65.71%] right-[32.76%] top-[136.02px]"
        animate={getFloatingAnimation(6)}
      >
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.7048 14.7048">
          <circle cx="7.35238" cy="7.35238" fill="#3C3C3C" id="Ellipse 11" r="7.35238" />
        </svg>
      </motion.div>
      
      <motion.div 
        className="absolute aspect-[18/18] left-[89.33%] right-[9.14%] top-[193px]"
        animate={getFloatingAnimation(7)}
      >
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.7048 14.7048">
          <circle cx="7.35238" cy="7.35238" fill="#3C3C3C" id="Ellipse 11" r="7.35238" />
        </svg>
      </motion.div>
      
      <motion.div 
        className="absolute aspect-[18/18] left-[82.1%] right-[16.38%] top-[347.4px]"
        animate={getFloatingAnimation(8)}
      >
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.7048 14.7048">
          <circle cx="7.35238" cy="7.35238" fill="#3C3C3C" id="Ellipse 11" r="7.35238" />
        </svg>
      </motion.div>
      
      <motion.div 
        className="absolute aspect-[18/18] left-[96.19%] right-[2.29%] top-[619.44px]"
        animate={getFloatingAnimation(9)}
      >
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.7048 14.7048">
          <circle cx="7.35238" cy="7.35238" fill="#3C3C3C" id="Ellipse 11" r="7.35238" />
        </svg>
      </motion.div>
      
      <motion.div 
        className="absolute aspect-[18/18] left-[80.95%] right-[17.52%] top-[619.44px]"
        animate={getFloatingAnimation(10)}
      >
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.7048 14.7048">
          <circle cx="7.35238" cy="7.35238" fill="#3C3C3C" id="Ellipse 11" r="7.35238" />
        </svg>
      </motion.div>
      
      <motion.div 
        className="absolute aspect-[18/18] left-[83.62%] right-[14.86%] top-[744.43px]"
        animate={getFloatingAnimation(11)}
      >
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.7048 14.7048">
          <circle cx="7.35238" cy="7.35238" fill="#3C3C3C" id="Ellipse 11" r="7.35238" />
        </svg>
      </motion.div>
      
      <motion.div 
        className="absolute aspect-[18/18] left-[66.48%] right-[32%] top-[915.37px]"
        animate={getFloatingAnimation(12)}
      >
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.7048 14.7048">
          <circle cx="7.35238" cy="7.35238" fill="#3C3C3C" id="Ellipse 11" r="7.35238" />
        </svg>
      </motion.div>
      
      <motion.div 
        className="absolute aspect-[18/18] left-[56.76%] right-[41.71%] top-[799.57px]"
        animate={getFloatingAnimation(13)}
      >
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.7048 14.7048">
          <circle cx="7.35238" cy="7.35238" fill="#3C3C3C" id="Ellipse 11" r="7.35238" />
        </svg>
      </motion.div>
      
      <motion.div 
        className="absolute aspect-[18/18] left-[46.86%] right-[51.62%] top-[882.29px]"
        animate={getFloatingAnimation(14)}
      >
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.7048 14.7048">
          <circle cx="7.35238" cy="7.35238" fill="#3C3C3C" id="Ellipse 11" r="7.35238" />
        </svg>
      </motion.div>
      
      <motion.div 
        className="absolute aspect-[18/18] left-[34.29%] right-[64.19%] top-[777.51px]"
        animate={getFloatingAnimation(15)}
      >
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.7048 14.7048">
          <circle cx="7.35238" cy="7.35238" fill="#3C3C3C" id="Ellipse 11" r="7.35238" />
        </svg>
      </motion.div>
      
      <motion.div 
        className="absolute aspect-[18/18] left-[23.05%] right-[75.43%] top-[696.64px]"
        animate={getFloatingAnimation(16)}
      >
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.7048 14.7048">
          <circle cx="7.35238" cy="7.35238" fill="#686868" id="Ellipse 44" r="7.35238" />
        </svg>
      </motion.div>
      
      <motion.div 
        className="absolute aspect-[18/18] left-[14.1%] right-[84.38%] top-[454.01px]"
        animate={getFloatingAnimation(17)}
      >
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.7048 14.7048">
          <circle cx="7.35238" cy="7.35238" fill="#3C3C3C" id="Ellipse 11" r="7.35238" />
        </svg>
      </motion.div>
      
      <motion.div 
        className="absolute aspect-[18/18] left-0 right-[98.48%] top-[509.15px]"
        animate={getFloatingAnimation(18)}
      >
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.7048 14.7048">
          <circle cx="7.35238" cy="7.35238" fill="#3C3C3C" id="Ellipse 11" r="7.35238" />
        </svg>
      </motion.div>
      
      <motion.div 
        className="absolute aspect-[18/18] left-[89.33%] right-[9.14%] top-[749.94px]"
        animate={getFloatingAnimation(19)}
      >
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.7048 14.7048">
          <circle cx="7.35238" cy="7.35238" fill="#686868" id="Ellipse 44" r="7.35238" />
        </svg>
      </motion.div>
      
      <motion.div 
        className="absolute aspect-[18/18] left-[31.43%] right-[67.05%] top-[62.5px]"
        animate={getFloatingAnimation(20)}
      >
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.7048 14.7048">
          <circle cx="7.35238" cy="7.35238" fill="#3C3C3C" id="Ellipse 11" r="7.35238" />
        </svg>
      </motion.div>
      
      <motion.div 
        className="absolute aspect-[18/18] left-[12.57%] right-[85.9%] top-[150.72px]"
        animate={getFloatingAnimation(21)}
      >
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.7048 14.7048">
          <circle cx="7.35238" cy="7.35238" fill="#3C3C3C" id="Ellipse 11" r="7.35238" />
        </svg>
      </motion.div>
      
      <motion.div 
        className="absolute aspect-[18/18] left-[26.1%] right-[72.38%] top-[207.7px]"
        animate={getFloatingAnimation(22)}
      >
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.7048 14.7048">
          <circle cx="7.35238" cy="7.35238" fill="#686868" id="Ellipse 44" r="7.35238" />
        </svg>
      </motion.div>
      
      <motion.div 
        className="absolute aspect-[18/18] left-[47.62%] right-[51.62%] top-[810.6px]"
        animate={getFloatingAnimation(23)}
      >
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.35238 7.35238">
          <circle cx="3.67619" cy="3.67619" fill="#3C3C3C" id="Ellipse 12" r="3.67619" />
        </svg>
      </motion.div>
      
      <motion.div 
        className="absolute aspect-[18/18] left-[81.71%] right-[17.52%] top-[255.5px]"
        animate={getFloatingAnimation(24)}
      >
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.35238 7.35238">
          <circle cx="3.67619" cy="3.67619" fill="#3C3C3C" id="Ellipse 12" r="3.67619" />
        </svg>
      </motion.div>
      
      <motion.div 
        className="absolute aspect-[18/18] left-[1.52%] right-[97.71%] top-[362.1px]"
        animate={getFloatingAnimation(25)}
      >
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.35238 7.35238">
          <circle cx="3.67619" cy="3.67619" fill="#3C3C3C" id="Ellipse 12" r="3.67619" />
        </svg>
      </motion.div>
      
      <motion.div 
        className="absolute aspect-[18/18] left-[37.14%] right-[61.52%] top-[9.19px]"
        animate={getFloatingAnimation(26)}
      >
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.8667 12.8667">
          <circle cx="6.43333" cy="6.43333" fill="#3C3C3C" id="Ellipse 14" r="6.43333" />
        </svg>
      </motion.div>
      
      <motion.div 
        className="absolute aspect-[18/18] left-[75.81%] right-[22.86%] top-[698.48px]"
        animate={getFloatingAnimation(27)}
      >
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.8667 12.8667">
          <circle cx="6.43333" cy="6.43333" fill="#3C3C3C" id="Ellipse 14" r="6.43333" />
        </svg>
      </motion.div>
      
      <motion.div 
        className="absolute aspect-[18/18] left-[20.76%] right-[74.67%] top-[845.52px]"
        animate={getFloatingAnimation(28)}
      >
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 44.1143 44.1143">
          <circle cx="22.0571" cy="22.0571" fill="#3C3C3C" id="Ellipse 5" r="22.0571" />
        </svg>
      </motion.div>
      
      <motion.div 
        className="absolute aspect-[18/18] left-[84%] right-[12.95%] top-[498.12px]"
        animate={getFloatingAnimation(29)}
      >
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 29.4095 29.4095">
          <circle cx="14.7048" cy="14.7048" fill="#3C3C3C" id="Ellipse 1" r="14.7048" />
        </svg>
      </motion.div>
      
      <motion.div 
        className="absolute aspect-[18/18] left-[50.1%] right-[49.14%] top-[128.67px]"
        animate={getFloatingAnimation(30)}
      >
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.35238 7.35238">
          <circle cx="3.67619" cy="3.67619" fill="#3C3C3C" id="Ellipse 12" r="3.67619" />
        </svg>
      </motion.div>
      
      <motion.div 
        className="absolute aspect-[18/18] left-[34.86%] right-[63.24%] top-[849.2px]"
        animate={getFloatingAnimation(31)}
      >
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.381 18.381">
          <circle cx="9.19048" cy="9.19048" fill="#686868" id="Ellipse 8" r="9.19048" />
        </svg>
      </motion.div>
      
      <motion.div 
        className="absolute aspect-[18/18] left-[20.38%] right-[78.86%] top-[764.65px]"
        animate={getFloatingAnimation(32)}
      >
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.35238 7.35238">
          <circle cx="3.67619" cy="3.67619" fill="#3C3C3C" id="Ellipse 12" r="3.67619" />
        </svg>
      </motion.div>
      
      <motion.div 
        className="absolute aspect-[18/18] left-[67.24%] right-[30.86%] top-[759.13px]"
        animate={getFloatingAnimation(33)}
      >
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.381 18.381">
          <circle cx="9.19048" cy="9.19048" fill="#3C3C3C" id="Ellipse 23" r="9.19048" />
        </svg>
      </motion.div>
      
      <motion.div 
        className="absolute aspect-[18/18] left-[11.81%] right-[87.43%] top-[237.11px]"
        animate={getFloatingAnimation(34)}
      >
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.35238 7.35238">
          <circle cx="3.67619" cy="3.67619" fill="#3C3C3C" id="Ellipse 12" r="3.67619" />
        </svg>
      </motion.div>
      
      <motion.div 
        className="absolute aspect-[18/18] left-[6.48%] right-[92.76%] top-[566.13px]"
        animate={getFloatingAnimation(35)}
      >
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.35238 7.35238">
          <circle cx="3.67619" cy="3.67619" fill="#3C3C3C" id="Ellipse 12" r="3.67619" />
        </svg>
      </motion.div>
      
      <motion.div 
        className="absolute aspect-[18/18] left-[4.38%] right-[94.86%] top-[661.71px]"
        animate={getFloatingAnimation(36)}
      >
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.35238 7.35238">
          <circle cx="3.67619" cy="3.67619" fill="#3C3C3C" id="Ellipse 12" r="3.67619" />
        </svg>
      </motion.div>
      
      <motion.div 
        className="absolute aspect-[18/18] left-[95.43%] right-[3.05%] top-[303.29px]"
        animate={getFloatingAnimation(37)}
      >
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.7048 14.7048">
          <circle cx="7.35238" cy="7.35238" fill="#3C3C3C" id="Ellipse 17" r="7.35238" />
        </svg>
      </motion.div>
      
      <motion.div 
        className="absolute aspect-[18/18] left-[45.71%] right-[52.38%] top-[942.94px]"
        animate={getFloatingAnimation(38)}
      >
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.381 18.381">
          <circle cx="9.19048" cy="9.19048" fill="#3C3C3C" id="Ellipse 23" r="9.19048" />
        </svg>
      </motion.div>
      
      <motion.div 
        className="absolute aspect-[18/18] left-[9.9%] right-[88.19%] top-[749.94px]"
        animate={getFloatingAnimation(39)}
      >
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.381 18.381">
          <circle cx="9.19048" cy="9.19048" fill="#3C3C3C" id="Ellipse 23" r="9.19048" />
        </svg>
      </motion.div>
      
      <motion.div 
        className="absolute aspect-[18/18] left-[87.81%] right-[11.43%] top-[669.07px]"
        animate={getFloatingAnimation(40)}
      >
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.35238 7.35238">
          <circle cx="3.67619" cy="3.67619" fill="#3C3C3C" id="Ellipse 12" r="3.67619" />
        </svg>
      </motion.div>
      
      <motion.div 
        className="absolute aspect-[18/18] left-[79.05%] right-[17.9%] top-[830.82px]"
        animate={getFloatingAnimation(41)}
      >
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 29.4095 29.4095">
          <circle cx="14.7048" cy="14.7048" fill="#3C3C3C" id="Ellipse 1" r="14.7048" />
        </svg>
      </motion.div>
      
      <motion.div 
        className="absolute aspect-[18/18] left-[92.57%] right-[5.9%] top-[454.01px]"
        animate={getFloatingAnimation(42)}
      >
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.7048 14.7048">
          <circle cx="7.35238" cy="7.35238" fill="#686868" id="Ellipse 10" r="7.35238" />
        </svg>
      </motion.div>
      
      <motion.div 
        className="absolute inset-[12.24%_72.38%_86.62%_26.48%]"
        animate={getFloatingAnimation(43)}
      >
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.0286 11.0286">
          <circle cx="5.51429" cy="5.51429" fill="#3C3C3C" id="Ellipse 2" r="5.51429" />
        </svg>
      </motion.div>
      
      <motion.div 
        className="absolute inset-[88.91%_42.67%_9.94%_56.19%]"
        animate={getFloatingAnimation(44)}
      >
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.0286 11.0286">
          <circle cx="5.51429" cy="5.51429" fill="#686868" id="Ellipse 4" r="5.51429" />
        </svg>
      </motion.div>
      
      <motion.div 
        className="absolute inset-[0_47.81%_98.85%_51.05%]"
        animate={getFloatingAnimation(45)}
      >
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.0286 11.0286">
          <circle cx="5.51429" cy="5.51429" fill="#3C3C3C" id="Ellipse 2" r="5.51429" />
        </svg>
      </motion.div>
    </div>
  );
}
