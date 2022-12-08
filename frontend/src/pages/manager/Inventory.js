import { useState, useEffect } from "react";
import axios from "axios";
import { url } from "../../config/global.js";
import { Link } from "react-router-dom";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import IconButton from "@mui/material/IconButton";
import InventoryDialog from "./InventoryDialog.js";
import { useLang } from "../../contexts/LanguageContext";
import { translateComponents } from "../../config/translate";
import { Box, Button, Stack } from "@mui/material";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";

/**
 * Component for table displaying inventory levels
 */
export default function Inventory() {
  const [data, setData] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [id, setId] = useState(0);

  let translated = false;

  const langInfo = useLang();
  
  const deleteIconStyling = {
    backgroundColor: "#FFD9D9",
    borderRadius: "5px",
  };

  useEffect(() => {
    const options = {
      method: "GET",
      url: `${url}/inventory`,
    };
    axios.request(options).then((res) => {
      let rows = res.data.rows;
      setData(rows);
    });
  }, []);


  /**
   * Handler for editing inventory entries
   * @param {*} dat Row to replace in the inventory
   */

  useEffect(() => {
    if (!translated && langInfo !== "en" && langInfo !== null) {
      translateComponents(langInfo);
      translated = true;
    }
  }, [data]);


  const handleEdit = (dat) => {
    setName(dat.name);
    setQuantity(dat.quantity);
    setId(dat.ingredient_id);
    setDialogOpen(true);
  };

  /**
   * Handler for removing inventory entries
   * @param {*} dat Row to remove from the inventory
   */
  const handleDelete = (dat) => {
    // FIXME: should delete "dat" from db
    // dat: int indgredient_id, string name, int quantity
    const options = {
      method: "GET",
      url: `${url}/invDelete`,
      params: { id: dat.ingredient_id },
    };
    axios.request(options).then((res) => {});
    setData(data.filter((d) => d.ingredient_id !== dat.ingredient_id));
  };

  /**
   * Closes popup for adding inventory items
   */
  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  /**
   * Handles adding inventory entries
   * @param {String} name Name for the inventory item
   * @param {Number} quantity Amount of item in inventory
   * @param {Number} id Numerical identifier for inventory item
   */
  const handleDialogUpdate = (name, quantity, id) => {
    // FIXME: update db with string name, string quantity
    console.log(name, parseInt(quantity));

    let options = {
      method: 'GET',
      url: `${url}/updateInventory`,
      params: {
        id: id,
        name: name,
        quantity: quantity
      }
    }
    axios.request(options).then((res) => {
      console.log('done')
    })

    setData(
      data.map((dat) => {
        if (dat.ingredient_id === id) {
          dat.name = name;
          dat.quantity = quantity;
        }
        return dat;
      })
    );

    setDialogOpen(false);
  };

  /**
   * Opens dialog box for adding inventory items
   */
  const handleAddDialogOpen = () => {
    setAddDialogOpen(true);
  };

  /**
   * Closes dialog box for adding inventory items
   */
  const handleAddDialogClose = () => {
    setAddDialogOpen(false);
  };

  /**
   * Handles adding a new inventory item to the inventory
   * @param {String} name Name for the inventory item
   * @param {Number} quantity Amount of item to add to inventory
   */
  const handleAddDialogUpdate = (name, quantity) => {
    console.log("Add item: ", name, quantity);

    const options = {
      method: "GET",
      url: `${url}/addInventory`,
      params: { name: name, quantity: quantity },
    };

    axios.request(options).then((res) => {
      const options2 = {
        method: "GET",
        url: `${url}/getInvID`,
        params: { name: name },
      };

      axios.request(options2).then((res2) => {
        console.log(res2.data.rows[0]);
        let d = [...data];
        d.push({
          name: name,
          quantity: quantity,
          ingredient_id: res2.data.rows[0].ingredient_id,
        });
        setData(d);
        setAddDialogOpen(false);
      });
    });
  };

  return (
    <>
      <Stack alignItems="center">
        <Box>
          <Stack spacing={2}>
            <TableContainer sx={{ maxHeight: "70vh" }} component={Paper}>
              <Table
                sx={{ minWidth: "sm", width: "80vw", maxWidth: "md" }}
                aria-label="inventory table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">id</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="center">Edit</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row) => (
                    <TableRow
                      key={row.name}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell align="right">{row.ingredient_id}</TableCell>
                      <TableCell align="right">{row.quantity}</TableCell>
                      <TableCell align="center">
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="center"
                          spacing={1}
                        >
                          <IconButton
                            sx={{
                              backgroundColor: "#D7E7FF",
                              borderRadius: "5px",
                            }}
                            onClick={() => handleEdit(row)}
                          >
                            <DriveFileRenameOutlineIcon
                              sx={{ color: "black" }}
                            />
                          </IconButton>
                          <IconButton
                            sx={deleteIconStyling}
                            onClick={() => handleDelete(row)}
                          >
                            <DeleteOutlineIcon
                              sx={{
                                color: "#D91111",
                                backgroundColor: "#FFD9D9",
                              }}
                            />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Stack direction="row" justifyContent="space-between">
              <Link to="/">
                <Button variant="outlined" color="secondary">
                  Back
                </Button>
              </Link>
              <Button variant="contained" onClick={handleAddDialogOpen}>
                Add Item
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
      <InventoryDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onUpdate={handleDialogUpdate}
        _name={name}
        _quantity={quantity}
        _id={id}
      />
      <InventoryDialog
        open={addDialogOpen}
        onClose={handleAddDialogClose}
        onUpdate={handleAddDialogUpdate}
        _name=""
        _quantity={0}
        _id={0}
      />
    </>
  );
}
