import React, { useState } from 'react';
import PropertyList from './PropertyList';
import SavedSearches from './SavedSearches';
import { Property, SavedSearch } from '../../types';

const HomeFinderPage: React.FC = () => {
  const [savedHomes, setSavedHomes] = useState<Property[]>([
    { 
      id: 1, 
      address: "789 Elm Street, Anytown, CA", 
      price: "$950,000", 
      saved: true,
      image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80" 
    },
    // ... other properties
  ]);

  const [recentlyViewed, setRecentlyViewed] = useState<Property[]>([
    { 
      id: 4, 
      address: "123 Maple Street, Anytown, CA", 
      price: "$1,200,000", 
      saved: false,
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80" 
    },
    // ... other properties
  ]);

  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([
    { id: 1, title: "Houses in Anytown", location: "Anytown, CA", checked: true },
    { id: 2, title: "Apartments in Anytown", location: "Anytown, CA", checked: true },
    { id: 3, title: "Condos in Anytown", location: "Anytown, CA", checked: true }
  ]);

  const handleSaveHome = (id: number, section: string) => {
    if (section === 'recentlyViewed') {
      const updatedHomes = recentlyViewed.map(home => 
        home.id === id ? { ...home, saved: !home.saved } : home
      );
      setRecentlyViewed(updatedHomes);
      
      const homeToSave = recentlyViewed.find(home => home.id === id);
      if (homeToSave && !homeToSave.saved) {
        setSavedHomes([...savedHomes, { ...homeToSave, saved: true }]);
      }
    } else {
      const updatedHomes = savedHomes.filter(home => home.id !== id);
      setSavedHomes(updatedHomes);
    }
  };

  const handleSearchToggle = (id: number) => {
    const updatedSearches = savedSearches.map(search => 
      search.id === id ? { ...search, checked: !search.checked } : search
    );
    setSavedSearches(updatedSearches);
  };

  return (
    <div className="container">
      <div className="main-content">
        <div className="content">
          <PropertyList 
            title="Recently Viewed"
            properties={recentlyViewed}
            onSave={handleSaveHome}
            section="recentlyViewed"
          />
          <PropertyList 
            title="Saved Homes"
            properties={savedHomes}
            onSave={handleSaveHome}
            section="savedHomes"
          />
          <SavedSearches 
            searches={savedSearches}
            onToggle={handleSearchToggle}
          />
        </div>
      </div>
    </div>
  );
};

export default HomeFinderPage;