import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import './index.css';

const notesAndStrings = {
	strings: ['E1', 'A2', 'D3', 'G4', 'B5', 'e6'],
	notes: ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'],
	enharmonicNotes: ['Bb', 'Db', 'Eb', 'Gb', 'Ab']
}

ReactDOM.render(
  <App values={notesAndStrings} />,
  document.getElementById('root')
);
