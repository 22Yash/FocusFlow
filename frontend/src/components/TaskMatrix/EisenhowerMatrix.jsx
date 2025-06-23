import React, { useState , useEffect} from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Clock, Calendar, Tag, Plus, X, Trash2, Play, Check } from 'lucide-react';
import AssistantChat from "../chatboat/AssistantChat";
import Header from "../Header/Header";
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from "react-router-dom";

function EisenhowerMatrix() {
  const [task, setTask] = useState("");
  const [quadrant, setQuadrant] = useState("");
  const [tasksByQuadrant, setTasksByQuadrant] = useState({
    do: [],
    schedule: [],
    delegate: [],
    eliminate: [],
  });

  const [showAdvancedForm, setShowAdvancedForm] = useState(false);
  const [taskForm, setTaskForm] = useState({
    description: "",
    category: "Work",
    priority: "Medium",
    estimatedTime: 60,
    dueDate: "",
    tags: [],
    currentTag: ""
  });

  const navigate = useNavigate();

  const { user } = useUser();
  const userID = user?.id;

  const quadrantColors = {
    do: {
      border: "border-red-500",
      bg: "bg-red-50",
      text: "text-red-800",
      hover: "hover:bg-red-100",
      accent: "bg-red-500"
    },
    schedule: {
      border: "border-blue-500",
      bg: "bg-blue-50",
      text: "text-blue-800",
      hover: "hover:bg-blue-100",
      accent: "bg-blue-500"
    },
    delegate: {
      border: "border-yellow-500",
      bg: "bg-yellow-50",
      text: "text-yellow-800",
      hover: "hover:bg-yellow-100",
      accent: "bg-yellow-500"
    },
    eliminate: {
      border: "border-gray-500",
      bg: "bg-gray-50",
      text: "text-gray-800",
      hover: "hover:bg-gray-100",
      accent: "bg-gray-500"
    },
  };

  const categories = ['Work', 'Personal', 'Learning', 'Health', 'Finance'];
  const priorities = ['High', 'Medium', 'Low'];

  useEffect(() => {
    if (!userID) return;

    const fetchTasks = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/tasks", {
          params: { userID }
        });
        const tasks = res.data;
        const grouped = {
          do: [],
          schedule: [],
          delegate: [],
          eliminate: [],
        };
        
        tasks.forEach((t) => {
          grouped[t.quadrant].push({
            id: t._id || Date.now().toString(),
            content: t.description,
            quadrant: t.quadrant,
            category: t.category || 'Work',
            priority: t.priority || 'Medium',
            estimatedTime: t.estimatedTime || 60,
            createdAt: t.createdAt,
            dueDate: t.dueDate,
            tags: t.tags || [],
            completed: t.completed || false,
            timeSpent: t.timeSpent || 0
          });
        });
        
        setTasksByQuadrant(grouped);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    
    fetchTasks();
  }, [userID]);

  const handleAddTask = async () => {
    const taskData = showAdvancedForm ? taskForm : { description: task, quadrant };
    
    if (!taskData.description.trim() || !quadrant) return;
    
    try {
      const payload = {
        description: taskData.description,
        quadrant,
        userID,
        category: taskData.category || 'Work',
        priority: taskData.priority || 'Medium',
        estimatedTime: taskData.estimatedTime || 60,
        dueDate: taskData.dueDate || null,
        tags: taskData.tags || [],
        createdAt: new Date().toISOString()
      };

      const res = await axios.post("http://localhost:5000/api/tasks", payload);
      const newTask = res.data;
      
      setTasksByQuadrant((prev) => ({
        ...prev,
        [quadrant]: [...prev[quadrant], {
          id: newTask._id || Date.now().toString(),
          content: newTask.description,
          quadrant: newTask.quadrant,
          category: newTask.category,
          priority: newTask.priority,
          estimatedTime: newTask.estimatedTime,
          dueDate: newTask.dueDate,
          tags: newTask.tags,
          completed: false,
          timeSpent: 0
        }],
      }));

      if (showAdvancedForm) {
        setTaskForm({
          description: "",
          category: "Work",
          priority: "Medium",
          estimatedTime: 60,
          dueDate: "",
          tags: [],
          currentTag: ""
        });
      } else {
        setTask("");
      }
      setQuadrant("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleStartTask = (taskDescription, focusMinutes) => {
  navigate("/sessionstart", {
    state: {
      task: taskDescription,
      time: focusMinutes,  // or a default like 25
    },
  });
};

  const completeTask = async (quadrant, taskId) => {
    const task = tasksByQuadrant[quadrant]?.find(t => t.id === taskId);
    if (!task) return;
    
    try {
      await axios.put(`http://localhost:5000/api/tasks/${taskId}`, { 
        completed: true,
        completedAt: new Date().toISOString()
      });

      setTasksByQuadrant(prev => ({
        ...prev,
        [quadrant]: prev[quadrant].map(t => 
          t.id === taskId ? { ...t, completed: true } : t
        )
      }));
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  const deleteTask = async (quadrant, taskId) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`);
      
      setTasksByQuadrant(prev => ({
        ...prev,
        [quadrant]: prev[quadrant].filter(t => t.id !== taskId)
      }));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const addTag = () => {
    if (taskForm.currentTag.trim() && !taskForm.tags.includes(taskForm.currentTag.trim())) {
      setTaskForm(prev => ({
        ...prev,
        tags: [...prev.tags, prev.currentTag.trim()],
        currentTag: ''
      }));
    }
  };

  const removeTag = (tagToRemove) => {
    setTaskForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const onDragEnd = async (result) => {
    const { source, destination } = result;
  
    if (!destination || 
        (source.droppableId === destination.droppableId && 
         source.index === destination.index)) {
      return;
    }
  
    const sourceQuadrant = source.droppableId;
    const destQuadrant = destination.droppableId;
    const taskId = tasksByQuadrant[sourceQuadrant][source.index].id;
  
    const updatedTasks = { ...tasksByQuadrant };
    const [movedTask] = updatedTasks[sourceQuadrant].splice(source.index, 1);
    updatedTasks[destQuadrant].splice(destination.index, 0, {
      ...movedTask,
      quadrant: destQuadrant
    });
  
    setTasksByQuadrant(updatedTasks);
  
    try {
      await axios.put(`http://localhost:5000/api/tasks/${taskId}`, { 
        quadrant: destQuadrant 
      });
    } catch (err) {
      console.error("Update error:", err);
      setTasksByQuadrant(prev => ({ ...prev }));
      alert("Failed to update task. Please refresh and try again.");
    }
  };

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto">
      <Header />
      
      <div className="text-center">
        <h1 className="text-3xl md:text-5xl md:mt-[30px] font-bold text-black">Eisenhower Matrix</h1>
        <h4 className="text-lg md:text-xl text-gray-600 mt-2">
          Prioritize tasks based on urgency and importance
        </h4>
      </div>

      {/* Enhanced Add Task Section */}
      <div className="bg-white shadow-xl rounded-2xl p-6 mt-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">➕ Add New Task</h2>
          <button
            onClick={() => setShowAdvancedForm(!showAdvancedForm)}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            {showAdvancedForm ? 'Simple Form' : 'Advanced Form'}
          </button>
        </div>

        {showAdvancedForm ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Task description..."
                value={taskForm.description}
                onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
                className="p-3 rounded-xl border border-gray-300"
              />
              <select
                value={quadrant}
                onChange={(e) => setQuadrant(e.target.value)}
                className="p-3 rounded-xl border border-gray-300"
              >
                <option value="">Select Quadrant</option>
                <option value="do">🔥 Do (Urgent & Important)</option>
                <option value="schedule">📅 Schedule (Not Urgent & Important)</option>
                <option value="delegate">👥 Delegate (Urgent & Not Important)</option>
                <option value="eliminate">🗑️ Eliminate (Not Urgent & Not Important)</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={taskForm.category}
                onChange={(e) => setTaskForm({...taskForm, category: e.target.value})}
                className="p-3 rounded-xl border border-gray-300"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              
              <select
                value={taskForm.priority}
                onChange={(e) => setTaskForm({...taskForm, priority: e.target.value})}
                className="p-3 rounded-xl border border-gray-300"
              >
                {priorities.map(pri => (
                  <option key={pri} value={pri}>{pri}</option>
                ))}
              </select>
              
              <div className="flex items-center gap-2">
                <Clock size={20} className="text-gray-500" />
                <input
                  type="number"
                  placeholder="Est. time (min)"
                  value={taskForm.estimatedTime}
                  onChange={(e) => setTaskForm({...taskForm, estimatedTime: parseInt(e.target.value) || 60})}
                  className="flex-1 p-3 rounded-xl border border-gray-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar size={20} className="text-gray-500" />
                <input
                  type="date"
                  value={taskForm.dueDate}
                  onChange={(e) => setTaskForm({...taskForm, dueDate: e.target.value})}
                  className="flex-1 p-3 rounded-xl border border-gray-300"
                />
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add tag..."
                  value={taskForm.currentTag}
                  onChange={(e) => setTaskForm({...taskForm, currentTag: e.target.value})}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  className="flex-1 p-3 rounded-xl border border-gray-300"
                />
                <button
                  onClick={addTag}
                  className="px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
                >
                  <Tag size={16} />
                </button>
              </div>
            </div>

            {taskForm.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {taskForm.tags.map(tag => (
                  <span
                    key={tag}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {tag}
                    <button onClick={() => removeTag(tag)}>
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Enter your task..."
              value={task}
              onChange={(e) => setTask(e.target.value)}
              className="flex-1 p-3 rounded-xl border border-gray-300"
            />
            <select
              value={quadrant}
              onChange={(e) => setQuadrant(e.target.value)}
              className="flex-1 p-3 rounded-xl border border-gray-300"
            >
              <option value="">Select Quadrant</option>
              <option value="do">🔥 Do (Urgent & Important)</option>
              <option value="schedule">📅 Schedule (Not Urgent & Important)</option>
              <option value="delegate">👥 Delegate (Urgent & Not Important)</option>
              <option value="eliminate">🗑️ Eliminate (Not Urgent & Not Important)</option>
            </select>
          </div>
        )}

        <button
          onClick={handleAddTask}
          disabled={(!task.trim() && !taskForm.description.trim()) || !quadrant}
          className={`mt-4 px-6 py-3 rounded-xl transition-all duration-200 w-full md:w-auto
            ${(!task.trim() && !taskForm.description.trim()) || !quadrant
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-gradient-to-r from-green-500 to-green-600 text-white hover:scale-105 shadow-lg"}`}
        >
          Add Task
        </button>
      </div>

      {/* Enhanced Matrix Display */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          {[
            { key: "do", title: "🔥 DO", desc: "Urgent & Important" },
            { key: "schedule", title: "📅 SCHEDULE", desc: "Important but Not Urgent" },
            { key: "delegate", title: "👥 DELEGATE", desc: "Urgent but Not Important" },
            { key: "eliminate", title: "🗑️ ELIMINATE", desc: "Not Urgent or Important" },
          ].map(({ key, title, desc }) => (
            <Droppable key={key} droppableId={key}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`bg-white shadow-lg rounded-2xl border-t-4 p-6 transition-all duration-200
                    ${quadrantColors[key].border} 
                    ${snapshot.isDraggingOver ? 'scale-105 shadow-xl' : ''}`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className={`text-xl font-bold mb-1 ${quadrantColors[key].text}`}>{title}</h3>
                      <p className="text-sm text-gray-500">{desc}</p>
                    </div>
                    <div className={`w-4 h-4 rounded-full ${quadrantColors[key].accent}`}></div>
                  </div>
                  
                  <div className="space-y-3">
                    {tasksByQuadrant[key].map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-4 rounded-xl break-words transition-all duration-200
                              ${quadrantColors[key].bg} ${quadrantColors[key].text} 
                              ${quadrantColors[key].hover} cursor-move
                              ${snapshot.isDragging ? 'rotate-3 scale-105 shadow-lg' : 'shadow-sm'}
                              ${task.completed ? 'opacity-50 line-through' : ''}`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <div className="font-medium">{task.content}</div>
                                {task.category && (
                                  <div className="text-xs opacity-70 mt-1">
                                    {task.category} • {task.priority}
                                  </div>
                                )}
                                {task.tags && task.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {task.tags.map(tag => (
                                      <span key={tag} className="text-xs bg-white/50 px-2 py-1 rounded">
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex flex-col gap-1 ml-2">
                                {!task.completed && (
                                  <>
                                    <button
                                      onClick={() => handleStartTask(task.description, 25)}
                                      className="p-1 rounded hover:bg-white/50 transition-colors"
                                    >
                                      <Play size={14} />
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        completeTask(key, task.id);
                                      }}
                                      className="p-1 rounded hover:bg-white/50 transition-colors text-green-600"
                                    >
                                      <Check size={14} />
                                    </button>
                                  </>
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteTask(key, task.id);
                                  }}
                                  className="p-1 rounded hover:bg-white/50 transition-colors text-red-600"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                            
                            {task.dueDate && (
                              <div className="text-xs opacity-70 mt-1 flex items-center gap-1">
                                <Calendar size={12} />
                                Due: {new Date(task.dueDate).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                  
                  {tasksByQuadrant[key].length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <div className="text-4xl mb-2">📝</div>
                      <div>No tasks here yet</div>
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
      
      <AssistantChat />
    </div>
  );
}

export default EisenhowerMatrix;