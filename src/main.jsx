import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./main.css";

import App from "./App.jsx";
import Authentication from "./screens/Authentication.jsx";
import SimpleSearch from "./screens/SimpleSearch.jsx"
import MovieDetails from "./screens/MovieDetails.jsx"
import HomePage from "./screens/HomePage.jsx"

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Authentication authenticationMode={AuthenticationMode.Login} />
  },
  {
    path: '/signup',
    element: <Authentication authenticationMode={AuthenticationMode.SignUp} />
  },
  {
    element: <App />,
    children: [
      {
        path: '/',
        element: <HomePage />
      },
      {
        path: '/search',
        element: <SimpleSearch />
      },
      {
        path: '/movie/:movieid',
        element: <MovieDetails />
      }
    ]
  }
])

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);