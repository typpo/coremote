import React from 'react';
import ReactDOM from 'react-dom';

import ControlPanel from './ControlPanel';
import People from './People';

const title = 'React with Webpack and Babel';

ReactDOM.render(
  <div>
    <div>
      <ControlPanel status={window.state.status} mood={window.state.mood} />
    </div>
    <div>
      <People />
    </div>
  </div>,
  document.getElementById('app'),
);
