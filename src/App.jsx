import React from 'react';

import logo from './kendelCircleLogo.png';
import './App.css';
import Socket from './utilities/Socket';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      roomCode: '',
      players: [],
      inProgress: false,
      gameOver: false,
      stage: 0,
      promptIndex: 0,
      promptOne: '',
      prompTwo: '',
    };
  }

  componentDidMount() {
    Socket.connect();
    Socket.addEventListener('createdRoom', (response) => {
      this.setState({ roomCode: response.roomCode });
    });

    Socket.addEventListener('playerList', ({ players }) => {
      this.setState({ players });
    });

    Socket.addEventListener('startedGame', () => {
      this.setState({
        inProgress: true,
        stage: 0
      });
    });

    Socket.addEventListener('stageChanged', ({ stage }) => {
      this.setState({ stage });
    });

    Socket.addEventListener('prompts', ({ promptOne, promptTwo }) => {
      this.setState({ promptOne, promptTwo });
    });

    Socket.addEventListener('answers', ({ promptOne, promptTwo }) => {
      this.setState({ promptOne, promptTwo });
    });

    Socket.addEventListener('promptChange', ({ promptIndex }) => {
      this.setState({ promptIndex });
    });

    Socket.addEventListener('gameOver', ({ players, promptOne, promptTwo }) => {
      this.setState({
        gameOver: true,
        players,
        promptOne,
        promptTwo
      });
    });
  }

  renderStageZero = () => (
    <div className="app">
      <h1>Kendel Circle</h1>
      <h2>Look at your devices!</h2>
      <h2>Enter Fun Questions for Others to Answer!</h2>
    </div>
  );

  renderStageOne = () => (
    <div className="app">
      <h1>Kendel Circle</h1>
      <h2>Look at your devices!</h2>
      <h2>Enter Answers to Your Two Prompts</h2>
    </div>
  );

  renderStageTwo = () => {
    const prompt = this.state.promptIndex === 0 ? this.state.promptOne : this.state.promptTwo;
    const answerList = prompt.answers
    const answers = answerList.map((answer) => (
      <li>{ answer.value }</li>
    ));

    return (
      <div className="app">
        <h1>Kendel Circle</h1>
        <h2>Look at your devices!</h2>
        <h2>Vote for your favorite response to the prompt:</h2>
        <h2>{ prompt.value }</h2>
        <ul>
          { answers }
        </ul>
      </div>
    )
  }

  renderRoomInProgress = (stage) => {
    if (stage === 0) {
      return this.renderStageZero();
    } else if (stage === 1) {
      return this.renderStageOne();
    } else if (stage === 2) {
      return this.renderStageTwo();
    }

    return null;
  }

  renderRoomNotInProgress = () => {
    const players = this.state.players.map((player) => (
      <li>{ `${player.username}${player.isVip ? ' (VIP)' : ''}` }</li>
    ));

    return (
      <div className="app">
        <h1>Kendel Circle</h1>
        <h2>{ 'Room Code: '}<b>{ this.state.roomCode }</b></h2>
        <h2>Players</h2>
        <ul>
          { players }
        </ul>
      </div>
    );
  }

  renderNoRoom = () => (
    <div className="app">
      <h1>Kendel Circle</h1>
      <img height={ 400 } src={ logo } />
      <button
        onClick={ () => Socket.createRoom() }
      >
        { 'Create Room' }
      </button>
    </div>
  );

  renderGameOver = () => {
    const playerList = this.state.players;
    playerList.sort((a, b) => (b.points - a.points));

    const players = playerList.map((player) => (
      <li>{ `${player.username} (${player.points})`}</li>
    ));

    return (
      <div className="app">
        <h1>Kendel Circle</h1>
        <h2>Thanks for playing!</h2>
        <h2>Results:</h2>
        <ul>{ players }</ul>
      </div>
    );
  }

  render() {
    if (this.state.gameOver) {
      return this.renderGameOver();
    }

    if (this.state.roomCode) {
      if (this.state.inProgress) {
        return this.renderRoomInProgress(this.state.stage);
      }
      return this.renderRoomNotInProgress();
    }

    return this.renderNoRoom();
  }
}

export default App;
