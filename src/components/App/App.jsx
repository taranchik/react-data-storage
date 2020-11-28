import './App.css';
import React from "react";
import Home from '../Home/Home.jsx'
import DataInformation from '../DataInformation/DataInformation.jsx'
import { BrowserRouter as Router, Link, Switch, Route, Redirect } from "react-router-dom";


const App = () => {
    return (
        <Router>
            <Redirect to="/home/" />

            <ul>
                <li>
                    <Link to="/home">Home Page</Link>
                </li>
                <li>
                    <Link to="/data-information">Data information</Link>
                </li>
            </ul>
            <hr />

            <Switch>
                <Route path="/home">
                    <Home />
                </Route>
                <Route path="/data-information">
                    <DataInformation />
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
