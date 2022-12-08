import { useState } from "react";
import { Button, Tabs, Tab, Box } from "@mui/material";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Typography from "@mui/material/Typography";
import Inventory from "./Inventory";
import MyMenu from "./MyMenu";
import Reports from "./Reports";
import Access from "./Access";
import "../../styles/master.scss";
import { OutlinedButton } from "../../styles/StyledButtons";
import AppBar from "@mui/material/AppBar";

/**
 * Component for rendering the manager tab
 * @returns HTML for manager tab
 */
export default function Driver() {
  const [tabValue, setTabValue] = useState(0);
  const handleTabChange = (e, newTabVal) => {
    setTabValue(newTabVal);
  };

  /**
   * Creates naviagation tab for manager views
   * @param {*} props 
   * @returns HTML for navigation tab
   */
  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  const tabStyle = {
    boxShadow: "none",
  };

  return (
    <div>
      <Header name={"Manager"} />
      <div className="content">
        <Box sx={{ width: "100%", marginTop: "-25px" }}>
          <AppBar position="static" color="info" style={tabStyle}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              textColor="primary"
              variant="fullWidth"
            >
              <Tab label="Inventory" />
              <Tab label="Menu" />
              <Tab label="Reports" />
              <Tab label="Access" />
            </Tabs>
          </AppBar>
          <TabPanel value={tabValue} index={0}>
            <Inventory />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <MyMenu />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <Reports />
          </TabPanel>
          <TabPanel value={tabValue} index={3}>
            <Access />
          </TabPanel>
        </Box>
      </div>
    </div>
  );
}
