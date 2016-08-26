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

		let roomSize = {1:{height:10,width:20},
						2:{height:20,width:10},
						3:{height:20,width:20},
						4:{height:30,width:30},
						};

		for(let i = 0;i<this.state.tiles;i++){
			if(i!==0&&i%RW_LNGTH===0){
				x=0;
				y+=RW_LNGTH;
			}

			let brdSqIds = this._findBrdSqIds([x,y],true);

			let cellType = "wall"
			arr.push(<Tile id={i} brdSqIds={brdSqIds} type={cellType} rmId={null}/>);
			x+=1;
		}

		for(let i = 0;i<1000;i++){
			let sqId = 0;
			do{
				sqId = Math.floor((Math.random()*this.state.tiles-1)+1);
			} while(sqId<100)
			let rmSize = roomSize[Math.floor((Math.random()*4)+1)];
			let rmIds = this._generateRoomIds(sqId,rmSize.height,rmSize.width);
			let createRoom = true;
			if(rmIds!==null){
				for (let j=0;j<rmIds.length;j++){
					if(arr[rmIds[j]].props.type==="area"){
						createRoom=false;
					} else{
						for(let k=0;k<arr[rmIds[j]].props.brdSqIds.length;k++){
							if(arr[arr[rmIds[j]].props.brdSqIds[k]].props.type==="area"){
								createRoom=false;
							}
						}
					}
				}

				if(createRoom){
					for (let j=0;j<rmIds.length;j++){
						arr[rmIds[j]].props.type="area";
						arr[rmIds[j]].props.rmId =i;
						arr[rmIds[j]].props.rmIds = rmIds;
					}
				}
			}
		}

		this.setState({cells:arr});
	}

	_generateRoomIds(id,h,w){
		let arr = [];
		const RW_LNGTH = 100;
	    const max_Y = 9999;

	    if((id+w)+(h*RW_LNGTH)>max_Y||id%RW_LNGTH>(id+w)%RW_LNGTH){
			return null;
	    }else{
	    	for(let i = 0;i<w;i++){
				arr.push(id+i);
				for(let j=1;j<h;j++){
					arr.push((id+i)+(j*RW_LNGTH));
				}
			}
	    }
		return arr;
	}

	_findBrdSqIds(arr,firstPass){
	    //x99 y9900
	    const max_X = 99;
	    const max_Y = 9900;
	    const min_X = 0;
	    const min_Y = 0;
	    const RW_LNGTH = 100;

	    let squares = [];
		
	    let brdSqs = [[1,0],[-1,0],[0,RW_LNGTH],
	          [0,-RW_LNGTH],[1,RW_LNGTH],[-1,-RW_LNGTH],
	          [1,-RW_LNGTH],[-1,RW_LNGTH]];

	    for(let i=0;i<brdSqs.length;i++){
	      let x = arr[0] + brdSqs[i][0];
	      let y = arr[1] + brdSqs[i][1];
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