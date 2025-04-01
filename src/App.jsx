import { RouterProvider } from 'react-router-dom';
import router from 'routes';
import NavigationScroll from 'layout/NavigationScroll';
import ThemeCustomization from 'themes';
import { VSProvider } from './context/VSContext';

// auth provider

// ==============================|| APP ||============================== //

export default function App() {
  return (
    <VSProvider>
      <ThemeCustomization>
        <NavigationScroll>
          <>
            <RouterProvider router={router} />
          </>
        </NavigationScroll>
      </ThemeCustomization>
    </VSProvider>
  );
}
