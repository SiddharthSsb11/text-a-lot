import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from '@chakra-ui/react';


ReactDOM.render(
  <BrowserRouter> 
    <ChakraProvider > 
      <App /> 
    </ChakraProvider> 
  </BrowserRouter>, document.getElementById('root')
);
