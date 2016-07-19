class LifeApp extends React.Component {
  constructor() {
    super();
  
    this.state = {
    	tiles:1000,
    	generations: 0,
    	cells: []
    };

    this._runGeneration = this._runGeneration.bind(this);
    this._startGame = this._startGame.bind(this);
    this._stopGame = this._stopGame.bind(this);
    this._clearGame = this._clearGame.bind(this);
    this._generateSquares = this._generateSquares.bind(this);
    this._clearSquares = this._clearSquares.bind(this);
  }

  _generateSquares(){
  	var arr =[];
  	for(var i = 0; i<this.state.tiles;i++){
  		arr.push(<Square id={i} key={i}/>);
  	}

  	this.setState({cells: arr});
  }

  _clearSquares(){
  	this.state.cells.map(e => {
  		if(e.state.living){
  			e.setState({living: false});
  		}
  	});
  }

  _startGame(){
  	this._generateSquares();
  	this.interval = setInterval(this._runGeneration, 500);
  }

  _stopGame(){
  	clearInterval(this.interval);
  }

  _clearGame(){
  	this._stopGame();
  	this._clearSquares();
  	this.setState({generations: 0});
  }

  _runGeneration(){
  	this.setState({generations: this.state.generations + 1});
  }

  componentDidMount(){
  	this._startGame();
  }

  componentWillUnmount(){
  	this._stopGame();
  }

  render(){
  	return(
  		<div className="lifeapp-container container">
  			<div className="game-header container">
  				
  			</div>
		   	<div className="board">
		   		{this.state.cells}
		   	</div>
		   	<div className="gamebutton-container container">
		   		<Run startGame={this._startGame}/>
		   		<Stop stopGame={this._stopGame}/>
		   		<Clear clearGame={this._clearGame}/>
		   		<h2 className="generation-count">Generations: {this.state.generations}</h2>
		   	</div>
		</div>
	);
  }
}

class Run extends React.Component {
	render(){
		return(
			<button onClick={this.props.startGame} className="btn btn-primary">Run</button>
		);
	}
}

class Stop extends React.Component {
	render(){
		return(
			<button onClick={this.props.stopGame} className="btn btn-danger">Stop</button>
		);
	}
}

class Clear extends React.Component {
	render(){
		return(
			<button onClick={this.props.clearGame} className="btn btn-warning">Clear</button>
		);
	}
}

class Square extends React.Component {
	constructor(props) {
	  super(props);

	  this.state = {
	  	living: false
	  }

	  this._handleClick = this._handleClick.bind(this);
	}

	_handleClick(){
		this.setState({living: !this.state.living})
	}

	render(){
		let lifeClass;
		if(this.state.living){
			lifeClass="living"
		}

		return(
			<div onClick={this._handleClick} className={`square ${lifeClass}`}></div>
		);
	}
}

ReactDOM.render(
	<LifeApp />,
	document.getElementById("life-app")
);