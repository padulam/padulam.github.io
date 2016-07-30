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
    this._runGame = this._runGame.bind(this);
    this._stopGame = this._stopGame.bind(this);
    this._clearGame = this._clearGame.bind(this);
    this._generateSquares = this._generateSquares.bind(this);
  }

  _generateSquares(randomize){
  	let arr =[];
    let x = 0;
    let y = 0;
    const RW_LNGTH = 40;

  	for(let i = 0; i<this.state.tiles;i++){
      if(i!==0&&i%RW_LNGTH===0){
        x=0;
        y+=RW_LNGTH;
      }

      let brdSqIds = this._findBrdSqIds([x,y]);

      let liv = false;
      if(randomize){
        if(Math.round(Math.random())){
          liv = true;
        }
      }
      
  		arr.push(<Square 
                    brdSqIds={brdSqIds} 
                    pos={[x,y]}
                    living={liv} 
                    id={i} 
                    key={i} 
                    updateSquare= {this._updateSquare.bind(this)}/>);
      x+=1;
  	}

  	this.setState({cells: arr});
  }

  _updateSquare(s){
    let arr = this.state.cells
    console.log(s.props.key)
    arr[s.props.id] = <Square 
                              brdSqIds = {s.props.brdSqIds}
                              pos= {s.props.pos}
                              living= {!s.props.living}
                              id={s.props.id} 
                              key={s.props.id} 
                              updateSquare= {s.props.updateSquare} />;
    this.setState({cells:arr});
  }

  _nextGen(){
    let determineLife = this._determineLife;
    let cells = this.state.cells;
    let findBrdrCmpnnts = this._findBrdrCmpnnts
    let cellsAlive = false;
    let arr = this.state.cells.map(function(s){
      let liv = determineLife(findBrdrCmpnnts(s.props.brdSqIds,cells), s.props.living);
      if (liv){
        cellsAlive = true;
      }
      return(<Square 
                    brdSqIds = {s.props.brdSqIds}
                    pos= {s.props.pos}
                    living= {liv}
                    id={s.props.id} 
                    key={s.props.id} 
                    updateSquare= {s.props.updateSquare} />
                    );
    });
    if(cellsAlive){
      return arr;
    }else{
      return null;
    }
  }

  _findBrdrCmpnnts(brdSqIds,cells){
    let arr = [];
    for(let i = 0; i<brdSqIds.length;i++){
      arr.push(cells[brdSqIds[i]]);
    }
    return arr;
  }

  _determineLife(borderSqs,living){
    let liveCnt = 0;

    borderSqs.forEach(function(s){
      if(s.props.living){
        liveCnt+=1;
      }
    })
    
    if(living&&liveCnt<2){
      return false;
    }else if(living&&(liveCnt===2||liveCnt===3)){
      return true;
    } else if(living&&liveCnt>3){
      return false;
    } else if(living===false&&liveCnt===3){
      return true;
    }else{
      return false;
    }
  }

  _findBrdSqIds(arr){
    //x39 y960
    const max_X = 39;
    const max_Y = 960;
    const min_X = 0;
    const min_Y = 0;
    const RW_LNGTH = 40;

    let brdSqs = [[1,0],[-1,0],[0,RW_LNGTH],
          [0,-RW_LNGTH],[1,RW_LNGTH],[-1,-RW_LNGTH],
          [1,-RW_LNGTH],[-1,RW_LNGTH]];

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

      squares.push(x+y);
    }

    return squares;
  }

  _startGame(){
  	this._generateSquares(true);
  	this._runGame();
  }

  _runGame(){
    this.interval = setInterval(this._runGeneration, 100);
  }

  _stopGame(){
  	clearInterval(this.interval);
  }

  _clearGame(){
  	this._stopGame();
  	this._generateSquares(false);
  	this.setState({generations: 0});
  }

  _runGeneration(){
    let nextGen = this._nextGen();
    if (nextGen){
      this.setState({generations: this.state.generations + 1, cells: nextGen});
    } else{
      this._clearGame();
    }
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
  				<h1>Game of Life</h1>
  			</div>
		   	<div className="board">
		   		{this.state.cells}
		   	</div>
		   	<div className="gamebutton-container container">
		   		<Run runGame={this._runGame}/>
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
			<button onClick={this.props.runGame} className="ghost-button">Run</button>
		);
	}
}

class Stop extends React.Component {
	render(){
		return(
			<button onClick={this.props.stopGame} className="ghost-button">Stop</button>
		);
	}
}

class Clear extends React.Component {
	render(){
		return(
			<button onClick={this.props.clearGame} className="ghost-button">Clear</button>
		);
	}
}

class Square extends React.Component {
  _updateSquare(){
    this.props.updateSquare(this);
  }

	render(){
		let lifeClass ="";
		if(this.props.living){
			lifeClass="living"
		}

		return(
			<div onClick={this._updateSquare.bind(this)} className={`square ${lifeClass}`}></div>
		);
	}
}

ReactDOM.render(
	<LifeApp />,
	document.getElementById("life-app")
);