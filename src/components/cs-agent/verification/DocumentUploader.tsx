import React, { useState, useCallback } from 'react';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Badge } from '@components/ui/Badge';
import { LoadingSpinner } from '@components/ui/LoadingSpinner';
import { 
  useValidatedFileUpload, 
  useDeleteDocument,
  validateFileUpload 
} from '@hooks/cs-agent/useDocumentUpload';
import { useCsAgentUploadStore } from '@store/cs-agent/csAgentStore';
import {
  CloudArrowUpIcon,
  DocumentIcon,
  TrashIcon,
  EyeIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@utils/classNames';
import type { UploadedDocument } from '@app-types/cs-agent/cs-agent';

interface DocumentUploaderProps {
  propertyId: number;
  existingDocuments?: UploadedDocument[];
  assignmentStatus?: 'pending' | 'in_progress' | 'completed' | 'rejected' | 'cancelled';
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  propertyId,
  existingDocuments = [],
  assignmentStatus = 'pending',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [documentType, setDocumentType] = useState('verification');
  const [uploadNotes, setUploadNotes] = useState('');

  const { upload, isPending: isUploading } = useValidatedFileUpload();
  const deleteDocument = useDeleteDocument();
  const { uploadProgress, uploadErrors } = useCsAgentUploadStore();

  // Check if uploads are allowed based on assignment status
  const canUpload = ['pending', 'in_progress'].includes(assignmentStatus);
  const canDelete = ['pending', 'in_progress'].includes(assignmentStatus);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    handleFileSelection(files);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    handleFileSelection(files);
  };

  const handleFileSelection = (files: File[]) => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    files.forEach(file => {
      const validation = validateFileUpload(file);
      if (validation.isValid) {
        validFiles.push(file);
      } else {
        errors.push(...validation.errors);
      }
    });

    if (errors.length > 0) {
      alert(errors.join('\n'));
    }

    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0) return;

    upload({
      propertyId,
      files: selectedFiles,
      documentType,
      notes: uploadNotes,
    });

    // Clear form after upload
    setSelectedFiles([]);
    setUploadNotes('');
  };

  const handleDeleteDocument = (documentId: number) => {
    if (confirm('Are you sure you want to delete this document?')) {
      deleteDocument.mutate({ propertyId, documentId });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Status Warning */}
      {!canUpload && (
        <Card>
          <div className="p-4 border-l-4 border-orange-400 bg-orange-50 dark:bg-orange-900/20">
            <div className="flex items-center">
              <ExclamationCircleIcon className="h-5 w-5 text-orange-400 mr-2" />
              <div>
                <h4 className="text-sm font-medium text-orange-800 dark:text-orange-200">
                  Document Upload Restricted
                </h4>
                <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                  Documents cannot be uploaded when assignment status is "{assignmentStatus}". 
                  Only assignments in "pending" or "in_progress" status allow document uploads.
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Upload Section */}
      <Card>
        <div className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Upload Documents
          </h3>

          {/* Drag & Drop Zone */}
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={cn(
              'relative flex min-h-[200px] w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors',
              isDragging
                ? 'border-teal-500 bg-teal-50 dark:border-teal-400 dark:bg-teal-900/20'
                : 'border-gray-300 bg-gray-50 hover:border-teal-400 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:hover:border-teal-500 dark:hover:bg-gray-700'
            )}
          >
            <input
              type="file"
              multiple
              accept="image/*,.pdf"
              onChange={handleFileInput}
              disabled={!canUpload}
              className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
            />
            <CloudArrowUpIcon className="mb-4 h-12 w-12 text-gray-400" />
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Drop files here or click to browse
            </p>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Supported: JPG, PNG, GIF, WEBP, PDF (Max 10MB per file)
            </p>
          </div>

          {/* Selected Files */}
          {selectedFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Selected Files ({selectedFiles.length})
              </p>
              {selectedFiles.map((file, index) => {
                const progress = uploadProgress[file.name];
                const error = uploadErrors[file.name];
                
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-700"
                  >
                    <div className="flex items-center space-x-3">
                      <DocumentIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {progress !== undefined && (
                        <div className="flex items-center space-x-2">
                          <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                            <div
                              className="h-full bg-teal-500 transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">{progress}%</span>
                        </div>
                      )}
                      
                      {error ? (
                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                      ) : progress === 100 ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      ) : (
                        <button
                          onClick={() => removeSelectedFile(index)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Upload Options */}
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Document Type
              </label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="verification">Verification Photos</option>
                <option value="ownership">Ownership Documents</option>
                <option value="property">Property Documents</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notes (Optional)
              </label>
              <textarea
                value={uploadNotes}
                onChange={(e) => setUploadNotes(e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="Add notes about these documents..."
              />
            </div>

            <Button
              variant="primary"
              onClick={handleUpload}
              disabled={selectedFiles.length === 0 || isUploading || !canUpload}
              className="w-full"
            >
              {isUploading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Uploading...
                </>
              ) : !canUpload ? (
                <>
                  <ExclamationCircleIcon className="mr-2 h-5 w-5" />
                  Upload Disabled ({assignmentStatus})
                </>
              ) : (
                <>
                  <CloudArrowUpIcon className="mr-2 h-5 w-5" />
                  Upload {selectedFiles.length} File{selectedFiles.length !== 1 ? 's' : ''}
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Existing Documents */}
      {existingDocuments.length > 0 && (
        <Card>
          <div className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Uploaded Documents ({existingDocuments.length})
            </h3>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {existingDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="group relative rounded-lg border border-gray-200 p-4 hover:shadow-md dark:border-gray-700"
                >
                  {/* Document Preview/Icon */}
                  <div className="mb-3 flex h-32 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                    {doc.file_type?.startsWith('image/') ? (
                      <img
                        src={doc.file_url}
                        alt={doc.file_name}
                        className="h-full w-full rounded-lg object-cover"
                      />
                    ) : (
                      <DocumentIcon className="h-12 w-12 text-gray-400" />
                    )}
                  </div>

                  {/* Document Info */}
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {doc.file_name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(doc.file_size)}
                    </p>
                    {doc.document_type && (
                      <Badge variant="secondary" size="sm" className="mt-2">
                        {doc.document_type}
                      </Badge>
                    )}
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Uploaded {new Date(doc.uploaded_at).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="mt-3 flex space-x-2">
                    <a
                      href={doc.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button variant="outline" size="sm" className="w-full">
                        <EyeIcon className="mr-1 h-4 w-4" />
                        View
                      </Button>
                    </a>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleDeleteDocument(doc.id)}
                      disabled={deleteDocument.isPending || !canDelete}
                      className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 disabled:opacity-50"
                      title={!canDelete ? `Cannot delete when status is ${assignmentStatus}` : 'Delete document'}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
