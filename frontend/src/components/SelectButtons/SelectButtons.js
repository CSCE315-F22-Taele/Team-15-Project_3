import SelectButton from "./SelectButton";
/**
 * Selects the buttons and returns such buttons
 * @param {*} items 
 * @param {*} handleSelect
 * @returns Selected button of the parameters
 */
export default function SelectButtons({ items, handleSelect }) {
  return (
    <div>
      {items.map((item) => (
        <SelectButton key={item.key} item={item} handleSelect={handleSelect} />
      ))}
    </div>
  );
}
