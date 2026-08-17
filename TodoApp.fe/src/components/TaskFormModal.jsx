import { useState, useEffect } from "react";
import { userApi } from "../api/taskApi";

export default function TaskFormModal({ initialData, onSave, onClose }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium",
    assignedTo: "",
  });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    userApi.getAll().then((res) => setUsers(res.data));
  }, []);

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title,
        description: initialData.description || "",
        dueDate: initialData.dueDate,
        priority: initialData.priority,
        assignedTo: initialData.assignedTo || "",
      });
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      title: form.title,
      description: form.description || null,
      dueDate: form.dueDate,
      priority: form.priority,
      assignedTo: form.assignedTo ? Number(form.assignedTo) : null,
    });
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h3>{initialData ? "Sửa Task" : "Thêm Task"}</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              placeholder="Tiêu đề"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              style={{ width: "100%", marginBottom: 8 }}
            />
          </div>
          <div>
            <textarea
              placeholder="Mô tả (không bắt buộc)"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              style={{ width: "100%", marginBottom: 8 }}
            />
          </div>
          <div>
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              required
              style={{ marginBottom: 8 }}
            />
          </div>
          <div>
            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
              style={{ marginBottom: 8 }}
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div>
            <select
              value={form.assignedTo}
              onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
              style={{ width: "100%", marginBottom: 8 }}
            >
              <option value="">-- Chưa giao ai --</option>
              {users.map((u) => (
                <option key={u.userId} value={u.userId}>
                  {u.username} ({u.role})
                </option>
              ))}
            </select>
          </div>
          <button type="submit">Lưu</button>
          <button type="button" onClick={onClose} style={{ marginLeft: 8 }}>
            Hủy
          </button>
        </form>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex", alignItems: "center", justifyContent: "center",
};

const modalStyle = {
  background: "white", padding: 24, borderRadius: 8, width: 360,
};