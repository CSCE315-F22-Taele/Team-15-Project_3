import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { url } from "../../config/global";
import axios from "axios";
import { Button, Stack } from "@mui/material";
import MyMenuDialog from "./MyMenuDialog";
import { useLang } from "../../contexts/LanguageContext";
import { translateComponents } from "../../config/translate";
import { Link } from "react-router-dom";

function createData(name, id, price, type, ingredients) {
  return { name, id, price, type, ingredients: [...ingredients] };
}

function createIngrData(name, id, amount) {
  return { name, id, amount };
}

function Row({ row, handleDelete }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell align="right">{row.price}</TableCell>
        <TableCell align="right">{row.type}</TableCell>
        <TableCell align="center">
          <IconButton
            sx={{
              backgroundColor: "#FFD9D9",
              borderRadius: "5px",
            }}
            onClick={() => handleDelete(row.id)}
          >
            <DeleteOutlineIcon
              sx={{
                color: "#D91111",
                backgroundColor: "#FFD9D9",
              }}
            />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Ingredients
              </Typography>
              <ul>
                {row.ingredients.map((ingr) => (
                  <li key={ingr.id}>
                    {ingr.name}: {ingr.amount} oz{" "}
                  </li>
                ))}
              </ul>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function MyMenu() {
  const [data, setData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  const langInfo = useLang();

  let translated = false;

  const handleOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  // FIXME: delete int id from database
  function handleDelete(id) {
    console.log(id);
    
    let options = {
      method: "GET",
      url: `${url}/deleteMenuItem`,
      params: {
        id: id
      }
    }

    axios.request(options).then((res) => {
      setData(data.filter((d) => d.id !== id));
    })

    //setData(data.filter((d) => d.id !== id));
  }

  const addMenuItem = (newName, newIngredients, newPrice, newType) => {
    console.log("ADDING...");
    console.log(newName);
    console.log(newIngredients);
    console.log(newType);
    
    // Get the menu id from the database
    let options = {
      method: "GET",
      url: `${url}/getMenuID`,
      params: {
        name: newName
      }
    }

    axios.request(options).then((res) => {
      console.log("New menu ID: ", res.data.rows[0].id);
      let d = createData(newName, res.data.rows[0].id, newPrice, newType, newIngredients);
      setData([...data, d]);
    })

    // let d = createData(newName, -1, newPrice, newType, newIngredients);
    // setData([...data, d]);
  };

  useEffect(() => {
    let options = {
      method: "GET",
      url: `${url}/itemIngredients`,
    };
    axios.request(options).then((res) => {
      let data = res.data.rows;
      let items = {};
      for (let i = 0; i < data.length; i++) {
        let item = data[i];
        if (!(item.item in items)) {
          // if the item does not exist in items dictionary
          items[item.item] = createData(
            item.item,
            item.id,
            item.extra_price,
            item.category,
            [
              createIngrData(
                item.ingredient_name,
                item.ingredient_id,
                item.amount
              ),
            ]
          ); // create item
        } else {
          // if it already is in item
          items[item.item].ingredients.push(
            createIngrData(
              item.ingredient_name,
              item.ingredient_id,
              item.amount
            )
          );
        }
      }
      items = Object.keys(items).map((key) => {
        return items[key];
      });
      setData(items);

      if (langInfo !== "en" && langInfo !== null) {
        translateComponents(langInfo);
      }
    });
  }, []);

  useEffect(() => {
    if (!translated && langInfo !== "en" && langInfo !== null) {
      translateComponents(langInfo);
      translated = true;
    }
  }, [data]);

  return (
    <div>
      <Stack alignItems="center">
        <Stack spacing={2}>
          <TableContainer component={Paper} sx={{ maxHeight: "70vh" }}>
            <Table
              sx={{ minWidth: "sm", width: "80vw", maxWidth: "md" }}
              aria-label="collapsible table"
            >
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Type</TableCell>
                  <TableCell align="center">Edit</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row) => (
                  <Row key={row.id} row={row} handleDelete={handleDelete} />
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
            <Button variant="contained" onClick={handleOpen}>
              Add Item
            </Button>
          </Stack>
        </Stack>
      </Stack>
      <MyMenuDialog
        open={openDialog}
        onClose={handleClose}
        onAddMenuItem={addMenuItem}
      />
    </div>
  );
}
