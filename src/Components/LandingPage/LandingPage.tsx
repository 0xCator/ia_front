// LandingPage.js

import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using React Router for navigation

const LandingPage = () => {
    return (
        <div className="landing-page">
            <nav className="navbar">
                <ul>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/signup">Sign up</Link></li>
                </ul>
            </nav>
            <div className="content">
                <h1>Welcome to Our Website!</h1>
                <p>Explore our amazing features and join our community today.</p>
            </div>
        </div>
    );
};

export default LandingPage;
