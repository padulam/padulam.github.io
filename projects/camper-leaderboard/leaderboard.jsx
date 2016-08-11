class LeaderBoard extends React.Component{
	constructor(){
		super();

		this.state = {
			campers: [],
			allTimeView: false,
			recentView: true
		}
	}

	componentDidMount(){
		this._getLeaders("https://fcctop100.herokuapp.com/api/fccusers/top/recent","recent");
	}

	_getLeaders(leaderUrl,score){
		$.ajax({
			method: 'GET',
			url: leaderUrl,
			success: (campers) => {
				campers.sort(function(a,b){
					return b[score] - a[score];
				})
				this.setState({campers});
			}
		});
	}

	handleClick(timeframe){
		if(timeframe ==="recent"){
			this.setState({recentView: true, alltimeView: false});
			this._getLeaders("https://fcctop100.herokuapp.com/api/fccusers/top/recent","recent");
		} else if(timeframe ==="alltime"){
			this.setState({recentView: false, alltimeView: true});
			this._getLeaders("https://fcctop100.herokuapp.com/api/fccusers/top/alltime","alltime");
		}
	}

	_getCampers(){
		let i =0;
		return this.state.campers.map((camper) => {
			i++;
			return(
				<Camper id={i} username = {camper.username} alltime = {camper.alltime} recent = {camper.recent} profilepic={camper.img}/>
			);
		});
	}

	render(){
		const campers = this._getCampers("campers");
		let allTimeIcon,
			recentTimeIcon;

		if(this.state.recentView){
		    recentTimeIcon = <i className="fa fa-sort-desc"></i>;
		 } else{
		 	allTimeIcon = <i className="fa fa-sort-desc"></i>;
		 }

		return(<table className="table table-striped leader-table">
		<caption>Leaderboard</caption>
		<thead>
		  <tr>
		    <th>#</th>
		    <th>Camper Name</th>
		    <th><a href="#" onClick={this.handleClick.bind(this,"recent")}>Points in the Past 30 Days {recentTimeIcon}</a></th>
		    <th><a href ="#" onClick={this.handleClick.bind(this,"alltime")}>All Time Points {allTimeIcon}</a></th>
		  </tr>
		 </thead>
		 <tbody>
		  {campers}
		 </tbody>
		</table>);
	};
}

function Camper(props){
		return(
			<tr>
				<td>{props.id}</td>
				<td><img src={props.profilepic} className="profile-pic" alt="User Profile Image"/> {props.username}</td>
				<td>{props.recent}</td>
				<td>{props.alltime}</td>
			</tr>
		);
}

ReactDOM.render(
  <LeaderBoard />, document.getElementById("leader-board")
)