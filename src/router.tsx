import App from "./App";
import LoginForm from "./Components/Forms/LoginForm/LoginForm";
import RegistrationForm from "./Components/Forms/RegisterationForm/RegisterationForm";
import LandingPage from "./Components/LandingPage/LandingPage";


const { createBrowserRouter } = require("react-router-dom");

export const router = createBrowserRouter([
    {
        path: "", // localhost:3000
        element: <App />,
        children: [
            {
                path: "", // localhost:3000
                element: <LandingPage />
            },
            {
                path: "/register", // localhost:3000/register
                element: <RegistrationForm />
            },
            {
                path: "/login", // localhost:3000/login
                element: <LoginForm />
            }
        ]
    }
])