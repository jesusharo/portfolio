export type PreviewDevice = 'desktop' | 'mobile';

export const PREVIEW_VIEWPORTS = {
  desktop: { width: 1200, height: 768 },
  mobile: { width: 402, height: 874 },
} as const;

export function getPreviewScale(containerWidth: number, viewportWidth: number): number {
  if (!Number.isFinite(containerWidth) || containerWidth <= 0) return 0;
  return Math.min(1, containerWidth / viewportWidth);
}
