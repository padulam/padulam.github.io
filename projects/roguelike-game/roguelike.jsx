class TitleBar extends React.Component {
  render(){
  	return(
		<div className="title">
			<h1 id="appTitle">Roguelike Dungeon Crawler Game</h1>
			<p>
				<span className="game-info">Floor: {this.props.floor}</span>
				<span className="game-info">Health: {this.props.health}</span>
				<span className="game-info">Weapon: {this.props.weapon} </span>
				<span className="game-info">Level: {this.props.level}</span>
				<span className="game-info">XP: {this.props.xp}</span>
			</p>
		</div>
  	);
  }
}

class RogueApp extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			tiles: 10000,
			cells: [],
			playerPosition: null,
			floor:1,
			weapon:"Knuckles",
			health:100,
			level:1,
			xp:0,
			enemies: [],
			bigBossHealth:200
		};
	}

	_generateCells(){
		const RW_LNGTH = 100;
		let x = 0;
		let y = 0;
		let arr = [];

		for(let i = 0;i<this.state.tiles;i++){
			if(i!==0&&i%RW_LNGTH===0){
				x=0;
				y+=RW_LNGTH;
			}

			let brdSqIds = this._findBrdSqIds([x,y],true);

			let cellType = "wall";
			arr.push(<Tile id={i} key={i} brdSqIds={brdSqIds} type={cellType} rmId={null} fog={false}/>);
			x+=1;
		}

		arr=this._generateRooms(arr,4230);

		arr=this._trimBridge(arr);

		arr=this._placePlayer(arr);

		arr=this._placeWeapon(arr);

		arr=this._placeHealth(arr,6);

		arr=this._placeEnemies(arr,6);

		arr=this._placeBigBoss(arr);

		this.setState({cells:arr});
	}

	_placeWeapon(arr){
		let weaponPlaced = false;
		do{
			let rnd = Math.floor(Math.random()*this.state.tiles);
			if(arr[rnd].props.type==="area"){
				arr[rnd].props.type="weapon";
				weaponPlaced=true;
			}
		}while(weaponPlaced===false)
		
		return arr;
	}

	_placeEnemies(arr,count){
		let i=0;
		do{
			let rnd = Math.floor(Math.random()*this.state.tiles);
			if(arr[rnd].props.type==="area"){
				arr[rnd].props.type="enemy";
				let enemies = this.state.enemies;
				enemies.push({location:rnd, health: 100*this.state.floor});
				this.setState({enemies: enemies});
				i++;
			}
		}while(i<count)

		return arr;
	}

	_placeHealth(arr,count){
		let i=0;
		do{
			let rnd = Math.floor(Math.random()*this.state.tiles);
			if(arr[rnd].props.type==="area"){
				arr[rnd].props.type="health";
				i++;
			}
		}while(i<count)

		return arr;
	}

	_placeBigBoss(arr){
		const bossSquare = [1,100,101];
		let bossPlaced = false;
		let i=0;
		do{
			let rnd = Math.floor(Math.random()*this.state.tiles);
			if(arr[rnd].props.type==="area"&&arr[rnd+bossSquare[0]].props.type==="area"&&
				arr[rnd+bossSquare[1]].props.type==="area"&&arr[rnd+bossSquare[2]].props.type==="area"){
				arr[rnd].props.type="big-boss";
				arr[rnd+bossSquare[0]].props.type="big-boss";
				arr[rnd+bossSquare[1]].props.type="big-boss";
				arr[rnd+bossSquare[2]].props.type="big-boss";
				bossPlaced = true;
			}
		}while(bossPlaced==false)

		return arr;
	}

	_generateRooms(arr,seedId,direction){
		const roomSizes = {	1:{height:10,width:20},
							2:{height:20,width:20},
							3:{height:15,width:15},
							4:{height:15,width:10}
						};

		let borders = {left:-1,right:1,down:100,up:-100};
		let roomSize = roomSizes[Math.floor((Math.random()*4)+1)];
		let roomIds = this._generateRoomIds(seedId,roomSize.height,roomSize.width,direction);
		let createRoom = true;

		if(roomIds!==null){
			createRoom = this._checkForRoomOverlap(roomIds,arr);

			if(createRoom){
				arr = this._createRoom(roomIds,arr);

				let nextBridges = this._generateBridge(roomIds,arr,direction);

				for(let nextBridge in nextBridges){
					arr[nextBridges[nextBridge]].props.type="hall";
					if(nextBridges[nextBridge]+1<10000){
						this._generateRooms(arr,nextBridges[nextBridge]+borders[nextBridge],nextBridge);
					}
				}
			}
		}

		return arr;
	}

	_generateBridge(roomIds,arr,direction){
		let borders = {left:-1,right:1,down:100,up:-100};
		let bridges = [];
		let borderIds = this._findRoomBorder(roomIds,arr);
		let borderLength = 0;

		//Delete bridge on opposing wall
		switch (direction) {
			case "right":
				delete borders.left;
				borderLength = 3;
				break;
			case "left":
				delete borders.right;
				borderLength = 3;
				break;
			case "up":
				delete borders.down
				borderLength = 3;
				break;
			case "down":
				delete borders.up
				borderLength = 3;
				break;
			default:
				borderLength = 4;

		}
		let bridgeCount = 0;

		do{
			let randomId = Math.floor(Math.random()*borderIds.length);

			for(let border in borders){
				let borderId = borderIds[randomId]+borders[border];
				if(arr[borderId]!==undefined){
					if(arr[borderId].props.type==="wall"){
						bridges[border] = borderId;
						delete borders[border];
						borderIds.splice(borderId,1);
						bridgeCount+=1;
						break;
					}
				}
			}
		}while(bridgeCount<borderLength)

		return bridges;
	}

	_findRoomBorder(roomIds,arr){
		const borders=[-1,1,-100,100];
		let borderIds = [];
		for(let i=0;i<roomIds.length;i++){
			for(let j=0;j<borders.length;j++){
				let borderId = roomIds[i]+borders[j];
				if(arr[borderId].props.type==="wall"){
					borderIds.push(roomIds[i]);
				}
			}
		}
		return borderIds;
	}

	_checkForRoomOverlap(roomIds, arr){
		for (let i=0;i<roomIds.length;i++){
			if(arr[roomIds[i]].props.type==="area"){
				return false;
			} else{
				for(let j=0;j<arr[roomIds[i]].props.brdSqIds.length;j++){
					if(arr[arr[roomIds[i]].props.brdSqIds[j]].props.type==="area"){
						return false;
					}
				}
			}
		}

		return true;
	}

	_createRoom(roomIds,arr){
		for (let i=0;i<roomIds.length;i++){
			arr[roomIds[i]].props.type="area";
			arr[roomIds[i]].props.roomIds = roomIds;
		}
		return arr;
	}

	_trimBridge(arr){
		let drct = [1,-1,100,-100];

		let deadEnd = false;

		do{
			deadEnd = false;
			for(let j=0;j<arr.length;j++){
				if(arr[j].props.type==="hall"){
					let k=0;
					let l= 0;
					for(let i=0;i<drct.length;i++){
						if(arr[j+drct[i]]!==undefined){
							if(arr[j+drct[i]].props.type==="wall"){
								k++;
							}else if(arr[j+drct[i]].props.type==="hall"){
								l++;
							}
						}else{
							k++;
						}
					}

					if(k>2||l>2){
						arr[j].props.type="wall";
						deadEnd = true;
					}
				}
			}
		}while(deadEnd)

		return arr;
	}

	_placePlayer(arr){
		let rndArea = 0;
		let playerPlaced = false;
		do{
			rndArea = Math.floor((Math.random()*this.state.tiles));
			if(arr[rndArea].props.type==="area"){
				arr[rndArea].props.type="player";
				arr = this._generateFogOfWar(arr,rndArea);
				playerPlaced = true;
			}
		}while(playerPlaced===false)

		this.setState({playerPosition:rndArea});

		return arr;
	}

	_generateExtraFog(playerId,borderArr){
		const extraFogArr = [[-2,0],[2,0],[0,-2],[0,2],
							[2,2],[-2,-2],[-2,2],[2,-2],
							[-2,1],[-2,-1],[2,-1],[2,1],
							[-1,-2],[-1,2],[1,2],[1,-2]]

		const RW_LNGTH=100;

		for(let i=0;i<extraFogArr.length;i++){
			borderArr.push(extraFogArr[i][0]+(extraFogArr[i][1]*RW_LNGTH)+playerId);
		}

		return borderArr;
	}

	_generateFogOfWar(arr,playerId){
		let playerBrdSqs= this._generateExtraFog(playerId,arr[playerId].props.brdSqIds);
		for(let i=0;i<arr.length;i++){
			if(i!==playerId){
				let notBorder = false;
				for(let j=0;j<playerBrdSqs.length;j++){
					if(i===playerBrdSqs[j]){
						notBorder = false;
						break;
					}else{
						notBorder = true;
					}
				}

				arr[i].props.fog=notBorder;
			}
		}
		return arr;
	}

	_removeFogOfWar(arr,playerId){
		let playerBrdSqs= this._generateExtraFog(playerId,arr[playerId].props.brdSqIds);
		for(let i =0;i<playerBrdSqs.length;i++){
			let j =playerBrdSqs[i];
			arr[j]=<Tile id={j} 
						 key={j}
						 brdSqIds={arr[j].props.brdSqIds} 
						 type={arr[j].props.type} 
						 rmId={arr[j].props.rmId} 
						 fog={false}/>
		}

		return arr;
	}

	_checkForDup(hallwayArr,newHall){
		for(let i = 0;i<hallwayArr.length;i++){
			if(hallwayArr[i][0]===newHall[0]&&hallwayArr[i][1]===newHall[1]){
				return true;
			}
		}
		return false;
	}

	_generateRoomIds(id,h,w,direction){
		let arr = [];
		const RW_LNGTH = 100;
	    const max_Y = 9999;
	    let adjustment = 0;

	    switch (direction) {
	    	case "left":
	    		adjustment = -w+1;
	    		break;
	    	case "up":
	    		adjustment = -h*RW_LNGTH+RW_LNGTH;
	    		break;
	    }

	    id+=adjustment;

	    if(id<200||id>9800||
	    	(id+w)+(h*RW_LNGTH)>max_Y||
	    	id%RW_LNGTH>(id+w)%RW_LNGTH||
	    	id%RW_LNGTH===99||id%RW_LNGTH===0||
	    	(id+w)%RW_LNGTH>97||(id+w)%RW_LNGTH<2){
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

	componentDidUpdate(){
		var e = document.getElementsByClassName('player')["0"];
	  	var b = document.getElementById('board');
	  	b.scrollTop=e.offsetTop-b.offsetTop-100;
	  	b.focus();
	}

	_handleKeyDown(e){
		e.preventDefault();
		let arr = this.state.cells;
		let dir = 0;
		switch (e.keyCode) {
			case 38:
				dir = -100;
				break;
			case 39:
				dir = 1;
				break;
			case 40:
				dir = 100;
				break;
			case 37:
				dir = -1;
				break;
		}
		
		let plyrPstn = this.state.playerPosition;
		let newPstn = plyrPstn+dir;

		if(arr[newPstn].props.type!=="wall"){
			let weapon = this.state.weapon;
			let health = this.state.health;
			let chngType;

			switch (arr[newPstn].props.type) {
				case "weapon":
					weapon = this._updateWeapon(this.state.floor);
					chngType = "area";
					break;
				case "health":
					health = this.state.health + 10;
					chngType = "area";
					break;
				case "enemy":
					let enemyHealth = this._fightEnemy(this.state.level, this._findEnemyHealth(newPstn),this.state.weapon);
					if(this._updateEnemyHealth(enemyHealth,newPstn,this.state.enemies)===false){
						this._updateXpAndLevel(this.state.xp,50);
						chngType = "area";
					}else{
						let playerHealth = this._fightPlayer(this.state.health,this.state.floor*5);
						if(playerHealth<=0){
							alert("You lose!");
							this._restartGame();
							return;
						}else{
							return;
						}
					}
					break;
				case "big-boss":
					let bigBossHealth = this._fightEnemy(this.state.level,this.state.bigBossHealth,this.state.weapon);
					console.log(bigBossHealth)
					if(this._updateBigBossHealth(bigBossHealth)===false){
						alert("You win!");
						this._restartGame();
					}else{
						let playerHealth = this._fightPlayer(this.state.health,50);
						if(playerHealth<=0){
							alert("You lose!");
							this._restartGame();
							return;
						}else{
							return;
						}
					}
					break;
			}

			let temp = arr[newPstn];
			arr[plyrPstn] = <Tile id={plyrPstn} 
						   key={plyrPstn} 
						   brdSqIds={arr[plyrPstn].props.brdSqIds} 
						   type={chngType||temp.props.type} 
						   rmId={arr[plyrPstn].props.rmId} 
						   fog={arr[plyrPstn].props.fog}/>;

			arr[newPstn] = <Tile id={newPstn} 
						   key={newPstn} 
						   brdSqIds={temp.props.brdSqIds} 
						   type={"player"} 
						   rmId={temp.props.rmId} 
						   fog={temp.props.fog}/>;

			arr = this._removeFogOfWar(arr,newPstn);
			this.setState({	cells: arr, 
							playerPosition:newPstn,
							weapon:weapon,
							health:health,
						});		
		}
	}

	_updateXpAndLevel(currXp, addXp){
		let newXp = currXp+addXp;
		if(newXp>=100){
			this.setState({level:this.state.level+1, xp:0});
		}else{
			this.setState({xp:newXp});
		}
		return;
	}

	_restartGame(){
		this.setState({
			tiles: 10000,
			cells: [],
			playerPosition: null,
			floor:1,
			weapon:"Knuckles",
			health:100,
			level:1,
			xp:0,
			enemies: [],
			bigBossHealth:500
		});
		this._generateCells();
	}

	_updateBigBossHealth(health){
		if(health<=0){
			return false;
		}else{
			this.setState({bigBossHealth: health});
			return true;
		}
	}

	_findEnemyHealth(id){
		for(let i=0;this.state.enemies.length;i++){
			if(this.state.enemies[i].location===id){
				return this.state.enemies[i].health;
			}
		}
	}

	_updateWeapon(floor){
		switch(floor){
			// case 1:
			// 	return "Bat";
			// 	break;
			// case 2:
			// 	return "Spear";
			// 	break;
			// case 3:
			// 	return "Mace";
			// 	break;
			case 1:
				return "Sword of Truth";
				break;
		}
	}

	_updateEnemyHealth(enemyHealth,id,enemies){
		for(let i=0;i<enemies.length;i++){
			if(enemies[i].location===id){
				enemies[i].health=enemyHealth;
				if(enemies[i].health<=0){
					enemies.splice(i,1);
					this.setState({enemies:enemies});
					return false;
				}else{
					this.setState({enemies:enemies});
					return true;
				}
			}
		}
	}

	_fightEnemy(level,enemyHealth,weapon){
		const weapons = {"Knuckles":1,
						"Bat":5,
						"Spear":10,
						"Mace":15,
						"Sword of Truth": 50};

		const playerMaxAttack=level*weapons[weapon];
		let playerAttack = Math.floor(Math.random()*(playerMaxAttack-4+1)+4);
		return  enemyHealth-playerAttack;
	}

	_fightPlayer(playerHealth,maxHp){
		let enemyAttack = Math.floor(Math.random()*maxHp)+1;
		let health = playerHealth - enemyAttack;
		this.setState({health:health});
		return health;
	}

	render(){
		return(
			<div>
				<TitleBar 
					health={this.state.health} 
					xp={this.state.xp} 
					level={this.state.level}
					weapon={this.state.weapon}
					floor={this.state.floor}/>
				<div tabIndex="0" onKeyDown={this._handleKeyDown.bind(this)} id="board">
					{this.state.cells}
				</div>
			</div>
		);
	}
}


class Tile extends React.Component {
	render(){
		let fog;
		if(this.props.fog){
			fog="cell fog";
		}else{
			fog="cell";
		}
		return(
			<div className={`${this.props.type} ${fog}`}>
			</div>
		);
	}
}

ReactDOM.render(<RogueApp />, document.getElementById('rogue-app'))