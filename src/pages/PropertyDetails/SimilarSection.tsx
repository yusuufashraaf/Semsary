import React from "react";
import Loader from "@components/common/Loader/Loader";
import SimilarPropertyCard from "@components/PropertyDetails/SimilarPropertyCard";
import { SimilarPropertyCardProps } from "src/types";
import { SimilarProps } from "src/types";

/**
 * SimilarSection
 *
 * Renders a list of similar properties in a responsive grid.
 * - Shows a loader while data is being fetched
 * - Maps through the properties and renders a card for each one
 * - Uses `React.memo` to avoid unnecessary re-renders
 */
const SimilarSection: React.FC<SimilarProps> = ({ properties, loading }) => {
  // If data is still loading, show a loader
  if (loading) {
    return (
      <div className="col-12">
        <Loader message="Loading similar properties..." />
      </div>
    );
  }

  // Otherwise, render the grid of similar properties
  return (
    <>
      {properties.map((sp) => (
        <div key={sp.id} className="col-md-4 mb-3">
          {/* Casting `sp` to match the expected prop type of SimilarPropertyCard */}
          <SimilarPropertyCard
            property={sp as SimilarPropertyCardProps["property"]}
          />
        </div>
      ))}
    </>
  );
};

// Memoize the component to prevent re-renders when props don’t change
export default React.memo(SimilarSection);
