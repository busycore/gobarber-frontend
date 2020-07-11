import React from 'react';
import { Switch } from 'react-router-dom';

import SignIn from '../pages/Signin';
import SignUp from '../pages/Signup';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import Dashboard from '../pages/Dashboard';
import Route from './Route';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={SignIn} />
    <Route path="/dashboard" component={Dashboard} isPrivate />
    <Route path="/signup" component={SignUp} />
    <Route path="/forgot-password" component={ForgotPassword} />
    <Route path="/reset-password" component={ResetPassword} />
  </Switch>
);

export default Routes;
