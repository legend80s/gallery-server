import React, { useState, useEffect } from 'react';
// import logo from './logo.svg';
import './App.css';
import Gallery from './components/Gallery'

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
    const viewInfo = await resp.json();

    typeof viewInfo.showFooter === 'boolean' && set(viewInfo.showFooter);
  } catch (error) {
    return console.error('fetchImages', error);
  }
}
