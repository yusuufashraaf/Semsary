# DocumentUploader Component

A comprehensive React component for uploading and managing documents with support for drag-and-drop, file validation, progress tracking, and document preview.

## Features

- 📁 **Drag & Drop Support** - Intuitive file upload with drag and drop functionality
- ✅ **File Validation** - Validates file types and sizes before upload
- 📊 **Progress Tracking** - Real-time upload progress with visual feedback
- 👁️ **Image Preview** - Modal preview for image files
- 📋 **Document Management** - View and manage previously uploaded documents
- 🎨 **Dark Mode Support** - Fully styled for both light and dark themes
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices

## Installation

The component is already integrated into the project. To use it, simply import:

```typescript
import DocumentUploader from '@components/DocumentUploader';
// or
import { DocumentUploader } from '@components/DocumentUploader/DocumentUploader';
```

## Usage

### Basic Example

```tsx
import DocumentUploader from '@components/DocumentUploader';

function PropertyDocuments() {
  const handleUploadComplete = (documents) => {
    console.log('Uploaded documents:', documents);
  };

  return (
    <DocumentUploader
      propertyId={123}
      onUploadComplete={handleUploadComplete}
    />
  );
}
```

### Advanced Example

```tsx
import DocumentUploader from '@components/DocumentUploader';
import { UploadedDocument } from '@app-types/cs-agent/cs-agent';

function PropertyDocuments() {
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);

  const handleUploadComplete = (newDocuments: UploadedDocument[]) => {
    setDocuments([...documents, ...newDocuments]);
    toast.success('Documents uploaded successfully!');
  };

  const handleUploadStart = () => {
    console.log('Upload started');
  };

  return (
    <DocumentUploader
      propertyId={123}
      existingDocuments={documents}
      onUploadComplete={handleUploadComplete}
      onUploadStart={handleUploadStart}
      maxFiles={10}
      maxFileSize={20} // 20MB
      allowedTypes={[
        'image/jpeg',
        'image/png',
        'image/webp',
        'application/pdf',
        'application/msword'
      ]}
      className="my-4"
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `propertyId` | `number` | *Required* | The ID of the property to upload documents for |
| `existingDocuments` | `UploadedDocument[]` | `[]` | Array of previously uploaded documents to display |
| `onUploadComplete` | `(documents: UploadedDocument[]) => void` | - | Callback fired when upload completes successfully |
| `onUploadStart` | `() => void` | - | Callback fired when upload starts |
| `maxFiles` | `number` | `10` | Maximum number of files that can be uploaded at once |
| `maxFileSize` | `number` | `10` | Maximum file size in MB |
| `allowedTypes` | `string[]` | `['image/jpeg', 'image/png', 'image/webp', 'application/pdf']` | Array of allowed MIME types |
| `className` | `string` | - | Additional CSS classes for the root container |

## Document Types

The component supports the following document types:

- `verification_report` - Verification Report
- `inspection_notes` - Inspection Notes  
- `property_photos` - Property Photos
- `legal_documents` - Legal Documents
- `other` - Other

## File Validation

Files are validated for:
1. **File Type** - Must match one of the allowed MIME types
2. **File Size** - Must not exceed the maximum file size limit
3. **File Count** - Total selected files must not exceed the maximum limit

## API Integration

The component integrates with the CS Agent API endpoints:

```typescript
// Upload documents
csAgentApi.uploadDocuments(propertyId, formData, config)

// Get documents
csAgentApi.getDocuments(propertyId)
```

## Styling

The component uses Tailwind CSS for styling and includes:
- Responsive grid layouts
- Dark mode support
- Smooth transitions and hover effects
- Loading states and progress indicators

## Dependencies

- React
- @tanstack/react-query - For data fetching and mutations
- react-hook-form - For form management
- zod - For schema validation
- @heroicons/react - For icons
- Tailwind CSS - For styling

## TypeScript Types

```typescript
interface DocumentUploaderProps {
  propertyId: number;
  existingDocuments?: UploadedDocument[];
  onUploadComplete?: (documents: UploadedDocument[]) => void;
  onUploadStart?: () => void;
  maxFiles?: number;
  maxFileSize?: number;
  allowedTypes?: string[];
  className?: string;
}

interface UploadedDocument {
  id: number;
  file_name: string;
  file_type: string;
  file_size: number;
  file_url: string;
  uploaded_by: string;
  uploaded_at: string;
  document_type?: string;
  notes?: string;
}
```

## Best Practices

1. **Error Handling** - Always provide user feedback for upload errors
2. **File Size Limits** - Set appropriate limits based on your backend configuration
3. **Progress Feedback** - Show upload progress for better user experience
4. **Validation** - Validate files client-side before uploading
5. **Accessibility** - Component includes proper ARIA labels and keyboard navigation

## Troubleshooting

### Common Issues

1. **Upload fails silently**
   - Check network tab for API errors
   - Verify the propertyId is valid
   - Ensure the backend endpoint is accessible

2. **Files not accepted**
   - Check the `allowedTypes` prop matches your file MIME types
   - Verify file size is within limits

3. **Progress not updating**
   - Ensure the API supports progress events
   - Check browser console for errors

## Future Enhancements

- [ ] Bulk file operations (delete multiple)
- [ ] File compression before upload
- [ ] Chunked upload for large files
- [ ] Drag to reorder documents
- [ ] Document categorization
- [ ] OCR support for scanned documents

## License

This component is part of the Semsary project and follows the project's license.
