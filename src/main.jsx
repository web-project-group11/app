import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./main.css";

import App from "./App.jsx";

import AdvancedSearch from "./screens/AdvancedSearch.jsx"
import MoviePage from "./screens/MoviePage/MoviePage.jsx"

import HomePage from "./screens/HomePage.jsx"
import ProfilePage from "./screens/ProfilePage.jsx"

import GroupsPage from "./screens/GroupsPage.jsx";

import Authentication from "./screens/Authentication/Authentication.jsx";
import SignUp from "./components/SignUp/SignUp.jsx";
import Login from "./components/Login/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoute";

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
                element: <AdvancedSearch />
            },
            {
                path: '/:mediatype/:mediaid',
                element: <MoviePage />
            },
            {
                path: '/groups',
                element: <GroupsPage/>                
            },
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        path: '/profile',
                        element: <ProfilePage />
                    }
                 ]
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