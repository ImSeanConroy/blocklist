import React from 'react';
import { useState, useEffect } from "react";
import "./App.css";
import ListItem from "./ListItem";
import Menu from "./Menu";

function App() {
  const [inputValue, setInputValue] = useState<string>("");
  const [items, setItems] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // This function will add the blocked site to the list of items
  const addElementToList = (site: string) => {
    setItems((prevItems) => [...prevItems, site]);
  };

  // Load blocked sites from chrome.storage.sync when the component mounts
  useEffect(() => {
    chrome.storage.sync.get(["sites"]).then((result) => {
      const blockedSites = result.sites || {};

      // Iterate over the keys of the blockedSites object
      Object.keys(blockedSites).forEach((site) => {
        addElementToList(site);
      });
    });
  }, []);

  const handleSubmit = () => {
    const site = inputValue.trim();
    if (site) {
      chrome.storage.sync.get(["sites"]).then((result) => {
        const blockedSites = result.sites || {};

        // Check if the site is already blocked
        if (!blockedSites.hasOwnProperty(site)) {
          blockedSites[site] = { startHour: 9, endHour: 17 };

          // Save the updated blockedSites object
          chrome.storage.sync.set({ sites: blockedSites }).then(() => {
            setItems([...items, inputValue.trim()]);
          });
        }
      });
      setInputValue("");
    }
  };

  // Handle clicking a list item
  const handleItemClick = (item: string) => {
    setSelectedItem(item); // Set the clicked item as the selected item]
    setIsSidebarOpen(true); // Show the sidebar
  };

  // Close the sidebar
  const closeMenu = () => {
    setIsSidebarOpen(false);
    setSelectedItem(null);
  };

  return (
    <>
      <div className="card">
        <h2>Block List</h2>
        <p className="text">Block sites perminately or by a schedule.</p>
        <div className="test">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type something"
          />
          <button onClick={handleSubmit}>Block</button>
        </div>
        <ul>
          {items.map((item, index) => (
            <ListItem
              key={index}
              index={index}
              item={item}
              selectedItem={selectedItem}
              onClick={() => handleItemClick(item)}
            />
          ))}
        </ul>
      </div>

      {isSidebarOpen && selectedItem && (
        <Menu selectedItem={selectedItem} closeMenu={closeMenu} />
      )}
    </>
  );
}

export default App;
