import React, { Component } from 'react';
import './App.css';
import mazes from './components/Mazes';
import axios from 'axios';

class App extends Component {
  constructor() {
    super();
    this.state = {
      start: false,
      stop: false,
      winner: false,
      quit: false,
      leaderboard: false,
      highscores: [],
      timer: 3000,
      maxtimers: [3000, 4000, 5000, 15000],
      score: 0,
      mazesIndex: 0,
      mazes: mazes 
    }

    // BIND METHODS THAT NEED ACCESS TO "THIS". //
    this.start = this.start.bind(this);
    this.restartMaze = this.restartMaze.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleScore = this.handleScore.bind(this);
    this.handleTimer = this.handleTimer.bind(this);
    this.nextMaze = this.nextMaze.bind(this);
    this.restartEntireGame = this.restartEntireGame.bind(this);
    this.quitGame = this.quitGame.bind(this);
    this.leaderboard = this.leaderboard.bind(this);
    this.tick = this.tick.bind(this);
  };

  // DEFINE METHODS AND COMPONENT LIFECYCLES. //

  start() {
    this.setState ({
      start: true
    })
    this.tick();
  }

  restartMaze() {
    let newTimer = this.state.maxtimers[this.state.mazesIndex];
    this.setState ({
      start: false,
      stop: false,
      winner: false,
      timer: newTimer
    })
  }

  nextMaze() {
    let oldMazesIndex = this.state.mazesIndex;
    let newMazesIndex = oldMazesIndex + 1;
    let newTimer = this.state.maxtimers[newMazesIndex];
    this.setState({
      start: false,
      stop: false,
      winner: false,
      timer: newTimer,
      mazesIndex: newMazesIndex
    })
  }

  restartEntireGame() {
    let newTimer = this.state.maxtimers[0];
    this.setState ({
      start: false,
      stop: false,
      winner: false,
      quit: false,
      leaderboard: false,
      timer: newTimer,
      score: 0,
      mazesIndex: 0
    })
  }

  quitGame() {
    this.setState ({
      quit: true
    })
  }

  leaderboard() {
    axios.get('http://localhost:8080/highscores')
    .then((response) => {
      console.log(response.data);
      this.setState({
        highscores: response.data
      })
    })
    .catch(function (error) {
      console.log(error);
    });
    this.setState ({
      timer: 0,
      leaderboard: true
    })
  }

  tick() { // Causes this.state.timer to decrease at a certain speed. Shows player current maze score is decreasing as time goes on.
    const { stop, winner, timer } = this.state;
    let newTimer =  timer - 1;
    if (stop === false && winner === false) { // start is implied to be true because tick starts when you click start
      this.setState({
        timer: newTimer
      })
      setTimeout(this.tick, 10); 
      if (timer <= 0) {
        this.setState({
          stop: true,
          timer: 0
        })
      }
    }
  }

  handleScore() { // Add current maze score to total maze score for a win. 
    // implied to run when this.state.winner = true because it runs right after the state changes.
    const { score, timer } = this.state;
    let oldScore = score;
    let newScore = oldScore + timer;
    console.log(newScore);
      this.setState ({
        score: newScore
      })
  }

  handleTimer() { // Reset this.state.timer (to the user: current maze score) to 0 for a loss.
      //implied to run when this.state.stop = true because it runs right after the state changes.
      let newTimer = 0;
      this.setState({
        timer: newTimer
      })
  }

  handleMouseMove(event) { // Maze logic. 

    const { start, stop, winner, mazes, mazesIndex} = this.state; // Fast way of writing ex: start = this.state.start for multiple states.

    if (start === true && stop === false && winner === false) {
      const domMaze = document.getElementById("Maze");
      const offsetLeft = domMaze.offsetLeft;
      const offsetTop = domMaze.offsetTop - window.scrollY; // See notebook diagram.
      const mouseX = event.clientX;
      const mouseY = event.clientY;

      // Logic for losing.
      let outsidemaze = true;
      let winner = false;
      let lastRect = mazes[mazesIndex].length - 1; // where the last rect object is the winning area.

      // Go through maze's rect objects and see if the mouse is inside the maze at all.
      for (let i = 0; i < mazes[mazesIndex].length; i++) { 
        if (mouseX >= (mazes[mazesIndex][i].x + offsetLeft) && 
            mouseX <= (mazes[mazesIndex][i].x + mazes[mazesIndex][i].width + offsetLeft) &&
            mouseY >= (mazes[mazesIndex][i].y + offsetTop) && 
            mouseY <= (mazes[mazesIndex][i].y + mazes[mazesIndex][i].height + offsetTop)) {

            outsidemaze = false;

      // If mouse is inside the maze, and therefore the player hasn't lost, check if the mouse is in the winning rect.
        } else if (mouseX >= (mazes[mazesIndex][lastRect].x + offsetLeft) && 
            mouseX <= (mazes[mazesIndex][lastRect].x + mazes[mazesIndex][lastRect].width + offsetLeft) &&
            mouseY >= (mazes[mazesIndex][lastRect].y + offsetTop) && 
            mouseY <= (mazes[mazesIndex][lastRect].y + mazes[mazesIndex][lastRect].height + offsetTop)) {
            
            outsidemaze = false;
            winner = true;
          }
      }
  
      if (outsidemaze === true) {
        this.setState ({
          stop: true
        }, this.handleTimer()) // Reset this.state.timer (to the user: current maze score) to 0 for a loss.
      }

      if (winner === true) {
        this.setState ({
          winner: true
        }, this.handleScore()) // Add current maze score to total maze score for a win. 
      }

    }
  }

  render() {
  
  // Switch views between starting screen, maze, loss, win, quit, and leaderboard. //

  const { start, stop, winner, quit, leaderboard, highscores, mazes, mazesIndex } = this.state;

  let mazeState = []
  if (start === false && stop === false && winner === false && quit === false && leaderboard === false) { // Start screen.
    mazeState = (
      <g>
        <svg width="120" height="80" xmlns="http://www.w3.org/2000/svg">
            <rect x="45" y="35" width="70" height="35" fill="black"/>
            <text x="54" y="58" fontFamily="Verdana" fontSize="15" fill="red" 
              onClick={this.start} className="start-button"> START </text>
        </svg>
      </g>
    )
  } else if (start === true && stop === false && winner === false && quit === false && leaderboard === false) { // Draw maze.
      mazeState = mazes[mazesIndex].map((rect, index) => {
          return <rect x={rect.x} y={rect.y} width={rect.width} height={rect.height} fill={rect.fill} key={index}/>
      })
  } else if (start === true && stop === true && winner === false && quit === false && leaderboard === false) { // Loss.
    mazeState = (
      <g>
        <svg xmlns="http://www.w3.org/2000/svg">
          <text x="100" y="250" fontFamily="sans-serif" fontSize="75" stroke="black" fill="red">GAME OVER!</text>
          <rect x="305" y="300" width="80" height="40" fill="black"/>
          <text x="310" y="325" fontFamily="Verdana" fontSize="15" fill="red" 
          onClick={this.restartMaze} className="restart-button"> RESTART </text>
        </svg>
      </g>
    )
  } else if (start === true && stop === false && winner === true && quit === false && leaderboard === false) { // Win.
    mazeState = (
      <g>
        <svg xmlns="http://www.w3.org/2000/svg">
          <text x="80" y="250" fontFamily="sans-serif" fontSize="75" stroke="black" fill="green">YOU KILLED IT!</text>
          <rect x="290" y="300" width="120" height="40" fill="black"/>
          <text x="305" y="325" fontFamily="Verdana" fontSize="15" fill="green" 
          onClick={this.nextMaze} className="next-maze-button"> NEXT LEVEL </text>
        </svg>
      </g>
    )
  } else if (quit === true && leaderboard === false) { // Quit.
    console.log("User is trying to quit the game.");
    mazeState = (
      <g>
      <svg xmlns="http://www.w3.org/2000/svg">
        <text x="50" y="250" fontFamily="sans-serif" fontSize="60" stroke="black" fill="red">CONGRATULATIONS!</text>
        <text x="190" y="300" fontFamily="sans-serif" fontSize="20" stroke="black" fill="black">Your score for this session was {this.state.score}.</text>
        <rect x="290" y="325" width="135" height="40" fill="black"/>
        <text x="300" y="350" fontFamily="Verdana" fontSize="15" fill="red" 
          onClick={this.leaderboard} className="leaderboard-button"> LEADERBOARD </text>
      </svg>
    </g>
    )
  } else if (quit === true && leaderboard === true) { // Leaderboard.
    console.log("User is trying to access the leaderboard.");
    mazeState = (
      <g>
        <svg xmlns="http://www.w3.org/2000/svg">
          <text x="180" y="70" fontFamily="sans-serif" fontSize="45" stroke="black" fill="red">LEADERBOARD</text>
          {highscores.map((highscore, index) => {
            let yCalc = index*30+125;
            return (
              <g key={index}>
                <text x="200" y={yCalc} fontFamily="sans-serif" fontSize="20" stroke="black" fill="black">{this.state.highscores[index].player}</text>
                <text x="400" y={yCalc} fontFamily="sans-serif" fontSize="20" stroke="black" fill="black">{this.state.highscores[index].score} pts</text>
              </g>
            )
          })}
        </svg>
      </g>
    )
  }

  // SVG ATTRIBUTES: //
    // DIMENSIONS OF DRAWING AREA.

  // SVG: RECTANGLE ATTRIBUTES: //
    // X & Y = COORDINATES | WIDTH & HEIGHT = DIMENSIONS FROM STARTING COORDS | STROKE = BORDER | FILL = COLOUR //

    return (
      <div className="App">

        <h2>Maze Madness</h2>
        <button onClick={this.restartEntireGame} type="button" className="new-game">New Game</button>
        <button onClick={this.quitGame} type="button" className="quit">Quit Game</button>
        
        <div id="Maze" onMouseMove={this.handleMouseMove}>
          <g>
            <svg width="700" height="500" xmlns="http://www.w3org/2000/svg">
                {mazeState}
            </svg>
          </g>
        </div>

        <h4 id="Coordinates"></h4>
        <div>
          <h3>Maze Score: {this.state.timer}</h3>
          <h3>Total Score: {this.state.score}</h3>
        </div>

      </div>
    );
  }
}

export default App;
