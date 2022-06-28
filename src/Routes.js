import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import viewsRoutes from 'views/routes';

const Routes = () => {
  return (
    <Switch>
      {viewsRoutes.map((item, i) => (
        <Route key={i} exact path={item.path} render={() => item.renderer()} />
      ))}
      <Redirect to={'/not-found-cover'} />
    </Switch>
  );
};

export default Routes;
