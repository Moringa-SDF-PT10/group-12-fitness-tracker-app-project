import React, { useState, useEffect } from 'react';

import WorkoutsPage from './pages/WorkoutsPage';
import WorkoutDetailPage from './pages/WorkoutDetailPage';

const App = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  let pageComponent;
  const pathSegments = currentPath.split('/').filter(Boolean);
  const firstSegment = pathSegments[0];
  const secondSegment = pathSegments[1];

  if (!firstSegment || (firstSegment === 'workouts' && !secondSegment)) {
    pageComponent = <WorkoutsPage navigate={navigate} />;
  } else if (firstSegment === 'workouts' && secondSegment) {
    pageComponent = <WorkoutDetailPage workoutId={secondSegment} navigate={navigate} />;
  } else {
    useEffect(() => {
        navigate('/workouts');
    }, [navigate]); // Added navigate to dependency array
    pageComponent = null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {pageComponent}
      </main>
    </div>
  );
};

export default App;