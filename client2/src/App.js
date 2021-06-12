import React from 'react';
import {
    Route,
    BrowserRouter as Router,
    Switch,
} from "react-router-dom";
import Home from './components/Home';
import Player from './components/Player';
import Upload from './components/Upload';
import './App.css';

function App() {
    return (
        <Router>
            <Switch>
            <Route exact path="/" component={Home}></Route>
            <Route path="/player/:id/:fileId" component={Player}></Route>
            <Route path="/upload" component={Upload}></Route>
            </Switch>
        </Router>
    );
}
export default App;
