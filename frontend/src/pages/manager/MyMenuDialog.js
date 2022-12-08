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

import { url } from "../../config/global.js";
import axios from "axios";
import { useLang } from "../../contexts/LanguageContext";
import { translateComponents } from "../../config/translate";

// const dummyData = [
//   { name: "kung pao", id: 1 },
//   { name: "chicken", id: 2 },
//   { name: "friend", id: 3 },
//   { name: "yohoo", id: 5 },
// ];

/**
 * Renders dialog for menu interactions
 * @param {Function} open Handler for opening dialog menu
 * @param {Function} onClose Handler for closing dialog menu
 * @param {Function} on AddMenuItem Handler for adding menu item
 * @returns 
 */
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

  const langInfo = useLang();

  useEffect(() => {
    //let active = true;

    if (!loading) return undefined;

    (async () => {
      const options = {
        method: "GET",
        url: `${url}/inventory`,
      };

      axios.request(options).then((res) => {
        console.log(res.data.rows);
        let ingreds = [];

        res.data.rows.forEach((val) => {
          let newVal = {
            name: val.name,
            id: val.ingredient_id,
          };

          ingreds.push(newVal);
        });

        console.log(ingreds);

        setIngredients(ingreds);

        if (langInfo !== "en" && langInfo !== null) {
          translateComponents(langInfo);
        }
      });

      // if (active) {
      //   setIngredients([...dummyData]);
      // }
    })();

    // return () => {
    //   active = false;
    // };
  }, [loading]);


  /**
   * Handler for name changes
   * @param {Event} e Event causing name change
   */
  useEffect(() => {
    if (langInfo !== "en" && langInfo !== null) {
      translateComponents(langInfo);
    }
  }, []);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  /**
   * Handler for quantity changes
   * @param {Event} e Event causing quantity change
   * @returns 
   */
  const handleQuantityChange = (e) => {
    if (isNaN(e.target.value)) return;
    setQuantity(e.target.value);
  };

  /**
   * Handler for price changes
   * @param {Event} e Event causing price change
   * @returns 
   */
  const handlePriceChange = (e) => {
    if (isNaN(e.target.value)) return;
    setPrice(e.target.value);
  };

  /**
   * Handler for type interactions
   * @param {Event} event Event causing type change
   * @param {String} newType Type to change to
   */
  const handleType = (event, newType) => {
    if (newType !== null) {
      console.log("new type", newType);
      setType(newType);
    }
  };

  /**
   * Handler for closing dialog menu
   */
  const handleClose = () => {
    setName("");
    setQuantity(10);
    setCurrIngr(null);
    setSelectedIngrs([]);
    setCount(0);

    onClose();
  };

  /**
   * Handler for errors on close
   */
  const handleErrorClose = () => setError(false);

  /**
   * Handler for adding menu items
   */
  const handleAdd = () => {
    if (name === "" || selectedIngrs.length === 0) {
      setError(true);
      return;
    }

    let existingIngrs = [];
    let newIngrs = [];

    selectedIngrs.forEach((ingr, index) => {
      if (ingr.id < 0) newIngrs.push(ingr);
      else existingIngrs.push(ingr);
    });

    if (newIngrs.length !== 0) {
      // Add new ingredients to inventory
      let options = {
        method: "GET",
        url: `${url}/addInventory`,
        params: { name: "", quantity: 0 },
      };

      let countIngredAdded = 0;

      selectedIngrs.forEach((ingr, index) => {
        if (ingr.id < 0) {
          options.params.name = ingr.name;
          console.log("Adding new ingredient: ", ingr);

          axios.request(options).then((res) => {
            countIngredAdded++;

            console.log(
              "Added ingredient: ",
              ingr.name,
              " with ID: ",
              selectedIngrs[index].id
            );

            // Can continue on
            if (countIngredAdded === newIngrs.length) {
              console.log(name); // name of menu item
              console.log(existingIngrs); // [] of ingredients already in db
              console.log(newIngrs); // [] of ingredients that need to be added to db
              console.log(price); // price
              console.log("Type", type); // string: 'appetizer' / 'entree' / 'dessert'

              // Add menu item to database
              let options2 = {
                method: "GET",
                url: `${url}/addMenuItem`,
                params: {
                  name: name,
                  category: type,
                  price: price,
                  ingredients: selectedIngrs,
                },
              };

              axios.request(options2).then((res) => {
                onAddMenuItem(name, selectedIngrs, price, type);
                handleClose();
              });
            }
          });
        }
      });
    } else {
      // All ingredients already exist in the database
      console.log(name); // name of menu item
      console.log(existingIngrs); // [] of ingredients already in db
      console.log(newIngrs); // [] of ingredients that need to be added to db
      console.log(price); // price
      console.log("Type", type); // string: 'appetizer' / 'entree' / 'dessert'

      // Add menu item to database
      let options = {
        method: "GET",
        url: `${url}/addMenuItem`,
        params: {
          name: name,
          category: type,
          price: price,
          ingredients: selectedIngrs,
        },
      };

      axios.request(options).then((res) => {
        onAddMenuItem(name, selectedIngrs, price, type);
        handleClose();
      });
    }
  };

  /**
   * Handler for deleting selectied ingredients
   * @param {*} ingrToDelete Ingredient object to remove
   */
  const handleDeleteSelectedIngr = (ingrToDelete) => {
    console.log("deleting", ingrToDelete);
    setSelectedIngrs((ingredients) =>
      ingredients.filter((i) => ingrToDelete.id !== i.id)
    );
  };

  /**
   * Handler for adding ingredients
   * @param {Event} e Event causing the addition of ingredients
   * @param {*} newVal New ingredient
   * @returns 
   */
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
                getOptionLabel={(option) => option.name || ""}
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
