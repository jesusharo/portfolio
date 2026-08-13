import svgPaths from "./svg-kbskpgp6e6";
type CtaProps = {
  className?: string;
  property1?: "primary" | "hover" | "secondary" | "secondary hover";
};

function Cta({ className, property1 = "primary" }: CtaProps) {
  const isHoverOrSecondaryHover = ["hover", "secondary hover"].includes(property1);
  const isPrimaryOrSecondary = ["primary", "secondary"].includes(property1);
  const isSecondary = property1 === "secondary";
  return (
    <div className={className || `relative rounded-[8px] w-[154px] ${property1 === "secondary hover" ? "bg-black" : property1 === "hover" ? "bg-[#6c06e6]" : ""}`}>
      <div aria-hidden={isPrimaryOrSecondary ? true : undefined} className={isSecondary ? "absolute border border-black border-solid inset-0 pointer-events-none rounded-[8px]" : isHoverOrSecondaryHover ? "flex flex-row items-center justify-center size-full" : "absolute border border-[#6c06e6] border-solid inset-0 pointer-events-none rounded-[8px]"}>
        {isHoverOrSecondaryHover && (
          <div className="content-stretch flex items-center justify-center px-[16px] py-[8px] relative size-full">
            <p className="[word-break:break-word] font-['Source_Sans_Pro:SemiBold',sans-serif] leading-[1.4] not-italic relative shrink-0 text-[14px] text-center text-white whitespace-nowrap">Talk to AI Teammate</p>
          </div>
        )}
      </div>
      {isPrimaryOrSecondary && (
        <div className="flex flex-row items-center justify-center size-full">
          <div className="content-stretch flex items-center justify-center px-[16px] py-[8px] relative size-full">
            <p className={`[word-break:break-word] font-["Source_Sans_Pro:SemiBold",sans-serif] leading-[1.4] not-italic relative shrink-0 text-[14px] text-center whitespace-nowrap ${isSecondary ? "text-black" : "text-[#6c06e6]"}`}>Talk to AI Teammate</p>
          </div>
        </div>
      )}
    </div>
  );
}

function LucideSend() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="lucide/send">
      <div className="absolute inset-[0_0_-4.17%_0]">
        <svg className="block size-full" fill="none" height="24.9999" preserveAspectRatio="none" viewBox="0 0 24 24.9999" width="24">
          <g id="lucide/send">
            <path d={svgPaths.p317f200} id="Vector" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="-translate-y-1/2 absolute bg-[#d25d5f] content-stretch flex items-center justify-center right-[8px] rounded-[32px] size-[48px] top-1/2">
      <LucideSend />
    </div>
  );
}

function Frame4() {
  return (
    <div className="-translate-x-1/2 absolute bg-[rgba(60,60,60,0.5)] bottom-[457px] content-stretch flex gap-[24px] items-center left-1/2 pl-[24px] pr-[8px] py-[24px] rounded-[32px] shadow-[0px_4px_36px_0px_rgba(0,0,0,0.05)] w-[480px]">
      <p className="[word-break:break-word] font-['Source_Sans_3:Regular',sans-serif] font-normal leading-[1.4] relative shrink-0 text-[16px] text-[rgba(255,255,255,0.3)] w-[376px]">Do you want to know anything in particular?</p>
      <Frame />
    </div>
  );
}

function LucideArrowRight() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="lucide/arrow-right">
      <svg className="absolute block inset-0 size-full" fill="none" height="24" preserveAspectRatio="none" viewBox="0 0 24 24" width="24">
        <g id="lucide/arrow-right">
          <path d="M5 12H19M12 19L19 12L12 5" id="Vector" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute bg-[#590db4] bottom-[8px] content-stretch flex items-center justify-center right-[8px] rounded-[32px] size-[48px]">
      <LucideArrowRight />
    </div>
  );
}

function Frame2() {
  return (
    <div className="-translate-x-1/2 [word-break:break-word] absolute content-stretch flex gap-[16px] items-start leading-[1.4] left-[calc(50%+0.5px)] not-italic text-[14px] text-center top-[1249px] w-[451px]">
      <p className="flex-[1_0_0] font-['Source_Sans_Pro:SemiBold',sans-serif] min-w-px relative text-[#783bc2]">Speak naturally</p>
      <p className="flex-[1_0_0] font-['Source_Sans_Pro:Regular',sans-serif] min-w-px relative text-[#565656]">The AI does the work</p>
      <p className="flex-[1_0_0] font-['Source_Sans_Pro:Regular',sans-serif] min-w-px relative text-[#565656]">You get Insights</p>
    </div>
  );
}

function LucideToolCase() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="lucide/tool-case">
      <svg className="absolute block inset-0 size-full" fill="none" height="32" preserveAspectRatio="none" viewBox="0 0 32 32" width="32">
        <g id="lucide/tool-case">
          <rect fill="#686868" height="32" rx="16" width="32" />
          <path d={svgPaths.p22804980} id="Vector" stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
        </g>
      </svg>
    </div>
  );
}

function LucideSearch() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="lucide/search">
      <svg className="absolute block inset-0 size-full" fill="none" height="32" preserveAspectRatio="none" viewBox="0 0 32 32" width="32">
        <g id="lucide/search">
          <rect fill="#686868" height="32" rx="16" width="32" />
          <path d={svgPaths.pddd3100} id="Vector" stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
        </g>
      </svg>
    </div>
  );
}

function LucideBrain() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="lucide/brain">
      <svg className="absolute block inset-0 size-full" fill="none" height="32" preserveAspectRatio="none" viewBox="0 0 32 32" width="32">
        <g id="lucide/brain">
          <rect fill="#D25D5F" height="32" rx="16" width="32" />
          <path d={svgPaths.p6326980} id="Vector" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
        </g>
      </svg>
    </div>
  );
}

function Group() {
  return (
    <div className="relative shrink-0 size-[17px]">
      <svg className="absolute block inset-0 size-full" fill="none" height="17" preserveAspectRatio="none" viewBox="0 0 17 17" width="17">
        <g id="Group 3">
          <circle cx="8.5" cy="8.5" id="Ellipse 53" r="8" stroke="black" />
          <g id="avatar">
            <path d={svgPaths.p2ba19f00} fill="black" />
            <path d={svgPaths.p34a1d300} fill="black" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function LucideLightbulb() {
  return (
    <div className="bg-[#686868] content-stretch flex items-center justify-center overflow-clip px-[5px] py-[2px] relative rounded-[100px] shrink-0 size-[32px]" data-name="lucide/lightbulb">
      <Group />
    </div>
  );
}

function LucideSearch1() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="lucide/search">
      <svg className="absolute block inset-0 size-full" fill="none" height="32" preserveAspectRatio="none" viewBox="0 0 32 32" width="32">
        <g id="lucide/search">
          <rect fill="#686868" height="32" rx="16" width="32" />
          <path d={svgPaths.pb074400} id="Vector" stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
        </g>
      </svg>
    </div>
  );
}

function Frame3() {
  return (
    <div className="-translate-y-1/2 absolute content-stretch flex flex-col gap-[16px] items-center left-[40px] top-1/2 w-[168px]">
      <LucideToolCase />
      <LucideSearch />
      <LucideBrain />
      <LucideLightbulb />
      <LucideSearch1 />
    </div>
  );
}

export default function Component() {
  return (
    <div className="bg-[#1c1c1c] relative size-full" data-name="10">
      <div className="absolute h-[523px] left-[493px] top-[204px] w-[525px]" data-name="animation">
        <div className="absolute inset-[0.57%_1.43%_1.05%_0.57%]">
          <svg className="absolute block inset-0 size-full" fill="none" height="515.024" preserveAspectRatio="none" viewBox="0 0 515.049 515.024" width="515.049">
            <path d={svgPaths.p11e15a00} id="Vector 62" stroke="#5F5F5F" strokeOpacity="0.5" strokeWidth="0.5" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[17.71%] right-[79.24%] top-[161px]">
          <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
            <circle cx="8" cy="8" fill="#3C3C3C" id="Ellipse 1" r="8" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[70.48%] right-[26.48%] top-[22px]">
          <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
            <circle cx="8" cy="8" fill="#3C3C3C" id="Ellipse 1" r="8" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[96.95%] right-0 top-[211px]">
          <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
            <circle cx="8" cy="8" fill="#3C3C3C" id="Ellipse 1" r="8" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[6.48%] right-[90.48%] top-[202px]">
          <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
            <circle cx="8" cy="8" fill="#3C3C3C" id="Ellipse 1" r="8" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[78.67%] right-[18.29%] top-[86px]">
          <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
            <circle cx="8" cy="8" fill="#686868" id="Ellipse 47" r="8" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[15.43%] right-[81.52%] top-[317px]">
          <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
            <circle cx="8" cy="8" fill="#3C3C3C" id="Ellipse 1" r="8" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[65.71%] right-[32.76%] top-[74px]">
          <svg className="absolute block inset-0 size-full" fill="none" height="8" preserveAspectRatio="none" viewBox="0 0 8 8" width="8">
            <circle cx="4" cy="4" fill="#3C3C3C" id="Ellipse 11" r="4" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[89.33%] right-[9.14%] top-[105px]">
          <svg className="absolute block inset-0 size-full" fill="none" height="8" preserveAspectRatio="none" viewBox="0 0 8 8" width="8">
            <circle cx="4" cy="4" fill="#3C3C3C" id="Ellipse 11" r="4" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[82.1%] right-[16.38%] top-[189px]">
          <svg className="absolute block inset-0 size-full" fill="none" height="8" preserveAspectRatio="none" viewBox="0 0 8 8" width="8">
            <circle cx="4" cy="4" fill="#3C3C3C" id="Ellipse 11" r="4" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[96.19%] right-[2.29%] top-[337px]">
          <svg className="absolute block inset-0 size-full" fill="none" height="8" preserveAspectRatio="none" viewBox="0 0 8 8" width="8">
            <circle cx="4" cy="4" fill="#3C3C3C" id="Ellipse 11" r="4" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[80.95%] right-[17.52%] top-[337px]">
          <svg className="absolute block inset-0 size-full" fill="none" height="8" preserveAspectRatio="none" viewBox="0 0 8 8" width="8">
            <circle cx="4" cy="4" fill="#3C3C3C" id="Ellipse 11" r="4" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[83.62%] right-[14.86%] top-[405px]">
          <svg className="absolute block inset-0 size-full" fill="none" height="8" preserveAspectRatio="none" viewBox="0 0 8 8" width="8">
            <circle cx="4" cy="4" fill="#3C3C3C" id="Ellipse 11" r="4" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[66.48%] right-[32%] top-[498px]">
          <svg className="absolute block inset-0 size-full" fill="none" height="8" preserveAspectRatio="none" viewBox="0 0 8 8" width="8">
            <circle cx="4" cy="4" fill="#3C3C3C" id="Ellipse 11" r="4" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[56.76%] right-[41.71%] top-[435px]">
          <svg className="absolute block inset-0 size-full" fill="none" height="8" preserveAspectRatio="none" viewBox="0 0 8 8" width="8">
            <circle cx="4" cy="4" fill="#3C3C3C" id="Ellipse 11" r="4" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[46.86%] right-[51.62%] top-[480px]">
          <svg className="absolute block inset-0 size-full" fill="none" height="8" preserveAspectRatio="none" viewBox="0 0 8 8" width="8">
            <circle cx="4" cy="4" fill="#3C3C3C" id="Ellipse 11" r="4" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[34.29%] right-[64.19%] top-[423px]">
          <svg className="absolute block inset-0 size-full" fill="none" height="8" preserveAspectRatio="none" viewBox="0 0 8 8" width="8">
            <circle cx="4" cy="4" fill="#3C3C3C" id="Ellipse 11" r="4" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[23.05%] right-[75.43%] top-[379px]">
          <svg className="absolute block inset-0 size-full" fill="none" height="8" preserveAspectRatio="none" viewBox="0 0 8 8" width="8">
            <circle cx="4" cy="4" fill="#686868" id="Ellipse 44" r="4" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[14.1%] right-[84.38%] top-[247px]">
          <svg className="absolute block inset-0 size-full" fill="none" height="8" preserveAspectRatio="none" viewBox="0 0 8 8" width="8">
            <circle cx="4" cy="4" fill="#3C3C3C" id="Ellipse 11" r="4" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-0 right-[98.48%] top-[277px]">
          <svg className="absolute block inset-0 size-full" fill="none" height="8" preserveAspectRatio="none" viewBox="0 0 8 8" width="8">
            <circle cx="4" cy="4" fill="#3C3C3C" id="Ellipse 11" r="4" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[89.33%] right-[9.14%] top-[408px]">
          <svg className="absolute block inset-0 size-full" fill="none" height="8" preserveAspectRatio="none" viewBox="0 0 8 8" width="8">
            <circle cx="4" cy="4" fill="#686868" id="Ellipse 44" r="4" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[31.43%] right-[67.05%] top-[34px]">
          <svg className="absolute block inset-0 size-full" fill="none" height="8" preserveAspectRatio="none" viewBox="0 0 8 8" width="8">
            <circle cx="4" cy="4" fill="#3C3C3C" id="Ellipse 11" r="4" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[12.57%] right-[85.9%] top-[82px]">
          <svg className="absolute block inset-0 size-full" fill="none" height="8" preserveAspectRatio="none" viewBox="0 0 8 8" width="8">
            <circle cx="4" cy="4" fill="#3C3C3C" id="Ellipse 11" r="4" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[26.1%] right-[72.38%] top-[113px]">
          <svg className="absolute block inset-0 size-full" fill="none" height="8" preserveAspectRatio="none" viewBox="0 0 8 8" width="8">
            <circle cx="4" cy="4" fill="#686868" id="Ellipse 44" r="4" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[47.62%] right-[51.62%] top-[441px]">
          <svg className="absolute block inset-0 size-full" fill="none" height="4" preserveAspectRatio="none" viewBox="0 0 4 4" width="4">
            <circle cx="2" cy="2" fill="#3C3C3C" id="Ellipse 12" r="2" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[81.71%] right-[17.52%] top-[139px]">
          <svg className="absolute block inset-0 size-full" fill="none" height="4" preserveAspectRatio="none" viewBox="0 0 4 4" width="4">
            <circle cx="2" cy="2" fill="#3C3C3C" id="Ellipse 12" r="2" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[1.52%] right-[97.71%] top-[197px]">
          <svg className="absolute block inset-0 size-full" fill="none" height="4" preserveAspectRatio="none" viewBox="0 0 4 4" width="4">
            <circle cx="2" cy="2" fill="#3C3C3C" id="Ellipse 12" r="2" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[37.14%] right-[61.52%] top-[5px]">
          <svg className="absolute block inset-0 size-full" fill="none" height="7" preserveAspectRatio="none" viewBox="0 0 7 7" width="7">
            <circle cx="3.5" cy="3.5" fill="#3C3C3C" id="Ellipse 14" r="3.5" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[75.81%] right-[22.86%] top-[380px]">
          <svg className="absolute block inset-0 size-full" fill="none" height="7" preserveAspectRatio="none" viewBox="0 0 7 7" width="7">
            <circle cx="3.5" cy="3.5" fill="#3C3C3C" id="Ellipse 14" r="3.5" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[20.76%] right-[74.67%] top-[460px]">
          <svg className="absolute block inset-0 size-full" fill="none" height="24" preserveAspectRatio="none" viewBox="0 0 24 24" width="24">
            <circle cx="12" cy="12" fill="#3C3C3C" id="Ellipse 5" r="12" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[84%] right-[12.95%] top-[271px]">
          <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
            <circle cx="8" cy="8" fill="#3C3C3C" id="Ellipse 1" r="8" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[50.1%] right-[49.14%] top-[70px]">
          <svg className="absolute block inset-0 size-full" fill="none" height="4" preserveAspectRatio="none" viewBox="0 0 4 4" width="4">
            <circle cx="2" cy="2" fill="#3C3C3C" id="Ellipse 12" r="2" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[34.86%] right-[63.24%] top-[462px]">
          <svg className="absolute block inset-0 size-full" fill="none" height="10" preserveAspectRatio="none" viewBox="0 0 10 10" width="10">
            <circle cx="5" cy="5" fill="#686868" id="Ellipse 8" r="5" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[20.38%] right-[78.86%] top-[416px]">
          <svg className="absolute block inset-0 size-full" fill="none" height="4" preserveAspectRatio="none" viewBox="0 0 4 4" width="4">
            <circle cx="2" cy="2" fill="#3C3C3C" id="Ellipse 12" r="2" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[67.24%] right-[30.86%] top-[413px]">
          <svg className="absolute block inset-0 size-full" fill="none" height="10" preserveAspectRatio="none" viewBox="0 0 10 10" width="10">
            <circle cx="5" cy="5" fill="#3C3C3C" id="Ellipse 23" r="5" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[11.81%] right-[87.43%] top-[129px]">
          <svg className="absolute block inset-0 size-full" fill="none" height="4" preserveAspectRatio="none" viewBox="0 0 4 4" width="4">
            <circle cx="2" cy="2" fill="#3C3C3C" id="Ellipse 12" r="2" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[6.48%] right-[92.76%] top-[308px]">
          <svg className="absolute block inset-0 size-full" fill="none" height="4" preserveAspectRatio="none" viewBox="0 0 4 4" width="4">
            <circle cx="2" cy="2" fill="#3C3C3C" id="Ellipse 12" r="2" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[4.38%] right-[94.86%] top-[360px]">
          <svg className="absolute block inset-0 size-full" fill="none" height="4" preserveAspectRatio="none" viewBox="0 0 4 4" width="4">
            <circle cx="2" cy="2" fill="#3C3C3C" id="Ellipse 12" r="2" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[95.43%] right-[3.05%] top-[165px]">
          <svg className="absolute block inset-0 size-full" fill="none" height="8" preserveAspectRatio="none" viewBox="0 0 8 8" width="8">
            <circle cx="4" cy="4" fill="#3C3C3C" id="Ellipse 17" r="4" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[45.71%] right-[52.38%] top-[513px]">
          <svg className="absolute block inset-0 size-full" fill="none" height="10" preserveAspectRatio="none" viewBox="0 0 10 10" width="10">
            <circle cx="5" cy="5" fill="#3C3C3C" id="Ellipse 23" r="5" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[9.9%] right-[88.19%] top-[408px]">
          <svg className="absolute block inset-0 size-full" fill="none" height="10" preserveAspectRatio="none" viewBox="0 0 10 10" width="10">
            <circle cx="5" cy="5" fill="#3C3C3C" id="Ellipse 23" r="5" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[87.81%] right-[11.43%] top-[364px]">
          <svg className="absolute block inset-0 size-full" fill="none" height="4" preserveAspectRatio="none" viewBox="0 0 4 4" width="4">
            <circle cx="2" cy="2" fill="#3C3C3C" id="Ellipse 12" r="2" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[79.05%] right-[17.9%] top-[452px]">
          <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
            <circle cx="8" cy="8" fill="#3C3C3C" id="Ellipse 1" r="8" />
          </svg>
        </div>
        <div className="absolute aspect-[18/18] left-[92.57%] right-[5.9%] top-[247px]">
          <svg className="absolute block inset-0 size-full" fill="none" height="8" preserveAspectRatio="none" viewBox="0 0 8 8" width="8">
            <circle cx="4" cy="4" fill="#686868" id="Ellipse 10" r="4" />
          </svg>
        </div>
        <div className="absolute inset-[12.24%_72.38%_86.62%_26.48%]">
          <svg className="absolute block inset-0 size-full" fill="none" height="6" preserveAspectRatio="none" viewBox="0 0 6 6" width="6">
            <circle cx="3" cy="3" fill="#3C3C3C" id="Ellipse 2" r="3" />
          </svg>
        </div>
        <div className="absolute inset-[88.91%_42.67%_9.94%_56.19%]">
          <svg className="absolute block inset-0 size-full" fill="none" height="6" preserveAspectRatio="none" viewBox="0 0 6 6" width="6">
            <circle cx="3" cy="3" fill="#686868" id="Ellipse 4" r="3" />
          </svg>
        </div>
        <div className="absolute inset-[0_47.81%_98.85%_51.05%]">
          <svg className="absolute block inset-0 size-full" fill="none" height="6" preserveAspectRatio="none" viewBox="0 0 6 6" width="6">
            <circle cx="3" cy="3" fill="#3C3C3C" id="Ellipse 2" r="3" />
          </svg>
        </div>
      </div>
      <Frame4 />
      <Cta className="absolute left-[1262.5px] rounded-[8px] top-[-70px] w-[154px]" />
      <div className="absolute left-[1123.5px] rounded-[8px] top-[-70px]" data-name="cta">
        <div aria-hidden className="absolute border border-black border-solid inset-0 pointer-events-none rounded-[8px]" />
        <div className="flex flex-row items-center justify-center size-full">
          <div className="content-stretch flex items-center justify-center px-[16px] py-[8px] relative size-full">
            <p className="[word-break:break-word] font-['Source_Sans_Pro:SemiBold',sans-serif] leading-[1.4] not-italic relative shrink-0 text-[14px] text-black text-center whitespace-nowrap">Try a Live Demo</p>
          </div>
        </div>
      </div>
      <div className="-translate-x-1/2 absolute bg-white bottom-[-406px] left-1/2 rounded-[32px] shadow-[0px_4px_36px_0px_rgba(0,0,0,0.1)] w-[480px]">
        <div className="flex flex-row items-end overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex gap-[24px] items-end pl-[24px] pr-[8px] py-[24px] relative size-full">
            <p className="[word-break:break-word] font-['Source_Sans_3:Regular',sans-serif] font-normal leading-[1.4] relative shrink-0 text-[16px] text-black w-[376px]">Identify qualified suppliers in Romania for precision titanium machining, assess their certifications and financial health</p>
            <Frame1 />
          </div>
        </div>
      </div>
      <div className="absolute bg-[#590db4] h-[6px] left-[586px] rounded-[16px] top-[1273px] w-[29px]" />
      <Frame2 />
      <Frame3 />
    </div>
  );
}