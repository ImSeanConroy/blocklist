import React from "react";
import "./ListItem.css"

const ListItem = ({
  index,
  item,
  selectedItem,
  onClick,
}: {
  index: number;
  item: string;
  selectedItem: string | null;
  onClick: () => void;
}) => {
  return (
    <li
      key={index}
      onClick={onClick}
      className={"list_item" + (selectedItem === item ? " selected" : "")}
    >
      <img
        src={`https://www.google.com/s2/favicons?domain=${item}&size=24`}
        alt="Favicon"
      />
      {item}
    </li>
  );
};

export default ListItem;