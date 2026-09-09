import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./main.css";

import App from "./App.jsx";
import SimpleSearch from "./screens/SimpleSearch.jsx"
import MovieDetails from "./screens/MovieDetails.jsx"
import HomePage from "./screens/HomePage.jsx"

import Authentication from "./screens/Authentication.jsx";
import SignUp from "./components/SignUp.jsx";
import Login from "./components/Login.jsx";

import UserProvider from "./context/UserProvider.jsx";

const router = createBrowserRouter([
    {
        element: <Authentication />,
        children: [
            {
                path: '/signup',
                element: <SignUp />
            },
            {
                path: '/login',
                element: <Login />
            }
        ]
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
        <UserProvider>
            <RouterProvider router={router} />
        </UserProvider>
    </StrictMode>,
);