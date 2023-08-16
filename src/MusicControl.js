import { useState, useEffect } from 'react'; 
import { LinearProgress } from '@mui/material';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import './MusicControl.css'

function MusicControl({ token }) {
    const [player, setPlayer] = useState(null); 
    const [track, setTrack] = useState(null); 
    const [state, setState] = useState(false); 
    const [paused, setPaused] = useState(false); 
    const [position, setPosition] = useState(0); 
    const [duration, setDuration] = useState(0); 
    const [currentTime, setCurrentTime] = useState(0); 
    const [WebPlaybackPlayer, setWebPlaybackPlayer] = useState(null);

    useEffect(() => {
        const script = document.createElement("script"); 
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true; 

        document.body.appendChild(script); 

        window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new window.Spotify.Player({
                name: 'Web Playback SDK Quick Start Player', 
                getOAuthToken: cb => { cb(token); }, 
                volume: 0.5 
            }); 

            setPlayer(player); 

            player.addListener('ready', ({ device_id }) => {
                console.log("Ready with Device ID", device_id); 
            })

            player.addListener('not_ready', ({ device_id }) => {
                console.log("Device ID is not ready for playback", device_id); 
            })

            player.addListener('initialization_error', ({ message }) => {
                console.error("Failed to initialize", message); 
            })

            player.addListener('authentication_error', ({ message }) => {
                console.error("Authentication failed", message); 
            })

            player.addListener('account_error', ({ message }) => {
                console.error("Account error", message); 
            })

            player.addListener('player_state_changed', (state => {
                if (!state) return; 
                
                setTrack(state.track_window.current_track); 
                setPaused(state.paused); 
                setPosition(state.position/1000);
                setDuration(state.duration); 
                setWebPlaybackPlayer(state);

                player.getCurrentState().then(state => {
                    state ? setState(true) : setState(false) 
                });
            }));

            player.connect();

        };
    }, []);

    useEffect(() => {
        const progression = setInterval(() => {

            if (track && !paused) {  
                setPosition(position + 1); 
                console.log(position); 
            }
        }, 1000)

        return () => {
            clearInterval(progression)
        }

    }, [track, position, WebPlaybackPlayer, currentTime])

    if (!state) {
        return (
            <>
                Play on Spotify
            </>
        )
    } else {    
        return (
            <>  
                <div className='MusicPlayer'> 
                    <div className='trackDisplay'>
                        <img 
                            className="trackImage" 
                            src={track.album.images[0].url} />

                            {track.name} <br/>
                            {track.artists[0].name}
                    </div>

                    <div className='progressContainer'>
                        <LinearProgress 
                            className='trackProgress'
                            variant='determinate' 
                            value={position}
                        />
                    </div>
                    

                    <div className='playbackControl'> 
                        <SkipPreviousIcon 
                            className='playbackElement' 
                            sx={{fontSize: 35}}
                            onClick={() => {player.previousTrack()}}
                        />

                        {paused ?
                            <PlayArrowIcon 
                                className='playbackElement'
                                sx={{fontSize: 35}}
                                onClick={() => {player.togglePlay()}}
                            /> :
                            <PauseIcon 
                                className='playbackElement'
                                sx={{fontSize: 35}}
                                onClick={() => {player.togglePlay()}}
                            />
                        }
                        
    
                        <SkipNextIcon 
                            className='playbackElement' 
                            sx={{fontSize: 35}}
                            onClick={() => {player.nextTrack()}}
                        />
                    </div>
                </div>
            </>
        )
    }
}

export default MusicControl; 