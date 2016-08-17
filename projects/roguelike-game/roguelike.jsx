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
		const RW_LNGTH = 100;
		let x = 0;
		let y = 0;
		let arr = [];
		let type = {1: "area", 
					2: "wall", 
					3: "treasure", 
					4: "health", 
					5: "player", 
					6: "enemy"};

		for(let i = 0;i<this.state.tiles;i++){
			if(i!==0&&i%RW_LNGTH===0){
				x=0;
				y+=RW_LNGTH;
			}

			let brdSqIds = this._findBrdSqIds([x,y]);

			let cellType = "wall"//type[Math.floor((Math.random()*2)+1)];
			arr.push(<Tile id={i} brdSqIds={brdSqIds} type={cellType}/>);
			x+=1;
		}
		for(let i = 0;i<500;i++){
			let sqId = Math.floor((Math.random()*10000)+1);
			if(arr[sqId].props.type!=="area"){
				for(let j=0;j<arr[sqId].props.brdSqIds.length;j++){
					arr[arr[sqId].props.brdSqIds[j]].props.type="area";
				}
				arr[sqId].props.type="area";
			}
		}

		this.setState({cells:arr});
	}

	_findBrdSqIds(arr){
	    //x99 y9900
	    const max_X = 99;
	    const max_Y = 9900;
	    const min_X = 0;
	    const min_Y = 0;
	    const RW_LNGTH = 100;

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
