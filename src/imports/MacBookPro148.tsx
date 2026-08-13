import svgPaths from "./svg-hjkjloa82s";

function LucideHatGlasses() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="lucide/hat-glasses">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="lucide/hat-glasses">
          <path d={svgPaths.p28224300} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
        </g>
      </svg>
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex flex-col gap-[5px] items-center relative shrink-0">
      <LucideHatGlasses />
      <p className="font-['Source_Sans_Pro:Regular',sans-serif] leading-[1.4] not-italic relative shrink-0 text-[#032b44] text-[14px] text-center whitespace-nowrap">Consejo de Agentes</p>
    </div>
  );
}

function LucideSettings() {
  return (
    <div className="absolute right-[24px] size-[20px] top-[24px]" data-name="lucide/settings-2">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="lucide/settings-2">
          <path d={svgPaths.p23e1b100} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
        </g>
      </svg>
    </div>
  );
}

function Frame6() {
  return (
    <div className="-translate-x-1/2 absolute backdrop-blur-[15px] bg-[rgba(255,255,255,0.7)] content-stretch flex flex-col gap-[8px] items-center left-[calc(50%-3px)] pt-[40px] px-[8px] top-0 w-[1512px]">
      <Frame10 />
      <LucideSettings />
    </div>
  );
}

function LucideArrowRight() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="lucide/arrow-right">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="lucide/arrow-right">
          <path d={svgPaths.p39396800} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute bg-[#590db4] bottom-[8px] content-stretch flex items-center justify-center right-[8px] rounded-[32px] size-[48px]">
      <LucideArrowRight />
    </div>
  );
}

function Frame7() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex gap-[16px] items-start leading-[1.4] left-[calc(50%+0.5px)] not-italic text-[14px] text-center top-[1249px] w-[451px]">
      <p className="flex-[1_0_0] font-['Source_Sans_Pro:SemiBold',sans-serif] min-h-px min-w-px relative text-[#783bc2]">Speak naturally</p>
      <p className="flex-[1_0_0] font-['Source_Sans_Pro:Regular',sans-serif] min-h-px min-w-px relative text-[#565656]">The AI does the work</p>
      <p className="flex-[1_0_0] font-['Source_Sans_Pro:Regular',sans-serif] min-h-px min-w-px relative text-[#565656]">You get Insights</p>
    </div>
  );
}

function LucideSearch() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="lucide/search">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="lucide/search">
          <rect fill="var(--fill-0, #ECDFFC)" height="32" rx="16" width="32" />
          <path d={svgPaths.p38815800} id="Vector" stroke="var(--stroke-0, #0367C4)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
        </g>
      </svg>
    </div>
  );
}

function LucideToolCase() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="lucide/tool-case">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="lucide/tool-case">
          <rect fill="var(--fill-0, #FBE1F7)" height="32" rx="16" width="32" />
          <path d={svgPaths.p6576600} id="Vector" stroke="var(--stroke-0, #0367C4)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
        </g>
      </svg>
    </div>
  );
}

function LucideBrain() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="lucide/brain">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="lucide/brain">
          <rect fill="var(--fill-0, #0084FF)" height="32" rx="16" width="32" />
          <path d={svgPaths.p2fe790c0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
        </g>
      </svg>
    </div>
  );
}

function LucideLightbulb() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="lucide/lightbulb">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="lucide/lightbulb">
          <rect fill="var(--fill-0, #E7D3FF)" height="32" rx="16" width="32" />
          <path d={svgPaths.p3a142140} id="Vector" stroke="var(--stroke-0, #0367C4)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
        </g>
      </svg>
    </div>
  );
}

function Frame8() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] items-center right-[88px] top-[397px] w-[168px]">
      <LucideSearch />
      <LucideToolCase />
      <LucideBrain />
      <LucideLightbulb />
    </div>
  );
}

function LucideArrowRight1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="lucide/arrow-right">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="lucide/arrow-right">
          <path d={svgPaths.p39396800} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Frame1() {
  return (
    <div className="-translate-y-1/2 absolute bg-[#0084ff] content-stretch flex items-center justify-center right-[8px] rounded-[32px] size-[48px] top-1/2">
      <LucideArrowRight1 />
    </div>
  );
}

function Frame9() {
  return (
    <div className="-translate-x-1/2 absolute bg-white bottom-[457px] content-stretch flex gap-[24px] items-center left-1/2 pl-[24px] pr-[8px] py-[24px] rounded-[32px] shadow-[0px_4px_36px_0px_rgba(0,0,0,0.1)] w-[480px]">
      <p className="font-['Source_Sans_3:Regular',sans-serif] font-normal leading-[1.4] relative shrink-0 text-[16px] text-[rgba(0,0,0,0.3)] w-[376px]">Comienza un nuevo proyecto</p>
      <Frame1 />
    </div>
  );
}

function LucideCirclePlus() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="lucide/circle-plus">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="lucide/circle-plus">
          <path d={svgPaths.p2cad7b80} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
        </g>
      </svg>
    </div>
  );
}

function Frame3() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center px-[8px] relative w-full">
          <LucideCirclePlus />
          <p className="font-['Source_Sans_Pro:Regular',sans-serif] leading-[1.4] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">Nueva conversación</p>
        </div>
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[8px] relative w-full">
          <p className="flex-[1_0_0] font-['Source_Sans_Pro:Regular',sans-serif] leading-[1.4] min-h-px min-w-px not-italic relative text-[#c7c7c7] text-[14px]">Conversation 2</p>
        </div>
      </div>
    </div>
  );
}

function Frame5() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[8px] relative w-full">
          <p className="flex-[1_0_0] font-['Source_Sans_Pro:Regular',sans-serif] leading-[1.4] min-h-px min-w-px not-italic relative text-[#c7c7c7] text-[14px]">Conversation 3</p>
        </div>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="-translate-y-1/2 absolute content-stretch flex flex-col gap-[15px] items-start left-[85px] top-[calc(50%+40px)] w-[129px]">
      <Frame3 />
      <Frame4 />
      <Frame5 />
    </div>
  );
}

export default function MacBookPro() {
  return (
    <div className="bg-white relative size-full" data-name="MacBook Pro 14' - 8">
      <div className="absolute backdrop-blur-[20px] bg-gradient-to-t from-[69.674%] from-[rgba(255,255,255,0)] h-[982px] left-0 to-[99.185%] to-[rgba(255,255,255,0.24)] top-0 w-[1512px]" data-name="blurr" />
      <div className="absolute h-[523px] left-[493px] top-[204px] w-[525px]" data-name="animation">
        <div className="absolute inset-[0.57%_1.43%_1.05%_0.57%]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 515.049 515.024">
            <path d={svgPaths.p3fd31d6a} id="Vector 62" stroke="var(--stroke-0, #D9D9D9)" strokeOpacity="0.5" strokeWidth="0.5" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[17.71%] right-[79.24%] top-[161px]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
            <circle cx="8" cy="8" fill="var(--fill-0, #EDE0FC)" id="Ellipse 1" r="8" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[70.48%] right-[26.48%] top-[22px]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
            <circle cx="8" cy="8" fill="var(--fill-0, #EDE0FC)" id="Ellipse 1" r="8" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[96.95%] right-0 top-[211px]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
            <circle cx="8" cy="8" fill="var(--fill-0, #EDE0FC)" id="Ellipse 1" r="8" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[6.48%] right-[90.48%] top-[202px]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
            <circle cx="8" cy="8" fill="var(--fill-0, #EDE0FC)" id="Ellipse 1" r="8" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[78.67%] right-[18.29%] top-[86px]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
            <circle cx="8" cy="8" fill="var(--fill-0, #FFA1E0)" id="Ellipse 47" r="8" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[15.43%] right-[81.52%] top-[317px]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
            <circle cx="8" cy="8" fill="var(--fill-0, #EDE0FC)" id="Ellipse 1" r="8" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[65.71%] right-[32.76%] top-[74px]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
            <circle cx="4" cy="4" fill="var(--fill-0, #EDE0FC)" id="Ellipse 11" r="4" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[89.33%] right-[9.14%] top-[105px]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
            <circle cx="4" cy="4" fill="var(--fill-0, #EDE0FC)" id="Ellipse 11" r="4" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[82.1%] right-[16.38%] top-[189px]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
            <circle cx="4" cy="4" fill="var(--fill-0, #EDE0FC)" id="Ellipse 11" r="4" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[96.19%] right-[2.29%] top-[337px]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
            <circle cx="4" cy="4" fill="var(--fill-0, #EDE0FC)" id="Ellipse 11" r="4" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[80.95%] right-[17.52%] top-[337px]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
            <circle cx="4" cy="4" fill="var(--fill-0, #EDE0FC)" id="Ellipse 11" r="4" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[83.62%] right-[14.86%] top-[405px]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
            <circle cx="4" cy="4" fill="var(--fill-0, #EDE0FC)" id="Ellipse 11" r="4" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[66.48%] right-[32%] top-[498px]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
            <circle cx="4" cy="4" fill="var(--fill-0, #EDE0FC)" id="Ellipse 11" r="4" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[56.76%] right-[41.71%] top-[435px]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
            <circle cx="4" cy="4" fill="var(--fill-0, #EDE0FC)" id="Ellipse 11" r="4" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[46.86%] right-[51.62%] top-[480px]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
            <circle cx="4" cy="4" fill="var(--fill-0, #EDE0FC)" id="Ellipse 11" r="4" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[34.29%] right-[64.19%] top-[423px]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
            <circle cx="4" cy="4" fill="var(--fill-0, #EDE0FC)" id="Ellipse 11" r="4" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[23.05%] right-[75.43%] top-[379px]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
            <circle cx="4" cy="4" fill="var(--fill-0, #FFA1E0)" id="Ellipse 44" r="4" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[14.1%] right-[84.38%] top-[247px]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
            <circle cx="4" cy="4" fill="var(--fill-0, #EDE0FC)" id="Ellipse 11" r="4" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-0 right-[98.48%] top-[277px]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
            <circle cx="4" cy="4" fill="var(--fill-0, #EDE0FC)" id="Ellipse 11" r="4" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[89.33%] right-[9.14%] top-[408px]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
            <circle cx="4" cy="4" fill="var(--fill-0, #FFA1E0)" id="Ellipse 44" r="4" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[31.43%] right-[67.05%] top-[34px]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
            <circle cx="4" cy="4" fill="var(--fill-0, #EDE0FC)" id="Ellipse 11" r="4" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[12.57%] right-[85.9%] top-[82px]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
            <circle cx="4" cy="4" fill="var(--fill-0, #EDE0FC)" id="Ellipse 11" r="4" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[26.1%] right-[72.38%] top-[113px]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
            <circle cx="4" cy="4" fill="var(--fill-0, #FFA1E0)" id="Ellipse 44" r="4" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[47.62%] right-[51.62%] top-[441px]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 4">
            <circle cx="2" cy="2" fill="var(--fill-0, #EDE0FC)" id="Ellipse 12" r="2" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[81.71%] right-[17.52%] top-[139px]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 4">
            <circle cx="2" cy="2" fill="var(--fill-0, #EDE0FC)" id="Ellipse 12" r="2" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[1.52%] right-[97.71%] top-[197px]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 4">
            <circle cx="2" cy="2" fill="var(--fill-0, #EDE0FC)" id="Ellipse 12" r="2" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[37.14%] right-[61.52%] top-[5px]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7 7">
            <circle cx="3.5" cy="3.5" fill="var(--fill-0, #EDE0FC)" id="Ellipse 14" r="3.5" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[75.81%] right-[22.86%] top-[380px]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7 7">
            <circle cx="3.5" cy="3.5" fill="var(--fill-0, #EDE0FC)" id="Ellipse 14" r="3.5" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[20.76%] right-[74.67%] top-[460px]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" fill="var(--fill-0, #EDE0FC)" id="Ellipse 5" r="12" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[84%] right-[12.95%] top-[271px]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
            <circle cx="8" cy="8" fill="var(--fill-0, #EDE0FC)" id="Ellipse 1" r="8" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[50.1%] right-[49.14%] top-[70px]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 4">
            <circle cx="2" cy="2" fill="var(--fill-0, #EDE0FC)" id="Ellipse 12" r="2" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[34.86%] right-[63.24%] top-[462px]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
            <circle cx="5" cy="5" fill="var(--fill-0, #FFA1E0)" id="Ellipse 8" r="5" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[20.38%] right-[78.86%] top-[416px]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 4">
            <circle cx="2" cy="2" fill="var(--fill-0, #EDE0FC)" id="Ellipse 12" r="2" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[67.24%] right-[30.86%] top-[413px]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
            <circle cx="5" cy="5" fill="var(--fill-0, #EDE0FC)" id="Ellipse 23" r="5" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[11.81%] right-[87.43%] top-[129px]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 4">
            <circle cx="2" cy="2" fill="var(--fill-0, #EDE0FC)" id="Ellipse 12" r="2" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[6.48%] right-[92.76%] top-[308px]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 4">
            <circle cx="2" cy="2" fill="var(--fill-0, #EDE0FC)" id="Ellipse 12" r="2" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[4.38%] right-[94.86%] top-[360px]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 4">
            <circle cx="2" cy="2" fill="var(--fill-0, #EDE0FC)" id="Ellipse 12" r="2" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[95.43%] right-[3.05%] top-[165px]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
            <circle cx="4" cy="4" fill="var(--fill-0, #EDE0FC)" id="Ellipse 17" r="4" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[45.71%] right-[52.38%] top-[513px]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
            <circle cx="5" cy="5" fill="var(--fill-0, #EDE0FC)" id="Ellipse 23" r="5" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[9.9%] right-[88.19%] top-[408px]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
            <circle cx="5" cy="5" fill="var(--fill-0, #EDE0FC)" id="Ellipse 23" r="5" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[87.81%] right-[11.43%] top-[364px]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 4">
            <circle cx="2" cy="2" fill="var(--fill-0, #EDE0FC)" id="Ellipse 12" r="2" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[79.05%] right-[17.9%] top-[452px]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
            <circle cx="8" cy="8" fill="var(--fill-0, #EDE0FC)" id="Ellipse 1" r="8" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[92.57%] right-[5.9%] top-[247px]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
            <circle cx="4" cy="4" fill="var(--fill-0, #FFA1E0)" id="Ellipse 10" r="4" />
          </svg>
        </div>
        <div className="absolute inset-[12.24%_72.38%_86.62%_26.48%]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 6">
            <circle cx="3" cy="3" fill="var(--fill-0, #EDE0FC)" id="Ellipse 2" r="3" />
          </svg>
        </div>
        <div className="absolute inset-[88.91%_42.67%_9.94%_56.19%]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 6">
            <circle cx="3" cy="3" fill="var(--fill-0, #FFA1E0)" id="Ellipse 4" r="3" />
          </svg>
        </div>
        <div className="absolute inset-[0_47.81%_98.85%_51.05%]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 6">
            <circle cx="3" cy="3" fill="var(--fill-0, #EDE0FC)" id="Ellipse 2" r="3" />
          </svg>
        </div>
      </div>
      <div className="absolute flex h-[982px] items-center justify-center left-0 top-0 w-[1512px]">
        <div className="flex-none rotate-180">
          <div className="h-[982px] w-[1512px]" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\'0 0 1512 982\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'0.20000000298023224\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(-7.5282e-15 98.2 -151.2 -4.0275e-14 756 2.1805e-13)\\'><stop stop-color=\\'rgba(108,6,230,0.3)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(145,68,236,0.25)\\' offset=\\'0.25\\'/><stop stop-color=\\'rgba(182,131,243,0.2)\\' offset=\\'0.5\\'/><stop stop-color=\\'rgba(255,255,255,0.1)\\' offset=\\'1\\'/></radialGradient></defs></svg>')" }} />
        </div>
      </div>
      <Frame6 />
      <div className="absolute content-stretch flex items-center justify-center left-[1262.5px] px-[16px] py-[8px] rounded-[8px] top-[-70px] w-[154px]" data-name="cta">
        <div aria-hidden="true" className="absolute border border-[#6c06e6] border-solid inset-0 pointer-events-none rounded-[8px]" />
        <p className="font-['Source_Sans_Pro:SemiBold',sans-serif] leading-[1.4] not-italic relative shrink-0 text-[#6c06e6] text-[14px] text-center whitespace-nowrap">Talk to AI Teammate</p>
      </div>
      <div className="absolute content-stretch flex items-center justify-center left-[1123.5px] px-[16px] py-[8px] rounded-[8px] top-[-70px]" data-name="cta">
        <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none rounded-[8px]" />
        <p className="font-['Source_Sans_Pro:SemiBold',sans-serif] leading-[1.4] not-italic relative shrink-0 text-[14px] text-black text-center whitespace-nowrap">Try a Live Demo</p>
      </div>
      <div className="-translate-x-1/2 absolute bg-white bottom-[-406px] content-stretch flex gap-[24px] items-end left-1/2 overflow-clip pl-[24px] pr-[8px] py-[24px] rounded-[32px] shadow-[0px_4px_36px_0px_rgba(0,0,0,0.1)] w-[480px]">
        <p className="font-['Source_Sans_3:Regular',sans-serif] font-normal leading-[1.4] relative shrink-0 text-[16px] text-black w-[376px]">Identify qualified suppliers in Romania for precision titanium machining, assess their certifications and financial health</p>
        <Frame />
      </div>
      <div className="absolute bg-[#590db4] h-[6px] left-[586px] rounded-[16px] top-[1273px] w-[29px]" />
      <Frame7 />
      <Frame8 />
      <Frame9 />
      <Frame2 />
    </div>
  );
}