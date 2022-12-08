import { useState, useEffect } from "react";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Stack } from "@mui/material";


/**
 * Popup dialog box for changing inventory
 * @param {Function} open Handler for opening dialog box
 * @param {Function} onClose Handler for closing dialog box
 * @param {Function} onUpdate Handler for updating inventory
 * @param {String} _name Current name of item ("" If new item)
 * @param {Number} _quantity Current quantity of item (0 if new item)
 * @param {Number} _id Current id of item (0 if new item)
 * @returns HTML for dialog menu for inventory changes
 */

import { useLang } from "../../contexts/LanguageContext";
import { translateComponents } from "../../config/translate";


export default function InventoryDialog({
  open,
  onClose,
  onUpdate,
  _name,
  _quantity,
  _id,
}) {
  const [name, setName] = useState(_name);
  const [quantity, setQuantity] = useState(_quantity);
  const [errorText, setErrorText] = useState("");


  /**
   * Handler for name changes
   * @param {Event} e Event causing change
   */

  const langInfo = useLang();

  useEffect(() => {
    if (langInfo !== "en" && langInfo !== null) {
      translateComponents(langInfo);
    }
  }, [])


  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  /**
   * Handler for quantity changes
   * @param {Event} e Event causing change 
   */
  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  /**
   * Handler for updating inventory
   */
  const handleUpdate = () => {
    if (isNaN(quantity)) {
      // if quantity is not a number
      setErrorText("Please enter a number for the quanity");
    } else {
      setErrorText("");
      onUpdate(name, quantity, _id);
    }
  };

  /**
   * Handles closing the dialog box
   */
  const handleClose = () => {
    setErrorText("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} keepMounted>
      <DialogTitle>Update Item</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <div>
            <TextField
              id="outlined-basic"
              label="Name"
              variant="outlined"
              value={name}
              onChange={handleNameChange}
            />
          </div>
          <div>
            <TextField
              id="outlined-basic"
              label="Quantity"
              variant="outlined"
              value={quantity}
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              onChange={handleQuantityChange}
              error={Boolean(errorText.length)}
              helperText={errorText}
            />
          </div>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleUpdate}>Update</Button>
      </DialogActions>
    </Dialog>
  );
}
