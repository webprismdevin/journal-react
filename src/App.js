import React, { Component } from 'react';
import Gun from 'gun';
import 'gun/sea';
import Home from './Components/Home';
import Login from './Components/Login';
import Logout from './Components/Logout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import 'draft-js/dist/Draft.css';


class App extends Component {
  constructor() {
  super();
    this.gun = Gun('https://p2p-journal-webprism.herokuapp.com/gun');
    window.gun = this.gun; //To have access to gun object in browser console

    this.user = this.gun.user().recall({sessionStorage: true});

    this.state = {
      authenticated: false
    }
  }

  componentDidMount(){
    console.log(this.user);
    if(this.user.is !== undefined) this.setAuth(true);
  }

  setAuth = (b) => {
    this.setState({authenticated: b})
  }

  render() {
    return (
      <div>
        {
        this.state.authenticated ? 
          <>
            <Logout user={this.user} setAuth={this.setAuth}/>
            <Home gun={this.gun} 
            user={this.user} 
            setAuth={this.setAuth}/> 
          </>
          : 
          <Login 
            setAuth={this.setAuth} 
            user={this.user}
            />
        }
        <ToastContainer />
      </div>
    );
  }
}

export default App;
