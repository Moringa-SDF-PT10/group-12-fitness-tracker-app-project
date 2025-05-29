import { useContext } from 'react';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
        {user ? `Welcome ${user.name}` : "Welcome"}
      </h1>
      {/* ...rest of your dashboard... */}
    </div>
  );
};

export default DashboardPage;
