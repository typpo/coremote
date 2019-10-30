import React from 'react';

import Person from './Person';

class People extends React.Component {
  constructor() {
    super();
    this.state = {
      people: [],
    };
  }

  componentDidMount() {
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
