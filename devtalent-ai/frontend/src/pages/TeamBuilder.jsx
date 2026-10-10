import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Users, Server, Box, Fingerprint, GripVertical, CheckCircle2 } from 'lucide-react';

const mockCandidates = {
  unassigned: {
    id: 'unassigned',
    title: 'Candidate Pool',
    icon: <Users className="w-5 h-5 text-blue-500" />,
    color: 'border-blue-200 bg-blue-50/50',
    candidates: [
      { id: 'dev-1', name: 'Alex Johnson', skill: 'React / Node.js', score: 92 },
      { id: 'dev-2', name: 'Sarah Chen', skill: 'Python / Django', score: 88 },
      { id: 'dev-3', name: 'Michael Rodriguez', skill: 'AWS / DevOps', score: 95 },
      { id: 'dev-4', name: 'Emma Wilson', skill: 'Vue / Express', score: 85 },
      { id: 'dev-5', name: 'David Kim', skill: 'Java / Spring', score: 91 },
    ],
  },
  frontend: {
    id: 'frontend',
    title: 'Frontend Squad',
    icon: <Box className="w-5 h-5 text-purple-500" />,
    color: 'border-purple-200 bg-purple-50/50',
    candidates: [],
  },
  backend: {
    id: 'backend',
    title: 'Backend Pod',
    icon: <Server className="w-5 h-5 text-emerald-500" />,
    color: 'border-emerald-200 bg-emerald-50/50',
    candidates: [],
  },
  data: {
    id: 'data',
    title: 'Data Science Team',
    icon: <Fingerprint className="w-5 h-5 text-rose-500" />,
    color: 'border-rose-200 bg-rose-50/50',
    candidates: [],
  }
};

const TeamBuilder = () => {
  const [columns, setColumns] = useState(mockCandidates);
  const [isReady, setIsReady] = useState(false);
  
  // Bypass React 18 StrictMode timing bugs with drag-and-drop
  React.useEffect(() => {
    setIsReady(true);
  }, []);

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceCol = columns[source.droppableId];
    const destCol = columns[destination.droppableId];

    const sourceCandidates = [...sourceCol.candidates];
    const destCandidates = [...destCol.candidates];

    const [draggedItem] = sourceCandidates.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceCandidates.splice(destination.index, 0, draggedItem);
      setColumns({
        ...columns,
        [source.droppableId]: { ...sourceCol, candidates: sourceCandidates }
      });
    } else {
      destCandidates.splice(destination.index, 0, draggedItem);
      setColumns({
        ...columns,
        [source.droppableId]: { ...sourceCol, candidates: sourceCandidates },
        [destination.droppableId]: { ...destCol, candidates: destCandidates }
      });
    }
  };

  if (!isReady) {
    return <div className="p-8 text-center text-slate-500">Loading Kanban engine...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 flex justify-between items-center bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
        <div className="flex items-center">
          <div className="bg-blue-800/50 p-3 rounded-xl mr-4 border border-blue-700">
            <Users className="w-8 h-8 text-blue-200" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-1">AI Team Builder</h2>
            <p className="text-blue-200">Drag and drop top-scoring candidates into specialized project pods.</p>
          </div>
        </div>
        <button className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-2.5 rounded-xl font-bold transition-all">
          Save Configuration
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-8 snap-x">
          {Object.entries(columns).map(([columnId, column]) => (
            <div key={columnId} className="min-w-[320px] flex-1 snap-center">
              <div className={`bg-white rounded-2xl border ${column.color} shadow-sm overflow-hidden flex flex-col h-[calc(100vh-280px)]`}>
                
                <div className="p-4 border-b border-inherit bg-white/50 backdrop-blur flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    {column.icon}
                    <h3 className="font-bold text-slate-800">{column.title}</h3>
                  </div>
                  <span className="bg-white text-slate-600 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm border border-slate-200">
                    {column.candidates.length}
                  </span>
                </div>

                <Droppable droppableId={columnId}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`flex-1 p-4 overflow-y-auto space-y-3 transition-colors ${snapshot.isDraggingOver ? 'bg-slate-100/50' : ''}`}
                    >
                      {column.candidates.map((candidate, index) => (
                        <Draggable key={candidate.id} draggableId={candidate.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-white border rounded-xl p-4 flex gap-3 transition-all cursor-grab active:cursor-grabbing ${
                                snapshot.isDragging 
                                  ? 'shadow-xl border-indigo-300 ring-2 ring-indigo-500/20 rotate-2 scale-105 opacity-90' 
                                  : 'border-slate-200 shadow-sm hover:-translate-y-1 hover:shadow-md'
                              }`}
                            >
                              <div className="text-slate-300 group-hover:text-indigo-500 flex items-center">
                                <GripVertical className="w-5 h-5" />
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                  <h4 className="font-bold text-slate-800">{candidate.name}</h4>
                                  <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded text-xs font-bold text-emerald-700">
                                    <CheckCircle2 className="w-3 h-3" />
                                    {candidate.score}
                                  </div>
                                </div>
                                <p className="text-xs text-slate-500 font-medium">{candidate.skill}</p>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      
                      {column.candidates.length === 0 && !snapshot.isDraggingOver && (
                        <div className="h-32 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-sm font-medium">
                          Drop Candidates Here
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default TeamBuilder;
