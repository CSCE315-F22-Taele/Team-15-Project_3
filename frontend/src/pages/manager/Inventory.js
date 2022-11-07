import { useState, useEffect } from "react";
import axios from "axios";
import { url } from "../../config/global.js";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

export default function Inventory() {
  const [data, setData] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [id, setId] = useState(0);
  const [errorText, setErrorText] = useState("");

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

  const handleEdit = (dat) => {
    setName(dat.name);
    setQuantity(dat.quantity);
    setId(dat.ingredient_id);
    setDialogOpen(true);
  };

  const handleDelete = (dat) => {
    // FIXME: should delete "dat" from db
    // dat: int indgredient_id, string name, int quantity
    const options = {
      method: "GET",
      url: `${url}/invDelete`,
      params: {id:dat.ingredient_id}
    };
    axios.request(options).then((res) => {
      
    });

    setData(data.filter((d) => d.ingredient_id !== dat.ingredient_id));
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  const handleDialogClose = () => {
    setErrorText("");
    setDialogOpen(false);
  };

  // FIXME: update db with new dat
  const handleDialogUpdate = () => {
    if (isNaN(quantity)) {
      // if quantity is not a number
      setErrorText("Please enter a number for the quanity");
    } else {
      // FIXME: update db with string name, string quantity
      console.log(name, parseInt(quantity));

      console.log("THE ID", id);
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
    }
  };
  return (
    <div>
      <TableContainer sx={{ maxHeight: 340 }} component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
                  <IconButton onClick={() => handleEdit(row)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(row)}>
                    <DeleteOutlineIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={dialogOpen} onClose={handleDialogClose} keepMounted>
        <DialogTitle>Update Item</DialogTitle>
        <DialogContent dividers>
          <div>
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
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleDialogUpdate}>Update</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
