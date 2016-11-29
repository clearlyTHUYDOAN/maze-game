import React, { Component } from 'react';

class AudioPlayer extends Component {

    // DEFINE METHODS AND COMPONENT LIFECYCLES. //

    componentDidUpdate() {
    const { start, stop, winner } = this.props;
    const player = this.refs.player; // Refers to audio tag in render > return.
    if (start === true && stop === false && winner === false) { // Component lifecycle ensures this happens after togglePlay and changeSong changes their respective states.
      player.play(); // The line that actually completes making songs play in addition to this.togglePlay.
    } 
    else if (start === true && stop === true && winner === false) {
        player.play(); // Needed to play songs on song change.
    } 
    else if (start === true && stop === false && winner === true) {
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