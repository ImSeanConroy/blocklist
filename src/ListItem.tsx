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
      className={selectedItem === item ? "selected" : ""}
    >
      <img
        src={`https://www.google.com/s2/favicons?domain=${item}&size=24`}
        alt="Favicon"
        style={{ width: "24px", height: "24px", marginRight: "8px" }}
      />
      {item}
    </li>
  );
};

export default ListItem;
