from sqlmodel import create_engine, SQLModel
import os
from dotenv import load_dotenv

# Cargar variables de entorno desde .env
load_dotenv()

# Configuración para PostgreSQL en AWS RDS
DB_USER = os.environ.get("DB_USER", "adminlab")
DB_PASSWORD = os.environ.get("DB_PASSWORD", "adminlab$$")
DB_HOST = os.environ.get("DB_HOST", "labprogradb.cj4ue0q8iae4.us-east-2.rds.amazonaws.com")
DB_PORT = os.environ.get("DB_PORT", "5432")
DB_NAME = os.environ.get("DB_NAME", "labprogradb")

# Construir la URL de conexión para PostgreSQL
DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# Crear el engine sin echo para producción (puedes activarlo con echo=True para debug)
engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)