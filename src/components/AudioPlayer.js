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
    //   let currentsong = this.props.songs[this.props.mazesIndex]
    //   console.log(currentsong);
    } 
    else if (this.props.start === true && this.props.stop === true && this.props.winner === false) {
        player.pause();
        // player.play();
    } 
    else if (this.props.start === true && this.props.stop === false && this.props.winner === true) {
        player.pause();
        // player.play();
    }
  };

    render () {

        return (
            <div className="AudioPlayer">
                <audio ref="player" src={this.props.songs[this.props.mazesIndex]}></audio> 
            </div>
        );

    }
}

export default AudioPlayer;