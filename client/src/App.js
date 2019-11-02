import React, { useState, useEffect } from 'react';
// import logo from './logo.svg';
import './App.css';
import { Gallery } from './components/Gallery'

function App() {
  const [isFooterVisible, setShowFooter] = useState(false);

  useEffect(() => {
    setFooterStatus(setShowFooter);
  }, []);

  return (
    <div className="App">
      <main className="Gallery-wrapper">
        <Gallery></Gallery>
      </main>

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
    const resp = await window.fetch('/api/view')
    const { isFooterVisible } = await resp.json();

    typeof isFooterVisible === 'boolean' && set(isFooterVisible);
  } catch (error) {
    return console.error('fetchImages', error);
  }
}
