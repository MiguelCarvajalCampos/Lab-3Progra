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

  const getStatusColor = (status) => {
    switch (status) {
      case 'todo': return 'bg-gray-50 border-gray-300';
      case 'in_progress': return 'bg-blue-50 border-blue-300';
      case 'done': return 'bg-green-50 border-green-300';
      default: return 'bg-gray-50 border-gray-300';
    }
  };

  return (
    <div className={`${getStatusColor(task.status)} border-2 p-4 rounded-xl shadow-md mb-4 hover:shadow-lg transition-all duration-300`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-bold text-lg text-gray-900 mb-1">{task.title}</h3>
          {task.description && (
            <p className="text-gray-600 text-sm">{task.description}</p>
          )}
        </div>
        <button 
          onClick={handleDelete}
          className="text-gray-400 hover:text-red-600 text-2xl font-bold ml-2 transition-colors"
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
        <div className="text-xs text-gray-500 mb-3">
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
          className="bg-white text-gray-900 text-sm rounded-lg px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
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
  const [view, setView] = useState('board');
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

  const calendarDate = new Date(currentYear, currentMonth);
  const monthName = calendarDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  
  const today = new Date();
  const isCurrentMonth = currentMonth === today.getMonth() && currentYear === today.getFullYear();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white text-gray-800">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-8 py-4">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold text-blue-600">
                Gestor de Tareas
              </h1>
              {user && (
                <p className="text-gray-600 text-sm sm:text-base mt-1">
                  Hola, <span className="font-semibold text-blue-600">{user.name}</span> ({user.email})
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              {/* View Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setView('board')}
                  className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                    view === 'board' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  📋 Tablero
                </button>
                <button
                  onClick={() => setView('calendar')}
                  className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                    view === 'calendar' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  📅 Calendario
                </button>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-all shadow-md hover:shadow-lg"
              >
                + Nueva Tarea
              </button>

              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition-colors shadow-md"
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
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md">
                <div className="text-3xl font-bold text-blue-600">{todoTasks.length}</div>
                <div className="text-gray-600 text-sm">Tareas pendientes</div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md">
                <div className="text-3xl font-bold text-blue-600">{inProgressTasks.length}</div>
                <div className="text-gray-600 text-sm">En progreso</div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md">
                <div className="text-3xl font-bold text-green-600">{doneTasks.length}</div>
                <div className="text-gray-600 text-sm">Completadas</div>
              </div>
            </div>

            {/* Board View */}
            {view === 'board' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Column: Sin Iniciar */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">📋 Sin Iniciar</h2>
                    <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold">
                      {todoTasks.length}
                    </span>
                  </div>
                  <div className="space-y-4">
                    {todoTasks.length === 0 ? (
                      <p className="text-gray-400 text-center py-8">No hay tareas pendientes</p>
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
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-blue-600">⚡ En Progreso</h2>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                      {inProgressTasks.length}
                    </span>
                  </div>
                  <div className="space-y-4">
                    {inProgressTasks.length === 0 ? (
                      <p className="text-gray-400 text-center py-8">No hay tareas en progreso</p>
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
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-green-600">✅ Completadas</h2>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                      {doneTasks.length}
                    </span>
                  </div>
                  <div className="space-y-4">
                    {doneTasks.length === 0 ? (
                      <p className="text-gray-400 text-center py-8">No hay tareas completadas</p>
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
              <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-md">
                <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                  <h2 className="text-3xl font-bold capitalize text-gray-900">{monthName}</h2>
                  <div className="flex gap-2">
                    <button 
                      onClick={goToPreviousMonth}
                      className="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-lg transition-colors font-semibold"
                    >
                      ← Anterior
                    </button>
                    {!isCurrentMonth && (
                      <button 
                        onClick={goToToday}
                        className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors font-semibold"
                      >
                        Hoy
                      </button>
                    )}
                    <button 
                      onClick={goToNextMonth}
                      className="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-lg transition-colors font-semibold"
                    >
                      Siguiente →
                    </button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
                    <div key={day} className="text-center font-semibold text-blue-600 py-2">
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
                            ? 'bg-blue-600 text-white font-bold ring-2 ring-blue-400'
                            : tasksForDay.length > 0
                            ? 'bg-gray-100 hover:bg-blue-600 hover:text-white'
                            : 'bg-gray-50 hover:bg-gray-200'
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
                  <h3 className="text-xl font-bold mb-4 text-gray-900">Tareas próximas</h3>
                  <div className="space-y-2">
                    {tasks
                      .filter(task => task.due_date)
                      .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
                      .slice(0, 5)
                      .map(task => (
                        <div key={task.id} className="bg-gray-50 p-4 rounded-lg flex justify-between items-center border border-gray-200">
                          <div>
                            <p className="font-semibold text-gray-900">{task.title}</p>
                            <p className="text-sm text-gray-600">
                              {new Date(task.due_date).toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                          <span className={`px-3 py-1 text-xs rounded-full ${
                            task.status === 'done' ? 'bg-green-100 text-green-700' :
                            task.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-700'
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