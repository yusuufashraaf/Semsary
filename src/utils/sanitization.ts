/**
 * Sanitization utilities for preventing XSS attacks
 * This file provides safe content rendering methods
 */

// Basic HTML entity encoding for text content
export const escapeHtml = (text: string): string => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

// Remove potentially dangerous HTML tags and attributes
export const sanitizeHtml = (html: string): string => {
  // Create a temporary element to parse HTML
  const temp = document.createElement('div');
  temp.innerHTML = html;
  
  // Remove script tags
  const scripts = temp.getElementsByTagName('script');
  for (let i = scripts.length - 1; i >= 0; i--) {
    scripts[i].remove();
  }
  
  // Remove iframe tags
  const iframes = temp.getElementsByTagName('iframe');
  for (let i = iframes.length - 1; i >= 0; i--) {
    iframes[i].remove();
  }
  
  // Remove object and embed tags
  const objects = temp.getElementsByTagName('object');
  for (let i = objects.length - 1; i >= 0; i--) {
    objects[i].remove();
  }
  
  const embeds = temp.getElementsByTagName('embed');
  for (let i = embeds.length - 1; i >= 0; i--) {
    embeds[i].remove();
  }
  
  // Remove event handlers
  const allElements = temp.getElementsByTagName('*');
  for (let i = 0; i < allElements.length; i++) {
    const element = allElements[i];
    const attributes = element.attributes;
    for (let j = attributes.length - 1; j >= 0; j--) {
      const attr = attributes[j];
      if (attr.name.startsWith('on')) {
        element.removeAttribute(attr.name);
      }
      // Remove javascript: protocol
      if (attr.value && attr.value.toString().toLowerCase().includes('javascript:')) {
        element.removeAttribute(attr.name);
      }
    }
  }
  
  return temp.innerHTML;
};

// Sanitize user input for display
export const sanitizeUserInput = (input: any): string => {
  if (typeof input !== 'string') {
    return String(input);
  }
  return escapeHtml(input);
};

// Sanitize rich text content (allows some HTML)
export const sanitizeRichContent = (content: string): string => {
  // For now, use basic sanitization
  // Will be replaced with DOMPurify when installed
  return sanitizeHtml(content);
};

// Sanitize URLs to prevent XSS via href/src attributes
export const sanitizeUrl = (url: string): string => {
  // Remove javascript: protocol
  if (url.toLowerCase().startsWith('javascript:')) {
    return '#';
  }
  // Remove data: protocol except for images
  if (url.toLowerCase().startsWith('data:') && !url.toLowerCase().startsWith('data:image/')) {
    return '#';
  }
  return url;
};

// Note: This would be better as a React component in a .tsx file
// For now, we'll export just the sanitization functions
// The SafeHtml component should be created in a separate .tsx file

// Export a hook for using DOMPurify when available
export const useSanitizer = () => {
  const sanitize = (dirty: string, options?: any): string => {
    // Check if DOMPurify is available
    if (typeof window !== 'undefined' && (window as any).DOMPurify) {
      return (window as any).DOMPurify.sanitize(dirty, options);
    }
    // Fallback to basic sanitization
    return sanitizeRichContent(dirty);
  };
  
  return { sanitize, escapeHtml, sanitizeUrl };
};

// Configuration for DOMPurify when it's installed
export const DOMPURIFY_CONFIG = {
  ALLOWED_TAGS: [
    'b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li',
    'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'pre', 'code',
    'span', 'div', 'img'
  ],
  ALLOWED_ATTR: [
    'href', 'target', 'rel', 'src', 'alt', 'title', 'class', 'id',
    'width', 'height', 'style'
  ],
  ALLOW_DATA_ATTR: false,
  FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover']
};
