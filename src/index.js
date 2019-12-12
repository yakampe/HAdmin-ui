import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.css';
import {
    Link,
    Route,
    BrowserRouter as Router,
    NavLink,
    HashRouter
} from "react-router-dom";
import HomePage from './components/HomePage'
import Transactions from './components/Transactions'
import Bills from './components/Bills'
import NavBar from './components/NavBar'

const routing = (
    <Router>
        <div>
            <div>
                <NavBar/>


            </div>

            <main>
                <div className="container bg-white mt-5 mb-5 p-5 rounded shadow">
                    <Route exact path="/home" component={HomePage} />
                    <Route path="/transactions" component={Transactions} />
                    <Route path="/bills" component={Bills} />
                </div>
            </main>
        </div>
    </Router>
)


ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
