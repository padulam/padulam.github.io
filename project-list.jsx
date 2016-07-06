class Project extends React.Component {
  render(){
    return(
	<li className="pic-item">
		<a href= {this.props.url} target="_blank">
			<img className="project-screenshots" src={this.props.image} alt={`Screenshot of ${this.props.name}`}/>
			<div className="caption">
				<div className="blur"></div>
				<div className="caption-text">
				<h1>{this.props.name}</h1>
				<p>Matthew Padula</p>
				</div>
			</div>
		</a>
	</li>
    )
  }
}

class ProjectList extends React.Component {
	constructor(props) {
		super(props);

		this.state = {projects:[]};
	}

	componentDidMount(){
		this._getProjects("projects.json");
	}

	_getProjects(projectUrl){
		$.ajax({
			method: 'GET',
			url: projectUrl,
			dataType: "json",
			success: (projects)=>{
				this.setState({projects: projects})
			}
		})
	}

	_getProjectList(){
		return this.state.projects.map((project)=>{
			return(
				<Project 
					id={project.id} 
					key={project.id} 
					name={project.name}
					url={project.url}
					image={project.screenshot}
				/>
			)
		});
	}

	render(){
		const projects = this._getProjectList();

		return(
			<ul className="caption-style-1">
				{projects}
			</ul>
		)
  	}
}

ReactDOM.render(
	<ProjectList />, document.getElementById('projectContainer')
)