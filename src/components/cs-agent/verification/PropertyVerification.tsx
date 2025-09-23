import React from "react";
import { Card } from "@components/ui/Card";
import { Badge } from "@components/ui/Badge";
import {
  HomeModernIcon,
  CurrencyDollarIcon,
  Square3Stack3DIcon,
  HomeIcon,
  MapPinIcon,
  CalendarDaysIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import type {
  AssignedProperty,
  PropertyAssignment,
} from "@app-types/cs-agent/cs-agent";

interface PropertyVerificationProps {
  property: Partial<AssignedProperty> | Partial<PropertyAssignment>;
}

export const PropertyVerification: React.FC<PropertyVerificationProps> = ({
  property,
}) => {
  return (
    <div className="space-y-6">
      {/* Property Images */}
      {property.images && property.images.length > 0 && (
        <Card>
          <div className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Property Images
            </h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {property.images.slice(0, 6).map((image) => (
                <div
                  key={image.id}
                  className="relative aspect-video overflow-hidden rounded-lg"
                >
                  <img
                    src={(image as any).url || (image as any).image_url}
                    alt={(image as any).alt_text || `Property image ${image.order_index}`}
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                    onError={(e) => {
                      console.error('Image failed to load:', (image as any).url || (image as any).image_url);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  {image.is_primary && (
                    <div className="absolute top-2 left-2">
                      <Badge variant="success" size="sm">
                        Primary
                      </Badge>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {property.images.length > 6 && (
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                +{property.images.length - 6} more images
              </p>
            )}
          </div>
        </Card>
      )}

      {/* Property Details */}
      <Card>
        <div className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Property Information
          </h3>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Basic Information */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <HomeModernIcon className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Property Type
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {property.type}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Price
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {(property as any)?.property_details?.formatted_price ||
                      (property as any)?.formatted_price ||
                      ((property as any)?.property_details?.price !== undefined
                        ? `$${(property as any).property_details.price?.toLocaleString?.() ?? String((property as any).property_details.price)}`
                        : ((property as any)?.price !== undefined
                        ? `$${(property as any).price?.toLocaleString?.() ?? String((property as any).price)}`
                        : "Price not specified"))}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Square3Stack3DIcon className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Property State
                  </p>
                  <Badge
                    variant={
                      (property as any)?.property_state === "Valid"
                        ? "success"
                        : (property as any)?.property_state === "Pending"
                        ? "warning"
                        : (property as any)?.property_state === "Invalid"
                        ? "danger"
                        : "secondary"
                    }
                  >
                    {(property as any)?.property_state || "Unknown"}
                  </Badge>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Created Date
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {(property as any)?.activity?.created_at
                      ? new Date((property as any).activity.created_at).toLocaleDateString()
                      : (property as any)?.created_at
                      ? new Date((property as any).created_at).toLocaleDateString()
                      : "Date not available"}
                  </p>
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPinIcon className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Full Address
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {typeof property.location === "object" && property.location
                      ? (property.location as any).full_address ||
                        (property.location as any).address
                      : property.location ||
                        (property as any).address ||
                        "Address not specified"}
                  </p>
                </div>
              </div>

              {property.owner && (
                <div className="flex items-start space-x-3">
                  <HomeIcon className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Owner
                    </p>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {property.owner.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {property.owner.email}
                      </p>
                      {property.owner.phone_number && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {property.owner.phone_number}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {property.description && (
            <div className="mt-6 border-t border-gray-200 pt-6 dark:border-gray-700">
              <div className="flex items-start space-x-3">
                <InformationCircleIcon className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    Description
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {property.description}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Verification Checklist */}
      <Card>
        <div className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Verification Checklist
          </h3>
          <div className="space-y-3">
            {[
              "Property title and ownership documents verified",
              "Property location and address confirmed",
              "Property images match the actual property",
              "Property description is accurate",
              "Property price is reasonable for the area",
              "Property amenities are correctly listed",
              "No signs of fraud or misrepresentation",
              "Contact information is valid",
            ].map((item, index) => (
              <label key={index} className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {item}
                </span>
              </label>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};
