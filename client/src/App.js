import React, { useState, useEffect } from 'react';
import './App.css';
import { Gallery } from './components/Gallery'
import fetch from './utils/fetch'

function App() {
  const [isFooterVisible, setShowFooter] = useState(false);

  useEffect(() => {
    setFooterStatus(setShowFooter);
  }, []);

  return (
    <div className="App">
      <Gallery />

      {isFooterVisible && <footer className="App-footer">
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
          Give a <span role="img" aria-label="github star">⭐️</span> if this project helped you!
        </a>
      </footer>}
    </div>
  );
}

export default App;

/**
 * @returns {Promise<void>}
 */
async function setFooterStatus(set) {
  try {
    const { isFooterVisible } = await fetch('/api/view');

    typeof isFooterVisible === 'boolean' && set(isFooterVisible);
  } catch (error) {
    return console.error('fetchImages', error);
  }
}
