import React, { useState } from 'react';
import { toast } from 'react-toastify';


const Login = (props) => {
    const [user, setUser] = useState("");
    const [pass, setPass] = useState("");

    const handleAuth = (e) => {
        if(e !== undefined) e.preventDefault();
        console.log("submitted");

        props.user.auth(user, pass, (res) => {
            if(res.err === "Wrong user or password.") handleBadAuth(res);
            
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
        <form onSubmit={e => handleAuth(e)}>
            <input type="text" value={user} onChange={e => setUser(e.target.value)} placeholder="Enter your username" />
            <input type="text" value={pass} onChange={e => setPass(e.target.value)} placeholder="Enter your password" /> 
            <input type="submit" value="Submit" />
            <input type="button" value="Sign Up" onClick={handleSignUp}/>
        </form>
    )
}

export default Login