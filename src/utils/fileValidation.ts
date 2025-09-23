/**
 * Enhanced file validation utilities for secure file uploads
 */

// File type configurations
export const FILE_UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp'
  ],
  ALLOWED_DOCUMENT_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ],
  ALLOWED_EXTENSIONS: {
    images: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    documents: ['.pdf', '.doc', '.docx']
  },
  // Magic numbers for file type verification
  FILE_SIGNATURES: {
    'image/jpeg': [0xFF, 0xD8, 0xFF],
    'image/png': [0x89, 0x50, 0x4E, 0x47],
    'image/gif': [0x47, 0x49, 0x46],
    'image/webp': [0x52, 0x49, 0x46, 0x46],
    'application/pdf': [0x25, 0x50, 0x44, 0x46]
  }
};

export interface FileValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Verify file content matches its declared MIME type
 * This helps prevent disguised malicious files
 */
export const verifyFileSignature = async (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      if (!e.target?.result) {
        resolve(false);
        return;
      }
      
      const arr = new Uint8Array(e.target.result as ArrayBuffer);
      const signatures = FILE_UPLOAD_CONFIG.FILE_SIGNATURES;
      
      // Check if file matches any known signature
      for (const [mimeType, signature] of Object.entries(signatures)) {
        if (file.type === mimeType) {
          const matches = signature.every((byte, index) => arr[index] === byte);
          resolve(matches);
          return;
        }
      }
      
      // If no signature check available, allow it (for now)
      resolve(true);
    };
    
    reader.onerror = () => resolve(false);
    
    // Read first 12 bytes (enough for most signatures)
    reader.readAsArrayBuffer(file.slice(0, 12));
  });
};

/**
 * Enhanced file validation with multiple security checks
 */
export const validateFileUpload = async (
  file: File,
  options: {
    allowImages?: boolean;
    allowDocuments?: boolean;
    maxSize?: number;
    verifyContent?: boolean;
  } = { allowImages: true, allowDocuments: true, verifyContent: true }
): Promise<FileValidationResult> => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const maxSize = options.maxSize || FILE_UPLOAD_CONFIG.MAX_FILE_SIZE;
  
  // Check file size
  if (file.size > maxSize) {
    errors.push(`File "${file.name}" exceeds ${maxSize / (1024 * 1024)}MB limit`);
  }
  
  // Check if file has a name
  if (!file.name || file.name.trim() === '') {
    errors.push('File must have a valid name');
  }
  
  // Check file extension
  const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
  const allowedExtensions = [
    ...(options.allowImages ? FILE_UPLOAD_CONFIG.ALLOWED_EXTENSIONS.images : []),
    ...(options.allowDocuments ? FILE_UPLOAD_CONFIG.ALLOWED_EXTENSIONS.documents : [])
  ];
  
  if (!allowedExtensions.includes(extension)) {
    errors.push(`File "${file.name}" has unsupported extension. Allowed: ${allowedExtensions.join(', ')}`);
  }
  
  // Check MIME type
  const allowedTypes = [
    ...(options.allowImages ? FILE_UPLOAD_CONFIG.ALLOWED_IMAGE_TYPES : []),
    ...(options.allowDocuments ? FILE_UPLOAD_CONFIG.ALLOWED_DOCUMENT_TYPES : [])
  ];
  
  if (!allowedTypes.includes(file.type)) {
    // Check if it's a missing MIME type but valid extension
    if (file.type === '' && allowedExtensions.includes(extension)) {
      warnings.push(`File "${file.name}" has no MIME type but extension appears valid`);
    } else {
      errors.push(`File "${file.name}" has unsupported type: ${file.type || 'unknown'}`);
    }
  }
  
  // Verify file content matches declared type
  if (options.verifyContent && errors.length === 0) {
    const isValidSignature = await verifyFileSignature(file);
    if (!isValidSignature) {
      errors.push(`File "${file.name}" content does not match its declared type`);
    }
  }
  
  // Check for suspicious file names
  const suspiciousPatterns = [
    /\.exe$/i,
    /\.bat$/i,
    /\.cmd$/i,
    /\.com$/i,
    /\.pif$/i,
    /\.scr$/i,
    /\.vbs$/i,
    /\.js$/i,
    /\.jar$/i,
    /\.(php|asp|aspx|jsp)$/i
  ];
  
  if (suspiciousPatterns.some(pattern => pattern.test(file.name))) {
    errors.push(`File "${file.name}" has a potentially dangerous extension`);
  }
  
  // Check for double extensions
  if ((file.name.match(/\./g) || []).length > 1) {
    const parts = file.name.split('.');
    if (parts.length > 2) {
      warnings.push(`File "${file.name}" has multiple extensions, which could be suspicious`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Validate multiple files at once
 */
export const validateMultipleFiles = async (
  files: File[],
  options?: Parameters<typeof validateFileUpload>[1]
): Promise<Map<File, FileValidationResult>> => {
  const results = new Map<File, FileValidationResult>();
  
  for (const file of files) {
    const result = await validateFileUpload(file, options);
    results.set(file, result);
  }
  
  return results;
};

/**
 * Generate a safe file name
 */
export const sanitizeFileName = (fileName: string): string => {
  // Remove path components
  const baseName = fileName.split(/[/\\]/).pop() || fileName;
  
  // Replace dangerous characters
  let safe = baseName
    .replace(/[^a-zA-Z0-9._-]/g, '_')  // Replace special chars with underscore
    .replace(/\.{2,}/g, '.')            // Remove multiple dots
    .replace(/^\.+/, '')                // Remove leading dots
    .replace(/\s+/g, '_');              // Replace spaces with underscore
  
  // Ensure it has a valid extension
  if (!safe.includes('.')) {
    safe += '.unknown';
  }
  
  // Limit length
  if (safe.length > 255) {
    const ext = safe.substring(safe.lastIndexOf('.'));
    safe = safe.substring(0, 255 - ext.length) + ext;
  }
  
  return safe;
};

/**
 * Check if a file is likely an image by extension and MIME type
 */
export const isImageFile = (file: File): boolean => {
  const imageExtensions = FILE_UPLOAD_CONFIG.ALLOWED_EXTENSIONS.images;
  const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
  return imageExtensions.includes(extension) || 
         FILE_UPLOAD_CONFIG.ALLOWED_IMAGE_TYPES.includes(file.type);
};

/**
 * Check if a file is likely a document by extension and MIME type
 */
export const isDocumentFile = (file: File): boolean => {
  const docExtensions = FILE_UPLOAD_CONFIG.ALLOWED_EXTENSIONS.documents;
  const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
  return docExtensions.includes(extension) || 
         FILE_UPLOAD_CONFIG.ALLOWED_DOCUMENT_TYPES.includes(file.type);
};

/**
 * Get human-readable file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};
