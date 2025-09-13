import React from 'react';
import { SavedSearch } from '../../types';
import './SavedSearchItem.css'; // You'll need to create this CSS file

interface SavedSearchItemProps {
  search: SavedSearch;
  onToggle: (id: number) => void;
}

const SavedSearchItem: React.FC<SavedSearchItemProps> = ({ search, onToggle }) => {
  return (
    <div className="search-item">
      <input 
        type="checkbox" 
        className="search-checkbox" 
        checked={search.checked}
        onChange={() => onToggle(search.id)}
      />
      <div className="search-info" style={{ opacity: search.checked ? 1 : 0.6 }}>
        <h3 className="search-title">{search.title}</h3>
        <p className="search-location">{search.location}</p>
      </div>
    </div>
  );
};

export default SavedSearchItem;