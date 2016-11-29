import React, { Component } from 'react';

class AudioPlayer extends Component {
    // constructor() {
    //     super();

        // BIND METHODS THAT NEED ACCESS TO "THIS". //
        // this.togglePlay = this.togglePlay.bind(this);
    // }

    // DEFINE METHODS AND COMPONENT LIFECYCLES. //

    componentDidUpdate() {
    const player = this.refs.player; // Refers to audio tag in render > return.
    if (this.props.start === true && this.props.stop === false && this.props.winner === false) { // Component lifecycle ensures this happens after togglePlay and changeSong changes their respective states.
      player.play(); // The line that actually completes making songs play in addition to this.togglePlay.
    } 
    else if (this.props.start === true && this.props.stop === true && this.props.winner === false) {
        player.play(); // Needed to play songs on song change.
    } 
    else if (this.props.start === true && this.props.stop === false && this.props.winner === true) {
        player.play(); // Needed to play songs on song change.
    }
  };

    render () {

        return (
            <div className="AudioPlayer">
                <audio ref="player" src={this.props.song}></audio> 
            </div>
        );

    }
}

export default AudioPlayer;