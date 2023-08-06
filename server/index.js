const express = require('express'); 
const dotenv = require('dotenv'); 

const port = 5000; 
const app = express();

dotenv.config(); 

var spotify_client_id = process.env.SPOTIFY_CLIENT_ID; 
var spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET;

const generateState = (length) => {
    let state = '';
    const keys = "ABCDEFGHIJKLOMNPQRSTUVWXYZabcdefghijklomnpqrstuvwxyz123456789!@#$%^&*()"; 

    for (let i = 0; i < length; i++) {
        state += keys[Math.floor(Math.random() * keys.length)];
    }

    return state 
}

// request authorization token 
app.get('/auth/login', (req, res) => {
    const uri = "http://localhost:3000/auth/callback"; 
    var scope = "streaming user-read-email user-read-private"; 

    var auth_query_parameters = new URLSearchParams({
        response_type: "code", 
        client_id: spotify_client_id, 
        scope: scope, 
        redirect_uri: uri, 
        state: generateState(16)
    })

    res.redirect('https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString()); 
}); 

// request access token 
app.get('/auth/callback', (req, res) => {
    var code = req.query.code; 
    var state = req.query.state; 

    var authOptions = {
        url: "https://account.spotify/api/token",
        form: {
            grant_type: "authorization_code", 
            code: code, 
            redirect_uri: "http://localhost:3000/auth/callback"
        }, 
        headers: {
            'Authorization': 'Basic ' + (Buffer.from(spotify_client_id + ":" + spotify_client_secret).toString('base64')), 
            'Content-Type' : 'application/x-www-form-urlencoded' 
        }, 
        json: true
    }


    request.post(authOptions, (error, res, body) => {
        if (!error && res.statusCode === 200) {
            var access_token = body.access_token 
            res.redirect('/'); 
        }
    })
});



app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
}); 