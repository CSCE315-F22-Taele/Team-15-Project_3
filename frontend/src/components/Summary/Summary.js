import { useEffect } from "react";
import SummaryCard from "./SummaryCard";
import { useLang } from "../../contexts/LanguageContext";
import { translateComponents } from "../../config/translate";

/**
 * Summary of the data given
 * @param {*} data 
 * @returns Summary card of the data
 */
export default function Summary({ data }) {
  const langInfo = useLang();

  useEffect(() => {
    if (langInfo !== "en" && langInfo !== null) {
      translateComponents(langInfo);
    }
  }, []);

  if (data.length !== 0) {
    return (
      <div>
        <h3> Summary: </h3>
        {data.map((item) => (
          <SummaryCard item={item} key={item.id} />
        ))}
      </div>
    );
  } else {
    return (
      <div>
        <h3> Summary:</h3>
        <div>No items in cart</div>
      </div>
    );
  }
}
