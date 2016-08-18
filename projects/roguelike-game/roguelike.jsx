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

			let cellType = "wall"
			arr.push(<Tile id={i} brdSqIds={brdSqIds} type={cellType}/>);
			x+=1;
		}
		for(let i = 0;i<100;i++){
			let sqId = Math.floor((Math.random()*10000)+1);
			if(arr[sqId].props.type!=="area"){
				let cellFill = false;
				let j = 0;
				while(cellFill===false&&j<arr[sqId].props.brdSqIds.length){
					if(arr[arr[sqId].props.brdSqIds[j]].props.type==="area"){
						cellFill=true;
					}
					
					j++;
				}

				if(cellFill===false){
					for(let k=0;k<arr[sqId].props.brdSqIds.length;k++){
						arr[arr[sqId].props.brdSqIds[k]].props.type="area";
					}
					arr[sqId].props.type="area";
				}
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
	    //let RW_LNGTH = 100;

	    let squares = [];
		
		for(let i = 1;i<2;i++){
			let RW_LNGTH = 100*i;
		    let brdSqs = [[i,0],[-i,0],[i-1,RW_LNGTH],
		          [i-1,-RW_LNGTH],[i,RW_LNGTH],[-i,-RW_LNGTH],
		          [i,-RW_LNGTH],[-i,RW_LNGTH]];

		    for(let j=0;j<brdSqs.length;j++){
		      let x = arr[0] + brdSqs[j][0];
		      let y = arr[1] + brdSqs[j][1];
		      if(x<min_X||x>max_X){
		        x=null;
		      }

		      if(y<min_Y||y>max_Y){
		        y= null;
		      }
			
			  if(x!==null&&y!==null){
				squares.push(x+y);
			  }
		    }
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
