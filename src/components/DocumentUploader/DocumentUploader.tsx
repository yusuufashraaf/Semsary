import React, { useState, useCallback, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  CloudArrowUpIcon,
  DocumentIcon,
  PhotoIcon,
  XMarkIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { csAgentApi } from '@api/endpoints/csAgent';
import { UploadedDocument } from '@app-types/cs-agent/cs-agent';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Badge } from '@components/ui/Badge';
import { ProgressBar } from '@components/ui/ProgressBar';
import { Modal } from '@components/ui/Modal';
import { Select } from '@components/ui/Select';
import { cn } from '@utils/classNames';

// Validation schema for document upload
const uploadSchema = z.object({
  files: z.array(z.instanceof(File)).min(1, 'At least one file is required'),
  document_type: z.enum(['verification_report', 'inspection_notes', 'property_photos', 'legal_documents', 'other'])
    .default('verification_report'),
  notes: z.string().optional()
});

type UploadFormData = z.infer<typeof uploadSchema>;

export interface DocumentUploaderProps {
  propertyId: number;
  existingDocuments?: UploadedDocument[];
  onUploadComplete?: (documents: UploadedDocument[]) => void;
  onUploadStart?: () => void;
  maxFiles?: number;
  maxFileSize?: number; // in MB
  allowedTypes?: string[];
  className?: string;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  propertyId,
  existingDocuments = [],
  onUploadComplete,
  onUploadStart,
  maxFiles = 10,
  maxFileSize = 10, // 10MB default
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  className
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { control, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema) as any,
    defaultValues: {
      files: [],
      document_type: 'verification_report',
      notes: ''
    }
  });

  // Watch files for changes
  watch('files');

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async ({ files, document_type, notes }: UploadFormData) => {
      const formData = new FormData();
      
      files.forEach((file, index) => {
        formData.append(`documents[${index}]`, file);
      });
      
      if (document_type) formData.append('document_type', document_type);
      if (notes) formData.append('notes', notes);

      onUploadStart?.();

      return csAgentApi.uploadDocuments(propertyId, formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(prev => ({ ...prev, [propertyId]: progress }));
          }
        }
      });
    },
    onSuccess: (response) => {
      const uploadedDocs = response.data;
      onUploadComplete?.(uploadedDocs);
      
      // Clear upload progress and reset form
      setUploadProgress({});
      setSelectedFiles([]);
      reset();
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({
        queryKey: ['cs-agent', 'property', propertyId, 'documents']
      });
    },
    onError: (error) => {
      setUploadProgress({});
      console.error('Upload failed:', error);
    }
  });

  // File validation
  const validateFile = useCallback((file: File): string | null => {
    if (!allowedTypes.includes(file.type)) {
      return `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`;
    }
    
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File size exceeds ${maxFileSize}MB limit`;
    }
    
    return null;
  }, [allowedTypes, maxFileSize]);

  // Handle file selection
  const handleFileSelect = useCallback((files: File[]) => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    files.forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    if (validFiles.length + selectedFiles.length > maxFiles) {
      errors.push(`Maximum ${maxFiles} files allowed`);
      return;
    }

    if (errors.length > 0) {
      // Show error toast or alert
      console.error('File validation errors:', errors);
      return;
    }

    const newFiles = [...selectedFiles, ...validFiles];
    setSelectedFiles(newFiles);
    setValue('files', newFiles);
  }, [selectedFiles, setValue, validateFile, maxFiles]);

  // Drag and drop handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFileSelect(files);
  }, [handleFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFileSelect(files);
    }
  }, [handleFileSelect]);

  // Remove file from selection
  const removeFile = useCallback((index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setValue('files', newFiles);
  }, [selectedFiles, setValue]);

  // Get file icon based on type
  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return PhotoIcon;
    }
    return DocumentIcon;
  };

  // Get file type display name
  const getDocumentTypeDisplayName = (type: string) => {
    const typeMap = {
      verification_report: 'Verification Report',
      inspection_notes: 'Inspection Notes',
      property_photos: 'Property Photos',
      legal_documents: 'Legal Documents',
      other: 'Other'
    };
    return typeMap[type as keyof typeof typeMap] || type;
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const onSubmit = (data: UploadFormData) => {
    uploadMutation.mutate(data);
  };

  const isUploading = uploadMutation.isPending;
  const currentProgress = uploadProgress[propertyId] || 0;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Upload Form */}
      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Upload Documents
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Upload verification documents, photos, and reports for this property
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
          {/* Document Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Document Type
            </label>
            <Controller
              name="document_type"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={[
                    { value: 'verification_report', label: 'Verification Report' },
                    { value: 'inspection_notes', label: 'Inspection Notes' },
                    { value: 'property_photos', label: 'Property Photos' },
                    { value: 'legal_documents', label: 'Legal Documents' },
                    { value: 'other', label: 'Other' }
                  ]}
                />
              )}
            />
            {errors.document_type && (
              <p className="mt-1 text-sm text-red-600">{errors.document_type.message}</p>
            )}
          </div>

          {/* File Upload Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Files
            </label>
            <div
              className={cn(
                "relative border-2 border-dashed rounded-lg p-6 text-center transition-colors",
                dragActive 
                  ? "border-teal-400 bg-teal-50 dark:bg-teal-900/10"
                  : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500",
                isUploading && "pointer-events-none opacity-50"
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={allowedTypes.join(',')}
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isUploading}
              />
              
              <CloudArrowUpIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              
              <div className="space-y-2">
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  Drop files here or click to browse
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Maximum {maxFiles} files, {maxFileSize}MB per file
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Supported: JPG, PNG, WebP, PDF
                </p>
              </div>
            </div>

            {errors.files && (
              <p className="mt-2 text-sm text-red-600">{errors.files.message}</p>
            )}
          </div>

          {/* Selected Files List */}
          {selectedFiles.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Selected Files ({selectedFiles.length})
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {selectedFiles.map((file, index) => {
                  const Icon = getFileIcon(file);
                  return (
                    <div
                      key={`${file.name}-${file.lastModified}`}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <Icon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {file.type.startsWith('image/') && (
                          <button
                            type="button"
                            onClick={() => setPreviewFile(file)}
                            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            title="Preview"
                          >
                            <EyeIcon className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="p-1 text-red-400 hover:text-red-600"
                          title="Remove"
                        >
                          <XMarkIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Notes Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes (Optional)
            </label>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                           focus:ring-2 focus:ring-teal-500 focus:border-transparent 
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                           placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="Add any additional notes or context about these documents..."
                />
              )}
            />
            {errors.notes && (
              <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
            )}
          </div>

          {/* Upload Progress */}
          {isUploading && currentProgress > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Uploading...</span>
                <span className="text-gray-900 dark:text-white font-medium">{currentProgress}%</span>
              </div>
              <ProgressBar value={currentProgress} className="h-2" />
            </div>
          )}

          {/* Submit Button */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setSelectedFiles([]);
                reset();
              }}
              disabled={isUploading}
            >
              Clear
            </Button>
            <Button
              type="submit"
              disabled={selectedFiles.length === 0 || isUploading}
              className="min-w-[120px]"
            >
              {isUploading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Uploading...
                </>
              ) : (
                <>
                  <CloudArrowUpIcon className="w-5 h-5 mr-2" />
                  Upload Files
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>

      {/* Existing Documents */}
      {existingDocuments.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Uploaded Documents ({existingDocuments.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {existingDocuments.map((doc) => (
              <div
                key={doc.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 
                         hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {doc.file_name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {getDocumentTypeDisplayName(doc.document_type || 'other')}
                    </p>
                  </div>
                  <Badge variant="primary" size="sm">
                    {doc.file_type}
                  </Badge>
                </div>
                
                {doc.notes && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                    {doc.notes}
                  </p>
                )}
                
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                  <span className="text-xs text-gray-400">
                    {new Date(doc.uploaded_at).toLocaleDateString()}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => window.open(doc.file_url, '_blank')}
                      className="text-teal-600 hover:text-teal-700 text-xs font-medium"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Preview Modal */}
      {previewFile && (
        <Modal
          isOpen={!!previewFile}
          onClose={() => setPreviewFile(null)}
          title="Image Preview"
          size="xl"
        >
          <div className="p-4">
            <img
              src={URL.createObjectURL(previewFile)}
              alt={previewFile.name}
              className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
            />
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {previewFile.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Size: {formatFileSize(previewFile.size)}
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default DocumentUploader;
