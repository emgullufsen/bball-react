import React from 'react';
import ReactDOM from 'react-dom';
import { ScoresComponent } from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render( <ScoresComponent />, div);
});
