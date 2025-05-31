import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Zap, Target, Shield, ListChecks, Dumbbell, Loader2, AlertTriangle, Info, Users,
    HeartPulse, MoveHorizontal, Footprints, UserCircle, Award, TrendingUp, CircleDot,
    ArrowUpFromDot, Activity, Edit3, Save, XCircle, PlusSquare, RefreshCw, Trash2
} from 'lucide-react';

const API_SINGLE_EXERCISE_URL_BASE = 'https://exercisedb-api.vercel.app/api/v1/exercises/';

const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

const getIconForBodyPartDetail = (bodyPart) => {
    const bp = bodyPart ? bodyPart.toLowerCase() : '';
    const iconSize = "w-24 h-24 md:w-32 md:h-32";
    const iconColorClass = "text-[#A1887F]";

    switch (bp) {
        case 'back': return <ArrowUpFromDot className={`${iconSize} ${iconColorClass}`} />;
        case 'cardio': return <HeartPulse className={`${iconSize} text-[#FFB6C1]`} />;
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

const WorkoutDetailPage = () => {
  const { workoutId } = useParams();
  const navigate = useNavigate();

  const [exercise, setExercise] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editableExercise, setEditableExercise] = useState(null);
  const [showLogModal, setShowLogModal] = useState(false);
  const [logData, setLogData] = useState({
    date: new Date().toISOString().split('T')[0], // Starts at today
    time: '08:00', // Default time
    duration: '',
    sets: '',
    reps: '',
    weight: '',
    notes: ''
  });
  const [saveMessage, setSaveMessage] = useState('');

  const fetchExercise = useCallback(async () => {
    if (!workoutId) {
        setError("Workout ID is missing.");
        setIsLoading(false);
        return;
    }
    setIsLoading(true); 
    setError(null); 
    
    const localKey = `editedExercise_${workoutId}`;
    const locallySavedExerciseJSON = localStorage.getItem(localKey);
    if (locallySavedExerciseJSON) {
        try {
            const locallySavedExercise = JSON.parse(locallySavedExerciseJSON);
             // Basic validatio to check if it has an exerciseId and name
            if (locallySavedExercise && locallySavedExercise.exerciseId && locallySavedExercise.name) {
                setExercise(locallySavedExercise);
                setEditableExercise(JSON.parse(JSON.stringify(locallySavedExercise)));
                setIsLoading(false);
                return;
            } else {
                console.warn("Locally saved exercise data is invalid, removing.");
                localStorage.removeItem(localKey);
            }
        } catch (e) {
            console.warn("Failed to parse locally saved exercise, fetching from API.", e);
            localStorage.removeItem(localKey);
        }
    }

    try {
      const response = await fetch(`${API_SINGLE_EXERCISE_URL_BASE}${workoutId}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `HTTP error! Status: ${response.status}` }));
        throw new Error(errorData.message || `API request failed: ${response.status}`);
      }
      const result = await response.json();
      if (!result.success || !result.data) {
        throw new Error(result.message || "Exercise data not found in API response.");
      }
      const fetchedExerciseData = result.data;
      if (typeof fetchedExerciseData !== 'object' || fetchedExerciseData === null || Object.keys(fetchedExerciseData).length === 0) {
          throw new Error("Invalid or empty exercise data received from API.");
      }
      setExercise(fetchedExerciseData);
      setEditableExercise(JSON.parse(JSON.stringify(fetchedExerciseData)));
    } catch (err) {
      setError(err.message || "Could not load exercise details.");
      setExercise(null);
      setEditableExercise(null);
    } finally {
      setIsLoading(false);
    }
  }, [workoutId]);

  useEffect(() => {
    fetchExercise();
  }, [fetchExercise]);

  const handleEditInputChange = (field, value, index = null) => {
    setEditableExercise(prev => {
      const newExercise = { ...prev };
      if (field === 'instructions' && index !== null) {
        newExercise.instructions = [...newExercise.instructions];
        newExercise.instructions[index] = value;
      } else if (field === 'targetMuscles' || field === 'bodyParts' || field === 'equipments' || field === 'secondaryMuscles') {
        newExercise[field] = value.split(',').map(s => s.trim()).filter(s => s);
      } else {
        newExercise[field] = value;
      }
      return newExercise;
    });
  };
  
  const handleAddInstruction = () => {
    setEditableExercise(prev => ({
        ...prev,
        instructions: [...(prev.instructions || []), 'New instruction']
    }));
  };

  const handleRemoveInstruction = (index) => {
    setEditableExercise(prev => ({
        ...prev,
        instructions: prev.instructions.filter((_, i) => i !== index)
    }));
  };


  const handleSaveEdit = () => {
    console.log("Simulating save to server:", editableExercise);
    
    // Save to localStorage
    const localKey = `editedExercise_${editableExercise.exerciseId}`;
    localStorage.setItem(localKey, JSON.stringify(editableExercise));
    
    setExercise(editableExercise);
    setIsEditing(false);
    setSaveMessage("Exercise updated successfully!");
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleCancelEdit = () => {
    // Reset editableExercise to the original exercise state
    setEditableExercise(JSON.parse(JSON.stringify(exercise)));
    setIsEditing(false);
  };

  const handleLogInputChange = (e) => {
    const { name, value } = e.target;
    setLogData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveLog = () => {
    if (!logData.date || !logData.duration || !logData.time) {
        setSaveMessage("Please fill in Date, Time, and Duration.");
        setTimeout(() => setSaveMessage(''), 3000);
        return;
    }
    const newLogEntry = {
      logId: crypto.randomUUID(), 
      exerciseId: exercise.exerciseId,
      exerciseName: exercise.name,
      ...logData
    };
    
    const existingLogsJSON = localStorage.getItem('loggedWorkouts');
    let loggedWorkouts = [];
    if (existingLogsJSON) {
        try {
            loggedWorkouts = JSON.parse(existingLogsJSON);
            if (!Array.isArray(loggedWorkouts)) loggedWorkouts = []; 
        } catch (e) {
            console.error("Error parsing logged workouts from localStorage", e);
            loggedWorkouts = [];
        }
    }
    
    loggedWorkouts.push(newLogEntry);
    localStorage.setItem('loggedWorkouts', JSON.stringify(loggedWorkouts));
    
    setShowLogModal(false);
    setLogData({ date: new Date().toISOString().split('T')[0], time: '08:00', duration: '', sets: '', reps: '', weight: '', notes: '' });
    setSaveMessage("Exercise logged successfully! View it on your dashboard.");
    setTimeout(() => {
        setSaveMessage('');
        navigate('/dashboard#completed-workouts'); 
    }, 3000);
  };

  const DetailItem = ({ icon: Icon, label, value, isList = false, iconColor = "text-[#FFDAC1]" }) => (
    <div className="flex items-start mb-3">
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

  const EditableField = ({ label, name, value, onChange, type = "text", rows = 1 }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-[#A1887F] mb-1">{label}</label>
        {type === "textarea" ? (
            <textarea
                name={name}
                value={value}
                onChange={onChange}
                rows={rows}
                className="w-full px-3 py-2 border border-[#F5E0D5] rounded-lg focus:ring-2 focus:ring-[#FFB6C1] focus:border-[#FFB6C1] text-[#6D4C41]"
            />
        ) : (
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full px-3 py-2 border border-[#F5E0D5] rounded-lg focus:ring-2 focus:ring-[#FFB6C1] focus:border-[#FFB6C1] text-[#6D4C41]"
            />
        )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#FFF7F5]">
        <Loader2 className="h-16 w-16 animate-spin text-[#FFB6C1]" />
        <p className="mt-4 text-xl text-[#A1887F]">Loading Exercise Details...</p>
      </div>
    );
  }

  if (error) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#FFF7F5]">
            <div className="text-center bg-[#FFB6C1]/10 p-8 rounded-2xl shadow-lg max-w-md w-full">
                <AlertTriangle className="h-16 w-16 text-[#FFB6C1] mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-[#6D4C41] mb-2">Oops! Failed to Load Details.</h3>
                <p className="text-[#A1887F] mb-6">{error}</p>
                <button
                    onClick={() => navigate('/workouts')}
                    className="px-6 py-2.5 bg-[#FFB6C1] hover:bg-opacity-80 text-white font-semibold rounded-xl shadow hover:shadow-md transition-all inline-flex items-center mr-2"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" /> Back to Workouts
                </button>
                <button
                    onClick={fetchExercise}
                    className="px-6 py-2.5 bg-[#FFDAC1] hover:bg-opacity-80 text-[#6D4C41] font-semibold rounded-xl shadow hover:shadow-md transition-all inline-flex items-center"
                >
                    <RefreshCw className="w-5 h-5 mr-2" /> Try Again
                </button>
            </div>
        </div>
    );
  }
  
  if (!exercise || !editableExercise) { 
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#FFF7F5]">
            <div className="text-center bg-[#FFFFFF] p-8 rounded-2xl shadow-lg border border-[#F5E0D5] max-w-md w-full">
                <Info className="h-16 w-16 text-[#A1887F] mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-[#6D4C41] mb-2">Exercise Not Found</h3>
                <p className="text-[#A1887F] mb-6">
                    The exercise you are looking for could not be found or is unavailable.
                </p>
                <button
                    onClick={() => navigate('/workouts')}
                    className="px-6 py-2.5 bg-[#FFB6C1] hover:bg-opacity-80 text-white font-semibold rounded-xl shadow hover:shadow-md transition-all inline-flex items-center"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" /> Back to Workouts
                </button>
            </div>
        </div>
    );
  }

  const primaryBodyPart = (Array.isArray(exercise.bodyParts) && exercise.bodyParts.length > 0) ? exercise.bodyParts[0] : 'unknown';

  return (
    <div className="min-h-full bg-[#FFF7F5] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {saveMessage && (
            <div className={`mb-4 p-3 ${saveMessage.includes("Please fill in") ? 'bg-yellow-100 border-yellow-400 text-yellow-700' : 'bg-green-100 border-green-400 text-green-700'} rounded-lg text-center`}>
                {saveMessage}
            </div>
        )}
        <div className="mb-6 flex justify-between items-center">
         <button
            onClick={() => navigate('/workouts')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-[#FFB6C1] hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFB6C1] transition-transform hover:scale-105"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back
          </button>
          {!isEditing && (
            <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-[#FFDAC1] hover:bg-opacity-80 text-[#6D4C41] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFDAC1] transition-transform hover:scale-105"
            >
                <Edit3 className="mr-2 h-5 w-5" />
                Edit
            </button>
          )}
        </div>
        <div className="bg-[#FFFFFF] shadow-xl rounded-2xl overflow-hidden border border-[#F5E0D5]">
          <header className="relative bg-[#FFDAC1] p-6 md:p-8">
            {isEditing ? (
                <EditableField 
                    label="Exercise Name" 
                    name="name"
                    value={editableExercise.name || ''} 
                    onChange={(e) => handleEditInputChange('name', e.target.value)} 
                />
            ) : (
                <h1 className="text-3xl md:text-4xl font-extrabold text-[#6D4C41] tracking-tight">
                {exercise.name ? capitalize(exercise.name) : "Exercise Name Unavailable"}
                </h1>
            )}
          </header>
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
              <div className="w-full h-64 md:h-80 flex items-center justify-center bg-[#FFDAC1]/20 rounded-xl shadow-inner border-2 border-[#F5E0D5] p-4">
                {getIconForBodyPartDetail(isEditing ? (editableExercise.bodyParts?.[0] || 'unknown') : primaryBodyPart)}
              </div>
              <div className="space-y-1"> 
                {isEditing ? (
                    <>
                        <EditableField label="Primary Target Muscle(s) (comma-separated)" name="targetMuscles" value={(editableExercise.targetMuscles || []).join(', ')} onChange={(e) => handleEditInputChange('targetMuscles', e.target.value)} />
                        <EditableField label="Body Part(s) (comma-separated)" name="bodyParts" value={(editableExercise.bodyParts || []).join(', ')} onChange={(e) => handleEditInputChange('bodyParts', e.target.value)} />
                        <EditableField label="Equipment Needed (comma-separated)" name="equipments" value={(editableExercise.equipments || []).join(', ')} onChange={(e) => handleEditInputChange('equipments', e.target.value)} />
                        <EditableField label="Secondary Muscles (comma-separated)" name="secondaryMuscles" value={(editableExercise.secondaryMuscles || []).join(', ')} onChange={(e) => handleEditInputChange('secondaryMuscles', e.target.value)} />
                    </>
                ) : (
                    <>
                        <DetailItem icon={Target} label="Primary Target Muscle(s)" value={exercise.targetMuscles || []} isList={true} iconColor="text-[#FFB6C1]" />
                        <DetailItem icon={Shield} label="Body Part(s)" value={exercise.bodyParts || []} isList={true} iconColor="text-[#FFDAC1]" />
                        <DetailItem icon={Dumbbell} label="Equipment Needed" value={exercise.equipments || []} isList={true} iconColor="text-[#A1887F]" />
                        <DetailItem icon={Users} label="Secondary Muscles" value={exercise.secondaryMuscles || []} isList={true} iconColor="text-[#D7CCC8]" />
                    </>
                )}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#F5E0D5]">
                <h2 className="text-2xl font-semibold text-[#6D4C41] mb-4 flex items-center">
                    <ListChecks className="w-7 h-7 mr-2 text-[#FFB6C1]" />
                    Instructions
                </h2>
                {isEditing ? (
                    <div className="space-y-3">
                        {(editableExercise.instructions || []).map((step, index) => (
                            <div key={index} className="flex items-start space-x-2">
                                <span className="mt-2 mr-1 bg-[#FFDAC1]/40 text-[#6D4C41] font-semibold rounded-full h-6 w-6 flex items-center justify-center text-xs flex-shrink-0">
                                    {index + 1}
                                </span>
                                <textarea
                                    value={step}
                                    onChange={e => handleEditInputChange('instructions', e.target.value, index)}
                                    rows="2"
                                    className="flex-grow px-3 py-2 border border-[#F5E0D5] rounded-lg focus:ring-2 focus:ring-[#FFB6C1] focus:border-[#FFB6C1] text-[#6D4C41]"
                                />
                                <button onClick={() => handleRemoveInstruction(index)} className="p-2 text-red-500 hover:text-red-700">
                                    <Trash2 size={18}/>
                                </button>
                            </div>
                        ))}
                        <button 
                            onClick={handleAddInstruction}
                            className="mt-2 px-3 py-1.5 bg-[#FFDAC1]/60 text-[#6D4C41] text-sm font-medium rounded-md hover:bg-[#FFDAC1]"
                        >
                            Add Instruction
                        </button>
                    </div>
                ) : (
                    Array.isArray(exercise.instructions) && exercise.instructions.length > 0 ? (
                        <ol className="space-y-3 text-[#6D4C41] leading-relaxed">
                        {exercise.instructions.map((step, index) => {
                            const instructionText = typeof step === 'string' && step.startsWith(`Step:${index + 1}`) ? step.substring(`Step:${index + 1} `.length) : step;
                            return (
                                <li key={index} className="flex items-start">
                                    <span className="mr-3 bg-[#FFDAC1]/40 text-[#6D4C41] font-semibold rounded-full h-6 w-6 flex items-center justify-center text-xs flex-shrink-0">
                                        {index + 1}
                                    </span>
                                    <span className="text-md flex-1">{typeof instructionText === 'string' ? capitalize(instructionText) : "Instruction step not available."}</span>
                                </li>
                            );
                        })}
                        </ol>
                    ) : <p className="text-[#A1887F] italic">No instructions available.</p>
                )}
            </div>
            
            {isEditing ? (
                <div className="mt-10 flex justify-end space-x-3">
                    <button
                        onClick={handleCancelEdit}
                        className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl shadow hover:shadow-md transition-all inline-flex items-center"
                    >
                        <XCircle className="w-5 h-5 mr-2" /> Cancel
                    </button>
                    <button
                        onClick={handleSaveEdit}
                        className="px-6 py-2.5 bg-[#FFB6C1] hover:bg-opacity-80 text-white font-semibold rounded-xl shadow hover:shadow-md transition-all inline-flex items-center"
                    >
                        <Save className="w-5 h-5 mr-2" /> Save Changes
                    </button>
                </div>
            ) : (
                <div className="mt-10 text-center">
                    <button
                        onClick={() => setShowLogModal(true)}
                        className="px-8 py-3 bg-[#FFB6C1] hover:bg-opacity-80 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center text-lg"
                    >
                        <PlusSquare className="w-5 h-5 mr-2" />
                        Log This Exercise
                    </button>
                </div>
            )}
          </div>
        </div>
      </div>
      
      {showLogModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md transform transition-all">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-[#6D4C41]">Log: {capitalize(exercise.name)}</h3>
                    <button onClick={() => setShowLogModal(false)} className="text-[#A1887F] hover:text-[#6D4C41]">
                        <XCircle size={24} />
                    </button>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); handleSaveLog(); }}>
                    <div className="grid grid-cols-2 gap-4">
                        <EditableField label="Date" name="date" type="date" value={logData.date} onChange={handleLogInputChange} />
                        <EditableField label="Time" name="time" type="time" value={logData.time} onChange={handleLogInputChange} />
                    </div>
                    <EditableField label="Duration (e.g., 30 mins, 1 hour)" name="duration" value={logData.duration} onChange={handleLogInputChange} />
                    <div className="grid grid-cols-2 gap-4">
                        <EditableField label="Sets" name="sets" type="number" value={logData.sets} onChange={handleLogInputChange} />
                        <EditableField label="Reps (per set)" name="reps" type="number" value={logData.reps} onChange={handleLogInputChange} />
                    </div>
                    <EditableField label="Weight (kg, optional)" name="weight" type="number" value={logData.weight} onChange={handleLogInputChange} />
                    <EditableField label="Notes (optional)" name="notes" type="textarea" rows={3} value={logData.notes} onChange={handleLogInputChange} />
                    <div className="mt-6 flex justify-end space-x-3">
                        <button type="button" onClick={() => setShowLogModal(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-[#FFB6C1] text-white rounded-lg hover:bg-opacity-80">Save Log</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutDetailPage;