import { Card, Stack } from "@mui/material";
import axios from "axios";
import { url } from "../../config/global.js";

/**
 * Summary card of the items ordered by the user from a item
 * @param {*} item 
 * @returns Card component for the item ordered
 */

export default function SummaryCard({ item }) {

  const ingrStyle = {
    marginLeft: "4ch"
  }

  // FIXME: Remove hard-code, Replace w/ querry
  var prices = {
    "Bowl": "6.40",
    "Plate": "7.90",
    "Bigger Plate": "9.40",
    "Appetizer": "1.90",
    "Drink": "0.00",
  };

  return (
    <Card variant="outlined">
      <h5>
        <Stack>
          <div>
            <u>{item.size}</u>: ${prices[item.size]}
          </div>
          {item.items.map((data) => (
            <div style={ingrStyle} key={data.id}>
              <i>{data.name}</i>
            </div>
          ))}
        </Stack>
      </h5>
    </Card>
  );
}
