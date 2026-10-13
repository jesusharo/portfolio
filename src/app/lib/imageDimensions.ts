export function getImageDimensions(src?: string): { width: number; height: number } | null {
  if (!src) return null;
  const match = src.match(/#portfolio-image=(\d{1,5})x(\d{1,5})/);
  if (!match) return null;
  const width = Number(match[1]);
  const height = Number(match[2]);
  return width > 0 && height > 0 ? { width, height } : null;
}
