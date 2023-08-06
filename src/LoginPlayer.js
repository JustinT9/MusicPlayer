import { useState, useEffect } from 'react'; 
import './LoginPlayer.css'; 

function LoginPlayer() {
    return (
        <button className="spotifyLogin" href="/auth/login">
            Spotify Login
        </button>
    )
}

export default LoginPlayer; 