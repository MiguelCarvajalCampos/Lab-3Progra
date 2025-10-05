import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900 text-white">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-6 bg-black bg-opacity-30">
        <h1 className="text-2xl font-bold">Gestor de tareas online</h1>
        <div className="flex gap-4">
          <Link 
            to="/login" 
            className="px-6 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
          >
            Iniciar sesión
          </Link>
          <Link 
            to="/register" 
            className="px-6 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors font-semibold"
          >
            Crear una cuenta
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Features */}
          <div className="space-y-8">
            <h2 className="text-5xl font-bold leading-tight">
              Gestor de tareas online
            </h2>
            
            <div className="space-y-6 text-lg">
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mt-3"></div>
                <p className="text-gray-200">Organiza tus tareas</p>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mt-3"></div>
                <p className="text-gray-200">Recuerda tus fechas más importantes</p>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mt-3"></div>
                <p className="text-gray-200">Crea eventos periódicos</p>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mt-3"></div>
                <p className="text-gray-200">Comparte tus ideas con tus amigos</p>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mt-3"></div>
                <p className="text-gray-200">Optimiza tu tiempo y alcanza tus metas</p>
              </div>
            </div>

            <button 
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-bold text-lg shadow-lg hover:shadow-indigo-500/50"
            >
              Haz click aquí para la versión de prueba
            </button>
          </div>

          {/* Right Column - Login Form */}
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-700">
            <h3 className="text-3xl font-bold mb-6 text-center">Iniciar sesión</h3>
            <p className="text-gray-400 text-center mb-8">Gestor de tareas online</p>
            
            <form className="space-y-6" onSubmit={(e) => {
              e.preventDefault();
              navigate('/login');
            }}>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  placeholder="Ingresa tu correo aquí"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Contraseña
                </label>
                <input
                  type="password"
                  placeholder="Ingresa tu contraseña aquí"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-500"
                />
              </div>

              <button
                type="submit"
                className="w-full px-4 py-3 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors font-bold text-lg"
              >
                Iniciar sesión
              </button>
            </form>

            <p className="text-center text-gray-400 mt-6">
              ¿No tienes una cuenta?{' '}
              <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold">
                Crea una cuenta aquí
              </Link>
            </p>
          </div>
        </div>

        {/* Calendar Preview Section */}
        <div className="mt-20 bg-gray-800 bg-opacity-50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <button className="text-2xl hover:text-indigo-400 transition-colors">&larr;</button>
              <h3 className="text-3xl font-bold">Octubre 2025</h3>
              <button className="text-2xl hover:text-indigo-400 transition-colors">&rarr;</button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map(day => (
              <div key={day} className="text-center font-semibold text-indigo-400 py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {[...Array(31)].map((_, i) => (
              <div
                key={i}
                className="aspect-square flex items-center justify-center bg-gray-700 hover:bg-indigo-600 rounded-lg cursor-pointer transition-colors"
              >
                <span className="text-lg">{i + 1}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-4 gap-4 mt-8">
            {['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'].map(month => (
              <button
                key={month}
                className="py-3 bg-gray-700 hover:bg-indigo-600 rounded-lg transition-colors font-semibold"
              >
                {month}
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-400 border-t border-gray-800 mt-16">
        <p>&copy; 2025 Gestor de tareas online. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default LandingPage;