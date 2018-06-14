// @flow
import { Component, styled } from '@guardian/guui';
import { pillarsHighlight } from '@guardian/pasteup/palette';

import { formatTime } from './utils';

import ProgressBar from './ProgressBar';
import Time from './Time';
import palette from '@guardian/pasteup/palette';

const AudioGrid = styled('div')({
    borderTop: '1px solid #767676',
    display: 'grid',
    gridTemplateColumns: "220px 1fr 1fr",
    gridTemplateRows: "1fr 90px 1fr 1fr",
    gridTemplateAreas: '". currentTime duration" "controls wave wave" "volume track track" "download links links"',
    backgroundColor: palette.neutral[1],
    color: palette.neutral[5]
});

const TimeSpan = styled('span')(({ area }) => ({
    [area === 'currentTime' ? 'borderLeft' : 'borderRight']: '1px solid #767676',
    [area === 'currentTime' ? 'paddingLeft' : 'paddingRight']: '4px',
    gridArea: area,
    paddingTop: '7px',
    textAlign: area === 'duration' ? 'right' : 'left'
}));

const Controls = styled('div')({
    gridArea: 'controls',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '33px 0'
});

const Track = styled('div')({
    gridArea: 'track',
    alignSelf: 'center',
    padding: '0 10px'
});

const Volume = styled('div')({
    gridArea: 'volume',
    display: 'flex',
    alignItems: 'center',
    padding: '0 20px',
    '> img': {
        marginRight: '6px'
    },
    'div[role="progressbar"]': {
        flex: 1
    }
});

const Download = styled('div')({
    borderTop: '1px solid #767676',
    gridArea: 'download',
    paddingLeft: '20px',
    paddingTop: '8px',
    a: {
        color: '#cbcbcb', // TODO: add to the palette
        border: '1px solid rgba(118, 118, 118, 0.7)',
        borderRadius: '15px',
        display: 'inline-flex',
        alignItems: 'center',
        padding: '3px 12px',
        fontSize: '12px',
        textDecoration: 'none'
    },
    img: {
        height: '18px',
        width: '18px'
    }
})

const Links = styled('div')({
    borderTop: '1px solid #767676',
    borderLeft: '1px solid #767676',
    gridArea: 'links',
    display: 'flex',
    padding: '10px 4px 0',
    alignItems: 'baseline',
    b: {
        fontSize: '18px',
        fontWeight: 'bold'
    },
    ul: {
        display: 'flex',
    },
    li: {
        marginLeft: '30px',
    },
    a: {
        color: '#cbcbcb', // TODO: add to the palette
    },
    img: {
        marginRight: '10px',
        verticalAlign: 'middle'
    }
});

const Button = styled('button')(({ className }) => ({
    background: 'none',
    border: 0,
    margin: 0,
    padding: className === 'play' ? '0 20px' : 0,
    ':focus': {
        outline: 'none' // ಠ_ಠ
    }
}));

const Wave = styled('svg')({
    gridArea: 'wave',
    alignSelf: 'stretch',
    justifySelf: 'stretch'
});

export default class AudioPlayer extends Component {
    constructor() {
        super();
        this.state = {
            ready: false,
            playing: false,
            currentTime: 0,
            iteration: 0,
            duration: NaN,
            volume: NaN,
            bins: NaN,
            interval: NaN,
            barHeight: NaN
        };
    }
    
    componentDidMount() {
        if (Number.isNaN(this.audio.duration)) {
            this.audio.addEventListener('durationchange', this.ready, { once: true });
        } else {
            this.ready();
        }
        this.audio.addEventListener('volumechange', this.onVolumeChange);
        this.audio.addEventListener('timeupdate', this.onTimeUpdate);
        this.context = new window.AudioContext();
        this.analyser = this.context.createAnalyser();
        this.analyser.fftSize = 256;
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount)
        this.source = this.context.createMediaElementSource(this.audio);
        this.source.connect(this.analyser);

        const rect = this.canvas.getBoundingClientRect();
        this.canvas.setAttribute('viewBox', `0 0 ${rect.width} ${rect.height}`);
        this.setState({ 
            bins: Math.floor(rect.width / 3),
            canvasH: rect.height,
            canvasW: rect.width
        });
    }
    
    setCanvas = el => {
        this.canvas = el;
    }

    setAudio = el => {
        this.audio = el;
    }

    ready = () => {
        const duration = this.audio.duration;
        const interval = duration / this.state.bins;
        this.setState({ 
            ready: true, 
            duration,
            interval,
            volume: this.audio.volume
        });
    }

    onVolumeChange = () => {
        this.setState({ volume: this.audio.volume });
    }

    onTimeUpdate = () => {
        this.setState({ currentTime: this.audio.currentTime });
    }

    play = () => {
        this.setState({ playing: !this.state.playing }, () => {
            if (this.state.playing) {
                this.audio.play();
                this.sample();
                this.setState({ 
                    sampler: window.setInterval(this.sample, this.state.interval * 1000)
                });
            } else {
                this.audio.pause();
                window.clearInterval(this.state.sampler);
                this.setState({ sampler: null });
            }
        });
    }
    
    forward = () => {
        this.audio.currentTime = Math.min(this.state.currentTime + 15, this.state.duration);
    }
    
    backward = () => {
        this.audio.currentTime = Math.max(this.state.currentTime - 15, 0);
    }

    updateVolume = v => {
        this.audio.volume = v / 100;
    }

    seek = v => {
        this.audio.currentTime = this.audio.duration * v / 100;
    }
    
    sample = () => {
        this.analyser.getByteFrequencyData(this.dataArray);
        const factor = Math.max(1, ...this.dataArray);
        const mean = this.dataArray.reduce((res, x) => res + x, 0) / this.dataArray.length;
        const minHeight = 5;
        const barHeight = minHeight + Math.ceil(mean / factor * (this.state.canvasH - minHeight));
        this.setState({
            barHeight,
            iteration: this.state.iteration + 1
        }, this.draw);
    }

    draw = () => {
        const barWidth = 2;
        const maxHeight = 90;
        const barOffset = this.state.iteration * (barWidth + 1);
        const playOffset = this.state.currentTime - this.state.interval * this.state.iteration;

        const rect = document.createElementNS(this.canvas.namespaceURI, 'rect');
        rect.setAttribute('x', barOffset);
        rect.setAttribute('y', maxHeight - this.state.barHeight);
        rect.setAttribute('width', 2);
        rect.setAttribute('height', this.state.barHeight);
        rect.setAttribute('fill', pillarsHighlight.sport);
        
        this.canvas.appendChild(rect);
    }

    render({ 
        sourceUrl, 
        mediaId,
        controls,
        css
    }, { ready, playing, currentTime, duration, volume, canvasW, canvasH }) {
        const currentOffset = ready ? currentTime / duration * 100 : 0;

        return (
            <AudioGrid>
                <audio ref={this.setAudio} controls={controls} volume data-media-id={mediaId} preload="metadata">
                    <source src={sourceUrl} type="audio/mpeg" />
                </audio>
                <Controls>
                    <Button onClick={this.backward} disabled={!playing}>
                        {playing ? (
                            <img src="/static/icons/fast-backward-active.svg" />
                        ) : (
                            <img src="/static/icons/fast-backward.svg" />
                        )}                        
                    </Button>
                    <Button className="play" onClick={this.play}>
                        {playing ? (
                            <img src="/static/icons/pause-btn.svg" />
                        ) : (
                            <img src="/static/icons/play-btn.svg" />
                        )}
                    </Button>
                    <Button onClick={this.forward} disabled={!playing}>
                        {playing ? (
                            <img src="/static/icons/fast-forward-active.svg" />
                        ) : (
                            <img src="/static/icons/fast-forward.svg" />
                        )}
                    </Button>
                </Controls>
                <TimeSpan area="currentTime"><Time t={currentTime} /></TimeSpan>
                <TimeSpan area="duration">{ready ? ( <Time t={duration} /> ) : ""}</TimeSpan>
                <Track>
                    <ProgressBar value={currentOffset} formattedValue={formatTime(currentOffset)} trackColour={pillarsHighlight.sport} progressColour={palette.neutral[4]} onChange={this.seek} />
                </Track>
                {Number.isNaN(volume) ? "" : (
                    <Volume>
                        <img src="/static/icons/volume.svg" />
                        <ProgressBar value={volume * 100} formattedValue={`Volume set to ${volume}`} trackColour={pillarsHighlight.sport} progressColour={palette.neutral[4]} onChange={this.updateVolume} />
                    </Volume>
                )}
                <Wave innerRef={this.setCanvas} colour={pillarsHighlight.sport} />
                <Download>
                    <a href="#">
                        Download MP3
                        <img src="/static/icons/download.svg" />
                    </a>
                </Download>
                <Links>
                    <b>Subscribe for free</b>
                    <ul>
                        <li><a href="#">
                            <img src="/static/icons/apple-podcast.jpg"
                                srcset="/static/icons/apple-podcast@2x.jpg 2x,
                                        /static/icons/apple-podcast@3x.jpg 3x"
                                />
                            Apple podcast
                        </a></li>
                        <li><a href="#">
                            <img src="/static/icons/spotify.jpg"
                                srcset="/static/icons/spotify@2x.jpg 2x,
                                        /static/icons/spotify@3x.jpg 3x"
                                />
                            Spotify
                        </a></li>
                    </ul>
                </Links>
            </AudioGrid>
        );
    }
}
