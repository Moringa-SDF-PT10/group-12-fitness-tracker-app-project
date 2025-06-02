import { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

// Helper to define default dashboard goals structure
const getDefaultDashboardGoals = () => ({
  weeklyActivityMinutesGoal: 300,
  weeklySessionGoal: { 
    count: 3, 
    type: 'any',
  },
  bodyPartGoals: [

  ],
  dailyWaterGoal: 8,
  currentWaterIntake: 0,
  dailySleepHoursGoal: 7.5,
  currentSleepHours: 0,
  weeklyActivityData: [
    { day: 'Mon', activity: 0, completedSession: false }, { day: 'Tue', activity: 0, completedSession: false },
    { day: 'Wed', activity: 0, completedSession: false }, { day: 'Thu', activity: 0, completedSession: false },
    { day: 'Fri', activity: 0, completedSession: false }, { day: 'Sat', activity: 0, completedSession: false },
    { day: 'Sun', activity: 0, completedSession: false },
  ],
});


// Helper to define the full default user profile structure
const getDefaultUserProfileData = (name = '', email = '') => ({
  profile: {
    name: name,
    email: email,
    age: '',
    gender: 'Prefer not to say',
    height: '',
    weight: '',
    photo: '',
    fitnessLevel: 'Beginner',
    goalWeight: '',
  },
  goals: {
    type: 'Maintain Fitness',
    target: '',
    timeframe: '',
  },
  preferences: {
    workouts: '',
    equipment: '',
    time: '',
  },
  dashboard: getDefaultDashboardGoals(),
  progress: {
    bodyMeasurements: '',
    totalWorkouts: 0, 
    streak: 0,
    favoriteExercises: '',
    activeDaysTimes: '',
    caloriesBurned: 0,
  },
  notifications: { notifyWorkouts: true, notifyProgress: true, notifyPromotions: false },
  appearance: { theme: 'light', fontSize: 'medium', reduceMotion: false },
  subscription: { plan: 'Free' },
});


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('fitbuddy-current-user');
    return saved ? JSON.parse(saved) : null;
  });

  const register = (name, email, password) => {
    const users = JSON.parse(localStorage.getItem('fitbuddy-users')) || [];
    if (users.some(u => u.email === email)) return 'Email already registered';

    users.push({ name, email, password });
    localStorage.setItem('fitbuddy-users', JSON.stringify(users));

    const initialProfileData = getDefaultUserProfileData(name, email);
    localStorage.setItem(`userData_${email}`, JSON.stringify(initialProfileData));
    return true;
  };

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('fitbuddy-users')) || [];
    const foundUser = users.find(u => u.email === email && u.password === password);

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('fitbuddy-current-user', JSON.stringify(foundUser));

      let userProfile;
      const userProfileJSON = localStorage.getItem(`userData_${email}`);

      if (userProfileJSON) {
        try {
          userProfile = JSON.parse(userProfileJSON);
          const defaultStructure = getDefaultUserProfileData(foundUser.name, foundUser.email);
          userProfile = {
            ...defaultStructure,
            ...userProfile,
            profile: { ...defaultStructure.profile, ...userProfile.profile },
            goals: { ...defaultStructure.goals, ...userProfile.goals },
            preferences: { ...defaultStructure.preferences, ...userProfile.preferences },
            dashboard: {
                ...defaultStructure.dashboard,
                ...(userProfile.dashboard || {}),
                weeklyActivityData: (userProfile.dashboard?.weeklyActivityData && userProfile.dashboard.weeklyActivityData.length === 7)
                    ? userProfile.dashboard.weeklyActivityData.map(day => ({ completedSession: false, ...day }))
                    : defaultStructure.dashboard.weeklyActivityData.map(day => ({ completedSession: false, ...day })),
                bodyPartGoals: userProfile.dashboard?.bodyPartGoals || [],
            },
            progress: { ...defaultStructure.progress, ...userProfile.progress },
            notifications: { ...defaultStructure.notifications, ...userProfile.notifications },
            appearance: { ...defaultStructure.appearance, ...userProfile.appearance },
            subscription: { ...defaultStructure.subscription, ...userProfile.subscription },
          };
        } catch (e) {
          console.error("Error parsing user profile, resetting to default:", e);
          userProfile = getDefaultUserProfileData(foundUser.name, foundUser.email);
        }
      } else {
        userProfile = getDefaultUserProfileData(foundUser.name, foundUser.email);
      }
      
      localStorage.setItem(`userData_${email}`, JSON.stringify(userProfile));
      localStorage.setItem('userData', JSON.stringify(userProfile));

      return true;
    }
    return 'Invalid credentials';
  };

  const logout = () => {
    localStorage.removeItem('fitbuddy-current-user');
    localStorage.removeItem('userData');
    setUser(null);
  };

  useEffect(() => {
    const syncUser = () => {
      const saved = localStorage.getItem('fitbuddy-current-user');
      setUser(saved ? JSON.parse(saved) : null);
    };
    window.addEventListener('storage', syncUser);
    return () => window.removeEventListener('storage', syncUser);
  }, []);

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
