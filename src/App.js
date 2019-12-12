import React, { Component } from 'react';
import {
  Route,
  NavLink,
  HashRouter
} from "react-router-dom";

import BillList from './HAdmin/BillList';
import TransactionList from './HAdmin/TransactionList';
import HomePage from './views/HomePage';

class Main extends Component {

  render() {
    return (
      <HashRouter>

      <div className="container">
        
        <div class="w-100">

          <nav class="navbar navbar-expand-lg navbar-light">
            <NavLink class="navbar-brand" href="#">Navbar</NavLink>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
              <ul class="navbar-nav">
                <li class="nav-item">
                  <NavLink class="nav-link" to="/">Home</NavLink>
                </li>
                <li class="nav-item">
                  <NavLink class="nav-link" to="/transactions">Transactions</NavLink>
                </li>
                <li class="nav-item">
                  <NavLink class="nav-link" to="/bills">Bills</NavLink>
                </li>
              </ul>
            </div>
          </nav>
        </div>
        <div>
            <Route exact path="/" component={HomePage}/>
            <Route path="/transactions" component={TransactionList}/>
            <Route path="/bills" component={BillList}/>
        </div>

      </div>
      </HashRouter>
    );
  }

}

export default Main;
