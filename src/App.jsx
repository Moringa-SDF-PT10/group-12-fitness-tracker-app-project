import React, { useState, useEffect } from 'react';

// Import pages directly
import WorkoutsPage from './pages/WorkoutsPage';
import WorkoutDetailPage from './pages/WorkoutDetailPage';

const SimpleNotFound = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900 p-4 text-center">
        <h1 className="text-4xl font-bold text-slate-700 dark:text-slate-200">404 - Page Not Found</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">The page you are looking for does not exist in this isolated view.</p>
        <button
            onClick={() => {
                // Navigate to /workouts and trigger state update in App
                window.history.pushState({}, '', '/workouts');
                const navEvent = new PopStateEvent('popstate');
                window.dispatchEvent(navEvent);
            }}
            className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md"
        >
            Go to Workouts
        </button>
    </div>
);

function App() {
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

  // Navigate function to be passed to pages
  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path); // Update state to trigger re-render
  };

  let pageComponent;
  const pathSegments = currentPath.split('/').filter(Boolean);
  const firstSegment = pathSegments[0];
  const secondSegment = pathSegments[1];

  if (!firstSegment || (firstSegment === 'workouts' && !secondSegment)) {
    // Matches '/' or '/workouts'
    pageComponent = <WorkoutsPage navigate={navigate} />;
  } else if (firstSegment === 'workouts' && secondSegment) {
    // Matches '/workouts/:id'
    pageComponent = <WorkoutDetailPage workoutId={secondSegment} navigate={navigate} />;
  } else {
    pageComponent = <SimpleNotFound />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-100 dark:bg-slate-900">
      <main className="flex-grow">
        {pageComponent}
      </main>
    </div>
  );
}

export default App;