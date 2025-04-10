import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [input1, setinput1] = useState('');
  const [input2, setinput2] = useState('');
  const [input3, setinput3] = useState('');
  const [first, setfirst] = useState(false)
  const redirect = useNavigate();

  const handle1 = (e) => setinput1(e.target.value);
  const handle2 = (e) => setinput2(e.target.value);
  const handle3 = (e) => setinput3(e.target.value);

  let flag = false;
  const final1 = () => {
    const newUser = { name: input1, email: input2, password: input3 };
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    for (let i in storedUsers) {
      if (storedUsers[i].email === newUser.email) flag = true;
    }
    if (flag) {
      alert("User already registered with this email");
      flag = false;
    } else {
      setfirst(true);
      storedUsers.push(newUser);
      localStorage.setItem("users", JSON.stringify(storedUsers));
      setTimeout(() => redirect('/Signin'), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center text-white">
      {first && <div className="text-green-400 mb-4">User successfully signed up. Redirecting to Signin Page...</div>}
      <div className="bg-gray-800 p-8 rounded-xl shadow-md w-80 space-y-4 border border-gray-700">
        <h2 className="text-2xl font-bold text-center">Sign Up</h2>
        <input className="w-full p-2 rounded bg-gray-700 border border-gray-600" value={input1} onChange={handle1} type="text" placeholder="Enter your name" />
        <input className="w-full p-2 rounded bg-gray-700 border border-gray-600" value={input2} onChange={handle2} type="email" placeholder="Enter your email" />
        <input className="w-full p-2 rounded bg-gray-700 border border-gray-600" value={input3} onChange={handle3} type="password" placeholder="Enter password" />
        <button onClick={final1} className="w-full bg-green-600 hover:bg-green-700 py-2 rounded font-semibold">Submit</button>
      </div>
    </div>
  );
};

export default Signup;
