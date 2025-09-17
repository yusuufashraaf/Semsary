import React from 'react';
import { SavedSearch } from '../../types';
import SavedSearchItem from './SavedSearchItem';
import './SavedSearches.css'; // You'll need to create this CSS file

interface SavedSearchesProps {
  searches: SavedSearch[];
  onToggle: (id: number) => void;
}

const SavedSearches: React.FC<SavedSearchesProps> = ({ searches, onToggle }) => {
  return (
    <div className="sidebar">
      <h2 className="section-title">Saved Searches</h2>
      {searches.map(search => (
        <SavedSearchItem 
          key={search.id} 
          search={search} 
          onToggle={onToggle}
        />
      ))}
    </div>
  );
};

export default SavedSearches;