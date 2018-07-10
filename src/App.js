import React from 'react';
import PropTypes from 'prop-types';

const App = ({ name }) => <h1>Hello webpack! {name}</h1>;

App.propTypes = {
  name: PropTypes.string,
};

App.defaultProps = {
  name: '',
};

export default App;
