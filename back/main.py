from typing import Annotated, Union
import uuid
import itertools
from uuid import UUID
from pydantic import BaseModel
from typing import List
from typing import Optional

from fastapi import HTTPException, status, Depends, FastAPI # type: ignore
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm # type: ignore
from fastapi.security import OAuth2PasswordBearer # type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore



app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setting token parameters for auth
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# generate incremental id's to the todo and item obj(emulating a database)
todo_id_generator = itertools.count(start=1)
item_id_generator = itertools.count(start=1)

class Item(BaseModel):
    id: Optional[int] = None
    description: str

# ToDo has a list of Item's 
class ToDo(BaseModel):
    id:Optional[int] = None
    name: str
    items:Optional[List[Item]] = []

# User has a list of ToDo's id's created by him, used to search and filter his ToDo's
class User(BaseModel):
    id:Optional[UUID] = None
    username:str
    password:str
    todos:Optional[List[int]] = []


# mock user for accessing the app, use the password '123456'
mock_user = User(
        id=uuid.uuid4(),
        username='user1',
        password='fakehash123456',
        todos=[]
        )

# list of Users (database mock)
users = [mock_user]
# list of ToDo's (database mock)
todos:List[ToDo] = []

# Mocking encripting password
def fake_hash(password:str):
    return 'fakehash' + password

# Mocking decode of JWT and user data present in the access-token
def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    return next((item for item in users if item.id == uuid.UUID(token)),None)

# Route to login and get access-token
# The response will be an object with access-token and user info, moking JWT.
@app.post("/token")
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    user = next((item for item in users if item.username == form_data.username),None)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    
    hashed_password = fake_hash(form_data.password)
    if not hashed_password == user.password:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    
    return {"user_id":user.id, "access_token": user.id, "token_type": "bearer"}

# Route for the home page that returns a welcome message.
@app.get('/')
def welcome():
    return {"message": "Hello world"}

# Route to get all todos for the user.
# The "response_model" parameter specifies that the response will be a list of ToDo objects.
@app.get("/userTodos/{user_id}", response_model=List[ToDo])
async def read_user_todos(user_id:UUID ,token: Annotated[str, Depends(oauth2_scheme)]):
    user = next((item for item in users if item.id == user_id),None)
    if not user:
        return []
    filtered_todos = [item for item in todos if item.id in user.todos]
    return filtered_todos

# Route to get all todos stored in the list.
# The "response_model" parameter specifies that the response will be a list of ToDo objects.
@app.get("/todo", response_model=List[ToDo])
async def read_todos(token: Annotated[str, Depends(oauth2_scheme)]):
    return todos

# Route to create a new todo.
# The "response_model" parameter specifies that the response will be a ToDo object.
@app.post("/todo", response_model=ToDo)
async def create_todo(todo: ToDo,current_user: Annotated[User, Depends(get_current_user)]):
    if not current_user:
        return []
    new_todo = ToDo(id=next(todo_id_generator),name=todo.name)
    todos.append(new_todo)
    current_user.todos.append(new_todo.id)
    return new_todo

# Route to update an existing todo by its ID.
# The response will be a message object.
@app.put("/todo/{todo_id}")
async def update_todo(todo_id: int, todo: ToDo,current_user: Annotated[User, Depends(get_current_user)]):
    old_todo = next((item for item in todos if item.id == todo_id),None)
    if not old_todo:
        return todos
    index = todos.index(old_todo)
    todos[index] = todo
    return {"message": "Item Updated"}

# Route to delete an todo by its ID.
# The response will be a message object.
@app.delete("/todo/{todo_id}")
async def delete_todo(todo_id: int,current_user: Annotated[User, Depends(get_current_user)]):
    try:
        item_to_remove = next((item for item in todos if item.id == todo_id),None)
        current_user.todos.remove(item_to_remove.id)
        todos.remove(item_to_remove)
        print(current_user)
    except StopIteration:
        print(f"Item with ID {todo_id} not found.")

    return {"message": "Item deleted"}

# Route to create a new todo item.
# The "response_model" parameter specifies that the response will be a Item object.
@app.post("/todoItem/{todo_id}", response_model=Item)
async def add_todo_item(todo_id: int,item:Item,current_user: Annotated[User, Depends(get_current_user)]):
    new_item = Item(id=next(item_id_generator),description=item.description)
    # Adds the todo to the list.
    for x in todos:
        if x.id == todo_id:
            x.items.append(new_item)
            break 
    return new_item

# Route to update an existing todo item by its ID.
# The response will be a message object.
@app.put("/todoItem/{todo_id}/{item_id}")
async def update_todo_item(todo_id: int,item_id:int, item:Item,current_user: Annotated[User, Depends(get_current_user)]):
    try:
        todo = next((item for item in todos if item.id == todo_id),None)
        item_to_update = next((item for item in todo.items if item.id == item_id),None)

        index = todo.items.index(item_to_update)
        todo.items[index] = item
    except StopIteration:
        print(f"Item with ID {item_id} not found.")

    return {"message": "Item Updated"}

# Route to delete an todo item by its ID.
# The response will be a message object
@app.delete("/todoItem/{todo_id}/{item_id}")
async def delete_todo_item(todo_id: int,item_id:int,current_user: Annotated[User, Depends(get_current_user)]):
     # Deletes the ToDo item from the list.
    try:
        todo = next((item for item in todos if item.id == todo_id),None)
        item_to_remove = next((item for item in todo.items if item.id == item_id),None)
        todo.items.remove(item_to_remove)
    except StopIteration:
        print(f"Item with ID {item_id} not found.")

    return {"message": "Item deleted"}
