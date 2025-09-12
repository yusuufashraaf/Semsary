import React, { useState } from 'react';
import PropertyList from './PropertyList';
import SavedSearches from './SavedSearches';
import { Property, SavedSearch } from '../../types';
import './HomeFinderPage.css'; // You'll need to create this CSS file
import ProfileHeader from './ProfileHeader';

const HomeFinderPage: React.FC = () => {
  const [savedHomes, setSavedHomes] = useState<Property[]>([
  { 
    id: 1, 
    address: "789 Elm Street, Anytown, CA", 
    price: "$950,000", 
    saved: true,
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80" 
  },
  { 
    id: 2, 
    address: "1011 Birch Road, Anytown, CA", 
    price: "$1,100,000", 
    saved: true,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80" 
  },
  { 
    id: 3, 
    address: "1213 Cedar Court, Anytown, CA", 
    price: "$750,000", 
    saved: true,
    image: "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=784&q=80" 
  }
]);

const [recentlyViewed, setRecentlyViewed] = useState<Property[]>([
  { 
    id: 4, 
    address: "123 Maple Street, Anytown, CA", 
    price: "$1,200,000", 
    saved: false,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80" 
  },
  { 
    id: 5, 
    address: "456 Oak Avenue, Anytown, CA", 
    price: "$850,000", 
    saved: false,
    image: "https://images.unsplash.com/photo-1600566753052-dc67f2a2e241?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80" 
  },
  { 
    id: 6, 
    address: "789 Pine Lane, Anytown, CA", 
    price: "$1,500,000", 
    saved: false,
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=853&q=80" 
  }
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
      
      // If saving, add to saved homes
      const homeToSave = recentlyViewed.find(home => home.id === id);
      if (homeToSave && !homeToSave.saved) {
        setSavedHomes([...savedHomes, { ...homeToSave, saved: true }]);
      }
    } else {
      // Remove from saved homes
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
    <div className="homefinder-container">
      <div className="main-content">
        <div className="sidebar">
          <h2 className="section-title">Saved Searches</h2>
          <ProfileHeader />
        </div>
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