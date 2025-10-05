// frontend/src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { getTasks, deleteTask, updateTask } from '../api/apiService';
import CreateTaskModal from '../components/CreateTaskModal';
import { useAuth } from '../context/AuthContext';

const TaskCard = ({ task, onDelete, onUpdateStatus, onEdit }) => {
  const handleDelete = async () => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar la tarea "${task.title}"?`)) {
      onDelete(task.id);
    }
  };

  const handleStatusChange = (e) => {
    onUpdateStatus(task.id, e.target.value);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'todo': return 'bg-gray-700 border-gray-600';
      case 'in_progress': return 'bg-blue-900 border-blue-700';
      case 'done': return 'bg-green-900 border-green-700';
      default: return 'bg-gray-700 border-gray-600';
    }
  };

  return (
    <div className={`${getStatusColor(task.status)} border-2 p-4 rounded-xl shadow-lg mb-4 hover:shadow-xl transition-all duration-300`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-bold text-lg text-white mb-1">{task.title}</h3>
          {task.description && (
            <p className="text-gray-300 text-sm">{task.description}</p>
          )}
        </div>
        <button 
          onClick={handleDelete}
          className="text-gray-400 hover:text-red-500 text-2xl font-bold ml-2 transition-colors"
        >
          ×
        </button>
      </div>

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {task.tags.map(tag => (
            <span
              key={tag.id}
              className="px-2 py-1 text-xs rounded-full text-white font-semibold"
              style={{ backgroundColor: tag.color }}
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}

      {/* Due Date */}
      {task.due_date && (
        <div className="text-xs text-gray-400 mb-3">
          📅 {new Date(task.due_date).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
        </div>
      )}

      <div className="flex justify-between items-center">
        <select
          value={task.status}
          onChange={handleStatusChange}
          className="bg-gray-800 text-white text-sm rounded-lg px-3 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
        >
          <option value="todo">📋 Sin Iniciar</option>
          <option value="in_progress">⚡ En Progreso</option>
          <option value="done">✅ Completada</option>
        </select>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState('board'); // 'board' o 'calendar'
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const response = await getTasks();
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskCreated = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      await updateTask(taskId, { status: newStatus });
      setTasks(tasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      ));
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const todoTasks = tasks.filter(t => t.status === 'todo');
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
  const doneTasks = tasks.filter(t => t.status === 'done');

  // Funciones para navegar en el calendario
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  };

  // Calendar View Logic
  const calendarDate = new Date(currentYear, currentMonth);
  const monthName = calendarDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Ajustar para que Lunes sea 0
  
  // Verificar si estamos en el mes actual
  const today = new Date();
  const isCurrentMonth = currentMonth === today.getMonth() && currentYear === today.getFullYear();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900 text-white">
      {/* Header */}
      <header className="bg-black bg-opacity-30 backdrop-blur-sm border-b border-gray-700">
        <div className="container mx-auto px-4 sm:px-8 py-4">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Gestor de Tareas
              </h1>
              {user && (
                <p className="text-gray-300 text-sm sm:text-base mt-1">
                  Hola, <span className="font-semibold text-indigo-300">{user.name}</span> ({user.email})
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              {/* View Toggle */}
              <div className="flex bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setView('board')}
                  className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                    view === 'board' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  📋 Tablero
                </button>
                <button
                  onClick={() => setView('calendar')}
                  className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                    view === 'calendar' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  📅 Calendario
                </button>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 font-semibold transition-all shadow-lg hover:shadow-indigo-500/50"
              >
                + Nueva Tarea
              </button>

              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 font-semibold transition-colors"
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-8 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <>
            {/* Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
                <div className="text-3xl font-bold text-indigo-400">{todoTasks.length}</div>
                <div className="text-gray-400 text-sm">Tareas pendientes</div>
              </div>
              <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
                <div className="text-3xl font-bold text-blue-400">{inProgressTasks.length}</div>
                <div className="text-gray-400 text-sm">En progreso</div>
              </div>
              <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
                <div className="text-3xl font-bold text-green-400">{doneTasks.length}</div>
                <div className="text-gray-400 text-sm">Completadas</div>
              </div>
            </div>

            {/* Board View */}
            {view === 'board' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Column: Sin Iniciar */}
                <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-200">📋 Sin Iniciar</h2>
                    <span className="bg-gray-700 px-3 py-1 rounded-full text-sm font-semibold">
                      {todoTasks.length}
                    </span>
                  </div>
                  <div className="space-y-4">
                    {todoTasks.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No hay tareas pendientes</p>
                    ) : (
                      todoTasks.map(task => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onDelete={handleDeleteTask}
                          onUpdateStatus={handleUpdateTaskStatus}
                        />
                      ))
                    )}
                  </div>
                </div>

                {/* Column: En Progreso */}
                <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-blue-200">⚡ En Progreso</h2>
                    <span className="bg-blue-900 px-3 py-1 rounded-full text-sm font-semibold">
                      {inProgressTasks.length}
                    </span>
                  </div>
                  <div className="space-y-4">
                    {inProgressTasks.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No hay tareas en progreso</p>
                    ) : (
                      inProgressTasks.map(task => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onDelete={handleDeleteTask}
                          onUpdateStatus={handleUpdateTaskStatus}
                        />
                      ))
                    )}
                  </div>
                </div>

                {/* Column: Completadas */}
                <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-green-200">✅ Completadas</h2>
                    <span className="bg-green-900 px-3 py-1 rounded-full text-sm font-semibold">
                      {doneTasks.length}
                    </span>
                  </div>
                  <div className="space-y-4">
                    {doneTasks.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No hay tareas completadas</p>
                    ) : (
                      doneTasks.map(task => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onDelete={handleDeleteTask}
                          onUpdateStatus={handleUpdateTaskStatus}
                        />
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Calendar View */}
            {view === 'calendar' && (
              <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm p-8 rounded-xl border border-gray-700">
                <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                  <h2 className="text-3xl font-bold capitalize">{monthName}</h2>
                  <div className="flex gap-2">
                    <button 
                      onClick={goToPreviousMonth}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors font-semibold"
                    >
                      ← Anterior
                    </button>
                    {!isCurrentMonth && (
                      <button 
                        onClick={goToToday}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors font-semibold"
                      >
                        Hoy
                      </button>
                    )}
                    <button 
                      onClick={goToNextMonth}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors font-semibold"
                    >
                      Siguiente →
                    </button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
                    <div key={day} className="text-center font-semibold text-indigo-400 py-2">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {/* Empty cells for days before month starts */}
                  {[...Array(adjustedFirstDay)].map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square"></div>
                  ))}

                  {/* Days of the month */}
                  {[...Array(daysInMonth)].map((_, i) => {
                    const day = i + 1;
                    const isToday = day === today.getDate() && isCurrentMonth;
                    const tasksForDay = tasks.filter(task => {
                      if (!task.due_date) return false;
                      const taskDate = new Date(task.due_date);
                      return taskDate.getDate() === day &&
                             taskDate.getMonth() === currentMonth &&
                             taskDate.getFullYear() === currentYear;
                    });

                    return (
                      <div
                        key={day}
                        className={`aspect-square flex flex-col items-center justify-center rounded-lg cursor-pointer transition-all ${
                          isToday
                            ? 'bg-indigo-600 text-white font-bold ring-2 ring-indigo-400'
                            : tasksForDay.length > 0
                            ? 'bg-gray-700 hover:bg-indigo-700'
                            : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                      >
                        <span className="text-lg">{day}</span>
                        {tasksForDay.length > 0 && (
                          <span className="text-xs mt-1">
                            {tasksForDay.length} tarea{tasksForDay.length > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Tasks with due dates */}
                <div className="mt-8">
                  <h3 className="text-xl font-bold mb-4">Tareas próximas</h3>
                  <div className="space-y-2">
                    {tasks
                      .filter(task => task.due_date)
                      .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
                      .slice(0, 5)
                      .map(task => (
                        <div key={task.id} className="bg-gray-700 p-4 rounded-lg flex justify-between items-center">
                          <div>
                            <p className="font-semibold">{task.title}</p>
                            <p className="text-sm text-gray-400">
                              {new Date(task.due_date).toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                          <span className={`px-3 py-1 text-xs rounded-full ${
                            task.status === 'done' ? 'bg-green-600' :
                            task.status === 'in_progress' ? 'bg-blue-600' : 'bg-gray-600'
                          }`}>
                            {task.status === 'done' ? 'Completada' :
                             task.status === 'in_progress' ? 'En progreso' : 'Pendiente'}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Modal */}
      {isModalOpen && (
        <CreateTaskModal
          onClose={() => setIsModalOpen(false)}
          onTaskCreated={handleTaskCreated}
        />
      )}
    </div>
  );
};

export default Dashboard;