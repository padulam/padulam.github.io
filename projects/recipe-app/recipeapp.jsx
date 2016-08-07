function Ingredient(props){
	return(
		<tr><td>{props.name.trim()}</td></tr>
	);
}

class Recipe extends React.Component{
	constructor() {
	  super();
	
	  this._handleEdit = this._handleEdit.bind(this);
	  this._handleRemoval = this._handleRemoval.bind(this);
	}

	_getIngredients(){
		return this.props.ingredients.map((ingredient)=>{
			return <Ingredient name={ingredient} />;
		})

	}

	_handleEdit(){
		this.props.editRecipe(this.props.id);
	}

	_handleRemoval(){
		this.props.removeRecipe(this.props.id);
	}

	render(){	
		const ingredients = this._getIngredients();
		return(
			<div className="panel panel-default" key = {this.props.id}>
				<div className="panel-heading recipe-title" role="tab" id={`heading${this.props.id}`}>
					<h4 className="panel-title recipe-name">
						<a role="button" data-toggle="collapse" data-parent="#accordion" href={`#collapse${this.props.id}`} aria-expanded="false" aria-controls={`collapse${this.props.id}`}>
							{this.props.name}
						</a>
					</h4>
					<RemoveRecipe removeRecipe={this._handleRemoval}/>
					<EditRecipe editRecipe={this._handleEdit}/>
				</div>
				<div id={`collapse${this.props.id}`} className="panel-collapse collapse" role="tabpanel" aria-labelledby={`heading${this.props.id}`}>
					<div className="panel-body">
						<table className="table table-bordered ingredient-table">
							<caption>Ingredients</caption>
							<tbody>
								{ingredients}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		);
	};
}

class RecipeApp extends React.Component{
	constructor(){
		super();

		this.state = {
			recipe: {name:'',ingredients:''},
			recipes: []
		};
	}

	componentDidMount(){
		this._locateStoredRecipes();
	}

	componentWillUpdate(nextProps, nextState){
		localStorage.setItem('_username_recipes', JSON.stringify(nextState.recipes));
	}

	_locateStoredRecipes(){
		//localStorage.removeItem('_username_recipes')
		const recipes = JSON.parse(localStorage.getItem('_username_recipes'));

		if(recipes !== null){
			this.setState({recipes: recipes});
		}
	}

	_getRecipes(){
		return this.state.recipes.map((recipe)=>{
			return <Recipe
				id= {recipe.id}
				name={recipe.name}
				ingredients={recipe.ingredients}
				editRecipe = {this._editRecipe.bind(this)}
				removeRecipe = {this._removeRecipe.bind(this)}
				key= {recipe.id} />;
		});
	}

	_addRecipe(recipeName, ingredientList, recipeId){
		if(recipeId!==undefined){
			let recipes = this.state.recipes
			recipes[recipeId - 1] = {
				id: recipeId,
				name: recipeName,
				ingredients: ingredientList
			}
			this.setState({
				recipes: recipes
			})
		} else{
			const recipe = {
				id: this.state.recipes.length + 1,
				name: recipeName,
				ingredients: ingredientList
			};
			this.setState({
				recipes: this.state.recipes.concat([recipe])
			});
		}
	}

	_editRecipe(recipeId){
		this.setState({recipe: this.state.recipes[recipeId-1]})
	}

	_removeRecipe(recipeId){
		const recipes = this.state.recipes.filter(e => e.id !== recipeId);
		this.setState({recipes: recipes});
	}

	render(){
		const recipes = this._getRecipes();
		return(
			<div className="container">
				<div className="panel-group recipe-container" id="accordion" role="tablist" aria-multiselectable="true">
					{recipes}
				</div>
				<AddRecipe />
				<RecipeForm defaultRecipe={this.state.recipe} addRecipe={this._addRecipe.bind(this)}/>
			</div>
		);
	}
}

class EditRecipe extends React.Component {
	constructor() {
	  super();
	
	  this._handleClick = this._handleClick.bind(this);
	}

	_handleClick(){
		this.props.editRecipe();
	}

	render(){
		return(
			<button data-toggle="modal" data-target="#recipeForm" className="edit-button" onClick={this._handleClick}>
				<span className="edit-icon glyphicon glyphicon-pencil"></span><span className="sr-only">Edit</span>
			</button>
		);
	}
}

class RemoveRecipe extends React.Component {
	constructor() {
		super();

		this._handleClick = this._handleClick.bind(this);
	}

	_handleClick(){
		this.props.removeRecipe();
	}

	render(){
		return(
			<button className="remove-button" onClick={this._handleClick}>
				<span className="remove-icon glyphicon glyphicon-trash"></span><span className="sr-only">Remove</span>
			</button>
		);
	}
}

class AddRecipe extends React.Component {
  	render(){
  		return(
    		<button className="btn btn-primary" data-toggle="modal" data-target="#recipeForm">Add Recipe</button>
    	);
  	}
}

class RecipeForm extends React.Component {
	constructor(props) {
	  super(props);
	  this.state = {
	  	name: '',
	  	ingredients: ''
	  }

	  this._handleSubmit = this._handleSubmit.bind(this);
	}

	_handleSubmit(event){
		event.preventDefault();
		let name = this.state.name||this.props.defaultRecipe.name;
		let ingredients = this.state.ingredients||this.props.defaultRecipe.ingredients;
		let id = this.props.defaultRecipe.id;
		if(typeof ingredients==='string'){
			ingredients = ingredients.split(',');
		}
		this.props.addRecipe(name, ingredients, id);
		this.setState({name: '', ingredients:''})
		$('#recipeForm').modal('toggle');
	}

	_onNameChange(e){
		this.setState({name: e.target.value})
	}

	_onIngChange(e){
		this.setState({ingredients: e.target.value})
	}

	render(){
		return(
			<div className="modal fade" id="recipeForm" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
			  <div className="modal-dialog" role="document">
			    <div className="modal-content">
			      <div className="modal-header">
			        <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
			        <h4 className="modal-title">Add Your Favorite Recipe</h4>
			      </div>
			      <form onSubmit={this._handleSubmit}>
			        <div className="modal-body">
			          <div className="form-group">
			            <label for="recipe">Recipe:</label>
			            <input type="text" value={this.state.name||this.props.defaultRecipe.name} onChange={this._onNameChange.bind(this)} id="recipe" className="form-control" placeholder="Please input recipe name" />
			          </div>
			          <div className="form-group">
			            <label for="ingredients">Ingredients:</label>
			            <textarea id="ingredients" value={this.state.ingredients||this.props.defaultRecipe.ingredients} onChange={this._onIngChange.bind(this)} className="form-control" placeholder="Please input comma separated list of ingredients (ex. apples, pie crust, butter)" />
			          </div>
			        </div>
			        <div className="modal-footer">
			        	<button type="submit" className="btn btn-primary">Save</button>
			          	<button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
			        </div>
			      </form>
			    </div>
			  </div>
			</div>
		);
	}
}

ReactDOM.render(
	<RecipeApp />, document.getElementById("recipe-app")
);