# backend/main.py
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm # <--- IMPORTACIÓN AÑADIDA
from sqlmodel import Session, select
from typing import List
from jose import JWTError, jwt # <--- IMPORTACIÓN AÑADIDA

# Importa modelos, funciones y la base de datos
from database import engine, create_db_and_tables
from models import User, UserCreate, UserRead, Task, TaskCreate, TaskRead, TaskUpdate
from auth import get_password_hash, verify_password, create_access_token, oauth2_scheme, SECRET_KEY, ALGORITHM
from models import Tag, TagCreate, TagRead, TaskTagLink
app = FastAPI()

# --- Configuración de CORS ---
origins = [
    "http://localhost:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

def get_session():
    with Session(engine) as session:
        yield session

# --- Dependencia para obtener el usuario actual ---
def get_current_user(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = session.exec(select(User).where(User.email == email)).first()
    if user is None:
        raise credentials_exception
    return user

# --- Endpoints de Autenticación ---
@app.post("/api/auth/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def register_user(user_in: UserCreate, session: Session = Depends(get_session)):
    db_user = session.exec(select(User).where(User.email == user_in.email)).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user_in.password)
    new_user = User(name=user_in.name, email=user_in.email, password_hash=hashed_password)
    
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    return new_user

@app.post("/api/auth/login")
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == form_data.username)).first()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

# --- Endpoints de Tareas ---
# (El resto del código de Tareas permanece igual)
@app.post("/api/tasks", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
def create_task(task_in: TaskCreate, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    # Creamos la tarea sin las etiquetas primero
    task_data = task_in.dict(exclude={"tag_ids"})
    new_task = Task.from_orm(task_data, update={'owner_id': current_user.id})
    
    # Buscamos las etiquetas existentes y las añadimos a la tarea
    if task_in.tag_ids:
        tags = session.exec(select(Tag).where(Tag.id.in_(task_in.tag_ids))).all()
        new_task.tags = tags

    session.add(new_task)
    session.commit()
    session.refresh(new_task)
    return new_task

@app.get("/api/tasks", response_model=List[TaskRead])
def read_tasks(current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    tasks = session.exec(select(Task).where(Task.owner_id == current_user.id)).all()
    return tasks

@app.put("/api/tasks/{task_id}", response_model=TaskRead)
def update_task(task_id: int, task_update: TaskUpdate, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    db_task = session.get(Task, task_id)
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    if db_task.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this task")
    
    task_data = task_update.dict(exclude_unset=True)
    for key, value in task_data.items():
        setattr(db_task, key, value)
    
    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task

@app.get("/api/users/me", response_model=UserRead)
def read_users_me(current_user: User = Depends(get_current_user)):
    """
    Obtiene el usuario actualmente autenticado.
    """
    return current_user

@app.delete("/api/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    db_task = session.get(Task, task_id)
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    if db_task.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this task")
        
    session.delete(db_task)
    session.commit()
    return {"ok": True}

# --- AÑADIR: Endpoints de Etiquetas (Tags) ---
@app.post("/api/tags", response_model=TagRead, status_code=status.HTTP_201_CREATED)
def create_tag(tag_in: TagCreate, session: Session = Depends(get_session)):
    new_tag = Tag.from_orm(tag_in)
    session.add(new_tag)
    session.commit()
    session.refresh(new_tag)
    return new_tag

@app.get("/api/tags", response_model=List[TagRead])
def read_tags(session: Session = Depends(get_session)):
    tags = session.exec(select(Tag)).all()
    return tags