// src/App.tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginPage from './website/pages/login/LoginPage';
import MainPage from './website/pages/main/MainPage';
import { ExplorePageView } from './website/pages/main/explore/ExplorePageView';
import { PlaygroundView } from './website/pages/main/playground/PlaygroundView';

function App() {

  const router = createBrowserRouter([
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/",
      element: <MainPage />,
      children: [
        {
          path: "/",
          element: <ExplorePageView />,
        },
        {
          path: "/playground",
          element: <PlaygroundView />
        },
      ]
    },
  ]);
  return <RouterProvider router={router} />
}

export default App;