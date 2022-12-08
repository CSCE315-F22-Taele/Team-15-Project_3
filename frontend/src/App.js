import "./styles/App.scss";
import "./App.css";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/landing/Landing";
import Cashier from "./pages/cashier/Cashier";
import Driver from "./pages/driver/Driver";
import Manager from "./pages/manager/Manager";
import Customer from "./pages/customer/Customer";
import PlateView from "./pages/view/PlateView";
import Checkout from "./pages/Checkout";
import { UserInfoProvider } from "./contexts/UserContext";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { LangProvider } from "./contexts/LanguageContext";

/**
 * Runs the web application, connecting all of the pages
 */
function App() {
  const theme = createTheme({
    palette: {
      background: {
        default: "#dbdbdb",
      },
      primary: {
        main: "#003077",
      },
      secondary: {
        main: "#373737",
        dark: "#262525",
        ligth: "#181717"
      },
      info: {
        main: "#F3F3F3",
      },
      icon: {
        main: "#D7E7FF",
        secondary: "#FFD9D9",
      },
    },
  });

  return (
    <UserInfoProvider>
      <LangProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/cashier" element={<Cashier />} />
              <Route path="/driver" element={<Driver />} />
              <Route path="/manager" element={<Manager />} />
              <Route path="/customer" element={<Customer />} />
              <Route
                path="/cashier/plate"
                element={<PlateView user={"cashier"} />}
              />
              <Route
                path="/customer/plate"
                element={<PlateView user={"customer"} />}
              />
              <Route
                path="/customer/checkout"
                element={<Checkout user={"Customer"} />}
              />
              <Route
                path="/cashier/checkout"
                element={<Checkout user={"Cashier"} />}
              />
            </Routes>
          </Router>
        </ThemeProvider>
      </LangProvider>
    </UserInfoProvider>
  );
}

export default App;
