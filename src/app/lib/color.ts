export function withAlpha(color: string, alpha: number) {
  const value = color.trim();
  const hex = value.replace('#', '');

  if (/^[\da-f]{3}$/i.test(hex)) {
    const [r, g, b] = hex.split('').map((channel) => parseInt(channel + channel, 16));
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  if (/^[\da-f]{6}$/i.test(hex)) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  return value;
}