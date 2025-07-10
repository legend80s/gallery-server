import React, { useState, useEffect } from 'react';
// @ts-expect-error no declaration file
import Toggle from 'react-toggle';
import {
  Gallery,
  THEME_LIGHT,
  THEME_DARK,
  type IDirection,
} from './components/Gallery';
import fetch from './utils/fetch';

import './App.css';
import 'react-toggle/style.css';
import { CinemaHall } from './components/CinemaHall';

function App() {
  const [isFooterVisible, setShowFooter] = useState(false);
  const [direction, setDirection] = useState<IDirection>('row');
  const [theme, setTheme] = useState(THEME_LIGHT);

  useEffect(() => {
    setViewOptions(setShowFooter, setDirection);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === THEME_LIGHT ? THEME_DARK : THEME_LIGHT);
  };

  return (
    <div className='App'>
      <main className={`main ${theme}`}>
        <Gallery theme={theme} direction={direction} />
        <CinemaHall theme={theme} />
      </main>

      {isFooterVisible && (
        <footer className='App-footer'>
          <div className='toggle-wrapper'>
            <span>Theme</span>

            <Toggle
              className='toggle'
              defaultChecked={false}
              icons={false}
              onChange={toggleTheme}
            />
          </div>

          <p className='tips'>Powered by @gallery-server</p>
          <a
            className='App-link'
            href='https://github.com/legend80s/gallery-server'
            target='_blank'
            rel='noopener noreferrer'
          >
            Give a{' '}
            <span role='img' aria-label='github star'>
              ⭐️
            </span>{' '}
            if this project helped you!
          </a>
        </footer>
      )}
    </div>
  );
}

export default App;

/**
 * @returns {Promise<void>}
 */
async function setViewOptions(setFooterVisible, setDirection) {
  try {
    const { isFooterVisible, isColumnLayout } = await fetch('/api/view');
    const direction = isColumnLayout ? 'column' : 'row';

    typeof isFooterVisible === 'boolean' && setFooterVisible(isFooterVisible);
    typeof isColumnLayout === 'boolean' && setDirection(direction);
  } catch (error) {
    return console.error('fetchImages', error);
  }
}
