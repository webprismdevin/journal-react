import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Welcome from './Welcome';


const Login = (props) => {
    const [user, setUser] = useState("");
    const [pass, setPass] = useState("");

    const handleAuth = (e) => {
        if(e !== undefined) e.preventDefault();

        props.user.auth(user, pass, (res) => {
            // console.log(res)
            if(res.err === "Wrong user or password.") {
                handleBadAuth(res);

                return;
            }
            
            props.setAuth(true)
        })
    }

    const handleBadAuth = () => {
        toast("Incorrect user/pass combo. Have you already created an account?")
    }

    const handleSignUp = () => {
        props.user.create(user, pass, () => {
            this.handleAuth();
        });
    }

    return(
        <section className="section">
            <div className="container">
                <form onSubmit={e => handleAuth(e)} className="columns">
                    <div className="column">
                        <div className="columns">
                            <div className="column">
                                <input className="input" type="text" value={user} onChange={e => setUser(e.target.value)} placeholder="Enter your username"/>
                            </div>
                            <div className="column">
                                <input className="input" type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="Enter your password"/>
                            </div>
                        </div>
                    </div>
                    <div className="column">
                        <input type="submit" value="Submit" className="button is-primary" style={{marginRight: 32}}/>
                        <input type="button" value="Sign Up" onClick={handleSignUp} className="button is-info"/>
                    </div>
                </form>
                <Welcome />
            </div>
        </section>
    )
}

export default Login