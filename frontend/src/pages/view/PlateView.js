import { useState, useEffect } from "react";
import { Button, Divider, Stack } from "@mui/material";
import SelectButtons from "../../components/SelectButtons/SelectButtons";
import axios from "axios";
import { url } from "../../config/global.js";
import "../../styles/master.scss";
import { OutlinedButton } from "../../styles/StyledButtons";
import { useLang } from "../../contexts/LanguageContext";
import { translateComponents } from "../../config/translate";
import { CenterWrapper } from "../../styles/CenterWrapper";

/**
 * handles the entree type selected from the given inputs
 * @param {*} entreeData
 * @param {*} handleEntreeSelect  
 * @returns sets the button to the selected item, adjusting to it accordingly
 */

function EntreeSelection({ entreeData, handleEntreeSelect }) {
  const secStyle = {
    margin: "40px 0",
  };
  return (
    <div style={secStyle}>
      <h2>Entrees</h2>
      <div>
        <SelectButtons items={entreeData} handleSelect={handleEntreeSelect} />
      </div>
    </div>
  );
}

// user will either be "cashier" or "client"
/**
 * Defines the plate view of the user, that deals witht the view of the plate page
 * @param {*} handleView
 * @param {*} view
 * @param {*} addItem
 * @returns returns the plate view from the view types inputs given.
 */
export default function PlateView({ handleView, view, addItem }) {
  // NOTE: Data MUST have keys: id : int, selected : bool, and name : string
  const [sideData, setSideData] = useState([]);
  const [entreeData, setEntreeData] = useState([]);
  const [entreeData2, setEntreeData2] = useState([]);
  const [entreeData3, setEntreeData3] = useState([]);
  const [appetizerData, setAppetizerData] = useState([]);

  const langInfo = useLang();
  let translated = false;

  /**
   * Gets the title depending on the view var
   * @returns returns the view type of the plate menu
   */
  const getTitle = () => {
    if (view === 1) return "Bowl";
    else if (view === 2) return "Plate";
    else if (view === 3) return "Bigger Plate";
    else if (view === -1) return "Appetizer";
    else return "Error";
  };
  /**
   * returns extracted group depending on the rows and num given
   * @param {*} rows 
   * @param {*} num 
   * @returns a list of groups
   */
  function extractGroups(rows, num) {
    let groups = { Entree: [], Side: [], Appetizer: [] };
    rows.forEach((el) => {
      let item = Object.assign({}, el);
      item.key = item.id + num * 1000;
      groups[item.category].push(item);
    });
    return groups;
  }

  useEffect(() => {
    let options = {
      method: "GET",
      url: `${url}/items`,
    };
    axios.request(options).then((res) => {
      let data = res.data.rows;
      setSideData(extractGroups(data, 0).Side);
      setEntreeData(extractGroups(data, 0).Entree);
      setEntreeData2(extractGroups(data, 1).Entree);
      setEntreeData3(extractGroups(data, 2).Entree);

      // FIXME: setAppetizerData()
      setAppetizerData(extractGroups(data, 3).Appetizer)
    });

    // [ {string name, int id,}]
  }, []);

  /**
   * handles the side selection depending on the id number
   * @param {*} id 
   * @returns none, but sets the side data
   */


  useEffect(() => {
    if (!translated && langInfo !== "en" && langInfo !== null) {
      translateComponents(langInfo);
      translated = true;
    }
  }, [entreeData3]);


  const handleSideSelect = (id) => {
    const updatedData = sideData.map((item) => {
      item.selected = item.id === id;
      return item;
    });
    setSideData(updatedData);
  };

  /**
   * handles the entree selection depending on id
   * @param {*} id 
   * @return none, but updates the data
   */

  const handleAppetizerSelect = (id) => {
    const updatedData = appetizerData.map((item) => {
      item.selected = item.key === id;
      return item;
    });
    setAppetizerData(updatedData);
  };


  const handleEntreeSelect = (id) => {
    const updatedData = entreeData.map((item) => {
      item.selected = item.key === id;
      return item;
    });
    setEntreeData(updatedData);
  };
  /**
   * handles the entree second selection
   * @param {*} id 
   * @returns none, but handles the entrees second data
   */
  const handleEntreeSelect2 = (id) => {
    const updatedData = entreeData2.map((item) => {
      item.selected = item.key === id;
      return item;
    });
    setEntreeData2(updatedData);
  };
  /**
   * handles the third entree selection
   * @param {*} id 
   * @returns none, but handles the entree selection 3
   */
  const handleEntreeSelect3 = (id) => {
    const updatedData = entreeData3.map((item) => {
      item.selected = item.key === id;
      return item;
    });
    setEntreeData3(updatedData);
  };

  const getSelectedItems = (dat) => {
    for (let i = 0; i < dat.length; i++) {
      if (dat[i].selected) return dat[i];
    }
  };

  const handleAddBtn = () => {
    handleView(0);

    let selectedItems = [];
    view === -1 && selectedItems.push(getSelectedItems(appetizerData));
    view >= 1 && selectedItems.push(getSelectedItems(sideData));
    view >= 1 && selectedItems.push(getSelectedItems(entreeData));
    view >= 2 && selectedItems.push(getSelectedItems(entreeData2));
    view >= 3 && selectedItems.push(getSelectedItems(entreeData3));

    addItem(getTitle(), selectedItems);
  };

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>{getTitle()}</h1>
      <Divider />
      <Stack spacing={5}>
        {view === -1 && (
          <div>
            <div>
              <h2>Appetizer</h2>
              <div>
                <SelectButtons
                  items={appetizerData}
                  handleSelect={handleAppetizerSelect}
                />
              </div>
            </div>
          </div>
        )}
        {view >= 1 && (
          <>
            <div>
              <div>
                <h2>Sides</h2>
              </div>
              <div>
                <SelectButtons
                  items={sideData}
                  handleSelect={handleSideSelect}
                />
              </div>
            </div>

            <div>
              <EntreeSelection
                entreeData={entreeData}
                handleEntreeSelect={handleEntreeSelect}
              />
            </div>
          </>
        )}
        <div>
          {view >= 2 && (
            <EntreeSelection
              entreeData={entreeData2}
              handleEntreeSelect={handleEntreeSelect2}
            />
          )}
        </div>
        <div>
          {view >= 3 && (
            <EntreeSelection
              entreeData={entreeData3}
              handleEntreeSelect={handleEntreeSelect3}
            />
          )}
        </div>
        <Stack direction="row" spacing={2} sx={{ paddingBottom: "50px" }}>
          <Button onClick={() => handleView(0)} variant="outlined" size="large">
            Cancel
          </Button>
          <Button variant="contained" onClick={handleAddBtn} size="large">
            Add
          </Button>
        </Stack>
      </Stack>
    </div>
  );
}
