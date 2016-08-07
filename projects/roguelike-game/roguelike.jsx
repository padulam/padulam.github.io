class RogueApp extends React.Component {
  render(){
  	return(
  		<div>
  			<TitleBar />
			<Board />
		</div>
  	);
  }
}

class TitleBar extends React.Component {
  render(){
  	return(
		<div className="title">

		</div>
  	);
  }
}

class Board extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			tiles: 10000,
			cells: []
		};
	}

	_generateCells(){
		let arr = [];
		let type = {1: "area", 
					2: "wall", 
					3: "treasure", 
					4: "health", 
					5: "player", 
					6: "enemy"};

		for(let i = 0;i<this.state.tiles;i++){
			let cellType = type[Math.floor((Math.random()*2)+1)];
			arr.push(<Tile type={cellType}/>);
		}
		this.setState({cells:arr});
	}

	componentDidMount() {
		this._generateCells();
	}

	render(){
		return(
			<div className="board">
				{this.state.cells}
			</div>
		);
	}
}

class Tile extends React.Component {	
	render(){
		return(
			<div className={`cell ${this.props.type}`}>
			</div>
		);
	}
}

ReactDOM.render(<RogueApp />, document.getElementById('rogue-app'))
