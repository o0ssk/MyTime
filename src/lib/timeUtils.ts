// ==========================================
// Time ↔ Angle Utilities for 12-Hour Clock
// ==========================================

/**
 * Curated task color palette — vibrant and distinguishable
 */
export const TASK_COLORS = [
  '#94a3b8', // Slate
  '#cbd5e1', // Silver
  '#64748b', // Steel
  '#475569', // Lead
  '#334155', // Charcoal Slate
  '#1e293b', // Deep Navy Slate
  '#0ea5e9', // Sky (Cool Accent)
  '#71717a', // Glacier Slate (Replacing Indigo)
  '#f8fafc', // Bright Silver
  '#e2e8f0', // Muted Silver
];

/**
 * Convert a 12-hour position (0–12) to an angle in radians.
 * 12 (or 0) is at the top, angles go clockwise.
 * In Three.js XY plane: top = +Y = π/2, clockwise = decreasing angle.
 */
export function hourToAngle12(hour12: number): number {
  const normalized = ((hour12 % 12) + 12) % 12;
  const fraction = normalized / 12;
  // Start from top (π/2), go clockwise (subtract)
  return Math.PI / 2 - fraction * Math.PI * 2;
}

/**
 * Convert a 24-hour decimal time to its position on a 12-hour clock face.
 * e.g., 14.5 → 2.5 (2:30 position on the clock face)
 */
export function time24ToHour12(time24: number): number {
  return ((time24 % 12) + 12) % 12;
}

/**
 * Convert a 24-hour decimal time to an angle on the 12-hour clock.
 */
export function timeToAngle(time24: number): number {
  return hourToAngle12(time24ToHour12(time24));
}

/**
 * Get the arc angles for a task on the outer ring.
 * Returns start and end angles in radians.
 */
export function getArcAngles(startTime: number, endTime: number): {
  startAngle: number;
  endAngle: number;
  sweep: number;
} {
  const startAngle = timeToAngle(startTime);
  const endAngle = timeToAngle(endTime);

  // Calculate sweep (clockwise, so startAngle - endAngle)
  let sweep = startAngle - endAngle;
  if (sweep <= 0) sweep += Math.PI * 2;

  // Cap sweep to avoid full-circle for 12-hour spans mapped to same position
  if (sweep > Math.PI * 2 - 0.01) sweep = Math.PI * 2 - 0.01;

  return { startAngle, endAngle, sweep };
}

/**
 * Calculate the duration of a task in hours.
 */
export function getTaskDuration(startTime: number, endTime: number): number {
  if (endTime > startTime) {
    return endTime - startTime;
  }
  // Wraps around midnight
  return 24 - startTime + endTime;
}

/**
 * Format 24h decimal time to display string.
 * e.g., 9.5 → "9:30 AM", 14 → "2:00 PM", 0 → "12:00 AM"
 */
export function formatTime(time24: number): string {
  const normalized = ((time24 % 24) + 24) % 24;
  const h = Math.floor(normalized);
  const m = Math.round((normalized - h) * 60);
  const period = h >= 12 ? 'PM' : 'AM';
  const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${displayHour}:${m.toString().padStart(2, '0')} ${period}`;
}

/**
 * Parse "HH:MM" string to 24h decimal.
 * e.g., "09:30" → 9.5, "14:00" → 14
 */
export function parseTimeInput(value: string): number {
  const [h, m] = value.split(':').map(Number);
  return h + (m || 0) / 60;
}

/**
 * Convert 24h decimal to "HH:MM" input value.
 * e.g., 9.5 → "09:30", 14 → "14:00"
 */
export function toTimeInputValue(time24: number): string {
  const normalized = ((time24 % 24) + 24) % 24;
  const h = Math.floor(normalized);
  const m = Math.round((normalized - h) * 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
}

/**
 * Get the next color from the palette based on existing task count.
 */
export function getNextColor(existingCount: number): string {
  return TASK_COLORS[existingCount % TASK_COLORS.length];
}
/**
 * Splitting logic for 24h tasks to fit onto 12h dual-rings.
 * Handles tasks crossing 12:00 (mid-day) or 00:00 (midnight).
 */
export interface ArcSegment {
  start: number;
  end: number;
  period: 'AM' | 'PM';
}

export function splitTaskByPeriod(start: number, end: number): ArcSegment[] {
  const segments: ArcSegment[] = [];

  // Normalize end time to handle overnight tasks (e.g., 23:00 to 01:00 is 23:00 to 25:00)
  let normalizedEnd = end;
  if (end < start) {
    normalizedEnd += 24;
  }

  // We need to check for crossings at 12:00, 24:00, 36:00, etc.
  let current = start;

  while (current < normalizedEnd) {
    const periodStart = current;
    const currentHourMod24 = current % 24;
    const isAM = currentHourMod24 < 12;

    // Next boundary is either the next 12:00 or next 00:00
    // If we are at 10:00 (AM), next boundary is 12:00
    // If we are at 14:00 (PM), next boundary is 24:00
    const nextBoundary = isAM 
      ? Math.floor(current / 12) * 12 + 12 
      : Math.floor(current / 12) * 12 + 12;

    const periodEnd = Math.min(normalizedEnd, nextBoundary);

    segments.push({
      start: periodStart % 24,
      end: periodEnd % 24 === 0 && periodEnd !== 0 ? 24 : periodEnd % 24,
      period: isAM ? 'AM' : 'PM',
    });

    current = periodEnd;
  }

  return segments;
}
