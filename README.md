# Lab-3Progra

Aplicación web de gestión de tareas con autenticación de usuarios, desarrollada con FastAPI (backend) y React + Vite (frontend).

## Características

- Autenticación de usuarios (registro y login)
- Gestión de tareas (CRUD completo)
- Sistema de etiquetas para organizar tareas
- Interfaz con React y Tailwind CSS
- API RESTful con FastAPI
- Base de datos SQLite con SQLModel

## Tecnologías

### Backend
- **FastAPI**: Framework web moderno y rápido
- **SQLModel**: ORM basado en Pydantic y SQLAlchemy
- **SQLite**: Base de datos ligera
- **JWT**: Autenticación basada en tokens
- **Bcrypt**: Hash de contraseñas

### Frontend
- **React**: Biblioteca de UI
- **Vite**: Build tool rápido
- **Tailwind CSS**: Framework CSS utility-first
- **Axios**: Cliente HTTP
- **React Router**: Navegación

## Instalación

### Prerrequisitos

- **Python**
- **Node.js** y **npm**
- **Git**

### 1️Clonar el Repositorio

```bash
git clone https://github.com/MiguelCarvajalCampos/Lab-3Progra.git
cd Lab-3Progra
```

### Configurar el Backend

#### Crear un Entorno Virtual

Es recomendable usar un entorno virtual de Python para aislar las dependencias del proyecto:

**En Linux:**
```bash
cd backend
python -m venv venv
source venv/bin/activate
```

#### Instalar Dependencias del Backend

Con el entorno virtual activado:

```bash
pip install -r requirements.txt
```

#### Variables de Entorno (Opcional)

El backend usa valores por defecto para la clave secreta JWT. Para producción, deberías configurar variables de entorno personalizadas.

Crea un archivo `.env` en la carpeta `backend/` (opcional):

```env
SECRET_KEY=tu-clave-secreta-super-segura-aqui
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

#### Iniciar el Backend

Desde la carpeta `backend/` con el entorno virtual activo:

```bash
uvicorn main:app --reload
```
En aws
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

El servidor estará disponible en: **http://localhost:8000**

### 3️Configurar el Frontend

#### Instalar Dependencias del Frontend

Abre una **nueva terminal** y navega a la carpeta del frontend:

```bash
cd frontend
npm install
```

#### Iniciar el Frontend

```bash
npm run dev
```

La aplicación estará disponible en: **http://localhost:5173**

## Uso

1. **Inicia el backend** (en una terminal):
   ```bash
   cd backend
   source venv/bin/activate  # En Windows: venv\Scripts\activate
   uvicorn main:app --reload
   ```

2. **Inicia el frontend** (en otra terminal):
   ```bash
   cd frontend
   npm run dev
   ```
   En aws
   ```bash
   npm run dev -- --host
   ```

4. Abre tu navegador en **http://localhost:5173**

5. Registra un nuevo usuario y comienza a gestionar tus tareas

## Estructura del Proyecto

```
Lab-3Progra/
├── backend/
│   ├── main.py           # Punto de entrada de la API
│   ├── database.py       # Configuración de la base de datos
│   ├── models.py         # Modelos de datos (User, Task, Tag)
│   ├── auth.py           # Lógica de autenticación JWT
│   ├── requirements.txt  # Dependencias de Python
│   └── tasks.db          # Base de datos SQLite (se genera automáticamente)
│
└── frontend/
    ├── src/
    │   ├── pages/         # Páginas de la aplicación
    │   ├── components/    # Componentes reutilizables
    │   ├── context/       # Context API (AuthContext)
    │   ├── api/           # Servicios de API
    │   └── App.jsx        # Componente principal
    ├── package.json       # Dependencias de Node.js
    └── vite.config.js     # Configuración de Vite
```

## Scripts Disponibles

### Backend
```bash
# Iniciar servidor de desarrollo
uvicorn main:app --reload

# Iniciar servidor de producción
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Frontend
```bash
# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Previsualizar build de producción
npm run preview

# Ejecutar linter
npm run lint
```

## API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/users/me` - Obtener usuario actual

### Tareas
- `GET /api/tasks` - Obtener todas las tareas del usuario
- `POST /api/tasks` - Crear nueva tarea
- `PUT /api/tasks/{task_id}` - Actualizar tarea
- `DELETE /api/tasks/{task_id}` - Eliminar tarea

### Etiquetas
- `GET /api/tags` - Obtener todas las etiquetas
- `POST /api/tags` - Crear nueva etiqueta

## Solución de Problemas

### El backend no inicia

- Verifica que el entorno virtual esté activado: `source venv/bin/activate`
- Asegúrate de haber instalado todas las dependencias: `pip install -r requirements.txt`
- Verifica que el puerto 8000 no esté en uso

### El frontend no conecta con el backend

- Verifica que el backend esté corriendo en `http://localhost:8000`
- Revisa la configuración de CORS en [backend/main.py](backend/main.py) (líneas 17-26)
- Verifica la URL base de la API en [frontend/src/api/apiService.js](frontend/src/api/apiService.js)

### Errores de autenticación

- Elimina el archivo `tasks.db` y reinicia el backend para recrear la base de datos
- Limpia el localStorage del navegador
- Verifica que el token JWT sea válido

## Desactivar el Entorno Virtual

Cuando termines de trabajar, puedes desactivar el entorno virtual de Python:

```bash
deactivate
```

## Contribuciones

Las contribuciones son bienvenidas. Por favor, crea un fork del repositorio y envía un pull request.

## Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.
