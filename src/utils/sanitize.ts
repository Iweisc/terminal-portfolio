/**
 * Sanitize user input to prevent XSS attacks
 * Escapes HTML special characters
 */
export function sanitizeInput(input: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  
  return input.replace(/[&<>"'/]/g, (char) => map[char] || char);
}

/**
 * Sanitize output for display
 * Currently a pass-through but can be extended for additional sanitization
 */
export function sanitizeOutput(output: string): string {
  // For now, we trust command outputs
  // This function exists for future enhancements
  return output;
}
