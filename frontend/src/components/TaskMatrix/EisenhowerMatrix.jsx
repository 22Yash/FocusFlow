import React, { useEffect, useState } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import AssistantChat from "../chatboat/AssistantChat";
import Header from "../Header/Header";
import { useUser } from '@clerk/clerk-react';

function EisenhowerMatrix() {
  const [task, setTask] = useState("");
  const [quadrant, setQuadrant] = useState("");
  const [tasksByQuadrant, setTasksByQuadrant] = useState({
    do: [],
    schedule: [],
    delegate: [],
    eliminate: [],
  });

  const { user } = useUser();
  const userID = user?.id;

  // Color mapping for each quadrant
  const quadrantColors = {
    do: {
      border: "border-red-500",
      bg: "bg-red-100",
      text: "text-red-800",
      hover: "hover:bg-red-200"
    },
    schedule: {
      border: "border-blue-500",
      bg: "bg-blue-100",
      text: "text-blue-800",
      hover: "hover:bg-blue-200"
    },
    delegate: {
      border: "border-yellow-500",
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      hover: "hover:bg-yellow-200"
    },
    eliminate: {
      border: "border-gray-500",
      bg: "bg-gray-100",
      text: "text-gray-800",
      hover: "hover:bg-gray-200"
    },
  };

  useEffect(() => {
    if (!userID) return; // ✅ wait until userID is available


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
            quadrant: t.quadrant
          });
        });
        setTasksByQuadrant(grouped);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };
    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    if (!task.trim() || !quadrant) return;
    try {
      const res = await axios.post("http://localhost:5000/api/tasks", {
        description: task,
        quadrant,
        userID
      });
      const newTask = res.data;
      setTasksByQuadrant((prev) => ({
        ...prev,
        [quadrant]: [...prev[quadrant], {
          id: newTask._id || Date.now().toString(),
          content: newTask.description,
          quadrant: newTask.quadrant
        }],
      }));
      setTask("");
      setQuadrant("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const onDragEnd = async (result) => {
    const { source, destination } = result;
  
    // Dropped outside the list or same position
    if (!destination || 
        (source.droppableId === destination.droppableId && 
         source.index === destination.index)) {
      return;
    }
  
    const sourceQuadrant = source.droppableId;
    const destQuadrant = destination.droppableId;
    const taskId = tasksByQuadrant[sourceQuadrant][source.index].id;
  
    // Optimistic UI update
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
      
      // Revert on error
      setTasksByQuadrant(prev => ({ ...prev }));
      alert("Failed to update task. Please refresh and try again.");
    }
  };

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <Header />
      <div className="text-center">
        <h1 className="text-3xl md:text-5xl md:mt-[30px] font-bold text-black">Eisenhower Matrix</h1>
        <h4 className="text-lg md:text-xl text-gray-600 mt-2">
          Prioritize tasks based on urgency and importance
        </h4>
      </div>

      {/* Add Task Section */}
      <div className="bg-white shadow-xl rounded-2xl p-6 mt-10">
        <h2 className="text-xl font-semibold mb-4">➕ Add New Task</h2>
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
          <button
            onClick={handleAddTask}
            disabled={!task.trim() || !quadrant}
            className={`px-5 py-3 rounded-xl transition-transform duration-200 
              ${!task.trim() || !quadrant
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-green-500 text-white hover:scale-105 hover:bg-green-600"}`}
          >
            Add Task
          </button>
        </div>
      </div>

      {/* Matrix Display */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          {[
            { key: "do", title: "🔥 DO", desc: "Urgent & Important" },
            { key: "schedule", title: "📅 SCHEDULE", desc: "Important but Not Urgent" },
            { key: "delegate", title: "👥 DELEGATE", desc: "Urgent but Not Important" },
            { key: "eliminate", title: "🗑️ ELIMINATE", desc: "Not Urgent or Important" },
          ].map(({ key, title, desc }) => (
            <Droppable key={key} droppableId={key}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`bg-white shadow p-4 rounded-lg border-t-4 ${quadrantColors[key].border}`}
                >
                  <h3 className={`text-xl font-bold mb-1 ${quadrantColors[key].text}`}>{title}</h3>
                  <p className="text-sm text-gray-500 mb-2">{desc}</p>
                  {tasksByQuadrant[key].map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`p-3 rounded mb-2 break-words ${quadrantColors[key].bg} ${quadrantColors[key].text} shadow-sm ${quadrantColors[key].hover} cursor-move`}
                        >
                          {task.content}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
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