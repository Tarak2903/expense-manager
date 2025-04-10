import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 flex flex-col items-center justify-center text-white">
      <h1 className="text-4xl font-bold mb-6">Welcome to Expense Manager</h1>
      <p className="mb-8 text-gray-300">Track your spending effortlessly.</p>
      <div className="flex space-x-6">
        <Link to="/Signin">
          <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-xl text-white font-semibold">Sign In</button>
        </Link>
        <Link to="/Signup">
          <button className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-xl text-white font-semibold">Sign Up</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
