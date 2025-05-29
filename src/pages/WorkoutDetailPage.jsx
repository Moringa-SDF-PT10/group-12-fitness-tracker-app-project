import React, { useState, useEffect, useCallback } from 'react';
import {
    ArrowLeft, Zap, Target, Shield, ListChecks, Dumbbell, Loader2, AlertTriangle, Info, Users,
    HeartPulse, MoveHorizontal, Footprints, UserCircle, Award, TrendingUp, CircleDot,
    ArrowUpFromDot, Activity
} from 'lucide-react';

const API_SINGLE_EXERCISE_URL_BASE = 'https://exercisedb-api.vercel.app/api/v1/exercises/';

const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

// Updated to use new palette
const getIconForBodyPartDetail = (bodyPart) => {
    const bp = bodyPart ? bodyPart.toLowerCase() : '';
    const iconSize = "w-24 h-24 md:w-32 md:h-32";
    const iconColorClass = "text-[#A1887F]"; // Using accent-neutral or text-secondary

    switch (bp) {
        case 'back': return <ArrowUpFromDot className={`${iconSize} ${iconColorClass}`} />;
        case 'cardio': return <HeartPulse className={`${iconSize} text-[#FFB6C1]`} />; // Secondary pastel for cardio
        case 'chest': return <Shield className={`${iconSize} ${iconColorClass}`} />;
        // ... (update other cases similarly or use default iconColorClass)
        default: return <Activity className={`${iconSize} ${iconColorClass}`} />;
    }
};


const WorkoutDetailPage = ({ workoutId, navigate }) => {
  const [exercise, setExercise] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExercise = useCallback(async () => {
    // ... (fetch logic remains the same)
    if (!workoutId) { /* ... */ return; }
    setIsLoading(true); setError(null); setExercise(null);
    try {
      const response = await fetch(`${API_SINGLE_EXERCISE_URL_BASE}${workoutId}`);
      if (!response.ok) { /* ... */ throw new Error(/* ... */); }
      const result = await response.json();
      if (!result.success || !result.data) { /* ... */ throw new Error(/* ... */); }
      const fetchedExerciseData = result.data;
      if (typeof fetchedExerciseData !== 'object' || fetchedExerciseData === null || Object.keys(fetchedExerciseData).length === 0) {
          throw new Error("Invalid or empty exercise data received from API.");
      }
      setExercise(fetchedExerciseData);
    } catch (err) { /* ... */ setError(err.message || "Could not load exercise details."); setExercise(null);
    } finally { setIsLoading(false); }
  }, [workoutId]);

  useEffect(() => { fetchExercise(); }, [fetchExercise]);

  const DetailItem = ({ icon: Icon, label, value, isList = false, iconColor = "text-[#FFDAC1]" }) => ( // Default icon color to primary pastel
    <div className="flex items-start">
      <Icon className={`w-6 h-6 mr-3 mt-1 flex-shrink-0 ${iconColor}`} />
      <div>
        <p className="text-sm font-medium text-[#A1887F]">{label}</p>
        {isList && Array.isArray(value) ? (
          <ul className="list-none mt-1 space-y-0.5">
            {value.length > 0 ? value.map((item, index) => (
              <li key={index} className="text-lg text-[#6D4C41]">{item ? capitalize(item) : 'N/A'}</li>
            )) : <li className="text-lg text-[#6D4C41] italic">N/A</li>}
          </ul>
        ) : (
          <p className="text-lg text-[#6D4C41]">{value && typeof value === 'string' ? capitalize(value) : (value || <span className="italic">N/A</span>)}</p>
        )}
      </div>
    </div>
  );

  // Loading and Error states - update text/icon colors
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#FFF7F5]">
        <Loader2 className="h-16 w-16 animate-spin text-[#FFB6C1]" />
        <p className="mt-4 text-xl text-[#A1887F]">Loading Exercise Details...</p>
      </div>
    );
  }
  if (error) { /* ... (update with new palette text/bg colors) ... */ }
  if (!exercise) { /* ... (update with new palette text/bg colors) ... */ }

  const primaryBodyPart = (Array.isArray(exercise.bodyParts) && exercise.bodyParts.length > 0) ? exercise.bodyParts[0] : 'unknown';

  return (
    <div className="min-h-full bg-[#FFF7F5] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
         <button
            onClick={() => navigate('/workouts')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-[#FFB6C1] hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFB6C1] transition-transform hover:scale-105"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Workouts
          </button>
        </div>
        <div className="bg-[#FFFFFF] shadow-xl rounded-2xl overflow-hidden border border-[#F5E0D5]">
          <header className="relative bg-[#FFDAC1] p-6 md:p-8"> {/* Header with primary pastel */}
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#6D4C41] tracking-tight">
              {exercise.name ? capitalize(exercise.name) : "Exercise Name Unavailable"}
            </h1>
          </header>
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
              <div className="w-full h-64 md:h-80 flex items-center justify-center bg-[#FFDAC1]/20 rounded-xl shadow-inner border-2 border-[#F5E0D5] p-4">
                {getIconForBodyPartDetail(primaryBodyPart)}
              </div>
              <div className="space-y-5">
                <DetailItem icon={Target} label="Primary Target Muscle(s)" value={exercise.targetMuscles || []} isList={true} iconColor="text-[#FFB6C1]" />
                <DetailItem icon={Shield} label="Body Part(s)" value={exercise.bodyParts || []} isList={true} iconColor="text-[#FFDAC1]" />
                <DetailItem icon={Dumbbell} label="Equipment Needed" value={exercise.equipments || []} isList={true} iconColor="text-[#A1887F]" />
                <DetailItem icon={Users} label="Secondary Muscles" value={exercise.secondaryMuscles || []} isList={true} iconColor="text-[#D7CCC8]" />
              </div>
            </div>

            {Array.isArray(exercise.instructions) && exercise.instructions.length > 0 && (
              <div className="mt-8 pt-6 border-t border-[#F5E0D5]">
                <h2 className="text-2xl font-semibold text-[#6D4C41] mb-4 flex items-center">
                  <ListChecks className="w-7 h-7 mr-2 text-[#FFB6C1]" />
                  Instructions
                </h2>
                <ol className="space-y-3 text-[#6D4C41] leading-relaxed">
                  {exercise.instructions.map((step, index) => {
                    const instructionText = typeof step === 'string' && step.startsWith(`Step:${index + 1}`) ? step.substring(`Step:${index + 1} `.length) : step;
                    return (
                        <li key={index} className="flex items-start">
                            <span className="mr-3 bg-[#FFDAC1]/40 text-[#6D4C41] font-semibold rounded-full h-6 w-6 flex items-center justify-center text-xs">
                                {index + 1}
                            </span>
                            <span className="text-md flex-1">{typeof instructionText === 'string' ? capitalize(instructionText) : "Instruction step not available."}</span>
                        </li>
                    );
                  })}
                </ol>
              </div>
            )}
            <div className="mt-10 text-center">
                 <button
                    className="px-8 py-3 bg-[#FFB6C1] hover:bg-opacity-80 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center text-lg"
                >
                    <Zap className="w-5 h-5 mr-2" />
                    Log This Exercise (Coming Soon)
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutDetailPage;