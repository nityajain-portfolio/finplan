export const fmt = (n, decimals = 0) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n || 0);

export const fmtPct = (n) => `${((n || 0) * 100).toFixed(1)}%`;

export const fmtNum = (n) =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n || 0);

export const shortFmt = (n) => {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000)     return `$${(n / 1_000).toFixed(0)}K`;
  return fmt(n);
};

export const TEAL  = '#00B4A6';
export const GOLD  = '#E8A23A';
export const RED   = '#F87171';
export const BLUE  = '#60A5FA';
export const PURP  = '#A78BFA';
export const GREEN = '#34D399';

export const STREAM_COLORS = [TEAL, GOLD, BLUE, PURP, GREEN, RED];
export const CATEGORY_COLORS = [RED, GOLD, TEAL, BLUE, PURP, GREEN, '#FB923C', '#F472B6', '#38BDF8', '#A3E635', '#C084FC', '#94A3B8'];
