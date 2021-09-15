/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import Logout from './Logout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCode } from '@fortawesome/free-solid-svg-icons'


class NavBar extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            burgerActive: false
        }

        this.user = this.props.user;
        this.setAuth = this.props.setAuth;
    }
    handleNavBar = () => {
        this.setState({
            burgerActive: !this.state.burgerActive
        })
    }

    render() {
        return(
            <nav className="navbar is-fixed-top" role="navigation" aria-label="main navigation">
                <div className="navbar-brand">
                    <a className="navbar-item" href="">
                        <h1 className="title">Journal</h1>
                    </a>
                    <a role="button" onClick={this.handleNavBar} className={`navbar-burger ${this.state.burgerActive && 'is-active'}`} aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                    </a>
                </div>
                <div id="navbarBasicExample" className={`navbar-menu ${this.state.burgerActive && 'is-active'}`}>   
                    <div class="navbar-start">
                        <a class="navbar-item" href="https://github.com/webprismdevin/web3-journal">
                            <FontAwesomeIcon icon={faCode} style={{marginRight: 6, display: this.state.burgerActive ? 'inline' : 'none'}}/>
                            <span>Source Code</span>
                        </a>
                    </div>
                    <div className="navbar-end">
                        <div className="navbar-item">
                            <div className="buttons">
                                {this.user.is && <Logout user={this.user} setAuth={this.setAuth} />}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        )
    }
}

export default NavBar;