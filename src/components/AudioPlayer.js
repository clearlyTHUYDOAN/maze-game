import React, { Component } from 'react';

class AudioPlayer extends Component {

    // DEFINE METHODS AND COMPONENT LIFECYCLES. //

    componentDidUpdate() {
    const { start, stop, winner } = this.props;
    const player = this.refs.player; // Refers to audio tag in render > return.

    if (start === true && stop === false && winner === false) { 
        player.play(); 
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