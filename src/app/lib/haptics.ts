export function triggerHaptic(duration = 10) {
  if (typeof navigator === 'undefined') return false;
  if (typeof navigator.vibrate !== 'function') return false;
  try {
    return navigator.vibrate(duration);
  } catch {
    return false;
  }
}