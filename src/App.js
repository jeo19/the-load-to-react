import React, { Component } from "react";
import "./App.css";
const list = [
  {
    title: "react",
    url: "https://reactjs.org",
    author: "Jordan Walke",
    num_comments: 3,
    points: 4,
    objectID: 0
  },
  {
    title: "Redux",
    url: "https://redux.js.org",
    author: "Dan Abramov, Andrew Clark",
    num_comments: 2,
    points: 5,
    objectID: 1
  }
];
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list,
      searchTerm: ""
    };
    /* The added section Start */
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    /* End */
  }
  onSearchChange = event => {
    this.setState({
      searchTerm: event.target.value
    });
  };
  /* The added section Start */
  onDismiss = id => {
    const isNotId = item => item.objectID !== id;
    const updatedList = this.state.list.filter(isNotId);
    // const updateList = this.state.list.filter(item => item.objectID !== id);
    this.setState({ list: updatedList });
  };
  /* End */
  render() {
    //Destructuring an Object and Array
    const { searchTerm, list } = this.state;
    //End
    // Ex:Use class object start//
    const robin = new Developer("Dan", "Abramov");
    console.log(robin.getName());
    //End
    return (
      <div className="App">
        {/* Spilit up Components Start */}
        <Search value={searchTerm} onChange={this.onSearchChange}>
          Search
        </Search>
        <Table list={list} pattern={searchTerm} onDismiss={this.onDismiss} />
        {/* End */}
      </div>
    );
  }
}
// Defined HOF(High Order Function)
const isSearched = searchTerm => item =>
  item.title.toLowerCase().includes(searchTerm.toLowerCase());

//End
class Developer {
  constructor(firstname, lastname) {
    this.firstname = firstname;
    this.lastname = lastname;
  }
  getName() {
    return this.firstname + " " + this.lastname;
  }
}
class Search extends Component {
  render() {
    const { value, onChange, children } = this.props;
    return (
      <form>
        {children}&nbsp;
        <input type="Text" onChange={onChange} value={value} />
      </form>
    );
  }
}
class Table extends Component {
  render() {
    const { list, pattern, onDismiss } = this.props;
    return (
      <div>
        {list.filter(isSearched(pattern)).map(item => (
          <div key={item.objectID}>
            <span>
              <a href={item.url}>{item.title}</a>
            </span>
            <span>{item.author}</span>
            <span>{item.num_comments}</span>
            <span>{item.points}</span>
            {/* The added section Start */}
            <span>
              <Button onClick={() => onDismiss(item.objectID)}>Dismiss</Button>
            </span>
            {/* End */}
          </div>
        ))}
      </div>
    );
  }
}
class Button extends Component {
  render() {
    const { onClick, className = "", children } = this.props;
    return (
      <button onClick={onClick} className={className}>
        {children}
      </button>
    );
  }
}
export default App;
