import type { ChangeEvent } from 'react';

export const MAX_CAPTION_LINES = 3;

export function limitCaptionLines(value: string): string {
  return value.replace(/\r\n?/g, '\n').split('\n').slice(0, MAX_CAPTION_LINES).join('\n');
}

interface Props {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function ImageCaptionField({
  value = '',
  onChange,
  placeholder = 'Caption (up to 3 lines)',
}: Props) {
  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    onChange(limitCaptionLines(event.target.value));
  }

  return (
    <textarea
      value={value}
      rows={3}
      onChange={handleChange}
      placeholder={placeholder}
      aria-label="Image caption"
      className="w-full resize-none rounded-[6px] border border-white/[0.06] bg-transparent px-2 py-1.5 text-[0.72rem] leading-[1.35] text-white/45 outline-none placeholder:text-white/20 focus:border-white/20 transition-colors"
      style={{ fontFamily: "'Source Sans 3', sans-serif" }}
    />
  );
}