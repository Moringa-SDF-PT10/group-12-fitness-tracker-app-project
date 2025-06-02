import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search, ChevronRight, RefreshCw, AlertTriangle, Loader2, Dumbbell,
    HeartPulse, Shield, MoveHorizontal, Footprints, UserCircle, Award, Zap,
    TrendingUp, CircleDot, ArrowUpFromDot, Activity, Info
} from 'lucide-react';

// API URL using HTTPS
const API_LIST_URL = 'https://exercisedb-api.vercel.app/api/v1/exercises';


// Capitalize first letter of a string
const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '';


// Returns a matching icon for a given body part
const getIconForBodyPart = (bodyPart) => {
    const bp = bodyPart ? bodyPart.toLowerCase() : '';
    const iconSize = "w-16 h-16";
    const iconColorClass = "text-[#6C757D]"; 
    const cardioColorClass = "text-[#05BFDB]";

    switch (bp) {
        case 'back': return <ArrowUpFromDot className={`${iconSize} ${iconColorClass}`} />;
        case 'cardio': return <HeartPulse className={`${iconSize} ${cardioColorClass}`} />;
        case 'chest': return <Shield className={`${iconSize} ${iconColorClass}`} />;
        case 'lower arms': return <MoveHorizontal className={`${iconSize} ${iconColorClass}`} />;
        case 'lower legs': return <Footprints className={`${iconSize} ${iconColorClass}`} />;
        case 'neck': return <UserCircle className={`${iconSize} ${iconColorClass}`} />;
        case 'shoulders': return <Award className={`${iconSize} ${iconColorClass}`} />;
        case 'upper arms': return <Zap className={`${iconSize} ${iconColorClass}`} />;
        case 'upper legs': return <TrendingUp className={`${iconSize} ${iconColorClass}`} />;
        case 'waist': return <CircleDot className={`${iconSize} ${iconColorClass}`} />;
        default: return <Activity className={`${iconSize} ${iconColorClass}`} />;
    }
};


// Component that renders individual exercise cards
const ExerciseCard = ({ exercise, navigate }) => {
  const primaryBodyPart = (Array.isArray(exercise.bodyParts) && exercise.bodyParts.length > 0) ? exercise.bodyParts[0] : 'unknown';
  const primaryTarget = (Array.isArray(exercise.targetMuscles) && exercise.targetMuscles.length > 0) ? exercise.targetMuscles[0] : 'N/A';
  const primaryEquipment = (Array.isArray(exercise.equipments) && exercise.equipments.length > 0) ? exercise.equipments[0] : 'N/A';

  return (
    <div
      className="bg-[#FFFFFF] rounded-[1.5rem] border border-[#D1D1D1] shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group flex flex-col"
      onClick={() => navigate(`/workouts/${exercise.exerciseId}`)}
    >
      <div className="relative w-full h-48 flex items-center justify-center bg-[#F5F5F5] p-4 group-hover:bg-[#E0E0E0] transition-colors duration-300">
        {getIconForBodyPart(primaryBodyPart)}
        <div className="absolute bottom-2 right-2 bg-[#05BFDB] text-[#0B0B0B] text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          View Details
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-[#0B0B0B] mb-1 truncate group-hover:text-[#05BFDB] transition-colors">
          {capitalize(exercise.name)}
        </h3>
        <p className="text-sm text-[#6C757D] mb-2">
          Target: <span className="font-medium text-[#05BFDB]">
            {capitalize(primaryTarget)}
          </span>
        </p>
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="text-xs bg-[#F5F5F5] text-[#3E3E3E] px-2 py-1 rounded-full">
            Body Part: {capitalize(primaryBodyPart)}
          </span>
          <span className="text-xs bg-[#F5F5F5] text-[#3E3E3E] px-2 py-1 rounded-full">
            Equipment: {capitalize(primaryEquipment)}
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/workouts/${exercise.exerciseId}`);
          }}
          className="w-full mt-auto inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-[#0A4D68] hover:bg-[#083D53] rounded-xl shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#0A4D68] focus:ring-opacity-50 group"
        >
          View Exercise
          <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};


// Main component that manages exercise browsing
const WorkoutsPage = () => {
  const navigate = useNavigate();
  const [allFetchedExercises, setAllFetchedExercises] = useState([]);
  const [exercisesToDisplay, setExercisesToDisplay] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBodyPart, setSelectedBodyPart] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState('');

  const [bodyPartFilterOptions, setBodyPartFilterOptions] = useState(['']); // Initialize with 'All'
  const [equipmentFilterOptions, setEquipmentFilterOptions] = useState(['']); // Initialize with 'All'
  
  const [nextPageUrl, setNextPageUrl] = useState(null); 
  const [currentOffset, setCurrentOffset] = useState(0);
  const exercisesPerPage = 50;

  const fetchExerciseData = useCallback(async (url, isInitialLoad = false) => {
    if (isInitialLoad) setIsLoading(true);
    else setIsLoadingMore(true);
    setError(null);

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      
      const result = await response.json();
      if (!result.success || !result.data || !Array.isArray(result.data.exercises)) {
        throw new Error("API response format is not as expected or no exercises found.");
      }
      
      const newExercises = result.data.exercises;
      const totalFetchedApi = result.data.total;

      if (newExercises.length > 0) {
        setAllFetchedExercises(prevItems => isInitialLoad ? newExercises : [...prevItems, ...newExercises]);
        
        let fetchedOffset = 0;
        const urlParams = new URLSearchParams(url.split('?')[1]);
        if (urlParams.has('offset')) fetchedOffset = parseInt(urlParams.get('offset'), 10) || 0;
        
        const newOffsetForNextPage = fetchedOffset + newExercises.length;
        setCurrentOffset(newOffsetForNextPage);

        if (totalFetchedApi && newOffsetForNextPage < totalFetchedApi) {
            setNextPageUrl(`${API_LIST_URL}?offset=${newOffsetForNextPage}&limit=${exercisesPerPage}`);
        } else if (!totalFetchedApi && newExercises.length === exercisesPerPage) {
            setNextPageUrl(`${API_LIST_URL}?offset=${newOffsetForNextPage}&limit=${exercisesPerPage}`);
        } else {
            setNextPageUrl(null);
        }
      } else {
        if (isInitialLoad) setAllFetchedExercises([]);
        setNextPageUrl(null);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message || "Could not load exercises. Please try again.");
    } finally {
      if (isInitialLoad) setIsLoading(false);
      else setIsLoadingMore(false);
    }
  }, [exercisesPerPage]);

  // Effect for initial data load
  useEffect(() => {
    fetchExerciseData(`${API_LIST_URL}?offset=0&limit=${exercisesPerPage}`, true);
  }, [exercisesPerPage]);

  // Effect to update filter options when allFetchedExercises changes
  useEffect(() => {
    if (allFetchedExercises.length > 0) {
        const uniqueBodyParts = ['', ...new Set(allFetchedExercises.flatMap(ex => ex.bodyParts || []).map(bp => bp ? bp.toLowerCase() : '').filter(Boolean))].sort();
        const uniqueEquipments = ['', ...new Set(allFetchedExercises.flatMap(ex => ex.equipments || []).map(eq => eq ? eq.toLowerCase() : '').filter(Boolean))].sort();
        setBodyPartFilterOptions(uniqueBodyParts);
        setEquipmentFilterOptions(uniqueEquipments);
    } else {
        // If no exercises, state is reset to default 'All' option
        setBodyPartFilterOptions(['']);
        setEquipmentFilterOptions(['']);
    }
  }, [allFetchedExercises]);

  // Effect for filtering displayed exercises
  useEffect(() => {
    let filtered = [...allFetchedExercises]; // Starts with all fetched exercises

    // Apply search term filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(ex =>
        (ex.name && typeof ex.name === 'string' && ex.name.toLowerCase().includes(lowerSearchTerm)) ||
        (Array.isArray(ex.targetMuscles) && ex.targetMuscles.some(tm => tm && typeof tm === 'string' && tm.toLowerCase().includes(lowerSearchTerm)))
      );
    }

    // Apply body part filter
    if (selectedBodyPart) {
      const lowerBodyPart = selectedBodyPart.toLowerCase();
      filtered = filtered.filter(ex =>
        Array.isArray(ex.bodyParts) && ex.bodyParts.some(bp => bp && typeof bp === 'string' && bp.toLowerCase() === lowerBodyPart)
      );
    }

    // Apply equipment filter
    if (selectedEquipment) {
      const lowerEquipment = selectedEquipment.toLowerCase();
      filtered = filtered.filter(ex =>
        Array.isArray(ex.equipments) && ex.equipments.some(eq => eq && typeof eq === 'string' && eq.toLowerCase() === lowerEquipment)
      );
    }
    setExercisesToDisplay(filtered); 
  }, [searchTerm, selectedBodyPart, selectedEquipment, allFetchedExercises]);

  const loadMoreExerciseData = async () => {
    if (nextPageUrl && !isLoadingMore) {
        await fetchExerciseData(nextPageUrl, false);
    }
  };
  
  const handleResetAndReload = () => {
    setSearchTerm('');
    setSelectedBodyPart('');
    setSelectedEquipment('');
    setCurrentOffset(0); 
    setAllFetchedExercises([]); 
    fetchExerciseData(`${API_LIST_URL}?offset=0&limit=${exercisesPerPage}`, true);
  };

  const canLoadMore = !!nextPageUrl && !isLoadingMore;

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-[#F5F5F5] min-h-full">
      <header className="mb-8 text-center">
        <div className="inline-flex items-center justify-center bg-[#E0E0E0] p-3 rounded-full mb-3">
            <Dumbbell className="h-10 w-10 text-[#05BFDB]" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-[#0B0B0B]">Explore Exercises</h1>
        <p className="text-[#3E3E3E] mt-2 text-md max-w-xl mx-auto">Find the perfect workout for your goals. Filter by body part, equipment, or search by name.</p>
      </header>

      <div className="mb-8 p-4 md:p-6 bg-[#FFFFFF] rounded-2xl shadow-lg border border-[#D1D1D1]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="lg:col-span-2">
            <label htmlFor="search-exercise" className="block text-sm font-medium text-[#6C757D] mb-1">Search Exercise</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="h-5 w-5 text-[#6C757D]" /></div>
              <input type="text" id="search-exercise" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 border border-[#B0B0B0] rounded-xl focus:ring-2 focus:ring-[#05BFDB] focus:border-[#05BFDB] bg-[#FFFFFF] text-[#3E3E3E] placeholder-[#6C757D]"
                placeholder="e.g., Bench Press, Squats..."/>
            </div>
          </div>
          <div>
            <label htmlFor="bodyPart-filter" className="block text-sm font-medium text-[#6C757D] mb-1">Body Part</label>
            <select id="bodyPart-filter" value={selectedBodyPart} onChange={(e) => setSelectedBodyPart(e.target.value)}
              className="w-full py-2.5 px-3 border border-[#B0B0B0] rounded-xl focus:ring-2 focus:ring-[#05BFDB] focus:border-[#05BFDB] bg-[#FFFFFF] text-[#3E3E3E]">
              {bodyPartFilterOptions.map(part => <option key={part || 'all-bp'} value={part}>{capitalize(part) || 'All Body Parts'}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="equipment-filter" className="block text-sm font-medium text-[#6C757D] mb-1">Equipment</label>
            <select id="equipment-filter" value={selectedEquipment} onChange={(e) => setSelectedEquipment(e.target.value)}
              className="w-full py-2.5 px-3 border border-[#B0B0B0] rounded-xl focus:ring-2 focus:ring-[#05BFDB] focus:border-[#05BFDB] bg-[#FFFFFF] text-[#3E3E3E]">
              {equipmentFilterOptions.map(equip => <option key={equip || 'all-eq'} value={equip}>{capitalize(equip) || 'All Equipment'}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-4 text-right">
            <button onClick={handleResetAndReload}
                className="text-sm text-[#05BFDB] hover:underline inline-flex items-center">
                <RefreshCw className="w-4 h-4 mr-1"/> Reset Filters & Reload
            </button>
        </div>
      </div>

      {isLoading && (<div className="flex flex-col items-center justify-center py-20"><Loader2 className="h-12 w-12 animate-spin text-[#05BFDB]" /><p className="mt-4 text-lg text-[#6C757D]">Loading Exercises...</p></div>)}
      
      {error && !isLoading && (
        <div className="text-center py-20 bg-[#DC3545]/10 p-6 rounded-2xl">
            <AlertTriangle className="h-16 w-16 text-[#DC3545] mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-[#0B0B0B] mb-2">Oops! Something went wrong.</h3>
            <p className="text-[#3E3E3E] mb-6">{error}</p>
            <button onClick={handleResetAndReload}
                className="px-6 py-2.5 bg-[#0A4D68] hover:bg-[#083D53] text-white font-semibold rounded-xl shadow hover:shadow-md transition-all inline-flex items-center">
                <RefreshCw className="w-5 h-5 mr-2" /> Try Again
            </button>
        </div>
      )}

      {!isLoading && !error && exercisesToDisplay.length === 0 && (searchTerm || selectedBodyPart || selectedEquipment) && (
        <div className="text-center py-20">
            <Search className="h-16 w-16 text-[#6C757D] mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-[#0B0B0B] mb-2">No Exercises Found</h3>
            <p className="text-[#3E3E3E]">Try adjusting your search terms or filters.</p>
        </div>
      )}
      
      {!isLoading && !error && exercisesToDisplay.length === 0 && !searchTerm && !selectedBodyPart && !selectedEquipment && allFetchedExercises.length === 0 && (
        <div className="text-center py-20">
            <Info className="h-16 w-16 text-[#6C757D] mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-[#0B0B0B] mb-2">No Exercises Available</h3>
            <p className="text-[#3E3E3E]">It seems there are no exercises to display at the moment.</p>
        </div>
      )}

      {!error && exercisesToDisplay.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {exercisesToDisplay.map(exercise => (<ExerciseCard key={exercise.exerciseId} exercise={exercise} navigate={navigate} />))}
        </div>
      )}

      {canLoadMore && !isLoading && (
          <div className="mt-12 text-center">
            <button onClick={loadMoreExerciseData} disabled={isLoadingMore}
                className="px-8 py-3 bg-[#05BFDB] hover:bg-[#049DB4] text-[#0B0B0B] font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 inline-flex items-center disabled:opacity-70">
                {isLoadingMore ? <Loader2 className="w-5 h-5 mr-2 animate-spin"/> : null}
                {isLoadingMore ? 'Loading More...' : 'Load More Exercises'}
            </button>
          </div>
      )}
    </div>
  );
};
export default WorkoutsPage;
