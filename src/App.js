import React from 'react';
import {
  ChakraProvider,
  theme,
} from '@chakra-ui/react';
import { Route, Switch } from 'react-router-dom';
import Login from './components/Auth/Login';
import { NonProtectedRoute } from './components/Auth/NonProtectedRoute';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';

import Main from './modules/Main';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Switch>
        <NonProtectedRoute exact path="/login" component={Login} />
        <Route path="/" component={Main} />
        {/* <ProtectedRoute path="/" component={Main} /> */}
        <Route path="*" component={() => "404 NOT FOUND"} />
      </Switch>
    </ChakraProvider>
  );
}

export default App;
