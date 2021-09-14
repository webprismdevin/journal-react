import React from 'react';

const Logout = (props) => {

    const handleLogout = () => {
        props.user.leave();
        props.setAuth(false);
    }

    return(
        <input type="button" value="logout" onClick={handleLogout} />
    )
}

export default Logout;