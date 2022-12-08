import { useState, useEffect } from "react";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import dayjs from "dayjs";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { url } from "../../config/global";
import axios from "axios";
import { useLang } from "../../contexts/LanguageContext";
import { translateComponents } from "../../config/translate";
import { Stack, Box } from "@mui/material";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";

/**
 * Renders a date-time selector
 * @param {Dayjs} value Date-Time object
 * @param {Function} handleChange Handler for input change
 * @param {String} labelName Label identifying specific time selector
 * @returns HTML for date-time selector
 */
function MaterialUIDateTimeSelect({ value, handleChange, labelName }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        label={labelName}
        value={value}
        onChange={handleChange}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
}

/**
 * Renders the reports tab
 * @returns HTML for rendering the reports tab
 */
export default function Reports() {
  // Variables for timestamps
  const [salesStartTime, setSalesStartTime] = useState(
    dayjs("2022-11-01T12:00:00")
  );
  const [salesEndTime, setSalesEndTime] = useState(
    dayjs("2022-11-01T12:00:00")
  );
  const [excessTime, setExcessTime] = useState(dayjs("2022-11-01T12:00:00"));
  const [sellsTogetherStartTime, setSellsTogetherStartTime] = useState(
    dayjs("2022-11-01T12:00:00")
  );
  const [sellsTogetherEndTime, setSellsTogetherEndTime] = useState(
    dayjs("2022-11-01T12:00:00")
  );

  const [salesData, setSalesData] = useState([]);
  const [excessData, setExcessData] = useState([]);
  const [restockData, setRestockData] = useState([]);
  const [sellsTogetherData, setSellsTogetherData] = useState([]);

  const langInfo = useLang();

  // Update restock table on page load
  useEffect(() => {
    const options = {
      method: "GET",
      url: `${url}/restockReport`,
    };
    axios.request(options).then((res) => {
      let rows = res.data.rows;
      setRestockData(rows);

      if (langInfo !== "en" && langInfo !== null) {
        translateComponents(langInfo);
      }
    });
  }, []);

  useEffect(() => {
    if (langInfo !== "en" && langInfo !== null) {
      translateComponents(langInfo);
    }
  }, [salesData, excessData, restockData, sellsTogetherData]);

  /**
   * Converts javascript timestamp to Postgresql timestamp
   * @param {Dayjs} time Javascript input from date-time picker
   * @returns 
   */
  function formatTimestamp(time) {
    let output = time.toISOString().replace("T", " ").slice(0, -5);
    return output;
  }

  /**
   * Formats decimals for report view
   * @param {Number} decimal Decimal representing a percent
   * @returns A formatted percentage
   */
  function formatPercent(decimal) {
    return Number(decimal).toLocaleString(undefined, {
      style: "percent",
      minimumFractionDigits: 3,
    });
  }

  /**
   * Gets sales data between 2 time stamps
   * @param {Dayjs} startTime Javascript timestamp to start at
   * @param {Dayjs} endTime Javascript timestamp to end at
   */
  function getSalesQuery(startTime, endTime) {
    const options = {
      method: "GET",
      url: `${url}/salesReport`,
      params: {
        start: formatTimestamp(startTime),
        end: formatTimestamp(endTime),
      },
    };

    axios.request(options).then((res) => {
      let rows = res.data.rows;
      setSalesData(rows);
    });
  }

  /**
   * Gets excess data from a starting time
   * @param {Dayjs} startTime Starting timestamp
   */
  function getExcessQuery(startTime) {
    const options = {
      method: "GET",
      url: `${url}/excessReport`,
      params: {
        start: formatTimestamp(startTime),
      },
    };

    axios.request(options).then((res) => {
      let rows = res.data.rows;
      setExcessData(rows);
    });
  }

  /**
   * Gets sells together data between 2 timestamps
   * @param {Dayjs} startTime Timestamp to start at
   * @param {Dayjs} endTime Timestamp to end at
   */
  function getSellsTogetherQuery(startTime, endTime) {
    const options = {
      method: "GET",
      url: `${url}/sellsTogetherReport`,
      params: {
        start: formatTimestamp(startTime),
        end: formatTimestamp(endTime),
      },
    };

    axios.request(options).then((res) => {
      let rows = res.data.rows;
      setSellsTogetherData(rows);
    });
  }

  /**
   * Handler for changing sales report start time
   * @param {Dayjs} newValue Timestamp to change to
   */
  const handleSalesStartChange = (newValue) => {
    setSalesStartTime(newValue);
    getSalesQuery(newValue, salesEndTime);
  };

  /**
   * Handler for changing sales report end time
   * @param {Dayjs} newValue Timestamp to change to
   */
  const handleSalesEndChange = (newValue) => {
    setSalesEndTime(newValue);
    getSalesQuery(salesStartTime, newValue);
  };

  /**
   * Handler for changing excess report start time
   * @param {Dayjs} newValue Timestamp to change to
   */
  const handleExcessChange = (newValue) => {
    setExcessTime(newValue);
    getExcessQuery(newValue);
  };

  /**
   * Handler for changing sales together report start time
   * @param {Dayjs} newValue Timestamp to change to
   */
  const handleTogetherStartChange = (newValue) => {
    setSellsTogetherStartTime(newValue);
    getSellsTogetherQuery(newValue, sellsTogetherEndTime);
  };

  /**
   * Handler for changing sales together report end time
   * @param {Dayjs} newValue Timestamp to change to
   */
  const handleTogetherEndChange = (newValue) => {
    setSellsTogetherEndTime(newValue);
    getSellsTogetherQuery(sellsTogetherStartTime, newValue);
  };

  return (
    <div>
      <Stack alignItems="center">
        <Box sx={{ minWidth: "sm", width: "80vw", maxWidth: "md" }}>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Sales</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <MaterialUIDateTimeSelect
                value={salesStartTime}
                handleChange={handleSalesStartChange}
                labelName={"Start Time"}
              />
              <MaterialUIDateTimeSelect
                value={salesEndTime}
                handleChange={handleSalesEndChange}
                labelName={"End Time"}
              />
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Item Name</TableCell>
                      <TableCell align="right">Amount Sold</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {salesData.map((row) => (
                      <TableRow
                        key={row.name}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {row.name}
                        </TableCell>
                        <TableCell align="right">{row.amount_sold}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography>Excess</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <MaterialUIDateTimeSelect
                value={excessTime}
                handleChange={handleExcessChange}
                labelName={"Start Time"}
              />
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Item Name</TableCell>
                      <TableCell align="right">Ingredient Name</TableCell>
                      <TableCell align="right">Percent Sold</TableCell>
                      <TableCell align="right">Amount Sold</TableCell>
                      <TableCell align="right">Total Quantity</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {excessData.map((row) => (
                      <TableRow
                        key={row.name}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {row.item_name}
                        </TableCell>
                        <TableCell align="right">
                          {row.ingredient_name}
                        </TableCell>
                        <TableCell align="right">
                          {formatPercent(row.percent_sold)}
                        </TableCell>
                        <TableCell align="right">{row.amount_sold}</TableCell>
                        <TableCell align="right">
                          {row.total_quantity}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography>Restock</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Item Name</TableCell>
                      <TableCell align="right">Current Amount</TableCell>
                      <TableCell align="right">Sold in Last 7 Days</TableCell>
                      <TableCell align="right">Recommended Resupply</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {restockData.map((row) => (
                      <TableRow
                        key={row.name}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {row.name}
                        </TableCell>
                        <TableCell align="right">
                          {row.current_amount}
                        </TableCell>
                        <TableCell align="right">
                          {row.last_7_days_sales}
                        </TableCell>
                        <TableCell align="right">
                          {row.recommended_resupply}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography>Sells Together</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <MaterialUIDateTimeSelect
                value={sellsTogetherStartTime}
                handleChange={handleTogetherStartChange}
                labelName={"Start Time"}
              />
              <MaterialUIDateTimeSelect
                value={sellsTogetherEndTime}
                handleChange={handleTogetherEndChange}
                labelName={"End Time"}
              />
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>First Item</TableCell>
                      <TableCell align="right">Second Item</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sellsTogetherData.map((row) => (
                      <TableRow
                        key={row.name}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {row.this_name}
                        </TableCell>
                        <TableCell align="right">{row.other_name}</TableCell>
                        <TableCell align="right">{row.count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>

          <Link to="/">
            <Button
              variant="outlined"
              color="secondary"
              sx={{ marginTop: "10px" }}
            >
              Back
            </Button>
          </Link>
        </Box>
      </Stack>
    </div>
  );
}
