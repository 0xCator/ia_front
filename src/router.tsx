import { Navigate } from "react-router-dom";
import App from "./App";
import LoginForm from "./Components/Forms/LoginForm/LoginForm";
import RegistrationForm from "./Components/Forms/RegisterationForm/RegisterationForm";
import LandingPage from "./Components/LandingPage/LandingPage";
import Dashboards  from "./Components/MainDashboard/Dashboards/Dashboards";
import ProjectView  from "./Components/MainDashboard/ProjectView/ProjectView";
import { AuthGuard } from "./Guard/auth-guard";

 

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
                element: <AuthGuard logRequired={false}/>,
                children: [
                    {
                        path: "/login", // localhost:3000/login
                        element: <LoginForm />
                    },
                    {
                        path: "/register", // localhost:3000/register
                        element: <RegistrationForm />
                    }
                ]
            },
            {
                element: <AuthGuard logRequired={true}/>,
                children: [
                    {
                        path: "/dashboard", // localhost:3000/dashboard
                        element: <Dashboards />
                    },
                    {
                        path: "/project/:projectId", // localhost:3000/project/1
                        element: <ProjectView />
                    }
                ]
            },
            {
                path: "*",
                element: <Navigate to={"/"} />
            }
        ]
    }
])