import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

class NavBar extends Component {

    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">

                    <div className="navbar-nav">
                        <NavLink to={`/home`} activeClassName="active" className="nav-item nav-link">Home</NavLink>
                        <NavLink to={`/transactions`} activeClassName="active" className="nav-item nav-link">Transactions</NavLink>
                        <NavLink to={`/bills`} activeClassName="active" className="nav-item nav-link">Bills</NavLink>
                    </div>
            </nav>

        )
    }

}

export default NavBar;