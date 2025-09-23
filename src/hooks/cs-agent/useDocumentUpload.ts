import { useMutation, useQueryClient } from '@tanstack/react-query';
import { csAgentApi } from '@api/endpoints/csAgent';
import { 
  useCsAgentNotifications, 
  useCsAgentUploadStore 
} from '@store/cs-agent/csAgentStore';
import { CS_AGENT_QUERY_KEYS } from './useCsAgentDashboard';
import { validateFileUpload as enhancedValidateFile } from '@utils/fileValidation';

interface UploadDocumentParams {
  propertyId: number;
  files: File[];
  documentType?: string;
  notes?: string;
}

export const useDocumentUpload = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useCsAgentNotifications();
  const { 
    setUploadProgress, 
    addUploadingFile, 
    removeUploadingFile,
    setUploadError,
    clearUploadState 
  } = useCsAgentUploadStore();

  return useMutation({
    mutationFn: async ({ propertyId, files, documentType, notes }: UploadDocumentParams) => {
      const formData = new FormData();
      
      files.forEach((file) => {
        formData.append('documents[]', file);
        addUploadingFile(file);
      });

      if (documentType) {
        formData.append('document_type', documentType);
      }
      
      if (notes) {
        formData.append('notes', notes);
      }

      const response = await csAgentApi.uploadDocuments(
        propertyId, 
        formData,
        {
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              files.forEach(file => {
                setUploadProgress(file.name, progress);
              });
            }
          },
        }
      );

      return response.data;
    },
    onSuccess: (_data, variables) => {
      // Clear upload state
      clearUploadState();

      // Invalidate property query to refresh documents list
      queryClient.invalidateQueries({ 
        queryKey: CS_AGENT_QUERY_KEYS.PROPERTY(variables.propertyId) 
      });

      showSuccess(
        'Documents Uploaded',
        `Successfully uploaded ${variables.files.length} document(s)`
      );
    },
    onError: (error: any, variables) => {
      variables.files.forEach(file => {
        setUploadError(file.name, error.message || 'Upload failed');
        removeUploadingFile(file.name);
      });

      showError(
        'Upload Failed',
        error.response?.data?.message || 'Failed to upload documents. Please try again.'
      );
    },
  });
};

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useCsAgentNotifications();

  return useMutation({
    mutationFn: async ({ 
      propertyId, 
      documentId 
    }: { 
      propertyId: number; 
      documentId: number 
    }) => {
      const response = await csAgentApi.deleteDocument(propertyId, documentId);
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: CS_AGENT_QUERY_KEYS.PROPERTY(variables.propertyId) 
      });

      showSuccess(
        'Document Deleted',
        'The document has been successfully removed'
      );
    },
    onError: (error: any) => {
      showError(
        'Deletion Failed',
        error.response?.data?.message || 'Failed to delete document'
      );
    },
  });
};

export const validateFileUpload = (file: File) => {
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf'
  ];
  const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf'];

  const errors: string[] = [];

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    errors.push(`File "${file.name}" exceeds 10MB limit`);
  }

  // Check file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      errors.push(`File "${file.name}" has unsupported format. Allowed: JPG, PNG, GIF, WEBP, PDF`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const useValidatedFileUpload = () => {
  const upload = useDocumentUpload();
  const { showError, showWarning } = useCsAgentNotifications();
  const { setUploadProgress, clearUploadState } = useCsAgentUploadStore();

  const uploadWithValidation = async (params: UploadDocumentParams): Promise<any> => {
    const allErrors: string[] = [];
    const allWarnings: string[] = [];

    // Reset progress for all files before starting
    params.files.forEach(file => {
      setUploadProgress(file.name, 0);
    });

    // Use both basic and enhanced validation
    for (const file of params.files) {
      // Basic validation for backward compatibility
      const basicValidation = validateFileUpload(file);
      if (!basicValidation.isValid) {
        allErrors.push(...basicValidation.errors);
      }
      
      // Enhanced validation with content verification
      const enhancedValidation = await enhancedValidateFile(file, {
        allowImages: true,
        allowDocuments: true,
        verifyContent: true
      });
      
      if (!enhancedValidation.isValid) {
        allErrors.push(...enhancedValidation.errors);
      }
      
      if (enhancedValidation.warnings.length > 0) {
        allWarnings.push(...enhancedValidation.warnings);
      }
    }

    // Show warnings if any
    allWarnings.forEach(warning => showWarning?.('File Warning', warning));

    if (allErrors.length > 0) {
      // Remove duplicates and show each error separately for better UX
      const uniqueErrors = [...new Set(allErrors)];
      uniqueErrors.forEach(error => showError('Invalid File', error));
      clearUploadState();
      throw new Error('File validation failed');
    }

    // Return promise properly to handle async operations
    return new Promise((resolve, reject) => {
      upload.mutate(params, {
        onSuccess: resolve,
        onError: reject
      });
    });
  };

  // Async wrapper for mutateAsync compatibility
  const uploadWithValidationAsync = async (params: UploadDocumentParams): Promise<any> => {
    return uploadWithValidation(params);
  };

  return {
    ...upload,
    upload: uploadWithValidation,
    uploadAsync: uploadWithValidationAsync,
  };
};
