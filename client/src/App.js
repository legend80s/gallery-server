import React, { useState, useEffect } from 'react';
import Toggle from 'react-toggle';
import { Gallery, THEME_LIGHT, THEME_DARK } from './components/Gallery'
import fetch from './utils/fetch'

import './App.css';
import "react-toggle/style.css";
import { CinemaHall } from './components/CinemaHall';

function App() {
  const [isFooterVisible, setShowFooter] = useState(false);
  const [theme, setTheme] = useState(THEME_LIGHT);

  useEffect(() => {
    setFooterStatus(setShowFooter);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === THEME_LIGHT ? THEME_DARK : THEME_LIGHT);
  };

  return (
    <div className="App">
      <main className={ `main ${theme}` }>
        <Gallery theme={theme} />
        <hr/>
        <CinemaHall theme={theme} />
      </main>

      {isFooterVisible && <footer className="App-footer">
        <div className="toggle-wrapper">
          <span>Theme</span>

          <Toggle
            className="toggle"
            defaultChecked={false}
            icons={false}
            onChange={toggleTheme}
          />
        </div>

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
