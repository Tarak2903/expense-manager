import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';

const Signin = () => {
  const [input1, setinput1] = useState('')
  const [input2, setinput2] = useState('')
  const navigate = useNavigate();

  const handle1 = (e) => setinput1(e.target.value)
  const handle2 = (e) => setinput2(e.target.value)
  const hello = async (newUser) => {
    let req = await fetch("http://localhost:3000/signin", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    })
    return await req.json();
  }

  const handle3 = async () => {
    const newUser = { email: input1, password: input2 }
    if (!newUser.email || !newUser.password) {
      alert("Fill both email and password please")
    } else {
      const storedUsers = await hello(newUser)
      if (storedUsers.success) {
        let a = input1;
        navigate(`/Dashboard/${a}`)
      }
      else 
      toast("Email or password is wrong or not registered", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
       
      });
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center text-white">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
       
      />
      <div className="bg-gray-800 p-8 rounded-xl shadow-md w-80 space-y-4 border border-gray-700">
        <h2 className="text-2xl font-bold text-center">Sign In</h2>
        <div>
          <label>Email</label>
          <input type="email" value={input1} onChange={handle1} className="w-full mt-1 p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none" />
        </div>
        <div>
          <label>Password</label>
          <input type="password" value={input2} onChange={handle2} className="w-full mt-1 p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none" />
        </div>
        <button onClick={handle3} className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-semibold">Submit</button>
      </div>
    </div>
  )
}

export default Signin
