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

    // these are the necessary parameters for the request direct 
    var auth_query_parameters = new URLSearchParams({
        response_type: "code", 
        client_id: spotify_client_id, 
        scope: scope, 
        redirect_uri: uri, 
        state: generateState(16)
    })

    // returns a code and state for the next request for the access token 
    res.redirect('https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString()); 
}); 

// request access token with the response from the authorization token  
app.get('/auth/callback', (req, res) => {
    // from the previous request 
    var code = req.query.code; 

    // parameters needed for the access token request 
    var authOptions = {
        url: "https://account.spotify/api/token",
        form: {
            code: code, 
            redirect_uri: "http://localhost:3000/auth/callback",
            grant_type: "authorization_code"
        }, 
        headers: {
            'Authorization': 'Basic ' + (Buffer.from(spotify_client_id + ":" + spotify_client_secret).toString('base64')), 
            'Content-Type' : 'application/x-www-form-urlencoded'
        }, 
        json: true
    }

    // on response it will return the access token and you can direct to the root 
    request.post(authOptions, (error, res, body) => {
        if (!error && res.statusCode === 200) {
            var access_token = body.access_token 
            res.redirect('/'); 
        }
    })
});

// returns access token from the request as json to the /auth/token endpoint 
// which will allow us to start the music player and make API calls and retrieve important data 
app.get('/auth/token', (req, res) => {
    res.json({ access_token: access_token })
})

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
}); 