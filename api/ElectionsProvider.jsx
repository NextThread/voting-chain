import React, { Component, createContext } from 'react';

import { db } from './firebase';

const ElectionsContext = createContext({
  elections: []
});

export class ElectionsProvider extends Component {
  state = {
    elections: []
  };

  componentDidMount() {
    db.collection('elections')
      .get()
      .then(querySnapshot => {
        var elections = [];

        querySnapshot.forEach(function(doc) {
          elections.push(formatElectionDoc({ id: doc.id, ...doc.data() }));
        });

        this.setState({ elections });
      });
  }

  render() {
    return (
      <ElectionsContext.Provider value={{ elections: this.state.elections }}>
        {this.props.children}
      </ElectionsContext.Provider>
    );
  }
}

/**
 * @param {{ [x: string]: any; id?: string; start?: any; end?: any; }} doc
 */
function formatElectionDoc(doc) {
  const { start, end, ...rest } = doc;

  const startTime = start.toDate();
  const endTime = end.toDate();
  const now = new Date();

  let status;

  if (now < startTime) status = 'nominating';
  else if (now > startTime && now < endTime) status = 'voting';
  else status = 'done';

  return {
    start: startTime,
    end: endTime,
    ...rest,
    status
  };
}

export default ElectionsContext;
