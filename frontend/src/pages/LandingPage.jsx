import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white text-gray-800">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-6 bg-white shadow-md">
        <h1 className="text-2xl font-bold text-blue-600">Gestor de tareas online</h1>
        <div className="flex gap-4">
          <Link 
            to="/login" 
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Iniciar sesión
          </Link>
          <Link 
            to="/register" 
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
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
            <h2 className="text-5xl font-bold leading-tight text-gray-900">
              Gestor de tareas online
            </h2>
            
            <div className="space-y-6 text-lg">
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-3"></div>
                <p className="text-gray-700">Organiza tus tareas</p>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-3"></div>
                <p className="text-gray-700">Recuerda tus fechas más importantes</p>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-3"></div>
                <p className="text-gray-700">Crea eventos periódicos</p>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-3"></div>
                <p className="text-gray-700">Comparte tus ideas con tus amigos</p>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-3"></div>
                <p className="text-gray-700">Optimiza tu tiempo y alcanza tus metas</p>
              </div>
            </div>

            <button 
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-bold text-lg shadow-lg hover:shadow-xl"
            >
              Haz click aquí para la versión de prueba
            </button>
          </div>

          {/* Right Column - Login Form */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
            <h3 className="text-3xl font-bold mb-6 text-center text-gray-900">Iniciar sesión</h3>
            <p className="text-gray-600 text-center mb-8">Gestor de tareas online</p>
            
            <form className="space-y-6" onSubmit={(e) => {
              e.preventDefault();
              navigate('/login');
            }}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  placeholder="Ingresa tu correo aquí"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <input
                  type="password"
                  placeholder="Ingresa tu contraseña aquí"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
                />
              </div>

              <button
                type="submit"
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold text-lg shadow-md"
              >
                Iniciar sesión
              </button>
            </form>

            <p className="text-center text-gray-600 mt-6">
              ¿No tienes una cuenta?{' '}
              <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
                Crea una cuenta aquí
              </Link>
            </p>
          </div>
        </div>

        {/* Sección de título para vista previa */}
        <div className="text-center mt-20 mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Ve una vista previa de la aplicación
          </h2>
          <p className="text-gray-600 text-lg">
            Descubre cómo puedes organizar tu tiempo con nuestro calendario interactivo
          </p>
          <div className="flex justify-center mt-6">
            <div className="w-24 h-1 bg-blue-600 rounded-full"></div>
          </div>
        </div>

        {/* Calendar Preview Section */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <button className="text-2xl text-blue-600 hover:text-blue-700 transition-colors">&larr;</button>
              <h3 className="text-3xl font-bold text-gray-900">Octubre 2025</h3>
              <button className="text-2xl text-blue-600 hover:text-blue-700 transition-colors">&rarr;</button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map(day => (
              <div key={day} className="text-center font-semibold text-blue-600 py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {[...Array(31)].map((_, i) => (
              <div
                key={i}
                className="aspect-square flex items-center justify-center bg-gray-100 hover:bg-blue-600 hover:text-white rounded-lg cursor-pointer transition-colors"
              >
                <span className="text-lg font-medium">{i + 1}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-4 gap-4 mt-8">
            {['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'].map(month => (
              <button
                key={month}
                className="py-3 bg-gray-100 hover:bg-blue-600 hover:text-white rounded-lg transition-colors font-semibold text-gray-700"
              >
                {month}
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-600 border-t border-gray-200 mt-16 bg-white">
        <p>&copy; 2025 Gestor de tareas online. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default LandingPage;