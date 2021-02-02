import React, { Component } from "react";
import { loadBugs, resolveBug, getUnresolvedBugs } from "../store/bugs";
import { connect } from "react-redux";

class Bugs extends Component {
  componentDidMount() {
    this.props.loadBugs();
  }

  render() {
    return (
      <ul>
        {this.props.bugs.map((bug) => (
          <li key={bug.id}>
            {bug.description}
            <button onClick={() => this.props.getUnresolveBug(bug.id)}>
              Resolve
            </button>
          </li>
        ))}
      </ul>
    );
  }
}

const mapStateToProps = (state) => ({ bugs: getUnresolvedBugs(state) }); // the value of bugs is going to be passed to our component as a prop

// This function takes the dispatch func from the store and map it to the props for a component.
const mapDispatchToProps = (dispatch) => ({
  loadBugs: () => dispatch(loadBugs()),
  resolveBug: (id) => dispatch(resolveBug(id)),
});

// First argumment is a function that specifies what part of this store, this component is interesed in. In our case is: state.entities.bugs.list or getUnresolvedBugs(state)
// The component that is return from this expression is called a container component
export default connect(mapStateToProps, mapDispatchToProps)(Bugs); // bugs component it ends up being a dummy or presentation component, because it does nothing it only knows
// how to present data.

/* //  CODE WITH OUT THE REACT-REDUX LIBRARY

export default Bugs;
import React, { Component } from "react";
import StoreContext from "../context/storeContext";
import { loadBugs } from "../store/bugs";
import { loadBugs } from './../../store/bugs';

class Bugs extends Component {
  static contextType = StoreContext;

  state = { bugs: [] };

  componentDidMount() {
    const store = this.context;

    this.unsubscribe = store.subscribe(() => {
      const bugsInStore = store.getState().entities.bugs.list;
      if (this.state.bugs !== bugsInStore) this.setState({ bugs: bugsInStore });
    });

    store.dispatch(loadBugs());
  }
  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    return (
      <ul>
        {this.state.bugs.map((bug) => (
          <li key={bug.id}>{bug.description}</li>
        ))}
      </ul>
    );
  }
}

export default Bugs;
 */
