class LifeApp extends React.Component {
  constructor() {
    super();
  
    //1000 tiles at 1px = 40x25 board
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
  }

  _generateSquares(){
  	var arr =[];
    var x = 0;
    var y = 0;

  	for(var i = 0; i<this.state.tiles;i++){
      if(i!==0&&i%40===0){
        x=0;
        y+=40;
      }

      let brdSqs = this._findBrdSqs([x,y]);
      let liv = false;
      if(Math.round(Math.random())){
        liv = true;
      }

  		arr.push(<Square 
                    brdSqs={brdSqs} 
                    pos={[x,y]}
                    living={liv} 
                    id={i} 
                    key={i} />);
      x+=1;
  	}

  	this.setState({cells: arr});
  }

  _highlightSquare(arr,cells){
    console.log("hl");
    let hSqs = [];
    for(let i = 0; i<arr.length;i++){
      cells.forEach(function(s){
        if(arr[i][0]===s.props.pos[0]&&arr[i][1]===s.props.pos[1]){
          hSqs.push(s);
        }
      });
    }
    return hSqs;
  }

  _nextGen(){
    let findBrdSqs = this._highlightSquare;
    let findLife = this._determineLife;
    let cells = this.state.cells;
    let arr = this.state.cells.map(function(s){
      let liv = findLife(findBrdSqs(s.props.brdSqs,cells), s.props.living);
      let key = Math.random()*100;
      return(<Square 
                    brdSqs= {s.props.brdSqs}
                    pos= {s.props.pos}
                    living= {liv}
                    id={s.props.id} 
                    key={key} />);
    });

    return arr;
  }

  _determineLife(borderSqs,living){
    let liveCnt = 0;

    borderSqs.forEach(function(s){
      if(s.props.living){
        liveCnt+=1;
      }
    })

    if(liveCnt<2){
      return false;
    }else if(living&&(liveCnt===2||liveCnt===3)){
      return true;
    } else if(living&&liveCnt>3){
      return false;
    } else if(living===false&&liveCnt===3){
      return true;
    }
  }

  _findBrdSqs(arr){
    const max_X = 39
    const max_Y = 960
    const min_X = 0
    const min_Y = 0

    console.log("hl");

    let brdSqs = [[1,0],[-1,0],[0,40],
          [0,-40],[1,40],[-1,-40],
          [1,-40],[-1,40]];

    let squares = [];

    for(let i=0;i<brdSqs.length;i++){
      let x = arr[0] + brdSqs[i][0];
      let y = arr[1] + brdSqs[i][1];
      if(x<min_X){
        x= max_X;
      } else if(x>max_X){
        x= min_X
      }

      if(y<min_Y){
        y= max_Y;
      } else if(y>max_Y){
        y= min_Y
      }
      squares.push([x,y]);
    }

    return squares;
  }

  _startGame(){
  	this._generateSquares();
  	this.interval = setInterval(this._runGeneration, 100);
  }

  _stopGame(){
  	clearInterval(this.interval);
  }

  _clearGame(){
  	this._stopGame();
  	this._generateSquares();
  	this.setState({generations: 0});
  }

  _runGeneration(){
  	this.setState({generations: this.state.generations + 1, cells: this._nextGen()});
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
  
    this.state = {living: this.props.living};

    this._handleClick = this._handleClick.bind(this);
  }

	_handleClick(){
		this.setState({living: !this.state.living});
	}

	render(){
		let lifeClass ="";
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