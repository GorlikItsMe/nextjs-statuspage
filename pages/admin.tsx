import React, { useEffect, useState } from 'react'
import cookie from 'js-cookie';
import { useRouter } from 'next/router'

export default function AdminPage() {
  const router = useRouter()
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (errorMsg != '') {
      let lasterror = errorMsg;
      const timer = setTimeout(() => {
        if (lasterror == errorMsg) {
          setErrorMsg('');
        }
      }, 10000)
      return () => { clearTimeout(timer) }
    }
  }, [errorMsg])

  const handleChange = (event) => {
    let n = event.target.name;
    if (n == 'login') {
      setLogin(event.target.value)
    }
    if (n == 'password') {
      setPassword(event.target.value)
    }
  }


  function handleSubmit(e) {
    e.preventDefault();
    fetch('/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        login,
        password,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data && data.error) {
          setErrorMsg(data.message);
          return
        }
        if (data && data.token) {
          //set cookie
          cookie.set('token', data.token, { expires: 2 });
          router.push('/admin/dashboard');
        }
      })
      .catch((e) => {
        setErrorMsg(`${e}`);
      })
  }

  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in</h2>
        </div>
        <p className='text-red-500'>{errorMsg}</p>
        <form className="mt-8 space-y-6" action="#" method="POST" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="login" className="sr-only">
                Login
              </label>
              <input
                id="login"
                name="login"
                type="text"
                autoComplete="login"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Login"
                value={login}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Log in
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}