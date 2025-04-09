import PropTypes from 'prop-types';
import { createContext } from 'react';

// project imports
import useLocalStorage from 'hooks/useLocalStorage';
import config from '../config';

// initial state
const initialState = {
  ...config.defaultConfig,
  onChangeFontFamily: () => {},
  onChangeBorderRadius: () => {},
  onReset: () => {}
};

// ==============================|| CONFIG CONTEXT & PROVIDER ||============================== //

const ConfigContext = createContext(initialState);

function ConfigProvider({ children }) {
  const [config, setConfig] = useLocalStorage('berry-config-vite-ts', {
    fontFamily: initialState.fontFamily,
    borderRadius: initialState.borderRadius
  });

  const onChangeFontFamily = (fontFamily) => {
    setConfig({
      ...config,
      fontFamily
    });
  };

  const onChangeBorderRadius = (event, newValue) => {
    setConfig({
      ...config,
      borderRadius: newValue
    });
  };

  const onReset = () => {
    setConfig({ ...defaultConfig });
  };

  return (
    <ConfigContext.Provider
      value={{
        ...config,
        onChangeFontFamily,
        onChangeBorderRadius,
        onReset
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
}

export { ConfigProvider, ConfigContext };

ConfigProvider.propTypes = { children: PropTypes.node };
