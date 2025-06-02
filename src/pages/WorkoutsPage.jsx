import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search, ChevronRight, RefreshCw, AlertTriangle, Loader2, Dumbbell,
    HeartPulse, Shield, MoveHorizontal, Footprints, UserCircle, Award, Zap,
    TrendingUp, CircleDot, ArrowUpFromDot, Activity, Info
} from 'lucide-react';

const API_LIST_URL = 'https://exercisedb-api.vercel.app/api/v1/exercises';

// Capitalize first letter of a string
const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

// Return appropriate icon based on the body part
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
            e.stopPropagation(); // Prevent card click
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

  // State variables
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

  // Fetch exercises from API
  const fetchExerciseData = useCallback(async (url) => {
    setIsLoading(true);
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`API request failed: ${response.status}`);
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

  // Load initial set of exercises on component mount
  useEffect(() => {
    const loadInitialExercises = async () => {
        setError(null);
        const initialItems = await fetchExerciseData(`${API_LIST_URL}?limit=50`);
        if (initialItems && initialItems.length > 0) {
            setAllFetchedExercises(initialItems);
            // Extract unique filter options
            const uniqueBodyParts = ['', ...new Set(initialItems.flatMap(ex => ex.bodyParts || []).map(bp => bp ? bp.toLowerCase() : '').filter(bp => bp))].sort();
            const uniqueEquipments = ['', ...new Set(initialItems.flatMap(ex => ex.equipments || []).map(eq => eq ? eq.toLowerCase() : '').filter(eq => eq))].sort();
            setBodyPartFilterOptions(uniqueBodyParts);
            setEquipmentFilterOptions(uniqueEquipments);
        }
    };
    loadInitialExercises();
  }, [fetchExerciseData]);

  // Apply filters and search to fetched exercises
  useEffect(() => {
    let filtered = allFetchedExercises;

    // Apply search term
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(ex =>
        (ex.name && ex.name.toLowerCase().includes(lowerSearchTerm)) ||
        (Array.isArray(ex.targetMuscles) && ex.targetMuscles.some(tm => tm && tm.toLowerCase().includes(lowerSearchTerm)))
      );
    }

    // Apply body part filter
    if (selectedBodyPart) {
      const lowerBodyPart = selectedBodyPart.toLowerCase();
      filtered = filtered.filter(ex =>
        Array.isArray(ex.bodyParts) && ex.bodyParts.some(bp => bp && bp.toLowerCase() === lowerBodyPart)
      );
    }

    // Apply equipment filter
    if (selectedEquipment) {
      const lowerEquipment = selectedEquipment.toLowerCase();
      filtered = filtered.filter(ex =>
        Array.isArray(ex.equipments) && ex.equipments.some(eq => eq && eq.toLowerCase() === lowerEquipment)
      );
    }

    // Limit to first 30
    setExercisesToDisplay(filtered.slice(0, 30));
  }, [searchTerm, selectedBodyPart, selectedEquipment, allFetchedExercises]);

  // Load more exercises
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
    <div className="p-4 md:p-6 lg:p-8 bg-[#F5F5F5] min-h-full">
      <header className="mb-8 text-center">
        <div className="inline-flex items-center justify-center bg-[#E0E0E0] p-3 rounded-full mb-3">
            <Dumbbell className="h-10 w-10 text-[#05BFDB]" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-[#0B0B0B]">
          Explore Exercises
        </h1>
        <p className="text-[#3E3E3E] mt-2 text-md max-w-xl mx-auto">
          Find the perfect workout for your goals. Filter by body part, equipment, or search by name.
        </p>
      </header>


      <div className="mb-8 p-4 md:p-6 bg-[#FFFFFF] rounded-2xl shadow-lg border border-[#D1D1D1]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="lg:col-span-2">
            <label htmlFor="search-exercise" className="block text-sm font-medium text-[#6C757D] mb-1">
              Search Exercise
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-[#6C757D]" />
              </div>
              <input
                type="text"
                id="search-exercise"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 border border-[#B0B0B0] rounded-xl focus:ring-2 focus:ring-[#05BFDB] focus:border-[#05BFDB] bg-[#FFFFFF] text-[#3E3E3E] placeholder-[#6C757D]"
                placeholder="e.g., Bench Press, Squats..."
              />
            </div>
          </div>
          <div>
            <label htmlFor="bodyPart-filter" className="block text-sm font-medium text-[#6C757D] mb-1">
              Body Part
            </label>
            <select
              id="bodyPart-filter"
              value={selectedBodyPart}
              onChange={(e) => setSelectedBodyPart(e.target.value)}
              className="w-full py-2.5 px-3 border border-[#B0B0B0] rounded-xl focus:ring-2 focus:ring-[#05BFDB] focus:border-[#05BFDB] bg-[#FFFFFF] text-[#3E3E3E]"
            >
              {bodyPartFilterOptions.map((option, idx) => (
                <option key={idx} value={option}>{capitalize(option) || 'All'}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="equipment-filter" className="block text-sm font-medium text-[#6C757D] mb-1">
              Equipment
            </label>
            <select
              id="equipment-filter"
              value={selectedEquipment}
              onChange={(e) => setSelectedEquipment(e.target.value)}
              className="w-full py-2.5 px-3 border border-[#B0B0B0] rounded-xl focus:ring-2 focus:ring-[#05BFDB] focus:border-[#05BFDB] bg-[#FFFFFF] text-[#3E3E3E]"
            >
              {equipmentFilterOptions.map((option, idx) => (
                <option key={idx} value={option}>{capitalize(option) || 'All'}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Exercises grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {exercisesToDisplay.map(ex => (
          <ExerciseCard key={ex.exerciseId} exercise={ex} navigate={navigate} />
        ))}
      </div>

      {/* Load More Button */}
      {canLoadMore && (
        <div className="text-center mt-10">
          <button
            onClick={loadMoreExerciseData}
            className="inline-flex items-center px-6 py-3 text-sm font-semibold bg-[#05BFDB] text-[#0B0B0B] rounded-xl shadow-md hover:bg-[#04A2BA] transition-all duration-300"
          >
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Load More Exercises
          </button>
        </div>
      )}
    </div>
  );
};

export default WorkoutsPage;
