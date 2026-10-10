import { useState, useEffect } from 'react';
import axios from 'axios';
import { Play, CheckCircle, Code, Terminal, Trophy, Cpu, ChevronRight } from 'lucide-react';

const Assessments = () => {
  const [assessments, setAssessments] = useState([]);
  const [customTracks, setCustomTracks] = useState([]);
  
  // IDE State
  const [activeTest, setActiveTest] = useState(null);
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalProgress, setEvalProgress] = useState(0);

  useEffect(() => {
    fetchAssessments();
    fetchCustomTracks();
  }, []);

  const fetchAssessments = async () => {
    try {
      const token = localStorage.getItem('devtalent_token');
      const res = await axios.get(`\${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/assessments/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAssessments(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCustomTracks = async () => {
    try {
      const token = localStorage.getItem('devtalent_token');
      const res = await axios.get(`\${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/assessments/custom`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCustomTracks(res.data.data.map(custom => ({
        id: custom._id,
        title: custom.title,
        icon: Code,
        color: custom.color || 'blue',
        duration: custom.duration,
        description: custom.description
      })));
    } catch (err) {
      console.error(err);
    }
  };

  const startAssessment = (trackObj) => {
    setActiveTest(trackObj);
    setLanguage('javascript');
    setCode('// Write your optimized solution here...\n\nfunction solve(input) {\n  \n}\n');
    setIsEvaluating(false);
    setEvalProgress(0);
  };

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    
    // Update boilerplate template
    if (lang === 'javascript') setCode('// Write your optimized solution here...\n\nfunction solve(input) {\n  \n}\n');
    else if (lang === 'python') setCode('# Write your optimized solution here...\n\ndef solve(input):\n    pass\n');
    else if (lang === 'java') setCode('// Write your optimized solution here...\n\nclass Solution {\n    public void solve(int[] input) {\n        \n    }\n}\n');
    else if (lang === 'cpp') setCode('// Write your optimized solution here...\n\nclass Solution {\npublic:\n    void solve(vector<int>& input) {\n        \n    }\n};\n');
    else if (lang === 'sql') setCode('-- Write your optimized SQL query here...\n\nSELECT * FROM table_name;\n');
  };

  const submitCode = () => {
    setIsEvaluating(true);
    
    // Simulate test runners evaluating the code
    const interval = setInterval(() => {
      setEvalProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          finalizeScore();
          return 100;
        }
        return p + 25;
      });
    }, 800);
  };

  const finalizeScore = async () => {
    try {
      const token = localStorage.getItem('devtalent_token');
      await axios.post(`\${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/assessments`, 
        { topic: activeTest.title, code: code },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setActiveTest(null);
      setIsEvaluating(false);
      setEvalProgress(0);
      fetchAssessments();
    } catch (err) {
      console.error(err);
      setActiveTest(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      {!activeTest && (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-8">
          <div className="flex items-center mb-2">
            <div className="bg-indigo-100 p-3 rounded-xl mr-4">
              <Code className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Technical Assessments</h2>
              <p className="text-slate-500 mt-1">Select a track below to enter the live coding sandbox.</p>
            </div>
          </div>
        </div>
      )}

      {activeTest ? (
        <div className="bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col" style={{ height: '800px' }}>
           {/* IDE Navbar */}
           <div className="h-14 bg-slate-900 flex items-center justify-between px-6 border-b border-slate-800">
             <div className="flex items-center space-x-4">
               <div className="flex space-x-2">
                 <div className="w-3 h-3 rounded-full bg-rose-500 cursor-pointer" onClick={() => setActiveTest(null)}></div>
                 <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                 <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
               </div>
               
               <span className="text-slate-400 font-mono text-sm ml-4 border-l border-slate-700 pl-4 py-1">{activeTest.title}</span>
               
               <select 
                 value={language}
                 onChange={handleLanguageChange}
                 disabled={isEvaluating}
                 className="ml-4 bg-[#2d2d2d] border border-slate-700 text-slate-300 text-xs px-3 py-1 rounded-md outline-none cursor-pointer hover:border-slate-500 transition-colors"
               >
                 <option value="javascript">JavaScript ⚙️</option>
                 <option value="python">Python 🐍</option>
                 <option value="java">Java ☕</option>
                 <option value="cpp">C++ ⚡</option>
                 <option value="sql">SQL 🗄️</option>
               </select>
             </div>
             
             {isEvaluating ? (
               <div className="text-emerald-400 font-mono text-sm flex items-center animate-pulse">
                 <Cpu className="w-4 h-4 mr-2" /> Running Test Cases... ({evalProgress}%)
               </div>
             ) : (
               <button onClick={submitCode} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-1.5 rounded text-sm font-bold shadow-md transition-colors flex items-center group">
                 Submit Code <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
               </button>
             )}
           </div>

           {/* IDE Body */}
           <div className="flex-1 flex overflow-hidden">
             
           {/* Left: Problem Details */}
           <div className="w-1/3 bg-slate-50 border-r border-slate-200 overflow-y-auto p-6 hidden md:block flex flex-col">
             <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
               <Cpu className="w-5 h-5 mr-2 text-indigo-500" /> Challenge Parameters
             </h3>
             <div className="prose prose-sm text-slate-600 flex-1">
               <div className="font-medium text-slate-800 mb-6 bg-white p-5 rounded-xl border border-slate-200 shadow-sm leading-relaxed">
                 {activeTest.longDescription || activeTest.description}
               </div>
               
               {activeTest.input && (
                 <div className="mb-6 bg-white p-4 rounded-lg border border-slate-200 shadow-inner">
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Example Input</p>
                   <pre className="text-xs text-slate-700 font-mono whitespace-pre-wrap bg-slate-50 p-2 rounded border border-slate-100">{activeTest.input}</pre>
                   
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-4 mb-2">Expected Output</p>
                   <pre className="text-xs text-emerald-700 font-mono whitespace-pre-wrap bg-emerald-50 p-2 rounded border border-emerald-100">{activeTest.output}</pre>
                 </div>
               )}
               
               <h4 className="font-bold text-slate-800 mt-4 mb-3 uppercase tracking-wider text-xs">Standard Sandbox Rules:</h4>
               <ul className="list-disc pl-5 space-y-2 text-slate-500 bg-slate-100 p-4 rounded-xl border border-slate-200/60">
                 <li>Ensure your solution strictly adheres to the requested parameters.</li>
                 <li>Write production-ready, highly optimized syntax.</li>
                 <li>Any infinite loops will automatically terminate and result in a 0% score.</li>
                 <li>Do not attempt to access the simulated file system.</li>
               </ul>
             </div>
           </div>
             
             {/* Right: Code Editor Layout */}
             <div className="flex-1 bg-[#1e1e1e] flex flex-col relative w-full">
               
               {/* Line Numbers & Textarea wrapper */}
               <div className="flex-1 flex w-full relative">
                 <div className="w-12 bg-[#252526] border-r border-[#404040] text-[#858585] text-right pr-2 py-4 font-mono text-sm leading-relaxed select-none hidden sm:block">
                   {code.split('\n').map((_, i) => (
                     <div key={i}>{i + 1}</div>
                   ))}
                 </div>
                 
                 <textarea 
                   className="flex-1 bg-transparent text-[#d4d4d4] font-mono text-sm leading-relaxed p-4 outline-none resize-none whitespace-pre"
                   value={code}
                   onChange={(e) => setCode(e.target.value)}
                   spellCheck="false"
                   disabled={isEvaluating}
                   style={{
                     tabSize: 2
                   }}
                 />
               </div>

               {/* Fake Terminal Output pane */}
               {isEvaluating && (
                 <div className="h-48 border-t border-slate-700 bg-[#0d0d0d] p-4 font-mono text-xs overflow-y-auto text-slate-300">
                   <p className="text-slate-500 mb-2">// System output stream</p>
                   <p>{'>'} Booting highly secure container...</p>
                   {evalProgress >= 25 && <p className="text-emerald-400">{'>'} Test 1 passing... (Time: 12ms)</p>}
                   {evalProgress >= 50 && <p className="text-emerald-400">{'>'} Test 2 passing... (Time: 14ms)</p>}
                   {evalProgress >= 75 && <p className="text-amber-400">{'>'} Warning: Edge case near heap threshold...</p>}
                   {evalProgress >= 100 && <p className="text-emerald-400 font-bold">{'>'} ALL TESTS PASSED! Syncing global score...</p>}
                 </div>
               )}
             </div>

           </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Assessment Tracks */}
          {[
            { id: 'fullstack', title: 'Full-Stack Web Development', icon: Code, color: 'blue', duration: '45', description: '3 Coding Challenges • Multiple Choice',
              longDescription: 'Design a scalable application function that ingests a raw JSON payload of unorganized nested candidate tags. Construct a logical hierarchy and return the flattened, sanitized tree.',
              input: '{\n  "candidates": [\n    {"id": 4, "skill": "React"},\n    {"id": 1, "skill": "Node"}\n  ]\n}',
              output: '{\n  "tree": [1, 4],\n  "sanitized": true\n}'
            },
            { id: 'backend', title: 'Backend Systems & API Design', icon: Terminal, color: 'indigo', duration: '45', description: '3 Coding Challenges • Multiple Choice',
              longDescription: 'Implement a highly-concurrent thread pool emulator. Ensure your queue perfectly manages simultaneous memory insertions without triggering buffer overflows or deadlocks.',
              input: 'Queue.push(ThreadA)\nQueue.push(ThreadB)\nQueue.pop()',
              output: 'ThreadA processed.\nBuffer stable.'
            },
            { id: 'data', title: 'Data Structures & Algorithms', icon: Code, color: 'purple', duration: '60', description: 'Advanced Algorithm Design',
              longDescription: 'Traverse an inverted binary structure across all external leaves to aggregate metrics. Identify the shortest path between the Root and the deepest unlinked vertex.',
              input: 'treeNode = [4, 2, 7, 1, 3, 6, 9]',
              output: 'max_depth = 3\nshortest_path = [4, 7, 9]'
            },
            ...customTracks
          ].map(track => {
            const colorClasses = {
              blue: { bg: 'bg-blue-600', hover: 'hover:bg-blue-700', iconBg: 'bg-blue-100', text: 'text-blue-600' },
              indigo: { bg: 'bg-indigo-600', hover: 'hover:bg-indigo-700', iconBg: 'bg-indigo-100', text: 'text-indigo-600' },
              purple: { bg: 'bg-purple-600', hover: 'hover:bg-purple-700', iconBg: 'bg-purple-100', text: 'text-purple-600' },
              emerald: { bg: 'bg-emerald-600', hover: 'hover:bg-emerald-700', iconBg: 'bg-emerald-100', text: 'text-emerald-600' },
              sky: { bg: 'bg-sky-600', hover: 'hover:bg-sky-700', iconBg: 'bg-sky-100', text: 'text-sky-600' },
              rose: { bg: 'bg-rose-600', hover: 'hover:bg-rose-700', iconBg: 'bg-rose-100', text: 'text-rose-600' }
            };
            const theme = colorClasses[track.color] || colorClasses.blue;

            return (
              <div key={track.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-lg transition-all group flex flex-col justify-between">
                <div>
                  <div className={`w-12 h-12 rounded-xl ${theme.iconBg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <track.icon className={`w-6 h-6 ${theme.text}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{track.title}</h3>
                  <p className="text-sm text-gray-500 mb-6">{track.duration} min • {track.description}</p>
                </div>
                
                <button 
                  onClick={() => startAssessment(track)}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-white ${theme.bg} ${theme.hover} transition-colors flex justify-center items-center mt-auto`}
                >
                  <Play className="w-4 h-4 mr-2" /> Start Assessment
                </button>
              </div>
            );
          })}

        </div>
      )}

      {/* Historical Scores */}
      {assessments.length > 0 && !activeTest && (
        <div className="mt-12 bg-white rounded-xl border border-slate-100 shadow-sm p-8">
           <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
             <Trophy className="w-6 h-6 mr-2 text-yellow-500" />
             Validated Certificates
           </h3>
           <div className="space-y-4">
             {assessments.map(a => (
               <div key={a._id} className="flex flex-col md:flex-row justify-between items-center bg-slate-50 border border-slate-200 p-4 rounded-xl">
                 <div className="flex items-center mb-4 md:mb-0">
                   <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mr-4">
                     <CheckCircle className="w-6 h-6 text-emerald-600" />
                   </div>
                   <div>
                     <p className="font-bold text-slate-900">{a.topic}</p>
                     <p className="text-xs text-slate-500">{new Date(a.completedAt).toLocaleDateString()}</p>
                   </div>
                 </div>
                 <div className="bg-blue-600 shadow-md text-white font-black text-xl px-4 py-2 rounded-lg">
                   {a.score}%
                 </div>
               </div>
             ))}
           </div>
        </div>
      )}

    </div>
  );
};

export default Assessments;
