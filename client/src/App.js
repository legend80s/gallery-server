import React, { useState, useEffect } from 'react';
// import logo from './logo.svg';
import './App.css';
import Gallery from './components/Gallery'
import { HOST } from './constants';

function App() {
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    setFooterStatus(setShowFooter);
  }, []);

  return (
    <div className="App">
      <main className="Gallery-wrapper">
        <Gallery></Gallery>
      </main>

      {showFooter && <footer className="App-footer">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <p className="tips">
          Powered by @gallery-server
        </p>
        <a
          className="App-link"
          href="https://github.com/legend80s/gallery-server"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn More About @gallery-server
        </a>
      </footer>}
    </div>
  );
}

export default App;

async function setFooterStatus(set) {
  let viewInfo;

  try {
    viewInfo = await window.fetch(`${HOST}/api/view`)
      .then(resp => resp.json())

  } catch (error) {
    return console.error('fetchImages', error);
  }

  typeof viewInfo.showFooter === 'boolean' && set(viewInfo.showFooter);
}
