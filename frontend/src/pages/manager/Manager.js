import { useState } from "react";
import { Button, Tabs, Tab, Box } from "@mui/material";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Typography from "@mui/material/Typography";
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
      <Header name={"manager"} />;
      <div>
        <Box sx={{ width: "100%" }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Item One" />
            <Tab label="Item TWO" />
            <Tab label="Item three" />
          </Tabs>
          <TabPanel value={tabValue} index={0}>
            Item one
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            Item two
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            Item three
          </TabPanel>
        </Box>
      </div>
      <Link to="/">
        <Button variant="outlined">Back</Button>
      </Link>
    </div>
  );
}
