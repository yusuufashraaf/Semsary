// src/components/admin/properties/PropertyDetailsModal.tsx
import React from 'react';
import { Modal } from '@components/ui/Modal';
import { Button } from '@components/ui/Button';
import { Badge } from '@components/ui/Badge';
import { LoadingSpinner } from '@components/ui/LoadingSpinner';
import { formatCurrency, formatNumber, formatDate } from '@utils/formatters';
import { getStatusVariant } from '@utils/statusHelpers';
import { useProperty } from '@hooks/usePropertiesQueries';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface PropertyDetailsModalProps {
  propertyId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove?: (propertyId: number) => void;
  onReject?: (propertyId: number) => void;
  onAssignCS?: (propertyId: number) => void;
}

export const PropertyDetailsModal: React.FC<PropertyDetailsModalProps> = ({
  propertyId,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onAssignCS,
}) => {
  const { data: property, isLoading, error } = useProperty(
    propertyId || 0,
    isOpen && propertyId !== null
  );

  if (!isOpen || !propertyId) return null;

  if (isLoading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </Modal>
    );
  }

  if (error || !property) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <div className="text-center py-12">
          <p className="text-red-600">Failed to load property details</p>
          <Button variant="outline" onClick={onClose} className="mt-4">
            Close
          </Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{property.title}</h2>
          <p className="text-sm text-gray-600 mt-1">
            {property.type} • {property.location?.city}, {property.location?.state}
          </p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Property Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Price:</span>
                <span className="text-sm font-medium">{formatCurrency(parseFloat(property.price) || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Size:</span>
                <span className="text-sm font-medium">{formatNumber(property.size)} sqft</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Bedrooms:</span>
                <span className="text-sm font-medium">{property.bedrooms}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <Badge variant={getStatusVariant(property.property_state)}>
                  {property.property_state}
                </Badge>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Owner Information</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Name:</span>
                <span className="text-sm font-medium">
                  {property.owner?.first_name} {property.owner?.last_name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Email:</span>
                <span className="text-sm font-medium">{property.owner?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Submitted:</span>
                <span className="text-sm font-medium">{formatDate(property.submitted_date)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4 mt-6">
        <div className="flex justify-between items-center">
          <div className="flex space-x-3">
            {property.property_state === 'Pending' && (
              <>
                <Button
                  variant="success"
                  onClick={() => onApprove?.(property.id)}
                >
                  Approve Property
                </Button>
                <Button
                  variant="danger"
                  onClick={() => onReject?.(property.id)}
                >
                  Reject Property
                </Button>
              </>
            )}
            <Button
              variant="outline"
              onClick={() => onAssignCS?.(property.id)}
            >
              Assign CS Agent
            </Button>
          </div>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};