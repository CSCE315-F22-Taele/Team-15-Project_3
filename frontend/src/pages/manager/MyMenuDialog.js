import React, { useState, useEffect } from "react";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import {
  Autocomplete,
  Box,
  Chip,
  CircularProgress,
  IconButton,
  InputAdornment,
  ToggleButtonGroup,
  ToggleButton,
  Snackbar,
  Alert,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Stack } from "@mui/system";
import axios from "axios";
import { url } from "../../config/global.js";

// FIXME: should be removed after async stuff gets done
function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

const dummyData = [
  { name: "kung pao", id: 1 },
  { name: "chicken", id: 2 },
  { name: "friend", id: 3 },
  { name: "yohoo", id: 5 },
];

export default function MyMenuDialog({ open, onClose, onAddMenuItem }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0.0);
  const [type, setType] = useState("Entree");
  const [quantity, setQuantity] = useState(10);
  const [ingredients, setIngredients] = useState([]);
  const [openIngrList, setOpenIngrList] = useState(false);
  const [currIngr, setCurrIngr] = useState(null); // keep track of ingredient in auto complete box
  const [selectedIngrs, setSelectedIngrs] = useState([]);
  const [count, setCount] = useState(0);
  const [error, setError] = useState(false);
  const loading = openIngrList && ingredients.length === 0;

  useEffect(() => {
    //let active = true;

    if (!loading) return undefined;

    (async () => {
      // await sleep(1e3); // should be replaced by actual async stuff

      // if (active) {
      //   setIngredients([...dummyData]);
      // }

      const options = {
        method: "GET",
        url: `${url}/inventory`,
      };
      axios.request(options).then((res) => {
        console.log(res.data.rows);
        let rows = res.data.rows;
        setIngredients(rows);
      });
    })();

    // return () => {
    //   active = false;
    // };
  }, [loading]);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleQuantityChange = (e) => {
    if (isNaN(e.target.value)) return;
    setQuantity(e.target.value);
  };

  const handlePriceChange = (e) => {
    if (isNaN(e.target.value)) return;
    setPrice(e.target.value);
  };

  const handleType = (event, newType) => {
    console.log("new type", newType);
    setType(newType);
  };

  const handleClose = () => {
    setName("");
    setQuantity(10);
    setCurrIngr(null);
    setSelectedIngrs([]);
    setCount(0);

    onClose();
  };

  const handleErrorClose = () => setError(false);

  const handleAdd = () => {
    if (name === "" || selectedIngrs.length === 0) {
      setError(true);
      return;
    }

    let existingIngrs = [];
    let newIngrs = [];

    selectedIngrs.forEach((ingr) => {
      if (ingr.id < 0) newIngrs.push(ingr);
      else existingIngrs.push(ingr);
    });

    console.log(name); // name of menu item
    console.log(existingIngrs); // [] of ingredients already in db
    console.log(newIngrs); // [] of ingredients that need to be added to db
    console.log(price); // price
    console.log("Type", type); // string: 'appetizer' / 'entree' / 'dessert'

    onAddMenuItem(name, selectedIngrs, price, type);
    handleClose();
  };

  const handleDeleteSelectedIngr = (ingrToDelete) => {
    console.log("deleting", ingrToDelete);
    setSelectedIngrs((ingredients) =>
      ingredients.filter((i) => ingrToDelete.id !== i.id)
    );
  };

  const handleAddIngr = (e, newVal) => {
    if (newVal === null) return;

    let newIngr = newVal;

    if (typeof newIngr === "string") {
      let newId = count - 1;
      setCount(count - 1);
      newIngr = { name: newIngr, id: newId };
    }

    if (!selectedIngrs.includes(newIngr)) {
      newIngr["amount"] = quantity;
      console.log(newIngr);
      setSelectedIngrs([...selectedIngrs, newIngr]);
    }
    setCurrIngr({ name: "" });
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        keepMounted
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add Menu Item</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3}>
            <TextField
              id="outlined-basic"
              label="Name"
              variant="outlined"
              value={name}
              onChange={handleNameChange}
            />

            <Stack direction="row" spacing={3} alignItems="center">
              <TextField
                variant="outlined"
                label="price"
                value={price}
                onChange={handlePriceChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
              />
              <ToggleButtonGroup
                value={type}
                exclusive
                onChange={handleType}
                aria-label="drink type"
                color="primary"
              >
                <ToggleButton value="Appetizer">
                  <Box sx={{ fontWeight: "bold" }}>Appetizer</Box>
                </ToggleButton>
                <ToggleButton value="Side">
                  <Box sx={{ fontWeight: "bold", minWidth: "8ch" }}>Side</Box>
                </ToggleButton>
                <ToggleButton value="Entree">
                  <Box sx={{ fontWeight: "bold" }}>Entree</Box>
                </ToggleButton>
                <ToggleButton value="Dessert">
                  <Box sx={{ fontWeight: "bold" }}>Dessert</Box>
                </ToggleButton>
              </ToggleButtonGroup>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <TextField
                variant="outlined"
                label="quantity"
                value={quantity}
                onChange={handleQuantityChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">oz</InputAdornment>
                  ),
                }}
              />
              <Autocomplete
                id="choose-ingredients"
                fullWidth
                open={openIngrList}
                onOpen={() => {
                  setOpenIngrList(true);
                }}
                onClose={() => {
                  setOpenIngrList(false);
                }}
                isOptionEqualToValue={(option, value) =>
                  option.name === value.name
                }
                getOptionLabel={(option) => option.name}
                options={ingredients}
                loading={loading}
                autoHighlight
                value={currIngr}
                onChange={handleAddIngr}
                freeSolo
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Ingredients"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {loading ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </React.Fragment>
                      ),
                    }}
                  />
                )}
              />
            </Stack>
            <Stack direction="row" spacing={1}>
              {selectedIngrs.map((ingr) => (
                <Chip
                  key={ingr.id}
                  label={`${ingr.amount} oz ${ingr.name}`}
                  onDelete={() => handleDeleteSelectedIngr(ingr)}
                />
              ))}
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={handleAdd} disabled={error}>
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={error} autoHideDuration={6000} onClose={handleErrorClose}>
        <Alert severity="error">
          Please make sure to fill out all the fields, including name, and
          ingredients
        </Alert>
      </Snackbar>
    </>
  );
}
