import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        mode: "dark",
        background: {
          default: "#101827",
          paper: "#101827",
        },
        primary: {
          main: "#2eb486",
        },
        secondary: {
          main: "#2eb486",
        },
        text: {
          primary: "#fcfcfc",
          secondary: "#fcfcfc",
        },
      },
  typography: {
    fontFamily: "Verdana, sans-serif",
  },
});

export default theme;
