import { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

const PRIORITIES = ['low', 'medium', 'high'];
const STATUSES = ['todo', 'in-progress', 'done'];

const priorityColors = { low: '#10b981', medium: '#f59e0b', high: '#ef4444' };
const statusLabels = { 'todo': 'To Do', 'in-progress': 'In Progress', 'done': 'Done' };

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium' });
  const [submitting, setSubmitting] = useState(false);

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/tasks');
      setTasks(data);
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const openCreate = () => {
    setEditTask(null);
    setForm({ title: '', description: '', priority: 'medium' });
    setShowModal(true);
  };

  const openEdit = (task) => {
    setEditTask(task);
    setForm({ title: task.title, description: task.description, priority: task.priority });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Title is required');
    setSubmitting(true);
    try {
      if (editTask) {
        const { data } = await api.put(`/tasks/${editTask._id}`, form);
        setTasks(tasks.map((t) => (t._id === data._id ? data : t)));
        toast.success('Task updated!');
      } else {
        const { data } = await api.post('/tasks', form);
        setTasks([data, ...tasks]);
        toast.success('Task created!');
      }
      setShowModal(false);
    } catch {
      toast.error('Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (task, status) => {
    try {
      const { data } = await api.put(`/tasks/${task._id}`, { status });
      setTasks(tasks.map((t) => (t._id === data._id ? data : t)));
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter((t) => t._id !== id));
      toast.success('Task deleted');
    } catch {
      toast.error('Failed to delete task');
    }
  };

  const filtered = filter === 'all' ? tasks : tasks.filter((t) => t.status === filter);

  const stats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === 'todo').length,
    inProgress: tasks.filter((t) => t.status === 'in-progress').length,
    done: tasks.filter((t) => t.status === 'done').length,
  };

  return (
    <div className="app">
      <Navbar />
      <main className="dashboard">
        {/* Stats */}
        <div className="stats-grid">
          {[
            { label: 'Total Tasks', value: stats.total, color: '#6366f1' },
            { label: 'To Do', value: stats.todo, color: '#f59e0b' },
            { label: 'In Progress', value: stats.inProgress, color: '#3b82f6' },
            { label: 'Done', value: stats.done, color: '#10b981' },
          ].map((s) => (
            <div key={s.label} className="stat-card" style={{ borderTopColor: s.color }}>
              <p className="stat-value" style={{ color: s.color }}>{s.value}</p>
              <p className="stat-label">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="section-header">
          <div className="filter-tabs">
            {['all', ...STATUSES].map((f) => (
              <button
                key={f}
                className={`filter-tab ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? 'All' : statusLabels[f]}
              </button>
            ))}
          </div>
          <button className="btn btn-primary" onClick={openCreate}>
            + New Task
          </button>
        </div>

        {/* Task List */}
        {loading ? (
          <div className="empty-state"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <p>🎯</p>
            <p>{filter === 'all' ? 'No tasks yet. Create your first one!' : `No ${statusLabels[filter] || filter} tasks.`}</p>
          </div>
        ) : (
          <div className="task-grid">
            {filtered.map((task) => (
              <div key={task._id} className="task-card">
                <div className="task-card-header">
                  <span
                    className="priority-badge"
                    style={{ background: priorityColors[task.priority] + '20', color: priorityColors[task.priority] }}
                  >
                    {task.priority}
                  </span>
                  <div className="task-actions">
                    <button onClick={() => openEdit(task)} title="Edit">✏️</button>
                    <button onClick={() => handleDelete(task._id)} title="Delete">🗑️</button>
                  </div>
                </div>
                <h3 className="task-title">{task.title}</h3>
                {task.description && <p className="task-desc">{task.description}</p>}
                <div className="task-card-footer">
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task, e.target.value)}
                    className={`status-select status-${task.status}`}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{statusLabels[s]}</option>
                    ))}
                  </select>
                  <span className="task-date">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editTask ? 'Edit Task' : 'New Task'}</h2>
              <button onClick={() => setShowModal(false)} className="modal-close">×</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  placeholder="Task title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  placeholder="Optional description..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                >
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : editTask ? 'Update Task' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
