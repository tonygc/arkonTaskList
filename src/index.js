import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Redirect} from 'react-router-dom';
import App from './components/tasks-list/container';
import { Container as TaskForm } from './components/task/container';
import { Container as Chart } from './components/chart/container';
import { TaskListProvider } from "./components/context";

ReactDOM.render(
  <TaskListProvider>
    <Router>
      {/**
       * Router para listado de tareas
       */}
      <Route path="/tarea/lista" exact render={props=><App {...props} />}/>
      {/**
        * Router para mantenimiento de tareas
        */}
      <Route path="/tarea" exact render={props=><TaskForm {...props} />}/>
      {/**
       * Router para gráfica de tareas
       */}
      <Route path="/tarea/grafica" exact render={props=><Chart {...props} />}/>
      {/**
       * Redireccinar a listado de tareas si la url es root|
       */}
      <Route exact path="/">
          <Redirect to="/tarea/lista" />
      </Route>
    </Router>
  </TaskListProvider>
    ,
  document.getElementById('root')
);