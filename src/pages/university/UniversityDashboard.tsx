'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BiBookOpen,
  BiTrophy,
  BiCheckCircle,
  // BiUser,
  BiLock,
  // BiAward,
  BiTrendingUp,
  // BiTime,
  // BiStar,
  BiTargetLock,
  // BiBrain,
  // BiBarChartAlt2,
  // BiCalendar,
  BiMedal,
  BiRocket,
  BiUserCheck,
} from 'react-icons/bi';
import { useMTAccounts } from '../../context/accounts/MTAccountsContext';
// import { http } from '../../utils/http_request';
import getUser from '../../utils/getUser';
import { getUserResume, UNIVERSITY_URL } from '../../utils/universityAuth';
import { http } from '@/utils/http_request';

// Only follow session links that point at the configured university origin.
const isTrustedUniversityLink = (link: string): boolean => {
  try {
    return new URL(link).origin === new URL(UNIVERSITY_URL).origin;
  } catch {
    return false;
  }
};

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  obtained: boolean;
  obtainedDate?: string;
}

interface Course {
  id: string;
  name: string;
  category: string;
  progress: number;
  xp: number;
  completed: boolean;
  completedDate?: string;
}

interface Skill {
  name: string;
  level: number;
  category: string;
}

interface UserResumeData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  level: number;
  xp: number;
  completedCourses: number;
  activeCourses: number;
  overallAverage: number;
  achievements: Achievement[];
  recentCourses: Course[];
  skills: Skill[];
  joinDate: string;
}

interface UserResume {
  success: boolean;
  data: UserResumeData;
}

export default function UniversityDashboard() {
  const [userResume, setUserResume] = useState<UserResume | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingToken, setIsGeneratingToken] = useState(false);
  const { currentAccount } = useMTAccounts();

  // NOTE: If getUser is a function, call it. If it's already an object, this still works.
  const user: any = typeof getUser === 'function' ? getUser() : getUser;

  // Fetch user resume data
  useEffect(() => {
    const fetchUserResume = async () => {
      try {
        setIsLoading(true);

        const acctId = (currentAccount as any)?._id;
        const userId = user?._id || user?.id;

        const resumeData: any = await getUserResume(acctId, userId);

        // Defensive sanitization so .map never runs on non-arrays
        const sanitized: UserResume = {
          ...resumeData,
          skills: Array.isArray(resumeData?.skills) ? resumeData.skills : [],
          recentCourses: Array.isArray(resumeData?.recentCourses) ? resumeData.recentCourses : [],
          achievements: Array.isArray(resumeData?.achievements) ? resumeData.achievements : [],
        };

        setUserResume(sanitized);

      } catch (error) {
        console.error('Error fetching user resume:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Run when account id changes (user object is assumed stable during session)
    if ((currentAccount as any)?._id || user?.id || user?._id) {
      fetchUserResume();
    }
  }, [(currentAccount as any)?._id]); // intentionally *not* depending on `user`

  // Function to generate the token and open the URL in a new tab (compatible with Safari iPhone)
  const handleGenerateAndRedirect = async () => {
    if (!userResume) return;

    setIsGeneratingToken(true);

    // 🟢 1. Abrir la nueva pestaña inmediatamente (durante la acción del usuario)
    const newTab = window.open('', '_blank');

    // Si el navegador bloquea el popup, window.open() devolverá null
    if (!newTab) {
      alert('Please allow pop-ups to continue to the university platform.');
      setIsGeneratingToken(false);
      return;
    }

    // 🟣 2. Mostrar mensaje temporal de carga en la pestaña
    newTab.document.write(`
    <html>
      <head>
        <title>Loading session...</title>
        <style>
          body {
            font-family: system-ui, sans-serif;
            background: linear-gradient(135deg, #00111f, #002b38);
            color: white;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            text-align: center;
          }
          .spinner {
            width: 48px;
            height: 48px;
            border: 4px solid rgba(255,255,255,0.3);
            border-top-color: #00d0ff;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        </style>
      </head>
      <body>
        <div class="spinner"></div>
        <h2>Preparing your university session...</h2>
        <p>This may take a few seconds</p>
      </body>
    </html>
  `);

    try {
      // 🟠 3. Llamar a la API para generar el enlace
      const response = await http.post('/auth/generate-session-link', {
        userId: userResume.data.id,
      });

      const link: string | undefined = response?.data?.link;
      if (link && isTrustedUniversityLink(link)) {
        // 🟢 4. Redirigir la pestaña abierta (esto sí funciona en Safari iPhone)
        newTab.location.href = link;
      } else if (link) {
        console.error('Refusing to redirect to untrusted university link');
        newTab.close();
        alert('Could not open the university platform. Please try again later.');
      } else {
        console.error('No token/link received');
        newTab.document.body.innerHTML = `
        <h2 style="color: #ff6666;">Error</h2>
        <p>Could not generate session link. Please try again later.</p>
      `;
      }
    } catch (error) {
      console.error('Error generating session link:', error);
      newTab.document.body.innerHTML = `
      <h2 style="color: #ff6666;">Connection Error</h2>
      <p>Something went wrong while generating your session.</p>
    `;
    } finally {
      setIsGeneratingToken(false);
    }
  };


  // const handleGenerateAndRedirect2 = async () => {
  //   if (!userResume) return;
  //   setIsGeneratingToken(true);
  
  //   // 🟢 1. Open the tab immediately (inside the user's click)
  //   const newTab = window.open('', '_blank');
  
  //   try {
  //     // 🟠 2. Make the async request
  //     const response = await http.post('/auth/generate-session-link', { userId: userResume.data.id });
  
  //     if (response?.data?.link) {
  //       // 🟢 3. Redirect the already-opened tab
  //       newTab.location.href = response.data.link;
  //     } else {
  //       console.error('No token/link received');
  //       newTab.close(); // optional: close if no valid link
  //     }
  //   } catch (error) {
  //     console.error('Error generating session link:', error);
  //     if (newTab) newTab.close();
  //   } finally {
  //     setIsGeneratingToken(false);
  //   }
  // };

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-900 via-[#040e18] to-slate-900 flex items-center justify-center'>
        <div className='text-center'>
          <div className='relative'>
            <div className='w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-6'></div>
            <div
              className='absolute inset-0 w-16 h-16 border-4 border-transparent border-t-teal-500 rounded-full animate-spin mx-auto'
              style={{ animationDelay: '0.5s' }}
            ></div>
          </div>
          <p className='text-cyan-300 font-medium'>Loading your academic journey...</p>
          <p className='text-gray-400 text-sm mt-2'>Preparing your personalized dashboard</p>
        </div>
      </div>
    );
  }

  if (!userResume) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-900 via-[#040e18] to-slate-900 flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-20 h-20 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-full flex items-center justify-center mx-auto mb-6'>
            <BiLock className='h-10 w-10 text-red-400' />
          </div>
          <p className='text-gray-300 font-medium mb-2'>Unable to load your resume</p>
          <p className='text-gray-500 text-sm'>Please try again or contact support</p>
        </div>
      </div>
    );
  }

  const getLevelColor = (level: number) => {
    if (level >= 10) return 'from-purple-500 to-pink-500';
    if (level >= 7) return 'from-cyan-500 to-teal-500';
    if (level >= 4) return 'from-green-500 to-emerald-500';
    return 'from-yellow-500 to-orange-500';
  };

  // const getSkillColor = (level: number) => {
  //   if (level >= 80) return 'from-emerald-500 to-green-500';
  //   if (level >= 60) return 'from-cyan-500 to-teal-500';
  //   if (level >= 40) return 'from-yellow-500 to-orange-500';
  //   return 'from-red-500 to-pink-500';
  // };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-[#040e18] to-slate-900 relative overflow-hidden'>
      {/* Background decorations */}
      <div className='absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-teal-500/5'></div>
      <div className='absolute top-20 left-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl animate-pulse'></div>
      <div className='absolute bottom-20 right-10 w-40 h-40 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000'></div>
      <div className='absolute top-1/2 left-1/4 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl animate-pulse delay-500'></div>

      <div className='relative z-10 max-w-7xl mx-auto p-4'>
        {/* Hero Header */}
        <motion.header
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className='relative mb-8 p-8 rounded-3xl bg-gradient-to-br from-slate-900/80 via-cyan-900/20 to-transparent border border-cyan-500/20 overflow-hidden'
        >
          <div className='absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-400/5 to-teal-500/0 opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-3xl'></div>

          <div className='relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6'>
            <div className='flex items-center gap-6'>
              <div className='relative'>
                <div className='w-20 h-20 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/25'>
                  <BiUserCheck className='h-10 w-10 text-white' />
                </div>
                <div className='absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center'>
                  <span className='text-xs font-bold text-white'>{userResume.data.level}</span>
                </div>
              </div>

              <div>
                <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-900/50 to-teal-900/50 border border-cyan-500/30 backdrop-blur-sm mb-3'>
                  <div className='w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-teal-400 animate-pulse'></div>
                  <span className='text-sm font-medium text-cyan-100'>Trading Scholar</span>
                </div>

                <h1 className='text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-100 via-white to-teal-100 mb-2'>
                  Welcome back, {userResume.data.firstName}!
                </h1>

                <div className='flex items-center gap-4'>
                  <span
                    className={`px-4 py-2 bg-gradient-to-r ${getLevelColor(userResume.data.level)} text-white font-bold rounded-full text-sm shadow-lg`}
                  >
                    Level {userResume.data.level}
                  </span>
                  <div className='flex items-center gap-3'>
                    <div className='bg-slate-800/50 w-32 h-3 rounded-full overflow-hidden border border-slate-700'>
                      <motion.div
                        initial={{ width: 0 }}
                        // animate={{ width: `${(userResume.data.xp % 1000) / 10}%` }}
                        animate={{
                          width: `${((userResume.data.completedCourses * 80) % 1000) / 10}%`,
                        }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className='bg-gradient-to-r from-cyan-500 to-teal-500 h-full rounded-full'
                      />
                    </div>
                    <span className='text-sm text-gray-300 font-medium'>
                      {userResume.data.xp} XP
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGenerateAndRedirect}
              disabled={isGeneratingToken}
              className='px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white font-semibold rounded-2xl shadow-2xl shadow-cyan-500/25 hover:shadow-cyan-400/40 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3'
            >
              {isGeneratingToken ? (
                <>
                  <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <BiRocket className='h-5 w-5' />
                  <span>Continue Learning</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.header>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'
        >
          {[
            {
              title: 'Courses Completed',
              value: userResume.data.completedCourses,
              icon: BiCheckCircle,
              color: 'from-emerald-500 to-green-500',
              description: 'Successfully finished',
              bg: 'from-emerald-500/10 to-green-500/10',
              border: 'border-emerald-500/30',
            },
            {
              title: 'Active Courses',
              // value: userResume.data.activeCourses,
              value: 12,
              icon: BiBookOpen,
              color: 'from-cyan-500 to-teal-500',
              description: 'Currently enrolled',
              bg: 'from-cyan-500/10 to-teal-500/10',
              border: 'border-cyan-500/30',
            },
            {
              title: 'Academic Average',
              value: `${(userResume.data.completedCourses * 100) / 12}%`,
              icon: BiTrophy,
              color: 'from-yellow-500 to-orange-500',
              description: 'Performance score',
              bg: 'from-yellow-500/10 to-orange-500/10',
              border: 'border-yellow-500/30',
            },
            // {
            //   title: 'Days Active',
            //   value: Math.floor((new Date().getTime() - new Date(userResume.data.joinDate).getTime()) / (1000 * 60 * 60 * 24)),
            //   icon: BiCalendar,
            //   color: 'from-purple-500 to-pink-500',
            //   description: 'Learning journey',
            //   bg: 'from-purple-500/10 to-pink-500/10',
            //   border: 'border-purple-500/30'
            // },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className={`group relative p-6 rounded-2xl bg-gradient-to-br ${stat.bg} border ${stat.border} hover:scale-105 transition-all duration-300 transform hover:shadow-2xl hover:shadow-cyan-500/10`}
            >
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-lg font-semibold text-white'>{stat.title}</h3>
                <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-xl shadow-lg`}>
                  <stat.icon className='h-6 w-6 text-white' />
                </div>
              </div>
              <div className='text-3xl font-bold text-white mb-2'>{stat.value}</div>
              <p className='text-sm text-gray-300'>{stat.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Skills Section */}
          {/* <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 bg-gradient-to-br from-slate-900/80 via-cyan-900/20 to-transparent rounded-2xl border border-cyan-500/20 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-xl shadow-lg">
                <BiBrain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Skill Mastery</h2>
                <p className="text-gray-400 text-sm">Your expertise across trading domains</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.isArray(userResume.data.skills) && userResume.data.skills.map((skill, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 hover:border-cyan-500/30 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="font-semibold text-white">{skill.name}</span>
                      <p className="text-xs text-gray-400">{skill.category}</p>
                    </div>
                    <span className="text-lg font-bold text-white">{skill.level}%</span>
                  </div>
                  <div className="bg-slate-700 w-full h-3 rounded-full overflow-hidden mb-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
                      className={`bg-gradient-to-r ${getSkillColor(skill.level)} h-full rounded-full shadow-lg`}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Beginner</span>
                    <span className="text-gray-400">Expert</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div> */}

          {/* Recent Courses */}
          {/* <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-slate-900/80 via-cyan-900/20 to-transparent rounded-2xl border border-cyan-500/20 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-lg">
                <BiBookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Recent Courses</h2>
                <p className="text-gray-400 text-sm">Your learning progress</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {Array.isArray(userResume.data.recentCourses) && userResume.data.recentCourses.map((course, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 hover:border-cyan-500/30 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white text-sm mb-1">{course.name}</h3>
                      <p className="text-xs text-gray-400 mb-2">{course.category}</p>
                      <div className="flex items-center gap-2 text-xs">
                        <BiTargetLock className="h-3 w-3 text-cyan-400" />
                        <span className="text-gray-300">{course.xp} XP</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        course.completed 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      }`}>
                        {course.completed ? 'Completed' : `${course.progress}%`}
                      </span>
                    </div>
                  </div>
                  <div className="bg-slate-700 w-full h-2 rounded-full overflow-hidden mb-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${course.progress}%` }}
                      transition={{ delay: 0.6 + index * 0.1, duration: 1 }}
                      className={`h-full rounded-full ${
                        course.completed 
                          ? 'bg-gradient-to-r from-emerald-500 to-green-500' 
                          : 'bg-gradient-to-r from-cyan-500 to-teal-500'
                      } shadow-lg`}
                    />
                  </div>
                  {course.completed && (
                    <div className="flex items-center gap-1 text-xs text-emerald-400">
                      <BiCheckCircle className="h-3 w-3" />
                      <span>Completed {course.completedDate && new Date(course.completedDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div> */}
        </div>

        {/* Achievements Section */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-gradient-to-br from-slate-900/80 via-cyan-900/20 to-transparent rounded-2xl border border-cyan-500/20 p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl shadow-lg">
              <BiAward className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Achievements</h2>
              <p className="text-gray-400 text-sm">Your milestones and accomplishments</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.isArray(userResume.data.achievements) && userResume.data.achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className={`group relative p-4 rounded-xl border transition-all duration-300 hover:scale-105 ${
                  achievement.obtained
                    ? 'bg-gradient-to-r from-emerald-500/10 to-green-500/10 border-emerald-500/30 hover:border-emerald-400/50'
                    : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg shadow-lg ${
                    achievement.obtained
                      ? 'bg-gradient-to-r from-emerald-500 to-green-500'
                      : 'bg-slate-700'
                  }`}>
                    {achievement.obtained ? (
                      <BiStar className="h-5 w-5 text-white" />
                    ) : (
                      <BiLock className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white text-sm mb-1">{achievement.name}</h3>
                    <p className="text-xs text-gray-400 mb-2">{achievement.description}</p>
                    {achievement.obtained && achievement.obtainedDate && (
                      <div className="flex items-center gap-1 text-xs text-emerald-400">
                        <BiTime className="h-3 w-3" />
                        <span>Unlocked {new Date(achievement.obtainedDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {achievement.obtained && (
                  <div className="absolute top-2 right-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div> */}

        {/* Learning Path Suggestion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className='mt-8 bg-gradient-to-br from-slate-900/80 via-purple-900/20 to-transparent rounded-2xl border border-purple-500/20 p-6'
        >
          <div className='flex items-center gap-3 mb-6'>
            <div className='p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg'>
              <BiTrendingUp className='h-6 w-6 text-white' />
            </div>
            <div>
              <h2 className='text-xl font-bold text-white'>Recommended Next Steps</h2>
              <p className='text-gray-400 text-sm'>Optimize your learning journey</p>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='bg-slate-800/50 rounded-xl p-4 border border-slate-700/50'>
              <div className='flex items-center gap-3 mb-3'>
                <div className='p-2 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg'>
                  <BiTargetLock className='h-4 w-4 text-white' />
                </div>
                <h3 className='font-semibold text-white text-sm'>Focus on Weak Areas</h3>
              </div>
              <p className='text-xs text-gray-400 mb-3'>
                Improve your lowest skill levels to become a well-rounded trader
              </p>
              <div className='text-xs text-cyan-400'>Priority: Fundamental Analysis (36%)</div>
            </div>

            <div className='bg-slate-800/50 rounded-xl p-4 border border-slate-700/50'>
              <div className='flex items-center gap-3 mb-3'>
                <div className='p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg'>
                  <BiMedal className='h-4 w-4 text-white' />
                </div>
                <h3 className='font-semibold text-white text-sm'>Achievement Hunt</h3>
              </div>
              <p className='text-xs text-gray-400 mb-3'>
                Complete 5 more courses to unlock the "Course Master" achievement
              </p>
              <div className='text-xs text-yellow-400'>Progress: 5/10 courses</div>
            </div>

            <div className='bg-slate-800/50 rounded-xl p-4 border border-slate-700/50'>
              <div className='flex items-center gap-3 mb-3'>
                <div className='p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg'>
                  <BiRocket className='h-4 w-4 text-white' />
                </div>
                <h3 className='font-semibold text-white text-sm'>Level Up</h3>
              </div>
              <p className='text-xs text-gray-400 mb-3'>
                You're close to reaching Level 8! Complete more courses to advance
              </p>
              <div className='text-xs text-purple-400'>Next level: 700 XP needed</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
