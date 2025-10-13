import React, { useState, useEffect } from 'react';
import { createTask, getTags, createTag } from '../api/apiService';

const CreateTaskModal = ({ onClose, onTaskCreated }) => {
  const now = new Date();
  const [day, setDay] = useState(String(now.getDate()).padStart(2, '0'));
  const [month, setMonth] = useState(String(now.getMonth() + 1).padStart(2, '0'));
  const [year, setYear] = useState(String(now.getFullYear()));
  const [hour, setHour] = useState(String(now.getHours()).padStart(2, '0'));
  const [minute, setMinute] = useState(String(now.getMinutes()).padStart(2, '0'));

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [allTags, setAllTags] = useState([]);
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [error, setError] = useState('');

  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#2563eb'); // Azul por defecto
  const [isCreatingTag, setIsCreatingTag] = useState(false);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await getTags();
      setAllTags(response.data);
    } catch (err) {
      console.error("Error fetching tags:", err);
    }
  };

  const handleTagSelection = (tagId) => {
    if (selectedTagIds.includes(tagId)) {
      setSelectedTagIds(selectedTagIds.filter(id => id !== tagId));
    } else {
      setSelectedTagIds([...selectedTagIds, tagId]);
    }
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) {
      setError("El nombre de la etiqueta no puede estar vacío");
      return;
    }
    
    setIsCreatingTag(true);
    try {
      const response = await createTag({ name: newTagName.trim(), color: newTagColor });
      setAllTags([...allTags, response.data]);
      setNewTagName('');
      setNewTagColor('#2563eb');
      setError('');
    } catch (err) {
      console.error("Error creating tag:", err);
      setError("No se pudo crear la etiqueta (quizás ya existe).");
    } finally {
      setIsCreatingTag(false);
    }
  };

  const formatDateForDisplay = () => {
    try {
      const dateObj = new Date(year, month - 1, day, hour, minute);
      return dateObj.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '';
    }
  };

  const isValidDate = () => {
    const d = parseInt(day);
    const m = parseInt(month);
    const y = parseInt(year);
    
    if (d < 1 || d > 31 || m < 1 || m > 12 || y < 2000 || y > 2100) {
      return false;
    }
    
    const date = new Date(y, m - 1, d);
    return date.getDate() === d && date.getMonth() === m - 1 && date.getFullYear() === y;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('El título es obligatorio');
      return;
    }

    if (!isValidDate()) {
      setError('La fecha ingresada no es válida');
      return;
    }

    try {
      const dueDateTime = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hour),
        parseInt(minute)
      );

      const taskData = {
        title: title.trim(),
        description: description.trim() || null,
        tag_ids: selectedTagIds,
        due_date: dueDateTime.toISOString(),
        status: 'todo'
      };

      const response = await createTask(taskData);
      onTaskCreated(response.data);
      onClose();
    } catch (err) {
      setError('No se pudo crear la tarea.');
      console.error(err);
    }
  };

  const presetColors = [
    '#2563eb', // Blue
    '#7c3aed', // Purple
    '#db2777', // Pink
    '#dc2626', // Red
    '#ea580c', // Orange
    '#16a34a', // Green
    '#0891b2', // Cyan
    '#4f46e5', // Indigo
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">
            Crear Nueva Tarea
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-900 text-3xl font-bold transition-colors"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
              Título *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Ej: Completar proyecto de programación"
              className="w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
            />
          </div>

          {/* Descripción */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              placeholder="Añade más detalles sobre esta tarea..."
              className="w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 resize-none"
            />
          </div>

          {/* Fecha de vencimiento */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Fecha de vencimiento *
            </label>
            
            <div className="grid grid-cols-5 gap-2 mb-2">
              <input
                type="number"
                placeholder="DD"
                min="1"
                max="31"
                value={day}
                onChange={(e) => setDay(e.target.value.padStart(2, '0'))}
                required
                className="col-span-1 px-4 py-3 text-gray-900 text-center bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
              />
              
              <span className="flex items-center justify-center text-gray-400 text-xl">/</span>
              
              <input
                type="number"
                placeholder="MM"
                min="1"
                max="12"
                value={month}
                onChange={(e) => setMonth(e.target.value.padStart(2, '0'))}
                required
                className="col-span-1 px-4 py-3 text-gray-900 text-center bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
              />
              
              <span className="flex items-center justify-center text-gray-400 text-xl">/</span>
              
              <input
                type="number"
                placeholder="YYYY"
                min="2000"
                max="2100"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                required
                className="col-span-1 px-4 py-3 text-gray-900 text-center bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <input
                type="number"
                placeholder="HH"
                min="0"
                max="23"
                value={hour}
                onChange={(e) => setHour(e.target.value.padStart(2, '0'))}
                required
                className="px-4 py-3 text-gray-900 text-center bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
              />
              
              <span className="flex items-center justify-center text-gray-400 text-xl">:</span>
              
              <input
                type="number"
                placeholder="MM"
                min="0"
                max="59"
                value={minute}
                onChange={(e) => setMinute(e.target.value.padStart(2, '0'))}
                required
                className="px-4 py-3 text-gray-900 text-center bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
              />
            </div>

            {isValidDate() && (
              <p className="mt-2 text-sm text-blue-600">
                📅 {formatDateForDisplay()}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Formato: DD/MM/YYYY HH:MM (Por defecto: fecha y hora actual)
            </p>
          </div>

          {/* Etiquetas existentes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Etiquetas (opcional)
            </label>
            <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg border border-gray-300 min-h-[60px]">
              {allTags.length > 0 ? (
                allTags.map(tag => (
                  <button
                    type="button"
                    key={tag.id}
                    onClick={() => handleTagSelection(tag.id)}
                    className={`px-4 py-2 text-sm font-semibold rounded-full transition-all ${
                      selectedTagIds.includes(tag.id)
                        ? 'text-white shadow-lg scale-105'
                        : 'text-gray-700 bg-gray-200 hover:bg-gray-300'
                    }`}
                    style={{
                      backgroundColor: selectedTagIds.includes(tag.id) ? tag.color : undefined
                    }}
                  >
                    {tag.name}
                  </button>
                ))
              ) : (
                <p className="text-sm text-gray-400">No hay etiquetas. Créalas abajo.</p>
              )}
            </div>
          </div>

          {/* Crear nueva etiqueta */}
          <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              ✨ Crear Nueva Etiqueta
            </label>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {presetColors.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setNewTagColor(color)}
                  className={`w-10 h-10 rounded-full transition-all ${
                    newTagColor === color ? 'ring-4 ring-blue-400 scale-110' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
              <input
                type="color"
                value={newTagColor}
                onChange={(e) => setNewTagColor(e.target.value)}
                className="w-10 h-10 rounded-full cursor-pointer"
                title="Elige un color personalizado"
              />
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Nombre de la etiqueta..."
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleCreateTag();
                  }
                }}
                className="flex-grow px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              />
              <button
                type="button"
                onClick={handleCreateTag}
                disabled={isCreatingTag || !newTagName.trim()}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {isCreatingTag ? '...' : 'Añadir'}
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-all shadow-md hover:shadow-lg"
            >
              Crear Tarea
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;