import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Zap, Target, Shield, ListChecks, Dumbbell, Loader2, AlertTriangle, Info, Users,
    HeartPulse, MoveHorizontal, Footprints, UserCircle, Award, TrendingUp, CircleDot,
    ArrowUpFromDot, Activity, Edit3, Save, XCircle, PlusSquare, RefreshCw, Trash2
} from 'lucide-react';


// Base API endpoint for fetching a single exercise
const API_SINGLE_EXERCISE_URL_BASE = 'https://exercisedb-api.vercel.app/api/v1/exercises/';


// Helper function to capitalize strings
const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

// Returns a matching icon for a given body part..[execrcise gifs werent loading]
const getIconForBodyPartDetail = (bodyPart) => {
    const bp = bodyPart ? bodyPart.toLowerCase() : '';
    const iconSize = "w-24 h-24 md:w-32 md:h-32";
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


// Main component for rendering and managing an individual workout
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
    date: new Date().toISOString().split('T')[0],
    time: '08:00',
    duration: '',
    sets: '',
    reps: '',
    weight: '',
    notes: ''
  });
  const [saveMessage, setSaveMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);


    // Fetch the exercise either from localStorage or API
  const fetchExercise = useCallback(async () => {
    if (!workoutId) {
        setError("Workout ID is missing."); setIsLoading(false); return;
    }
    setIsLoading(true); setError(null);
    

    // Attempt to load locally saved edits
    const localKey = `editedExercise_${workoutId}`;
    const locallySavedExerciseJSON = localStorage.getItem(localKey);
    if (locallySavedExerciseJSON) {
        try {
            const locallySavedExercise = JSON.parse(locallySavedExerciseJSON);
            if (locallySavedExercise && locallySavedExercise.exerciseId && locallySavedExercise.name) {
                setExercise(locallySavedExercise);
                setEditableExercise(JSON.parse(JSON.stringify(locallySavedExercise)));
                setIsLoading(false); return;
            } else { localStorage.removeItem(localKey); }
        } catch (e) { localStorage.removeItem(localKey); }
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
      setExercise(null); setEditableExercise(null);
    } finally { setIsLoading(false); }
  }, [workoutId]);

  useEffect(() => { fetchExercise(); }, [fetchExercise]);


  // Handle input changes while editing an exercise
  const handleEditInputChange = (field, value, index = null) => {
    setEditableExercise(prev => {
      const newExercise = { ...prev };
      if (field === 'instructions' && index !== null) {
        newExercise.instructions = [...(newExercise.instructions || [])]; // Ensure instructions array exists
        newExercise.instructions[index] = value;
      } else if (field === 'targetMuscles' || field === 'bodyParts' || field === 'equipments' || field === 'secondaryMuscles') {
        newExercise[field] = value.split(',').map(s => s.trim()).filter(s => s);
      } else { newExercise[field] = value; }
      return newExercise;
    });
  };
  
  const handleAddInstruction = () => setEditableExercise(prev => ({ ...prev, instructions: [...(prev.instructions || []), 'New instruction'] }));
  
  const handleRemoveInstruction = (index) => {
    setEditableExercise(prev => ({
        ...prev,
        instructions: (prev.instructions || []).filter((_, i) => i !== index)
    }));
  };

  const handleSaveEdit = async () => {
    if (!editableExercise || !editableExercise.exerciseId) {
        setSaveMessage("Error: Exercise data is missing.");
        setTimeout(() => setSaveMessage(''), 3000);
        return;
    }
    setIsSaving(true);
    setSaveMessage('');

    try {
        const response = await fetch(`${API_SINGLE_EXERCISE_URL_BASE}${editableExercise.exerciseId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editableExercise),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.warn("API response not OK:", response.status, errorData);
            if (response.status === 403 || response.status === 405 || response.status === 404) {
                 setSaveMessage("Note: API is likely read-only. Changes saved locally.");
            } else {
                throw new Error(`API error: ${response.status} - ${errorData.message || 'Failed to save to server.'}`);
            }
        } else {
            const responseData = await response.json();
            console.log("API save response:", responseData);
            setSaveMessage("Changes submitted to API and saved locally!");
        }
        
        const localKey = `editedExercise_${editableExercise.exerciseId}`;
        localStorage.setItem(localKey, JSON.stringify(editableExercise));
        
        setExercise(editableExercise);
        setIsEditing(false);

    } catch (err) {
        console.error("Error saving exercise:", err);
        setSaveMessage(`Error: ${err.message}. Changes saved locally only.`);
        const localKey = `editedExercise_${editableExercise.exerciseId}`;
        localStorage.setItem(localKey, JSON.stringify(editableExercise));
        setExercise(editableExercise);
        setIsEditing(false);
    } finally {
        setIsSaving(false);
        setTimeout(() => setSaveMessage(''), 4000);
    }
  };

  const handleCancelEdit = () => { 
    if (exercise) { // Ensure exercise is not null before stringifying
        setEditableExercise(JSON.parse(JSON.stringify(exercise)));
    }
    setIsEditing(false); 
  };

  const handleLogInputChange = (e) => { 
    const { name, value } = e.target; 
    setLogData(prev => ({ ...prev, [name]: value })); 
  };

  const handleSaveLog = () => {
    if (!logData.date || !logData.duration || !logData.time) {
        setSaveMessage("Please fill in Date, Time, and Duration."); setTimeout(() => setSaveMessage(''), 3000); return;
    }
    if (!exercise || !exercise.exerciseId || !exercise.name) { // Guard against null exercise
        setSaveMessage("Error: Exercise data not available for logging."); setTimeout(() => setSaveMessage(''), 3000); return;
    }
    const newLogEntry = { logId: crypto.randomUUID(), exerciseId: exercise.exerciseId, exerciseName: exercise.name, ...logData };
    const existingLogsJSON = localStorage.getItem('loggedWorkouts');
    let loggedWorkouts = [];
    if (existingLogsJSON) { try { loggedWorkouts = JSON.parse(existingLogsJSON); if (!Array.isArray(loggedWorkouts)) loggedWorkouts = []; } catch (e) { loggedWorkouts = []; } }
    loggedWorkouts.push(newLogEntry);
    localStorage.setItem('loggedWorkouts', JSON.stringify(loggedWorkouts));
    setShowLogModal(false);
    setLogData({ date: new Date().toISOString().split('T')[0], time: '08:00', duration: '', sets: '', reps: '', weight: '', notes: '' });
    setSaveMessage("Exercise logged! View on dashboard.");
    setTimeout(() => { setSaveMessage(''); navigate('/dashboard#completed-workouts'); }, 3000);
  };

  // --- Child Components defined inside WorkoutDetailPage ---
  // For stability, especially with HMR, these could be moved outside or memoized if they don't rely heavily on parent scope beyond props.
  const DetailItem = ({ icon: Icon, label, value, isList = false, iconColor = "text-[#05BFDB]" }) => (
    <div className="flex items-start mb-3">
      <Icon className={`w-6 h-6 mr-3 mt-1 flex-shrink-0 ${iconColor}`} />
      <div>
        <p className="text-sm font-medium text-[#6C757D]">{label}</p>
        {isList && Array.isArray(value) ? (
          <ul className="list-none mt-1 space-y-0.5">
            {value.length > 0 ? value.map((item, index) => (
              <li key={index} className="text-lg text-[#0B0B0B]">{item ? capitalize(item) : 'N/A'}</li>
            )) : <li className="text-lg text-[#0B0B0B] italic">N/A</li>}
          </ul>
        ) : (
          <p className="text-lg text-[#0B0B0B]">{value && typeof value === 'string' ? capitalize(value) : (value || <span className="italic">N/A</span>)}</p>
        )}
      </div>
    </div>
  );

  const EditableField = ({ label, name, value, onChange, type = "text", rows = 1 }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-[#6C757D] mb-1">{label}</label>
        {type === "textarea" ? (
            <textarea
                name={name}
                value={value || ''} // Ensure value is not null/undefined
                onChange={onChange}
                rows={rows}
                className="w-full px-3 py-2 border border-[#B0B0B0] rounded-lg focus:ring-2 focus:ring-[#05BFDB] focus:border-[#05BFDB] text-[#3E3E3E] bg-white placeholder-[#6C757D]"
            />
        ) : (
            <input
                type={type}
                name={name}
                value={value || ''} // Ensure value is not null/undefined
                onChange={onChange}
                className="w-full px-3 py-2 border border-[#B0B0B0] rounded-lg focus:ring-2 focus:ring-[#05BFDB] focus:border-[#05BFDB] text-[#3E3E3E] bg-white placeholder-[#6C757D]"
            />
        )}
    </div>
  );
  // --- End Child Components ---

  if (isLoading) return ( <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#F5F5F5]"><Loader2 className="h-16 w-16 animate-spin text-[#05BFDB]" /><p className="mt-4 text-xl text-[#6C757D]">Loading...</p></div> );
  
  if (error) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#F5F5F5]">
            <div className="text-center bg-[#FFFFFF] p-8 rounded-2xl shadow-lg border border-[#D1D1D1] max-w-md w-full">
                <AlertTriangle className="h-16 w-16 text-[#DC3545] mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-[#0B0B0B] mb-2">Oops! Failed to Load Details.</h3>
                <p className="text-[#3E3E3E] mb-6">{error}</p>
                <button onClick={() => navigate('/workouts')} className="px-6 py-2.5 bg-[#0A4D68] hover:bg-[#083D53] text-white font-semibold rounded-xl shadow hover:shadow-md transition-all inline-flex items-center mr-2"><ArrowLeft className="w-5 h-5 mr-2" /> Back</button>
                <button onClick={fetchExercise} className="px-6 py-2.5 bg-[#05BFDB] hover:bg-[#049DB4] text-[#0B0B0B] font-semibold rounded-xl shadow hover:shadow-md transition-all inline-flex items-center"><RefreshCw className="w-5 h-5 mr-2" /> Try Again</button>
            </div>
        </div>
    );
  }
  
  if (!exercise || !editableExercise) { 
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#F5F5F5]">
            <div className="text-center bg-[#FFFFFF] p-8 rounded-2xl shadow-lg border border-[#D1D1D1] max-w-md w-full">
                <Info className="h-16 w-16 text-[#6C757D] mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-[#0B0B0B] mb-2">Exercise Not Found</h3>
                <p className="text-[#3E3E3E] mb-6">The exercise you are looking for could not be found or is unavailable.</p>
                <button onClick={() => navigate('/workouts')} className="px-6 py-2.5 bg-[#0A4D68] hover:bg-[#083D53] text-white font-semibold rounded-xl shadow hover:shadow-md transition-all inline-flex items-center"><ArrowLeft className="w-5 h-5 mr-2" /> Back</button>
            </div>
        </div>
    );
  }

  const primaryBodyPart = (Array.isArray(exercise.bodyParts) && exercise.bodyParts.length > 0) ? exercise.bodyParts[0] : 'unknown';

  return (
    <div className="min-h-full bg-[#F5F5F5] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {saveMessage && (
            <div className={`mb-4 p-3 rounded-lg text-center fixed top-5 left-1/2 -translate-x-1/2 z-[100] shadow-lg text-sm
                            ${saveMessage.toLowerCase().includes('error') ? 'bg-red-100 border-red-400 text-red-700' : 
                             saveMessage.toLowerCase().includes('note') ? 'bg-yellow-100 border-yellow-400 text-yellow-700' :
                             'bg-green-100 border-green-400 text-green-700'}`}>
                {saveMessage}
            </div>
        )}
        <div className="mb-6 flex justify-between items-center">
         <button onClick={() => navigate('/workouts')} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-[#0A4D68] hover:bg-[#083D53] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0A4D68] transition-transform hover:scale-105"><ArrowLeft className="mr-2 h-5 w-5" />Back</button>
          {!isEditing && (<button onClick={() => setIsEditing(true)} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl shadow-sm text-[#0B0B0B] bg-[#05BFDB] hover:bg-[#049DB4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#05BFDB] transition-transform hover:scale-105"><Edit3 className="mr-2 h-5 w-5" />Edit</button>)}
        </div>
        <div className="bg-[#FFFFFF] shadow-xl rounded-2xl overflow-hidden border border-[#D1D1D1]">
          <header className="relative bg-[#0A4D68] p-6 md:p-8">
            {isEditing ? (
                <EditableField 
                    label="Exercise Name (Edit Mode)" // Clarify in edit mode
                    name="name"
                    value={editableExercise.name} 
                    onChange={(e) => handleEditInputChange('name', e.target.value)} 
                />
            ) : (
                <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">{exercise.name ? capitalize(exercise.name) : "Exercise Name Unavailable"}</h1>
            )}
          </header>
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
              <div className="w-full h-64 md:h-80 flex items-center justify-center bg-[#F5F5F5] rounded-xl shadow-inner border-2 border-[#E0E0E0] p-4">
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
                        <DetailItem icon={Target} label="Primary Target Muscle(s)" value={exercise.targetMuscles} isList={true} iconColor="text-[#05BFDB]" />
                        <DetailItem icon={Shield} label="Body Part(s)" value={exercise.bodyParts} isList={true} iconColor="text-[#17A2B8]" />
                        <DetailItem icon={Dumbbell} label="Equipment Needed" value={exercise.equipments} isList={true} iconColor="text-[#6C757D]" />
                        <DetailItem icon={Users} label="Secondary Muscles" value={exercise.secondaryMuscles} isList={true} iconColor="text-[#A1887F]" /> {/* Kept one of the original softer colors for variety if desired */}
                    </>
                )}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#D1D1D1]">
                <h2 className="text-2xl font-semibold text-[#0B0B0B] mb-4 flex items-center">
                    <ListChecks className="w-7 h-7 mr-2 text-[#05BFDB]" /> Instructions
                </h2>
                {isEditing ? (
                    <div className="space-y-3">
                        {(editableExercise.instructions || []).map((step, index) => (
                            <div key={index} className="flex items-start space-x-2">
                                <span className="mt-2 mr-1 bg-[#E0E0E0] text-[#3E3E3E] font-semibold rounded-full h-6 w-6 flex items-center justify-center text-xs flex-shrink-0">{index + 1}</span>
                                <textarea value={step} onChange={e => handleEditInputChange('instructions', e.target.value, index)} rows="2"
                                    className="flex-grow px-3 py-2 border border-[#B0B0B0] rounded-lg focus:ring-2 focus:ring-[#05BFDB] focus:border-[#05BFDB] text-[#3E3E3E] bg-white"/>
                                <button onClick={() => handleRemoveInstruction(index)} className="p-2 text-red-500 hover:text-red-700"><Trash2 size={18}/></button>
                            </div>
                        ))}
                        <button onClick={handleAddInstruction} className="mt-2 px-3 py-1.5 bg-[#05BFDB]/20 text-[#0A4D68] text-sm font-medium rounded-md hover:bg-[#05BFDB]/40">Add Instruction</button>
                    </div>
                ) : (
                    Array.isArray(exercise.instructions) && exercise.instructions.length > 0 ? (
                        <ol className="space-y-3 text-[#3E3E3E] leading-relaxed">
                        {exercise.instructions.map((step, index) => {
                            const instructionText = typeof step === 'string' && step.startsWith(`Step:${index + 1}`) ? step.substring(`Step:${index + 1} `.length) : step;
                            return (<li key={index} className="flex items-start"><span className="mr-3 bg-[#E0E0E0] text-[#0B0B0B] font-semibold rounded-full h-6 w-6 flex items-center justify-center text-xs flex-shrink-0">{index + 1}</span><span className="text-md flex-1">{typeof instructionText === 'string' ? capitalize(instructionText) : "Instruction step not available."}</span></li>);
                        })}
                        </ol>
                    ) : <p className="text-[#6C757D] italic">No instructions available.</p>
                )}
            </div>
            
            {isEditing ? (
                <div className="mt-10 flex justify-end space-x-3">
                    <button onClick={handleCancelEdit} disabled={isSaving} className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl shadow hover:shadow-md transition-all inline-flex items-center disabled:opacity-50"><XCircle className="w-5 h-5 mr-2" /> Cancel</button>
                    <button onClick={handleSaveEdit} disabled={isSaving} className="px-6 py-2.5 bg-[#0A4D68] hover:bg-[#083D53] text-white font-semibold rounded-xl shadow hover:shadow-md transition-all inline-flex items-center disabled:opacity-50">
                        {isSaving ? <Loader2 className="w-5 h-5 mr-2 animate-spin"/> : <Save className="w-5 h-5 mr-2" />} {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            ) : (
                <div className="mt-10 text-center"><button onClick={() => setShowLogModal(true)} className="px-8 py-3 bg-[#0A4D68] hover:bg-[#083D53] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center text-lg"><PlusSquare className="w-5 h-5 mr-2" />Log This Exercise</button></div>
            )}
          </div>
        </div>
      </div>
      
      {showLogModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md transform transition-all">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-[#0B0B0B]">Log: {exercise ? capitalize(exercise.name) : 'Exercise'}</h3>
                    <button onClick={() => setShowLogModal(false)} className="text-[#6C757D] hover:text-[#3E3E3E]"><XCircle size={24} /></button>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); handleSaveLog(); }}>
                    <div className="grid grid-cols-2 gap-4">
                        <EditableField label="Date" name="date" type="date" value={logData.date} onChange={(e) => handleLogInputChange(e)} />
                        <EditableField label="Time" name="time" type="time" value={logData.time} onChange={(e) => handleLogInputChange(e)} />
                    </div>
                    <EditableField label="Duration (e.g., 30 mins, 1 hour)" name="duration" value={logData.duration} onChange={(e) => handleLogInputChange(e)} />
                    <div className="grid grid-cols-2 gap-4">
                        <EditableField label="Sets" name="sets" type="number" value={logData.sets} onChange={(e) => handleLogInputChange(e)} />
                        <EditableField label="Reps (per set)" name="reps" type="number" value={logData.reps} onChange={(e) => handleLogInputChange(e)} />
                    </div>
                    <EditableField label="Weight (kg, optional)" name="weight" type="number" value={logData.weight} onChange={(e) => handleLogInputChange(e)} />
                    <EditableField label="Notes (optional)" name="notes" type="textarea" rows={3} value={logData.notes} onChange={(e) => handleLogInputChange(e)} />
                    <div className="mt-6 flex justify-end space-x-3">
                        <button type="button" onClick={() => setShowLogModal(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-[#0A4D68] text-white rounded-lg hover:bg-[#083D53]">Save Log</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutDetailPage;