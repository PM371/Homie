import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/NavbarSub';
import axios from 'axios';

const Auth = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [state, setState] = useState('signin');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (username === 'admin' && password === 'admin1234') {
        window.location.href = "http://localhost:5174/admin-dashboard";
        return;
      }

      const response = await axios.post('http://localhost:8085/signin', {
        username,
        password
      });
      const token = response.data.data.token;
      if (token) {
        localStorage.setItem('lastUser', username);
        localStorage.setItem('token', token);
        navigate("/");
        window.location.reload();
      }
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      alert(error.response?.data.message);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:8085/signup', {
        username,
        password,
        name,
      });

      if (response.status === 200) {
        alert("Signup successful");
        window.location.reload();
        navigate("/signin");
      }
    } catch (error) {
      const errorMessage = error.response?.data || "Signup failed. Please try again.";
      alert(errorMessage);
    }
  };

  return (
      <div className='mx-4 sm:mx-[10%] mt-5'>
        <Navbar />
      <form
          className="min-h-[80vh] flex items-center"
          onSubmit={state === "Sign Up" ? handleSignup : handleLogin}
      >

        <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg">

          <p className="text-2xl font-semibold">
            {state === "Sign Up" ? "Create Account" : "Login"}
          </p>
          <p>Please {state === "Sign Up" ? "sign up" : "log in"} to book appointment</p>

          {/* รับ Name แทน Email */}
          {state === "Sign Up" && (
              <div className="w-full">
                <p>Name</p>
                <input
                    className="border border-zinc-300 rounded w-full p-2 mt-1"
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    required
                />
              </div>
          )}

          <div className="w-full">
            <p>Username</p>
            <input
                className="border border-zinc-300 rounded w-full p-2 mt-1"
                type="text"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                required
            />
          </div>

          <div className="w-full">
            <p>Password</p>
            <input
                className="border border-zinc-300 rounded w-full p-2 mt-1"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
            />
          </div>

          <button className="bg-primary text-white w-full py-2 rounded-md text-base">
            {state === "Sign Up" ? "Create account" : "Login"}
          </button>

          {state === "Sign Up" ? (
              <p>
                Already have an account?
                <span
                    onClick={() => {
                      setState("Login");
                      navigate("/signin");
                    }}
                    className="text-primary underline cursor-pointer"
                >
              {" "}Login here
            </span>
              </p>
          ) : (
              <p>
                Create a new account?
                <span
                    onClick={() => {
                      setState("Sign Up");
                      navigate("/signup");
                    }}
                    className="text-primary underline cursor-pointer"
                >
              {" "}click here
            </span>
              </p>
          )}

        </div>
      </form>
      </div>
  );
};

export default Auth;
