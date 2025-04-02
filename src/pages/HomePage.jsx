import React from 'react';
import Navbar from '../components/Navbar';

function HomePage() {
    return (
        <>
            <Navbar />
            <div className="body-home-bg flex flex-col items-center justify-center h-screen  ">
                <h1 className="text-4xl font-bold mb-4">Welcome to the Home Page</h1>
                <p className="text-lg">This is a simple home page with a navbar.</p>
            </div>
        </>
    );
}
export default  HomePage;