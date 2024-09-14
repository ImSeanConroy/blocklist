import { useState, useEffect } from "react";

const Menu = ({
  selectedItem,
  closeMenu,
}: {
  selectedItem: string;
  closeMenu: () => void;
}) => {
  const [startTime, setStartTime] = useState<string>("9");
  const [endTime, setEndTime] = useState<string>("17");

  useEffect(() => {
    chrome.storage.sync.get(["sites"]).then((result) => {
      const blockedSites = result.sites || {};

      if (blockedSites.hasOwnProperty(selectedItem)) {
        setStartTime(blockedSites[selectedItem].startHour);
        setEndTime(blockedSites[selectedItem].endHour);
      }
    });
  }, []);

  const handleSubmit = () => {
    const startHour = parseInt(startTime);
    const endHour = parseInt(endTime);

    if (
      isNaN(startHour) ||
      isNaN(endHour) ||
      startHour < 0 ||
      startHour > 23 ||
      endHour < 0 ||
      endHour > 23
    ) {
      console.log("Invalid input for start or end hour.");
      return;
    }

    chrome.storage.sync.get(["sites"]).then((result) => {
      var blockedSites = result.sites || {};

      if (blockedSites.hasOwnProperty(selectedItem)) {
        blockedSites[selectedItem] = { startHour, endHour };
        chrome.storage.sync.set({ sites: blockedSites });
      }

      closeMenu()
    });
  };

  return (
    <div
      className="card-sm"
      style={{ display: "flex", flexDirection: "column" }}
    >
      <h2>Set up Blocking Schedule</h2>
      <p className="text" style={{ paddingBottom: "16px" }}>
        Blocked between the following times:
      </p>
      <div className="row">
        <input
          className="small"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          type="number"
          min="0"
          max="23"
        />
        <p>to</p>
        <input
          className="small"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          type="number"
          min="0"
          max="23"
        />
      </div>
      <div className="row">
        <button style={{ flexGrow: 1 }} onClick={() => closeMenu()}>
          Cancel
        </button>
        <button style={{ flexGrow: 1 }} onClick={() => handleSubmit()}>
          Set Schedule
        </button>
      </div>
    </div>
  );
};

export default Menu;
