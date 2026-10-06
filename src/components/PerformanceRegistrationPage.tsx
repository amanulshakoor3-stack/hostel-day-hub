import React, { useState, useEffect } from 'react';
import {
  Flame,
  Music,
  Users,
  Sparkles,
  Star,
  Crown,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Home,
  PartyPopper,
  ShieldCheck,
  User,
  GraduationCap,
  Building2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PerformanceType, Year } from '../types';
import { submitPerformanceRegistration } from '../lib/supabase';

const YEARS: Year[] = ['First Year', 'Second Year', 'Third Year', 'Fourth Year'];

interface ActivityCardConfig {
  type: PerformanceType;
  title: string;
  badge: string;
  description: string;
  icon: React.ReactNode;
  themeColor: {
    bg: string;
    border: string;
    badge: string;
    button: string;
    iconBg: string;
  };
}

const ACTIVITIES: ActivityCardConfig[] = [
  {
    type: 'Solo Dance',
    title: 'Solo Dance',
    badge: 'Individual Act',
    description: 'Own the dance floor with your moves, rhythm, and passion.',
    icon: <Flame className="w-6 h-6 text-rose-500" />,
    themeColor: {
      bg: 'bg-gradient-to-br from-rose-50/80 via-white to-rose-100/40',
      border: 'border-rose-200 hover:border-rose-300',
      badge: 'bg-rose-100 text-rose-700 border-rose-200',
      button: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20',
      iconBg: 'bg-rose-100',
    },
  },
  {
    type: 'Solo Song',
    title: 'Solo Song',
    badge: 'Individual Act',
    description: 'Enchant the crowd with your vocal melody and musical talent.',
    icon: <Music className="w-6 h-6 text-festival-blue-600" />,
    themeColor: {
      bg: 'bg-gradient-to-br from-festival-blue-50/80 via-white to-blue-100/40',
      border: 'border-festival-blue-200 hover:border-festival-blue-300',
      badge: 'bg-festival-blue-100 text-festival-blue-800 border-festival-blue-200',
      button: 'bg-festival-blue-600 hover:bg-festival-blue-700 text-white shadow-festival-blue-600/20',
      iconBg: 'bg-festival-blue-100',
    },
  },
  {
    type: 'Group Dance',
    title: 'Group Dance',
    badge: 'Team Act',
    description: 'Synchronize the steps with your crew and set the stage on fire.',
    icon: <Users className="w-6 h-6 text-pink-500" />,
    themeColor: {
      bg: 'bg-gradient-to-br from-pink-50/80 via-white to-pink-100/40',
      border: 'border-pink-200 hover:border-pink-300',
      badge: 'bg-pink-100 text-pink-700 border-pink-200',
      button: 'bg-pink-600 hover:bg-pink-700 text-white shadow-pink-600/20',
      iconBg: 'bg-pink-100',
    },
  },
  {
    type: 'Group Song',
    title: 'Group Song',
    badge: 'Team Act',
    description: 'Harmonize together as a choir or band for an unforgettable performance.',
    icon: <Sparkles className="w-6 h-6 text-festival-purple-600" />,
    themeColor: {
      bg: 'bg-gradient-to-br from-festival-purple-50/80 via-white to-purple-100/40',
      border: 'border-festival-purple-200 hover:border-festival-purple-300',
      badge: 'bg-festival-purple-100 text-festival-purple-800 border-festival-purple-200',
      button: 'bg-festival-purple-600 hover:bg-festival-purple-700 text-white shadow-festival-purple-600/20',
      iconBg: 'bg-festival-purple-100',
    },
  },
  {
    type: 'Rampwalk',
    title: 'Rampwalk',
    badge: 'Fashion Act',
    description: 'Walk the ramp with confidence, charisma, and festive hostel pride.',
    icon: <Crown className="w-6 h-6 text-amber-500" />,
    themeColor: {
      bg: 'bg-gradient-to-br from-amber-50/80 via-white to-amber-100/40',
      border: 'border-amber-200 hover:border-amber-300',
      badge: 'bg-amber-100 text-amber-800 border-amber-200',
      button: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20',
      iconBg: 'bg-amber-100',
    },
  },
  {
    type: 'Extra Performance',
    title: 'Extra Performance',
    badge: 'Special Act',
    description: 'Extra Performance: Enter the activity or performance you would like to perform.',
    icon: <Star className="w-6 h-6 text-festival-orange-500" />,
    themeColor: {
      bg: 'bg-gradient-to-br from-festival-orange-50/80 via-white to-orange-100/40',
      border: 'border-festival-orange-200 hover:border-festival-orange-300',
      badge: 'bg-festival-orange-100 text-festival-orange-800 border-festival-orange-200',
      button: 'bg-festival-orange-600 hover:bg-festival-orange-700 text-white shadow-festival-orange-600/20',
      iconBg: 'bg-festival-orange-100',
    },
  },
];

interface PerformanceRegistrationPageProps {
  onBackToHome: () => void;
  initialActivity?: PerformanceType | null;
}

export const PerformanceRegistrationPage: React.FC<PerformanceRegistrationPageProps> = ({
  onBackToHome,
  initialActivity = null,
}) => {
  const [selectedActivity, setSelectedActivity] = useState<PerformanceType | null>(initialActivity);

  // Form Fields State
  const [name, setName] = useState('');
  const [groupName, setGroupName] = useState('');
  const [leaderName, setLeaderName] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState<Year | ''>('');
  const [groupMembers, setGroupMembers] = useState('');
  const [performanceName, setPerformanceName] = useState('');
  const [shortDescription, setShortDescription] = useState('');

  // UI status state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedActivityName, setSubmittedActivityName] = useState<string>('');

  // Scroll to top when changing views
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setErrorMessage('');
    setSuccessMessage('');
  }, [selectedActivity]);

  const handleSelectActivity = (type: PerformanceType) => {
    setSelectedActivity(type);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleBackToList = () => {
    setSelectedActivity(null);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const resetFormFields = () => {
    setName('');
    setGroupName('');
    setLeaderName('');
    setDepartment('');
    setYear('');
    setGroupMembers('');
    setPerformanceName('');
    setShortDescription('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!selectedActivity) return;

    // Validate based on activity type
    if (selectedActivity === 'Group Dance' || selectedActivity === 'Group Song') {
      const trimmedGroupName = groupName.trim();
      const trimmedLeaderName = leaderName.trim();
      const trimmedDept = department.trim();
      const trimmedMembers = groupMembers.trim();

      if (!trimmedGroupName) {
        setErrorMessage('Please enter the Group Name.');
        return;
      }
      if (trimmedGroupName.length > 100) {
        setErrorMessage('Group Name cannot exceed 100 characters.');
        return;
      }

      if (!trimmedLeaderName) {
        setErrorMessage('Please enter the Main Participant / Group Leader Name.');
        return;
      }
      if (trimmedLeaderName.length > 100) {
        setErrorMessage('Leader Name cannot exceed 100 characters.');
        return;
      }

      if (!trimmedDept) {
        setErrorMessage('Please select your department.');
        return;
      }

      if (!year) {
        setErrorMessage('Please select your year.');
        return;
      }

      if (!trimmedMembers) {
        setErrorMessage('Please enter the names of all group members, one per line.');
        return;
      }
      if (trimmedMembers.length > 2000) {
        setErrorMessage('Group member list is too long (maximum 2000 characters).');
        return;
      }

      setIsSubmitting(true);
      try {
        const result = await submitPerformanceRegistration({
          performance_type: selectedActivity,
          participant_name: trimmedLeaderName,
          group_name: trimmedGroupName,
          department: trimmedDept,
          year: year,
          group_members: trimmedMembers,
        });

        if (result.success) {
          try {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
            });
          } catch {}

          setSubmittedActivityName(selectedActivity);
          setSuccessMessage(
            `Your performance registration has been submitted successfully. Your ${selectedActivity} registration has been submitted successfully.`
          );
          resetFormFields();
        } else {
          setErrorMessage(result.message || 'Registration failed. Please check your details and try again.');
        }
      } catch (err: any) {
        setErrorMessage(err?.message || 'An unexpected error occurred during submission.');
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (selectedActivity === 'Extra Performance') {
      const trimmedPerfName = performanceName.trim();
      const trimmedName = name.trim();
      const trimmedDept = department.trim();
      const trimmedDesc = shortDescription.trim();

      if (!trimmedPerfName) {
        setErrorMessage('Please enter your Performance / Activity Name.');
        return;
      }
      if (trimmedPerfName.length > 120) {
        setErrorMessage('Performance / Activity Name cannot exceed 120 characters.');
        return;
      }

      if (!trimmedName) {
        setErrorMessage('Please enter your name.');
        return;
      }
      if (trimmedName.length > 100) {
        setErrorMessage('Name cannot exceed 100 characters.');
        return;
      }

      if (!trimmedDept) {
        setErrorMessage('Please select your department.');
        return;
      }

      if (!year) {
        setErrorMessage('Please select your year.');
        return;
      }

      if (trimmedDesc.length > 1000) {
        setErrorMessage('Short description cannot exceed 1000 characters.');
        return;
      }

      setIsSubmitting(true);
      try {
        const result = await submitPerformanceRegistration({
          performance_type: selectedActivity,
          performance_name: trimmedPerfName,
          participant_name: trimmedName,
          department: trimmedDept,
          year: year,
          description: trimmedDesc || null,
        });

        if (result.success) {
          try {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
            });
          } catch {}

          setSubmittedActivityName(selectedActivity);
          setSuccessMessage(
            `Your performance registration has been submitted successfully. Your ${selectedActivity} registration has been submitted successfully.`
          );
          resetFormFields();
        } else {
          setErrorMessage(result.message || 'Registration failed. Please check your details and try again.');
        }
      } catch (err: any) {
        setErrorMessage(err?.message || 'An unexpected error occurred during submission.');
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // Solo Dance, Solo Song, Rampwalk
    const trimmedName = name.trim();
    const trimmedDept = department.trim();

    if (!trimmedName) {
      setErrorMessage('Please enter your name.');
      return;
    }
    if (trimmedName.length > 100) {
      setErrorMessage('Name cannot exceed 100 characters.');
      return;
    }

    if (!trimmedDept) {
      setErrorMessage('Please select your department.');
      return;
    }

    if (!year) {
      setErrorMessage('Please select your year.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitPerformanceRegistration({
        performance_type: selectedActivity,
        participant_name: trimmedName,
        department: trimmedDept,
        year: year,
      });

      if (result.success) {
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {}

        setSubmittedActivityName(selectedActivity);
        setSuccessMessage(
          `Your performance registration has been submitted successfully. Your ${selectedActivity} registration has been submitted successfully.`
        );
        resetFormFields();
      } else {
        setErrorMessage(result.message || 'Registration failed. Please check your details and try again.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'An unexpected error occurred during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSubmitButtonTitle = () => {
    switch (selectedActivity) {
      case 'Solo Dance':
        return 'Submit Solo Dance Registration';
      case 'Solo Song':
        return 'Submit Solo Song Registration';
      case 'Group Dance':
        return 'Submit Group Dance Registration';
      case 'Group Song':
        return 'Submit Group Song Registration';
      case 'Rampwalk':
        return 'Submit Rampwalk Registration';
      case 'Extra Performance':
        return 'Submit Extra Performance Registration';
      default:
        return 'Submit Registration';
    }
  };

  return (
    <div className="min-h-screen bg-festival-cream-50 pt-28 pb-20 relative">
      {/* Decorative background glows matching Hostel Day Hub theme */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-festival-purple-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-96 right-10 w-96 h-96 bg-festival-orange-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Navigation Bar at Top */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <button
            onClick={onBackToHome}
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 hover:bg-white text-slate-700 hover:text-slate-900 text-sm font-bold border border-slate-200 shadow-sm transition-all hover:shadow"
          >
            <Home className="w-4 h-4 text-festival-purple-600" />
            Back to Home
          </button>

          {selectedActivity && (
            <button
              onClick={handleBackToList}
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-festival-purple-50 hover:bg-festival-purple-100 text-festival-purple-900 text-sm font-bold border border-festival-purple-200 shadow-sm transition-all hover:shadow"
            >
              <ArrowLeft className="w-4 h-4 text-festival-purple-700" />
              Back to Performance List
            </button>
          )}
        </div>

        {/* View 1: Performance Activities Selection Cards */}
        {!selectedActivity && (
          <div>
            {/* Header Section */}
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-festival-purple-100 text-festival-purple-800 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 border border-festival-purple-200">
                <PartyPopper className="w-4 h-4 text-festival-purple-700" />
                Stage Registration
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-festival-purple-950 font-display tracking-tight">
                Register for Performance
              </h1>
              <p className="mt-3 text-base sm:text-lg text-slate-600 font-medium">
                Show your talent and be part of the Hostel Day celebration.
              </p>
            </div>

            {/* Activities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ACTIVITIES.map((activity) => (
                <div
                  key={activity.type}
                  className={`relative rounded-3xl p-6 sm:p-7 border bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between ${activity.themeColor.border}`}
                >
                  <div>
                    {/* Top row: Icon and Badge */}
                    <div className="flex items-center justify-between mb-5">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${activity.themeColor.iconBg} shadow-sm`}>
                        {activity.icon}
                      </div>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full border ${activity.themeColor.badge}`}>
                        {activity.badge}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-extrabold text-slate-900 font-display mb-2.5">
                      {activity.title}
                    </h2>

                    {/* Description */}
                    <p className="text-sm text-slate-600 font-medium leading-relaxed mb-6">
                      {activity.description}
                    </p>
                  </div>

                  {/* Register Button */}
                  <button
                    type="button"
                    onClick={() => handleSelectActivity(activity.type)}
                    className={`w-full py-3.5 px-5 rounded-2xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] active:scale-[0.98] ${activity.themeColor.button}`}
                  >
                    <span>Register</span>
                    <Sparkles className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Privacy notice banner at bottom */}
            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-festival-cream-100 border border-festival-cream-300 text-xs font-semibold text-slate-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>No login required. We only ask for your name, department, and study year.</span>
              </div>
            </div>
          </div>
        )}

        {/* View 2: Form for Selected Activity */}
        {selectedActivity && (
          <div className="max-w-2xl mx-auto animate-fadeIn">
            
            {/* Form Card Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-festival-orange-100 text-festival-orange-800 text-xs sm:text-sm font-bold uppercase tracking-wider mb-3 border border-festival-orange-200">
                <Sparkles className="w-4 h-4 text-festival-orange-600" />
                Celebration Stage Form
              </div>

              {/* Exact Selected Activity Heading */}
              <h1 className="text-2xl sm:text-4xl font-extrabold text-festival-purple-950 font-display tracking-tight">
                Register for {selectedActivity}
              </h1>

              {/* Special instruction text if Extra Performance */}
              {selectedActivity === 'Extra Performance' && (
                <p className="mt-3 text-sm sm:text-base text-slate-600 font-medium">
                  Extra Performance: Enter the activity or performance you would like to perform.
                </p>
              )}
            </div>

            {/* Success Message Banner */}
            {successMessage && (
              <div className="mb-6 p-6 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-950 shadow-sm animate-fadeIn">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-emerald-900 mb-1">
                      Registration Successful!
                    </h3>
                    <p className="text-sm text-emerald-800 font-medium leading-relaxed">
                      Your performance registration has been submitted successfully.
                    </p>
                    <p className="text-sm font-bold text-emerald-900 mt-1">
                      Your {submittedActivityName || selectedActivity} registration has been submitted successfully.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2.5">
                      <button
                        type="button"
                        onClick={handleBackToList}
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                      >
                        Register for Another Activity
                      </button>
                      <button
                        type="button"
                        onClick={onBackToHome}
                        className="px-4 py-2 bg-white hover:bg-emerald-100 text-emerald-900 text-xs font-bold rounded-xl transition-all border border-emerald-300 shadow-sm"
                      >
                        Back to Home
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message Banner */}
            {errorMessage && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 animate-fadeIn">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <p className="text-sm font-semibold">{errorMessage}</p>
              </div>
            )}

            {/* Registration Form Box */}
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-festival-purple-100 shadow-xl">
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Extra Performance Specific Field: Performance / Activity Name */}
                {selectedActivity === 'Extra Performance' && (
                  <div>
                    <label
                      htmlFor="performance-name"
                      className="block text-sm font-bold text-slate-800 mb-1.5"
                    >
                      Performance / Activity Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="performance-name"
                      type="text"
                      value={performanceName}
                      onChange={(e) => setPerformanceName(e.target.value)}
                      placeholder="Example: Mime, Skit, Stand-up Comedy, Instrumental Performance, Magic Show, or Other Talent"
                      required
                      maxLength={120}
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm focus:ring-2 focus:ring-festival-purple-500 focus:border-festival-purple-500 shadow-sm placeholder:text-slate-400 transition-all"
                    />
                  </div>
                )}

                {/* Group Specific Fields */}
                {(selectedActivity === 'Group Dance' || selectedActivity === 'Group Song') && (
                  <>
                    {/* Group Name */}
                    <div>
                      <label
                        htmlFor="group-name"
                        className="block text-sm font-bold text-slate-800 mb-1.5"
                      >
                        Group Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="group-name"
                        type="text"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        placeholder="Enter your group name"
                        required
                        maxLength={100}
                        className="w-full px-4 py-3.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm focus:ring-2 focus:ring-festival-purple-500 focus:border-festival-purple-500 shadow-sm placeholder:text-slate-400 transition-all"
                      />
                    </div>

                    {/* Main Participant / Group Leader Name */}
                    <div>
                      <label
                        htmlFor="leader-name"
                        className="block text-sm font-bold text-slate-800 mb-1.5"
                      >
                        Main Participant / Group Leader Name <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <User className="w-5 h-5" />
                        </div>
                        <input
                          id="leader-name"
                          type="text"
                          value={leaderName}
                          onChange={(e) => setLeaderName(e.target.value)}
                          placeholder="Enter group leader's name"
                          required
                          maxLength={100}
                          className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm focus:ring-2 focus:ring-festival-purple-500 focus:border-festival-purple-500 shadow-sm placeholder:text-slate-400 transition-all"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Solo acts, Rampwalk, and Extra Performance Name Field */}
                {(selectedActivity === 'Solo Dance' ||
                  selectedActivity === 'Solo Song' ||
                  selectedActivity === 'Rampwalk' ||
                  selectedActivity === 'Extra Performance') && (
                  <div>
                    <label
                      htmlFor="participant-name"
                      className="block text-sm font-bold text-slate-800 mb-1.5"
                    >
                      Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <User className="w-5 h-5" />
                      </div>
                      <input
                        id="participant-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        required
                        maxLength={100}
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm focus:ring-2 focus:ring-festival-purple-500 focus:border-festival-purple-500 shadow-sm placeholder:text-slate-400 transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* Department & Year Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Department Dropdown */}
                  <div>
                    <label
                      htmlFor="department"
                      className="block text-sm font-bold text-slate-800 mb-1.5"
                    >
                      Department <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <select
                        id="department"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        required
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm focus:ring-2 focus:ring-festival-purple-500 focus:border-festival-purple-500 shadow-sm transition-all appearance-none cursor-pointer"
                      >
                        <option value="" disabled>
                          Select your department
                        </option>
                        {/* Existing website departments */}
                        <optgroup label="College Departments">
                          <option value="CSE">CSE (Computer Science and Engineering)</option>
                          <option value="IT">IT (Information Technology)</option>
                          <option value="ECE">ECE (Electronics and Communication Engineering)</option>
                          <option value="AIML">AIML (Artificial Intelligence & Machine Learning)</option>
                          <option value="AIDS">AIDS (Artificial Intelligence and Data Science)</option>
                          <option value="Cyber">Cyber (Cyber Security)</option>
                          <option value="BME">BME (Biomedical Engineering)</option>
                          <option value="R&A">R&A (Robotics & Automation)</option>
                          <option value="FT">FT (Food Technology)</option>
                        </optgroup>
                        {/* Standard department names */}
                        <optgroup label="Engineering Departments">
                          <option value="Computer Science and Engineering">Computer Science and Engineering</option>
                          <option value="Information Technology">Information Technology</option>
                          <option value="Electronics and Communication Engineering">Electronics and Communication Engineering</option>
                          <option value="Electrical and Electronics Engineering">Electrical and Electronics Engineering</option>
                          <option value="Mechanical Engineering">Mechanical Engineering</option>
                          <option value="Civil Engineering">Civil Engineering</option>
                          <option value="Artificial Intelligence and Data Science">Artificial Intelligence and Data Science</option>
                          <option value="Other">Other</option>
                        </optgroup>
                      </select>
                    </div>
                  </div>

                  {/* Year Dropdown */}
                  <div>
                    <label
                      htmlFor="year"
                      className="block text-sm font-bold text-slate-800 mb-1.5"
                    >
                      Year <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <select
                        id="year"
                        value={year}
                        onChange={(e) => setYear(e.target.value as Year)}
                        required
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm focus:ring-2 focus:ring-festival-purple-500 focus:border-festival-purple-500 shadow-sm transition-all appearance-none cursor-pointer"
                      >
                        <option value="" disabled>
                          Select your year
                        </option>
                        {YEARS.map((yr) => (
                          <option key={yr} value={yr}>
                            {yr}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Group Member Names (Textarea) for Group acts */}
                {(selectedActivity === 'Group Dance' || selectedActivity === 'Group Song') && (
                  <div>
                    <label
                      htmlFor="group-members"
                      className="block text-sm font-bold text-slate-800 mb-1.5"
                    >
                      Group Member Names <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      id="group-members"
                      rows={4}
                      value={groupMembers}
                      onChange={(e) => setGroupMembers(e.target.value)}
                      placeholder="Enter the names of all group members, one per line"
                      required
                      maxLength={2000}
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm focus:ring-2 focus:ring-festival-purple-500 focus:border-festival-purple-500 shadow-sm placeholder:text-slate-400 transition-all resize-y"
                    />
                    <p className="mt-1.5 text-xs text-slate-500">
                      Include all performing students. No separate registration is needed for each member.
                    </p>
                  </div>
                )}

                {/* Short Description (Optional) for Extra Performance */}
                {selectedActivity === 'Extra Performance' && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor="short-description"
                        className="block text-sm font-bold text-slate-800"
                      >
                        Short Description
                      </label>
                      <span className="text-xs text-slate-400 font-medium">Optional</span>
                    </div>
                    <textarea
                      id="short-description"
                      rows={3}
                      value={shortDescription}
                      onChange={(e) => setShortDescription(e.target.value)}
                      placeholder="Briefly describe your performance"
                      maxLength={1000}
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm focus:ring-2 focus:ring-festival-purple-500 focus:border-festival-purple-500 shadow-sm placeholder:text-slate-400 transition-all resize-y"
                    />
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-festival-purple-700 via-festival-purple-800 to-festival-purple-900 hover:from-festival-purple-800 hover:to-festival-purple-950 text-white font-bold text-base shadow-lg shadow-festival-purple-900/25 hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed group active:scale-[0.99]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Submitting Registration...</span>
                      </>
                    ) : (
                      <>
                        <span>{getSubmitButtonTitle()}</span>
                        <Sparkles className="w-5 h-5 text-festival-orange-400 group-hover:scale-110 transition-transform" />
                      </>
                    )}
                  </button>
                </div>

                {/* Back Link below form */}
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={handleBackToList}
                    className="text-xs sm:text-sm font-bold text-festival-purple-700 hover:text-festival-purple-900 hover:underline inline-flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back to Performance List
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
