import React, { useState, useEffect } from "react";
import './App.css'

// modal component add/edit/delete task
const TaskModal = ({isOpen, onClose, onSave, initialTaskTitle, confirmDelete}) => {
  const [taskTitle, setTaskTitle] = useState(initialTaskTitle || "")
  
  // reset form
  useEffect(() => {
    setTaskTitle(initialTaskTitle || "");
  }, [isOpen, initialTaskTitle]);

  const handleBtnSave = () => {
    if (taskTitle.trim() !== "") {
      onSave(taskTitle);
      setTaskTitle("");
    }
  }

  return isOpen ? (
    <div className="modal-overlay">
      <div className="modal-content">
        {confirmDelete ? (
          <>
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this task?</p>
            <div className="box-modal-action">
              <button onClick={onClose} className="btn-cancel">Cancel</button>
              <button onClick={() => onSave()} className="btn-delete">Delete</button>
            </div>
          </>
        ) : (
          <>
            <h2>{initialTaskTitle ? "Edit Task" : "Add New Task"}</h2>
            <div className="box-modal-content">
              <input 
                type="text"
                value={taskTitle}
                onChange={(event) => setTaskTitle(event.target.value)}
                placeholder="Enter your task title"
              />
            </div>
            <div className="box-modal-action">
              <button onClick={onClose} className="btn-cancel">Cancel</button>
              <button onClick={handleBtnSave}>Save</button>
            </div>
          </>
        )}
      </div>
    </div>
  ) : null ;
};

// task component to display
const TaskList = ({ taskItem, onDelete, onEdit, onToggleComplete}) => {
  return (
    <>
    <div className={`task-list-card ${taskItem.completed ? "completed" : ""}`}>
      <div className="task-list-card-content">
        <input 
          type="checkBox"
          checked={taskItem.completed}
          onChange={() => onToggleComplete(taskItem.id)}
          className="check-box"
        />
        <div>
          <p className="task-list-card-title">{taskItem.title}</p>
          <span className="task-list-card-timestamp">{taskItem.createdAt}</span> 
        </div>
      </div>
      <div className="task-list-card-action">
        <button onClick={() => onDelete(taskItem.id)} className="btn-action">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#4b4453" width={16}>
            <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
          </svg>
        </button>
        <button onClick={() => onEdit(taskItem.id)} className="btn-action">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#4b4453" width={16}>
            <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
          </svg>
        </button>
      </div>
    </div>
    </>
  );
};

// main todo app component
const TodoApp = () => {
  const [taskLists, setTaskLists] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const [filter, setFilter] = useState("all");

  // open add new task modal
  const openAddNewModal = () => {
    setIsModalOpen(true);
  }

  const formatDateTime = (date) => {
    const time = new Date(date).toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  
    const datePart = new Date(date).toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  
    return `${time}, ${datePart}`;
  };

  // save btn from modal
  const handelBtnAddNewTask = (title) => {
    const newTaskObj = {
      id: Date.now(),
      title: title.trim(),
      completed: false,
      createdAt: formatDateTime(new Date()),
    }
    setTaskLists([...taskLists, newTaskObj]);
    setIsModalOpen(false);
  }

  // open edit task modal
  const openEditModal = (taskId) => {
    setEditingTaskId(taskId);
    setIsEditTaskModalOpen(true);
  }

  // handle editing task
  const handleEditTask = (newTitle) => {
    setTaskLists(
      taskLists.map((task) => 
        task.id === editingTaskId ? {...task, title: newTitle} : task
      )
    );
    setIsEditTaskModalOpen(false);
  }

  // open delete task modal
  const openConfirmDeleteModal = (taskId) => {
    setDeletingTaskId(taskId);
    setIsConfirmDeleteOpen(true);
  }

  // handle del task
  const handleDeleteTask = () => {
    setTaskLists(taskLists.filter((task) => task.id !== deletingTaskId));
    setIsConfirmDeleteOpen(false);
  }

  // change completed status
  const handleToggleComplete = (taskId) => {
    setTaskLists(
      taskLists.map((task) => 
        task.id === taskId ? {...task, completed: !task.completed} : task 
      )
    );
  }

  // filter task status
  const filteredTasks = taskLists.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "incomplete") return !task.completed;
    return true
  });

  return (
    <>
    <div className="todo-app">
      <h1 className="title">TODO LIST</h1>
      <div className="container">
        <div className="container-action">
          {/* open modal add new task */}
          <button onClick={openAddNewModal}>Add Task</button>

          {/* dropdown filter */}
          <select value={filter} onChange={(event) => setFilter(event.target.value)}>
            <option value="all">All</option>
            <option value="completed">completed</option>
            <option value="incomplete">Incomplete</option>
          </select>
        </div>

        {/* task list */}
        {filteredTasks.length === 0 ? (
          <>
          <p>No tasks available.</p>
          </>
        ) : (
          <div className="box-card-container">
            {filteredTasks.map((task) => (
              <div key={task.id}>
                <TaskList 
                  taskItem={task}
                  onDelete={openConfirmDeleteModal}
                  onEdit={openEditModal}
                  onToggleComplete={handleToggleComplete}
                />
              </div>
            ))}
          </div>
        )}

        {/* add new task modal */}
        <TaskModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handelBtnAddNewTask}
        />

        {/* edit task modal */}
        <TaskModal 
          isOpen={isEditTaskModalOpen}
          onClose={() => setIsEditTaskModalOpen(false)}
          onSave={handleEditTask}
          initialTaskTitle={taskLists.find((task) => task.id === editingTaskId)?.title}
        />

        {/* confirm delete modal */}
        <TaskModal 
          isOpen={isConfirmDeleteOpen}
          onClose={() => setIsConfirmDeleteOpen(false)}
          onSave={handleDeleteTask}
          confirmDelete={true}
        />

      </div>
      
    </div>
    </>
  );
};

export default TodoApp;