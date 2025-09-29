# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware # Importa el middleware de CORS

app = FastAPI()

# Configuración de CORS
# Esto permite que tu frontend (que se ejecuta en otro puerto)
# pueda hacerle peticiones a tu backend.
origins = [
    "http://localhost:5173", # La dirección de tu frontend con Vite
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Permite todos los métodos (GET, POST, etc.)
    allow_headers=["*"], # Permite todas las cabeceras
)

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/api/data")
def get_data():
    # Aquí podrías consultar una base de datos, por ejemplo
    return {"message": "¡Hola desde el backend de FastAPI!"}
