	class MarkdownPreview extends React.Component {
	  constructor() {
	    super();
	    this.state = { words: 'Heading\n===\n\nSubheading' +
	    					   '\n---\n\n### Third Heading' +
	    					   '\n\nBulleted List' +
	    					   '\n* Item\n* Item\n* Item'+
	    					   '\n\nNumber List' +
	    					   '\n1. Item\n2. Item\n3. Item' +
	    					   '\n\n*italic*, **bold**, '+
	    					   '`monospace`, ~~strikethrough~~' +
	    					   '\n\n```javascript\n///Code block'+
	    					   '\n\nconsole.log("Hello world!)"' +
	    					   '\n```\n\n[Matthew Padula]'+
	    					   '(https://www.freecodecamp.com/padulam)'};
      this.handleChange = this.handleChange.bind(this);
	  };

	  cMarkup() {
	    var cMarkup = marked(this.state.words.toString(), {
	      sanitize: true
	    });
	    return {__html: cMarkup};
	  }

	  handleChange(event) {
	    this.setState({words: event.target.value});
	  };

	  render() {
	    return (
	      <div className="container main">
          	<div className="col-md-6 fill">
           		<textarea onChange={this.handleChange} value={this.state.words}/>
          	</div>
			<div className="col-md-6 fill">
				<span dangerouslySetInnerHTML={this.cMarkup()} />
			</div>
		</div>
	    );
	  }
	}

	ReactDOM.render(
	  <MarkdownPreview />, document.getElementById("markdown-app")
	);