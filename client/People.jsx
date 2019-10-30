import React from 'react';

import Person from './Person';

const REFRESH_RATE_MS = 11000;

class People extends React.Component {
  constructor() {
    super();
    this.state = {
      people: [],
    };
  }

  refresh() {
    fetch('/api/people')
      .then((resp) => {
        return resp.json();
      })
      .then((data) => {
        this.setState({
          people: data.people,
        });
      });
  }

  componentDidMount() {
    this.refresh();
    setInterval(() => {
      this.refresh();
    }, REFRESH_RATE_MS);
  }

  render() {
    if (!this.state.people || this.state.people.length < 1) {
      return null;
    }
    const persons = this.state.people.map(person => (
      <Person key={person.id} image={person.image} status={person.status} mood={person.mood} />
    ));
    return (
      <div className="flex-container">
        {persons}
      </div>
    );
  }
}

export default People;
