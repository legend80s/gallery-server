import { useState, useEffect } from 'react';
// @ts-expect-error no declaration file
import Toggle from 'react-toggle';
import {
  Gallery,
  THEME_LIGHT,
  THEME_DARK,
  type IDirection,
} from './components/Gallery';
import { get } from './utils/fetch';

import './App.css';
import 'react-toggle/style.css';
import { CinemaHall } from './components/CinemaHall';

function App() {
  const [isFooterVisible, setShowFooter] = useState(false);
  const [direction, setDirection] = useState<IDirection>('row');
  const [theme, setTheme] = useState(THEME_LIGHT);

  // TODO: move to a separate hook file
  useEffect(() => {
    queryViewOptions().then((opts) => {
      if (!opts) return;

      const { isFooterVisible, direction } = opts;
      if (typeof isFooterVisible === 'boolean') setShowFooter(isFooterVisible);

      setDirection(direction);
    });
  }, []);

  const toggleTheme = () => {
    setTheme(theme === THEME_LIGHT ? THEME_DARK : THEME_LIGHT);
  };

  return (
    <div className="App">
      <main className={`main ${theme}`}>
        <Gallery theme={theme} direction={direction} />
        <CinemaHall theme={theme} />
      </main>

      <footer className="App-footer">
        <div className="toggle-wrapper">
          <span>Theme</span>

          <Toggle
            className="toggle"
            defaultChecked={false}
            icons={false}
            onChange={toggleTheme}
          />
        </div>
        {isFooterVisible && (
          <div>
            <span className="tips" style={{ marginInlineEnd: '1em' }}>
              Powered by @gallery-server
            </span>
            <a
              className="App-link"
              href="https://github.com/legend80s/gallery-server"
              target="_blank"
              rel="noopener noreferrer"
            >
              Give a{' '}
              <span role="img" aria-label="github star">
                ⭐️
              </span>{' '}
              if this project helped you!
            </a>
          </div>
        )}
      </footer>
    </div>
  );
}

export default App;

type IQueryViewOptions = {
  isFooterVisible: boolean;
  direction: IDirection;
};

async function queryViewOptions(): Promise<IQueryViewOptions | undefined> {
  try {
    const { isFooterVisible, isColumnLayout } = await get('/api/view');
    const direction = isColumnLayout ? 'column' : 'row';

    return {
      isFooterVisible,
      direction,
    };
  } catch (error) {
    console.error('fetchImages', error);

    return undefined;
  }
}
