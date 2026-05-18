// ==============================
// Handcrafted Haven — Utility Functions
// ==============================

/**
 * Format a number as USD currency
 */
export function formatPrice(price) {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(num);
}

/**
 * Format a date string to a human-readable format
 */
export function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

/**
 * Format a date)
 */
export function formatRelativeTime(date) {
  const now = new Date();
  const target = new Date(date);
  const diffMs = now.getTime() - target.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);
  const diffMonth = Math.floor(diffDay / 30);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 30) return `${diffDay}d ago`;
  if (diffMonth < 12) return `${diffMonth}mo ago`;
  return formatDate(date);
}

/**
 * Generate a URL-friendly slug from a string
 */
export function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Truncate text to a max length with ellipsis
 */
export function truncate(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '...';
}

/**
 * Capitalize the first letter of a string
 */
export function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Get initials from a name (e.g., "John Doe" -> "JD")
 */
export function getInitials(name) {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Debounce a function
 */
export function debounce(func, wait) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Class name helper — joins truthy values
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Generate a random string for unique IDs
 */
export function generateId(length= 8) {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length);
}

/**
 * Validate email format
 */
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Check minimum password strength
 */
export function isStrongPassword(password) {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain an uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain a lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain a number' };
  }
  return { valid: true, message: 'Password is strong' };
}

/**
 * Parse search params into ProductFilters
 */
export function parseProductFilters(searchParams) {
  const get = (key) => {
    const val = searchParams[key];
    return typeof val === 'string' ? val : undefined;
  };

  return {
    category: get('category'),
    minPrice: get('minPrice') ? parseFloat(get('minPrice')) : undefined,
    maxPrice: get('maxPrice') ? parseFloat(get('maxPrice')) : undefined,
    minRating: get('minRating') ? parseInt(get('minRating')) : undefined,
    search: get('search'),
    sort: get('sort'),
    page: get('page') ? parseInt(get('page')) : 1,
    pageSize: get('pageSize') ? parseInt(get('pageSize')) : 12,
  };
}
