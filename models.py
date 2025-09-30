# backend/models.py
from typing import Optional, List
from sqlmodel import Field, SQLModel, Relationship
from datetime import datetime

class TaskTagLink(SQLModel, table=True):
    task_id: Optional[int] = Field(default=None, foreign_key="task.id", primary_key=True)
    tag_id: Optional[int] = Field(default=None, foreign_key="tag.id", primary_key=True)

class TagBase(SQLModel):
    name: str = Field(index=True, unique=True)
    color: str = Field(default="#cccccc")

class Tag(TagBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    tasks: List["Task"] = Relationship(back_populates="tags", link_model=TaskTagLink)

class TagCreate(TagBase):
    pass

class TagRead(TagBase):
    id: int

class TaskBase(SQLModel):
    title: str
    description: Optional[str] = None
    status: str = "todo"
    due_date: Optional[datetime] = None

class Task(TaskBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    owner_id: int = Field(foreign_key="user.id")
    owner: "User" = Relationship(back_populates="tasks")
    tags: List[Tag] = Relationship(back_populates="tasks", link_model=TaskTagLink)

class TaskCreate(TaskBase):
    tag_ids: List[int] = []

class TaskRead(TaskBase):
    id: int
    tags: List[TagRead] = []

class TaskUpdate(SQLModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    due_date: Optional[datetime] = None
    tag_ids: Optional[List[int]] = None

class UserBase(SQLModel):
    name: str
    email: str

class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    password_hash: str
    # CORRECCIÓN: "Task" debe estar entre comillas porque se define más abajo.
    tasks: List["Task"] = Relationship(back_populates="owner")

class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=72)

class UserRead(UserBase):
    id: int