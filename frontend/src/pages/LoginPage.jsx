import React from 'react'
import { useState } from 'react'
import { ShoppingCart, UserPlus, User, LogIn, LogOut, Lock, Mail, ArrowRight, Loader } from "lucide-react";
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
const LoginPage = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loading = false;
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email, password);
  }

  return (
    <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8 ">
      <motion.div
        className="sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className='mt-6 text-center text-3xl font-extrabold text-emerald-500'>Create an account</h2>

      </motion.div>
      <motion.div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >


        <div className="bg-green-100  py-8 px-4  sm:rounded-lg sm:px-10 border border-green-500 shadow-2xl">
          <form className="space-y-6 " onSubmit={handleSubmit}>


            <div>
              <label htmlFor='name' className='block text-sm font-bold text-blue-700   '>
                Email
              </label>
              <div className='mt-1  relative rounded-md shadow-sm bg-white'>
                <div className="  absolute inset-y-0 left-0 pl-0 flex item-center pointer-events-none">
                  <Mail className=' m-2  w-6 h-6  text-red-700 ' />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="JohnDoe@gmail.com"
                  className="block left-0 w-full pl-10 pr-0 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor='password' className='block text-sm font-bold text-blue-700 '>
                  Password
                </label>
                <div className='mt-1 relative rounded-md shadow-sm'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <Lock className='h-5 w-5 text-black' aria-hidden='true' />
                  </div>
                  <input
                    id='password'
                    type='password'
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className=' block w-full px-3 py-2 pl-10 bg-white text-gray-700 border border-gray-600 
                    rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm'
                    placeholder='••••••••'
                  />
                </div>
              </div>

            </div>
            <button
                          type='submit'
                          className='w-full flex justify-center py-2 px-4 border border-transparent 
                          rounded-md shadow-sm text-sm font-medium text-white bg-emerald-200
                           hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2
                            focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50'
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
                              Loading...
                            </>
                          ) : (
                            <>
                              <Loader className='mr-2 h-5 w-5 animate-spin ' aria-hidden='true' />
                              Loading
                            </>
                          )}
                        </button>
          </form>
        </div>
      </motion.div>
       <p className='mt-8 text-center text-sm text-gray-400'>
                  Not a member?{" "}
                  <Link to='/signup' className='font-medium text-emerald-400 hover:text-emerald-300'>
                    Signup Now <ArrowRight className='inline h-4 w-4' />
                  </Link>
                </p>
    </div>
    
  )

}

export default LoginPage