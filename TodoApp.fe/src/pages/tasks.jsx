import { useState, useEffect, useMemo } from "react";
import { taskApi } from "../api/taskApi";
import { useAuth } from "../context/AuthContext";
import TaskFormModal from "../components/TaskFormModal";
import "./Tasks.css";

const TABS = ["Today", "Pending", "Overdue"];

export default function Tasks() {
    const { user, logout } = useAuth();
    const isAdmin = user?.role === "Admin";

    const [tasks, setTasks] = useState([]);
    const [activeTab, setActiveTab] = useState("Today");
    const [showCompleted, setShowCompleted] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadTasks = async () => {
        setLoading(true);
        try {
            const res = await taskApi.getAll();
            setTasks(res.data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTasks();
    }, []);

    const activeTasks = useMemo(
        () => tasks.filter((t) => t.status === activeTab),
        [tasks, activeTab]
    );

    const completedTasks = useMemo(
        () => tasks.filter((t) => t.status === "Completed"),
        [tasks]
    );

    const handleToggle = async (taskId) => {
        await taskApi.toggleComplete(taskId);
        loadTasks();
    };

    const handleDelete = async (taskId) => {
        if (!confirm("Xóa task này?")) return;
        await taskApi.remove(taskId);
        loadTasks();
    };

    const handleSave = async (data) => {
        if (editingTask) {
            await taskApi.update(editingTask.taskId, data);
        } else {
            await taskApi.create(data);
        }
        setModalOpen(false);
        setEditingTask(null);
        loadTasks();
    };

    const openCreate = () => {
        setEditingTask(null);
        setModalOpen(true);
    };

    const openEdit = (task) => {
        setEditingTask(task);
        setModalOpen(true);
    };

    if (loading) return <p style={{ textAlign: "center", marginTop: 60 }}>Đang tải...</p>;

    return (
        <div className="page">
            <div className="banner">
                <h1>Todo App</h1>
            </div>

            <div className="topbar">
                <div />
                <button className="logout-btn" onClick={logout}>
                    {user.username} · Đăng xuất
                </button>
            </div>

            <div className="tabs">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        className={`tab ${activeTab === tab ? "active" : ""}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="tasks-header">
                <h2>Tasks</h2>
                {isAdmin && (
                    <button className="add-task-btn" onClick={openCreate}>
                        + Add Task
                    </button>
                )}
            </div>

            {activeTasks.length === 0 && <p className="empty-state">Không có task nào.</p>}

            <div className="task-list">
                {activeTasks.map((task) => (
                    <div className="task-row" key={task.taskId}>
                        <div className="task-left">
                            <input
                                type="checkbox"
                                className="task-checkbox"
                                checked={task.isCompleted}
                                onChange={() => handleToggle(task.taskId)}
                            />
                            <div>
                                <div className="task-title">{task.title}</div>
                                {task.assignedToUsername && (
                                    <div className="task-assignee">Giao cho: {task.assignedToUsername}</div>
                                )}
                            </div>
                        </div>

                        <div className="task-right">
                            <span className="task-date">{task.dueDate}</span>
                            {isAdmin && (
                                <>
                                    <button className="icon-btn" onClick={() => openEdit(task)}>✏️</button>
                                    <button className="icon-btn" onClick={() => handleDelete(task.taskId)}>🗑️</button>
                                </>
                            )}
                            <span className={`leaf ${task.priority}`} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="completed-section">
                <h3 className="completed-toggle" onClick={() => setShowCompleted(!showCompleted)}>
                    Completed {showCompleted ? "▲" : "▼"} ({completedTasks.length})
                </h3>
                {showCompleted &&
                    completedTasks.map((task) => (
                        <div className="completed-row" key={task.taskId}>
                            <input
                                type="checkbox"
                                checked={task.isCompleted}
                                onChange={() => handleToggle(task.taskId)}
                            />
                            <span>{task.title}</span>
                        </div>
                    ))}
            </div>

            {modalOpen && (
                <TaskFormModal
                    initialData={editingTask}
                    onSave={handleSave}
                    onClose={() => {
                        setModalOpen(false);
                        setEditingTask(null);
                    }}
                />
            )}
        </div>
    );
}