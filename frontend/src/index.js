import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from '@chakra-ui/react';

/* import { extendTheme } from "@chakra-ui/react"

// 2. Call `extendTheme` and pass your custom values
const theme = extendTheme({
  colors: {
    brand: {
      100: "#f7fafc",
      // ...
      900: "#1a202c",
    },
  },
})
 */

ReactDOM.render(
  <BrowserRouter> 
    <ChakraProvider > 
      <App /> 
    </ChakraProvider> 
  </BrowserRouter>, document.getElementById('root')
);
