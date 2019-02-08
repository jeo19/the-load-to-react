import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import {
  DEFAULT_QUERY,
  DEFAULT_HPP,
  PATH_BASE,
  PATH_SEARCH,
  PARAM_PAGE,
  PARAM_SEARCH,
  PARAM_HPP
} from "./constants";
import { sortBy } from "lodash";
import PropTypes from "prop-types";
import ClassNames from "classnames";
const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, "title"),
  AUTHOR: list => sortBy(list, "author"),
  COMMENTS: list => sortBy(list, "num_comments").reverse(),
  POINTS: list => sortBy(list, "points").reverse()
};
class App extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      results: null,
      searchKey: "",
      searchTerm: DEFAULT_QUERY,
      error: null,
      isLoading: false,
      sortKey: "NONE",
      isSortReverse: false
    };
    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onSort = this.onSort.bind(this);
  }
  onSort = sortKey => {
    const isSortReverse =
      this.state.sortKey === sortKey && !this.state.isSortReverse;
    this.setState({ sortKey, isSortReverse });
  };
  needsToSearchTopStories = searchTerm => !this.state.results[searchTerm];
  onSearchChange = event => {
    this.setState({
      searchTerm: event.target.value
    });
  };
  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.setState({
      searchKey: searchTerm
    });
    if (this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm);
    }
    event.preventDefault();
  }
  onDismiss = id => {
    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];
    const isNotId = item => item.objectID !== id;
    const updatedHits = hits.filter(isNotId);
    // const updateList = this.state.list.filter(item => item.objectID !== id);
    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page }
      }
    });
  };

  // setSearchTopStories = result => this.setState(result);
  setSearchTopStories(result) {
    const { hits, page } = result;
    const { searchKey, results } = this.state;
    // const oldHits = page !== 0 ? this.state.result.hits : [];
    const oldHits =
      results && results[searchKey] ? results[searchKey].hits : [];
    const updatedHits = [...oldHits, ...hits];
    //   this.setState({
    //     result: { hits: updatedHits, page }
    //   });
    // }
    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page }
      }
    });
  }
  fetchSearchTopStories(searchTerm, page = 0) {
    axios(
      `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`
    )
      .then(result => this._isMounted && this.setSearchTopStories(result.data))
      .catch(e => this._isMounted && this.setState({ error: e }));
    this.setState({
      isLoading: true
    });
  }
  componentDidMount() {
    const { searchTerm } = this.state;
    this._isMounted = true;
    this.setState({
      searchKey: searchTerm
    });
    this.fetchSearchTopStories(searchTerm);
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  render() {
    const {
      searchKey,
      results,
      sortKey,
      searchTerm,
      error,
      isLoading,
      isSortReverse
    } = this.state;
    // console.log(results);
    const page =
      (results && results[searchKey] && results[searchKey].page) || 0;
    // if (!result) {
    //   return null;
    // }
    const list =
      (results && results[searchKey] && results[searchKey].hits) || [];
    return (
      <div className="page">
        <div className="interactions">
          {/* Spilit up Components Start */}
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            Search
          </Search>
        </div>
        {error ? (
          <div className="interactions">
            <p>No results for your search. </p>
          </div>
        ) : (
          <div className="interactions">
            <Table
              list={list}
              onDismiss={this.onDismiss}
              sortKey={sortKey}
              onSort={this.onSort}
              isSortReverse={isSortReverse}
            />
            {isLoading ? (
              <Loading />
            ) : (
              <ButtonWithLoading
                isLoading={isLoading}
                onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}
              >
                More
              </ButtonWithLoading>
            )}
          </div>
        )}
        {/* End */}
      </div>
    );
  }
}
class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.input.focus();
  }
  render() {
    const { value, onChange, onSubmit, children } = this.props;
    return (
      <form onSubmit={onSubmit}>
        <input
          type="Text"
          onChange={onChange}
          value={value}
          ref={node => {
            this.input = node;
          }}
        />
        <button type="submit">{children}</button>
      </form>
    );
  }
}
// const Search = ({ value, onChange, onSubmit, children }) => {
//   let input;
//   return (
//     <form onSubmit={onSubmit}>
//       <input
//         type="Text"
//         onChange={onChange}
//         value={value}
//         ref={node => {
//           input = node;
//         }}
//       />
//       <button type="submit">{children}</button>
//     </form>
//   );
// };
class Table extends Component {
  render() {
    const { list, onDismiss, sortKey, onSort, isSortReverse } = this.props;
    const sortedList = SORTS[sortKey](list);
    const reverseSortedList = isSortReverse ? sortedList.reverse() : sortedList;
    return (
      <div className="table">
        <div className="table-header">
          <span style={{ width: "40%" }}>
            <Sort sortKey={"TITLE"} onSort={onSort} activeSortKey={sortKey}>
              Title
            </Sort>
          </span>
          <span style={{ width: "30%" }}>
            <Sort sortKey={"AUTHOR"} onSort={onSort} activeSortKey={sortKey}>
              Author
            </Sort>
          </span>
          <span style={{ width: "10%" }}>
            <Sort sortKey={"COMMENTS"} onSort={onSort} activeSortKey={sortKey}>
              Comments
            </Sort>
          </span>
          <span style={{ width: "10%" }}>
            <Sort sortKey={"POINTS"} onSort={onSort} activeSortKey={sortKey}>
              Points
            </Sort>
          </span>
          <span style={{ width: "10%" }}>Archive</span>
        </div>
        {reverseSortedList.map(item => (
          <div key={item.objectID} className="table-row">
            <span style={largeColumn}>
              <a href={item.url}>{item.title}</a>
            </span>
            <span style={mediumColumn}>{item.author}</span>
            <span style={smallColumn}>{item.num_comments}</span>
            <span style={smallColumn}>{item.points}</span>
            <span style={smallColumn}>
              <Button
                onClick={() => onDismiss(item.objectID)}
                className="button-inline"
              >
                Dismiss
              </Button>
            </span>
          </div>
        ))}
      </div>
    );
  }
}
const Button = ({ onClick, className, children }) => (
  <button onClick={onClick} className={className} type="button">
    {children}
  </button>
);
const Loading = () => <div>Loading...</div>;
// Hoc Start
const withLoading = Component => ({ isLoading, ...rest }) =>
  isLoading ? <Loading /> : <Component {...rest} />;
//End
const ButtonWithLoading = withLoading(Button);
const Sort = ({ sortKey, onSort, children, activeSortKey }) => {
  const sortClass = ClassNames("button-inline", {
    "button-active": sortKey === activeSortKey
  });

  return (
    <Button onClick={() => onSort(sortKey)} className={sortClass}>
      {children}
    </Button>
  );
};
// Typechecking with PropTypes Start
Button.propTypes = {
  onClick: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.node
};
Button.defaultProps = {
  className: ""
};
Table.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      objectID: PropTypes.string.isRequired,
      author: PropTypes.string,
      url: PropTypes.string,
      num_comments: PropTypes.number,
      points: PropTypes.number
    })
  ),
  onDismiss: PropTypes.func.isRequired
};
Search.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  children: PropTypes.node
};
// End
const largeColumn = {
  width: "40%"
};
const mediumColumn = {
  width: "30%"
};
const smallColumn = {
  width: "10%"
};
//End
export default App;
export { Button, Search, Table };
