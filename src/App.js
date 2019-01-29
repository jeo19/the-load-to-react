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
      list
    };
    /* The added section Start */
    this.onDismiss = this.onDismiss.bind(this);
    /* End */
  }
  /* The added section Start */
  onDismiss = id => {
    const isNotId = item => item.objectID !== id;
    const updatedList = this.state.list.filter(isNotId);
    // const updateList = this.state.list.filter(item => item.objectID !== id);
    this.setState({ list: updatedList });
  };
  /* End */
  render() {
    // Ex:Use class object start//
    const robin = new Developer("Dan", "Abramov");
    console.log(robin.getName());
    //End
    return (
      <div className="App">
        {this.state.list.map(item => (
          <div key={item.objectID}>
            <span>
              <a href={item.url}>{item.title}</a>
            </span>
            <span>{item.author}</span>
            <span>{item.num_comments}</span>
            <span>{item.points}</span>
            {/* The added section Start */}
            <span>
              <button onClick={() => console.log(item.objectID)} type="button">
                dismiss
              </button>
              <button onClick={console.log(item.author)} type="button">
                dismiss once
              </button>
            </span>
            {/* End */}
          </div>
        ))}
      </div>
    );
  }
}
class Developer {
  constructor(firstname, lastname) {
    this.firstname = firstname;
    this.lastname = lastname;
  }
  getName() {
    return this.firstname + " " + this.lastname;
  }
}
export default App;
