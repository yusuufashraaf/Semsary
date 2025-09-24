import React from 'react';
import DocumentUploader from '@components/DocumentUploader';

const DocumentUploaderExample: React.FC = () => {
  const handleUploadComplete = (documents: any[]) => {
    console.log('Documents uploaded:', documents);
  };

  const handleUploadStart = () => {
    console.log('Upload started');
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Document Upload Example</h1>
      
      <DocumentUploader
        propertyId={1}
        existingDocuments={[]}
        onUploadComplete={handleUploadComplete}
        onUploadStart={handleUploadStart}
        maxFiles={5}
        maxFileSize={10}
        allowedTypes={['image/jpeg', 'image/png', 'application/pdf']}
      />
    </div>
  );
};

export default DocumentUploaderExample;
