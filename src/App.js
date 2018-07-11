import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const App = ({ name }) => (
  <Fragment>
    <h1>Hello webpack! {name}</h1>
    <input type="text" placeholder="hello" />
    <div id="section">
      <p>这是一句话</p>
    </div>
  </Fragment>
);

App.propTypes = {
  name: PropTypes.string,
};

App.defaultProps = {
  name: '',
};

export default App;
