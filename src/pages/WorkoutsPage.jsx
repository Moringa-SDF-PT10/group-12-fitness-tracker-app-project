// WorkoutsPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import {
    Search, ChevronRight, RefreshCw, AlertTriangle, Loader2, Dumbbell,
    HeartPulse, Shield, MoveHorizontal, Footprints, UserCircle, Award, Zap,
    TrendingUp, CircleDot, ArrowUpFromDot, Activity, Info
} from 'lucide-react';

const API_LIST_URL = 'https://exercisedb-api.vercel.app/api/v1/exercises';

const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

const getIconForBodyPart = (bodyPart) => {
    const bp = bodyPart ? bodyPart.toLowerCase() : '';
    const iconColorClass = "text-[#A1887F]";

    switch (bp) {
        case 'back': return <ArrowUpFromDot className={`w-16 h-16 ${iconColorClass}`} />;
        case 'cardio': return <HeartPulse className={`w-16 h-16 text-[#FFB6C1]`} />;
        case 'chest': return <Shield className={`w-16 h-16 ${iconColorClass}`} />;
        case 'lower arms': return <MoveHorizontal className={`w-16 h-16 ${iconColorClass}`} />;
        case 'lower legs': return <Footprints className={`w-16 h-16 ${iconColorClass}`} />;
        case 'neck': return <UserCircle className={`w-16 h-16 ${iconColorClass}`} />;
        case 'shoulders': return <Award className={`w-16 h-16 ${iconColorClass}`} />;
        case 'upper arms': return <Zap className={`w-16 h-16 ${iconColorClass}`} />;
        case 'upper legs': return <TrendingUp className={`w-16 h-16 ${iconColorClass}`} />;
        case 'waist': return <CircleDot className={`w-16 h-16 ${iconColorClass}`} />;
        default: return <Activity className={`w-16 h-16 ${iconColorClass}`} />;
    }
};

const ExerciseCard = ({ exercise, navigate }) => { // navigate prop is still passed here
  const primaryBodyPart = (Array.isArray(exercise.bodyParts) && exercise.bodyParts.length > 0) ? exercise.bodyParts[0] : 'unknown';
  const primaryTarget = (Array.isArray(exercise.targetMuscles) && exercise.targetMuscles.length > 0) ? exercise.targetMuscles[0] : 'N/A';
  const primaryEquipment = (Array.isArray(exercise.equipments) && exercise.equipments.length > 0) ? exercise.equipments[0] : 'N/A';

  return (
    <div
      className="bg-[#FFFFFF] rounded-[1.5rem] border border-[#F5E0D5] shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group flex flex-col"
      onClick={() => navigate(`/workouts/${exercise.exerciseId}`)}
    >
      <div className="relative w-full h-48 flex items-center justify-center bg-[#FFDAC1]/20 p-4 group-hover:bg-[#FFDAC1]/30 transition-colors duration-300">
        {getIconForBodyPart(primaryBodyPart)}
        <div className="absolute bottom-2 right-2 bg-[#FFB6C1] text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          View Details
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-[#6D4C41] mb-1 truncate group-hover:text-[#FFB6C1] transition-colors">
          {capitalize(exercise.name)}
        </h3>
        <p className="text-sm text-[#A1887F] mb-2">
          Target: <span className="font-medium text-[#FFB6C1]">
            {capitalize(primaryTarget)}
          </span>
        </p>
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="text-xs bg-[#FFDAC1]/40 text-[#6D4C41] px-2 py-1 rounded-full">
            Body Part: {capitalize(primaryBodyPart)}
          </span>
          <span className="text-xs bg-[#FFDAC1]/40 text-[#6D4C41] px-2 py-1 rounded-full">
            Equipment: {capitalize(primaryEquipment)}
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/workouts/${exercise.exerciseId}`);
          }}
          className="w-full mt-auto inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-[#FFB6C1] hover:bg-opacity-80 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#FFB6C1] focus:ring-opacity-50 group"
        >
          View Exercise
          <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};

const WorkoutsPage = () => { // Removed navigate from props
  const navigate = useNavigate(); // Use the hook here
  const [allFetchedExercises, setAllFetchedExercises] = useState([]);
  const [exercisesToDisplay, setExercisesToDisplay] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBodyPart, setSelectedBodyPart] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState('');

  const [bodyPartFilterOptions, setBodyPartFilterOptions] = useState([]);
  const [equipmentFilterOptions, setEquipmentFilterOptions] = useState([]);
  const [nextPageUrl, setNextPageUrl] = useState(null);

  const fetchExerciseData = useCallback(async (url) => {
    setIsLoading(true);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      const result = await response.json();

      if (!result.success || !result.data || !Array.isArray(result.data.exercises)) {
        throw new Error("API response format is not as expected.");
      }
      setNextPageUrl(result.data.nextPage);
      return result.data.exercises;
    } catch (err) {
      setError(err.message || "Could not load exercises. Please try again.");
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadInitialExercises = async () => {
        setError(null);
        const initialItems = await fetchExerciseData(`${API_LIST_URL}?limit=50`);
        if (initialItems && initialItems.length > 0) {
            setAllFetchedExercises(initialItems);
            const uniqueBodyParts = ['', ...new Set(initialItems.flatMap(ex => ex.bodyParts || []).map(bp => bp ? bp.toLowerCase() : '').filter(bp => bp))].sort();
            const uniqueEquipments = ['', ...new Set(initialItems.flatMap(ex => ex.equipments || []).map(eq => eq ? eq.toLowerCase() : '').filter(eq => eq))].sort();
            setBodyPartFilterOptions(uniqueBodyParts);
            setEquipmentFilterOptions(uniqueEquipments);
        }
    };
    loadInitialExercises();
  }, [fetchExerciseData]);

  useEffect(() => {
    let filtered = allFetchedExercises;

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(ex =>
        (ex.name && ex.name.toLowerCase().includes(lowerSearchTerm)) ||
        (Array.isArray(ex.targetMuscles) && ex.targetMuscles.some(tm => tm && tm.toLowerCase().includes(lowerSearchTerm)))
      );
    }

    if (selectedBodyPart) {
      const lowerBodyPart = selectedBodyPart.toLowerCase();
      filtered = filtered.filter(ex =>
        Array.isArray(ex.bodyParts) && ex.bodyParts.some(bp => bp && bp.toLowerCase() === lowerBodyPart)
      );
    }

    if (selectedEquipment) {
      const lowerEquipment = selectedEquipment.toLowerCase();
      filtered = filtered.filter(ex =>
        Array.isArray(ex.equipments) && ex.equipments.some(eq => eq && eq.toLowerCase() === lowerEquipment)
      );
    }
    setExercisesToDisplay(filtered.slice(0, 24));
  }, [searchTerm, selectedBodyPart, selectedEquipment, allFetchedExercises]);

  const loadMoreExerciseData = async () => {
    if (nextPageUrl && !isLoading) {
        const moreItems = await fetchExerciseData(nextPageUrl);
        if (moreItems && moreItems.length > 0) {
            setAllFetchedExercises(prevItems => [...prevItems, ...moreItems]);
        }
    }
  };
  const canLoadMore = !!nextPageUrl;

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-[#FFF7F5] min-h-full">
      <header className="mb-8 text-center">
        <div className="inline-flex items-center justify-center bg-[#FFDAC1]/30 p-3 rounded-full mb-3">
            <Dumbbell className="h-10 w-10 text-[#FFB6C1]" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-[#6D4C41]">
          Explore Exercises
        </h1>
        <p className="text-[#A1887F] mt-2 text-md max-w-xl mx-auto">
          Find the perfect workout for your goals. Filter by body part, equipment, or search by name.
        </p>
      </header>

      <div className="mb-8 p-4 md:p-6 bg-[#FFFFFF] rounded-2xl shadow-lg border border-[#F5E0D5]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="lg:col-span-2">
            <label htmlFor="search-exercise" className="block text-sm font-medium text-[#6D4C41] mb-1">
              Search Exercise
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-[#A1887F]" />
              </div>
              <input
                type="text"
                id="search-exercise"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 border border-[#F5E0D5] rounded-xl focus:ring-2 focus:ring-[#FFB6C1] focus:border-[#FFB6C1] bg-[#FFFFFF] text-[#6D4C41] placeholder-[#A1887F]"
                placeholder="e.g., Bench Press, Squats..."
              />
            </div>
          </div>
          <div>
            <label htmlFor="bodyPart-filter" className="block text-sm font-medium text-[#6D4C41] mb-1">
              Body Part
            </label>
            <select
              id="bodyPart-filter"
              value={selectedBodyPart}
              onChange={(e) => setSelectedBodyPart(e.target.value)}
              className="w-full py-2.5 px-3 border border-[#F5E0D5] rounded-xl focus:ring-2 focus:ring-[#FFB6C1] focus:border-[#FFB6C1] bg-[#FFFFFF] text-[#6D4C41]"
            >
              {bodyPartFilterOptions.map(part => <option key={part} value={part}>{capitalize(part) || 'All Body Parts'}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="equipment-filter" className="block text-sm font-medium text-[#6D4C41] mb-1">
              Equipment
            </label>
            <select
              id="equipment-filter"
              value={selectedEquipment}
              onChange={(e) => setSelectedEquipment(e.target.value)}
              className="w-full py-2.5 px-3 border border-[#F5E0D5] rounded-xl focus:ring-2 focus:ring-[#FFB6C1] focus:border-[#FFB6C1] bg-[#FFFFFF] text-[#6D4C41]"
            >
              {equipmentFilterOptions.map(equip => <option key={equip} value={equip}>{capitalize(equip) || 'All Equipment'}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-4 text-right">
            <button
                onClick={() => {
                    setSearchTerm(''); setSelectedBodyPart(''); setSelectedEquipment('');
                }}
                className="text-sm text-[#FFB6C1] hover:underline inline-flex items-center"
            >
                <RefreshCw className="w-4 h-4 mr-1"/> Reset Filters
            </button>
        </div>
      </div>

      {isLoading && allFetchedExercises.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-[#FFB6C1]" />
          <p className="mt-4 text-lg text-[#A1887F]">Loading Exercises...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-20 bg-[#FFB6C1]/10 p-6 rounded-2xl">
          <AlertTriangle className="h-16 w-16 text-[#FFB6C1] mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-[#6D4C41] mb-2">Oops! Something went wrong.</h3>
          <p className="text-[#A1887F] mb-6">{error}</p>
          <button
            onClick={() => {
                setError(null);
                fetchExerciseData(`${API_LIST_URL}?limit=50`).then(newData => {
                    if (newData && newData.length > 0) setAllFetchedExercises(newData);
                });
            }}
            className="px-6 py-2.5 bg-[#FFB6C1] hover:bg-opacity-80 text-white font-semibold rounded-xl shadow hover:shadow-md transition-all inline-flex items-center"
          >
            <RefreshCw className="w-5 h-5 mr-2" /> Try Again
          </button>
        </div>
      )}

      {!isLoading && !error && exercisesToDisplay.length === 0 && (searchTerm || selectedBodyPart || selectedEquipment) && (
        <div className="text-center py-20">
          <Search className="h-16 w-16 text-[#A1887F] mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-[#6D4C41] mb-2">No Exercises Found</h3>
          <p className="text-[#A1887F]">
            Try adjusting your search terms or filters.
          </p>
        </div>
      )}
      {!isLoading && !error && exercisesToDisplay.length === 0 && !searchTerm && !selectedBodyPart && !selectedEquipment && allFetchedExercises.length === 0 && (
         <div className="text-center py-20">
          <Info className="h-16 w-16 text-[#A1887F] mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-[#6D4C41] mb-2">No Exercises Available</h3>
          <p className="text-[#A1887F]">
            It seems there are no exercises to display at the moment.
          </p>
        </div>
      )}

      {!error && exercisesToDisplay.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {exercisesToDisplay.map(exercise => (
            <ExerciseCard key={exercise.exerciseId} exercise={exercise} navigate={navigate} />
          ))}
        </div>
      )}

      {!isLoading && !error && canLoadMore && (
          <div className="mt-12 text-center">
            <button
                onClick={loadMoreExerciseData}
                disabled={isLoading && allFetchedExercises.length > 0} // Prevent multiple clicks while loading more
                className="px-8 py-3 bg-[#FFDAC1] hover:bg-opacity-80 text-[#6D4C41] font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 inline-flex items-center"
            >
                {isLoading && allFetchedExercises.length > 0 ? <Loader2 className="w-5 h-5 mr-2 animate-spin"/> : null}
                Load More Exercises
            </button>
          </div>
      )}
    </div>
  );
};
export default WorkoutsPage;