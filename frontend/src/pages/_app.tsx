// global da aplicação
import "../../styles/globals.scss";
import { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { DataGrid, ptBR } from "@mui/x-data-grid";

import { AuthProvider } from "../contexts/AuthContext";

const activeLabelStyles = {
  transform: "scale(0.85) translateY(-24px)"
};
export const theme = extendTheme({
  components: {
    Form: {
      variants: {
        floating: {
          container: {
            _focusWithin: {
              label: {
                ...activeLabelStyles
              }
            },
            "input:not(:placeholder-shown) + label, .chakra-select__wrapper + label, textarea:not(:placeholder-shown) ~ label": {
              ...activeLabelStyles
            },
            label: {
              top: 0,
              left: 0,
              zIndex: 2,
              position: "absolute",
              backgroundColor: "white",
              pointerEvents: "none",
              mx: 3,
              px: 1,
              my: 2,
              transformOrigin: "left top"
            }
          }
        }
      }
    }
  }
});

const themeMui = createTheme(
  {
    palette: {
      primary: { main: '#1976d2' },
    },
  },
  ptBR,
);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ChakraProvider theme={theme}>
      <ThemeProvider theme={themeMui}>
        <Component {...pageProps} />
        <ToastContainer limit={5} autoClose={3000} />
        </ThemeProvider>
      </ChakraProvider>
    </AuthProvider>
  );
}

export default MyApp;
