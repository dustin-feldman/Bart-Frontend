import { RouterProvider } from 'react-router-dom';
import router from 'routes';
import NavigationScroll from 'layout/NavigationScroll';
import ThemeCustomization from 'themes';
import { VSProvider } from './context/VSContext';
import { Provider } from 'react-redux';
import store from './store';

// auth provider

// ==============================|| APP ||============================== //

export default function App() {
  return (
    <Provider store={store}>
      <VSProvider>
        <ThemeCustomization>
          <NavigationScroll>
            <>
              <RouterProvider router={router} />
            </>
          </NavigationScroll>
        </ThemeCustomization>
      </VSProvider>
    </Provider>
  );
}
