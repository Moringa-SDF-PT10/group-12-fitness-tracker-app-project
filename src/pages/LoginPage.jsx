import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const result = login(email, password);
    if (result === true) {
      // Successful login
      navigate('/dashboard');
    } else {
      // Failed login: show error message
      setError(result);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          className="block w-full mb-4 p-2 border rounded"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
          required
        />
        <input
          className="block w-full mb-4 p-2 border rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition duration-200"
          type="submit"
        >
          Login
        </button>

          <p
    className="mt-2 text-sm text-blue-600 hover:underline text-center cursor-pointer"
    onClick={() => navigate('/forgot-password')}
  >
    Forgot Password? Click Here
  </p>

        <p className="mt-4 text-sm text-center text-gray-600">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Register
          </button>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
