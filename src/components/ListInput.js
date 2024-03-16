import React from 'react';

const ListInput = ({ items, setItems }) => {
  const handleItemChange = (index, text) => {
    const newItems = [...items];
    newItems[index].text = text;
    setItems(newItems);
    if (index === items.length - 1) {
      setItems([...newItems, { id: Date.now(), text: '', checked: false }]);
    }
  };

  const handleItemCheck = (index, checked) => {
    const newItems = [...items];
    newItems[index].checked = checked;
    setItems(newItems);
  };

  return (
    <>
      {items.map((item, index) => (
        <div key={item.id} className="d-flex mb-2 align-items-center">
          <input
            className="form-check-input me-2"
            type="checkbox"
            checked={item.checked}
            onChange={(e) => handleItemCheck(index, e.target.checked)}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Añade un ítem..."
            value={item.text}
            onChange={(e) => handleItemChange(index, e.target.value)}
          />
        </div>
      ))}
    </>
  );
};

export default ListInput;
