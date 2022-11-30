import { useState } from "react";
import { Button, Tabs, Tab, Box } from "@mui/material";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Typography from "@mui/material/Typography";
import Inventory from "./Inventory";
import MyMenu from "./MyMenu";
import Reports from "./Reports";
import UserPerm from "./UserPerm";
import "../../styles/master.scss";
import { OutlinedButton } from "../../styles/StyledButtons";
export default function Driver() {
  const [tabValue, setTabValue] = useState(0);
  const handleTabChange = (e, newTabVal) => {
    setTabValue(newTabVal);
  };

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

  return (
    <div>
      <Header name={"manager"} />
      <div className="content">
        <Box sx={{ width: "100%" }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Inventory" />
            <Tab label="Menu" />
            <Tab label="Reports" />
            <Tab label="Users" />
          </Tabs>
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
            <UserPerm />
          </TabPanel>
        </Box>
      </div>
      <Link to="/">
        <OutlinedButton>Back</OutlinedButton>
      </Link>
    </div>
  );
}
