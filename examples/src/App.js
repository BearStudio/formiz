import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import {
  ThemeProvider, CSSReset, Box, Stack,
} from '@chakra-ui/core';

import theme from './theme';
import { NavBar } from './layout/NavBar';
import { AutoForm } from './pages/AutoForm';
import { Wizard } from './pages/Wizard';
import { Repeater } from './pages/Repeater';
import { LotOfFields } from './pages/LotOfFields';
import { UseCase1 } from './pages/UseCase1/index';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CSSReset />
        <Stack minH="100vh" m="auto" overflow="hidden" flexDirection={{ base: 'column', lg: 'row' }}>
          <NavBar />
          <Box flex="1" w="100%" position="relative">
            <Route path="/" exact>
              <AutoForm />
            </Route>
            <Route path="/wizard" exact>
              <Wizard />
            </Route>
            <Route path="/repeater" exact>
              <Repeater />
            </Route>
            <Route path="/lot-of-fields" exact>
              <LotOfFields />
            </Route>
            <Route path="/real-life-1" exact>
              <UseCase1 />
            </Route>
          </Box>
        </Stack>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
