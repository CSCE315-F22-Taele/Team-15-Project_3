import { useState } from "react";
import { Button, Stack } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Summary from "../components/Summary/Summary";
import axios from "axios";
import { url } from "../config/global";
import { translateComponents } from "../config/translate";
import { CenterWrapper } from "../styles/CenterWrapper";
/**
 * Exports the checkout functionality page depending on the user
 * @param {*} user 
 * @returns a page containing the relevant checkout information to the user
 */
export default function Checkout({ user }) {
  const location = useLocation();
  const [summaryData, setSummaryData] = useState([
    ...location.state.summaryData,
  ]);

  // FIXME: should send summary to database to order;
  // [int, string, []] summaryData: [
  //    int id (randomKey),
  //    string size ("Bowl", "Plate", or "Bigger Plate"),
  //    [string, bool, int] items : [
  //      {string name, bool selected, int id},
  //    ],
  //]
  /**
   * handles the order to the user and updates the database as such
   */
  const handleOrder = () => {
    let options = {
      method: "GET",
      url: `${url}/placeOrder`,
      params: { data: summaryData },
    };

    axios
      .request(options)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //returns the header and wrapper for the page checkout depending on user
  return (
    <div>
      <Header name={`${user} Checkout`} />
      <CenterWrapper>
        <Stack spacing={2}>
          <div>
            <Summary data={location.state.summaryData} />
          </div>
          <Stack spacing={2} direction="row">
            <Link to={`/${user}`}>
              <Button variant="outlined">Cancel</Button>
            </Link>
            <Link to={`/${user}`}>
              <Button variant="contained" onClick={handleOrder}>
                Order
              </Button>
            </Link>
          </Stack>
        </Stack>
      </CenterWrapper>
    </div>
  );
}
