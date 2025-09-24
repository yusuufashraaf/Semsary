import React, { useState } from 'react';
import { 
  useStartVerification, 
  useCompleteVerification, 
  useRejectVerification 
} from '@hooks/cs-agent/usePropertyVerification';
import { 
  confirmPropertyRejection, 
  confirmPropertyApproval,
  inputNotes
} from '@utils/confirmationDialogs';
import type { PropertyAssignment } from '@app-types/cs-agent/cs-agent';

interface PropertyVerificationActionsProps {
  property: PropertyAssignment;
  className?: string;
}

export const PropertyVerificationActions: React.FC<PropertyVerificationActionsProps> = ({ 
  property, 
  className = '' 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const startVerification = useStartVerification();
  const completeVerification = useCompleteVerification();
  const rejectVerification = useRejectVerification();

  const handleRejectVerification = async () => {
    const { confirmed, reason } = await confirmPropertyRejection({
      propertyTitle: property.property?.title
    });
    
    if (!confirmed || !reason) return;

    setIsLoading(true);
    try {
      await rejectVerification.mutateAsync({
        propertyId: property.id,
        reason
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteVerification = async () => {
    const shouldApprove = await confirmPropertyApproval(property.property?.title);
    if (!shouldApprove) return;

    const { confirmed, notes } = await inputNotes('Completion Notes', 'Enter final notes...');
    if (!confirmed || !notes) return;

    setIsLoading(true);
    try {
      await completeVerification.mutateAsync({ propertyId: property.id, notes });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      {property.status === 'pending' && (
        <button
          onClick={() => startVerification.mutate(property.id)}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Start Verification
        </button>
      )}
      {property.status === 'in_progress' && (
        <>
          <button
            onClick={handleCompleteVerification}
            disabled={isLoading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            Complete
          </button>
          <button
            onClick={handleRejectVerification}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            Reject
          </button>
        </>
      )}
    </div>
  );
};
