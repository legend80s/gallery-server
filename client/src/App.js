import React from 'react';
import logo from './logo.svg';
import './App.css';
import Gallery from './components/Gallery'

function App() {
  return (
    <div className="App">
      <main className="Gallery-wrapper">
        <Gallery></Gallery>
      </main>

      <footer className="App-footer">
        <img src={logo} className="App-logo" alt="logo" />
        <p className="tips">
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </footer>
    </div>
  );
}

export default App;
