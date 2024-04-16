import App from "./App";
import { LandingPage } from "./Components/LandingPage/LandingPage";

const { createBrowserRouter } = require("react-router-dom");

export const router = createBrowserRouter([
    {
        path: "", // localhost:3000
        element: <App />,
        children: [
            {
                path: "", // localhost:3000
                element: <LandingPage />
            }
        ]
    }
])