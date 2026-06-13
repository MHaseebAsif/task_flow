import { useState, useEffect } from "react";
import { Plus, PencilLine, ChevronDown } from "lucide-react";
import { getTasks, createTask, updateTask, assignTask, updateTaskStatus } from "../../Helpers/taskApi";
import { getProjects } from "../../Helpers/projectApi";
import { getAllUsers } from "../../Helpers/companyApi";
import { useAuth } from "../../context/AuthContext";
import Modal from "../../Component/Modal";
import toast from "react-hot-toast";

const Tasks = () => {
  const { user } = useAuth();
  
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);
  
  const [filters, setFilters] = useState({ status: "", priority: "", assigned_to: "" });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  const [formData, setFormData] = useState({ title: "", description: "", project_id: "", priority: "medium", status: "todo" });

  const [activeAssignDropdown, setActiveAssignDropdown] = useState(null);
  const [activeStatusDropdown, setActiveStatusDropdown] = useState(null);

  const isAdminOrManager = user?.role === "admin" || user?.role === "manager";

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [tasksRes, projsRes, usersRes] = await Promise.all([
        getTasks(filters),
        getProjects(),
        getAllUsers()
      ]);
      setTasks(tasksRes.data);
      setProjects(projsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to load tasks");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  const handleOpenModal = (task = null) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        description: task.description || "",
        project_id: task.project_id || "",
        priority: task.priority,
        status: task.status,
      });
    } else {
      setEditingTask(null);
      setFormData({ title: "", description: "", project_id: projects.length > 0 ? projects[0].id : "", priority: "medium", status: "todo" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    setFormData({ title: "", description: "", project_id: "", priority: "medium", status: "todo" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await updateTask(editingTask.id, formData);
        toast.success("Task updated");
      } else {
        await createTask(formData);
        toast.success("Task created");
      }
      handleCloseModal();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to save task");
    }
  };

  const handleAssign = async (taskId, userId) => {
    try {
      await assignTask(taskId, userId);
      toast.success("Task assigned");
      setActiveAssignDropdown(null);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to assign task");
    }
  };

  const handleStatusUpdate = async (taskId, status) => {
    try {
      await updateTaskStatus(taskId, status);
      toast.success("Status updated");
      setActiveStatusDropdown(null);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to update status");
    }
  };

  const getProjectName = (id) => projects.find(p => p.id === id)?.name || "Unknown";
  const getUserName = (id) => users.find(u => u.id === id)?.full_name || users.find(u => u.id === id)?.name || "Unassigned";

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Tasks
          </h1>
          <p className="text-sm text-gray-400">
            Manage and track all tasks
          </p>
        </div>
        {isAdminOrManager && (
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Task
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-4 bg-surface border border-white/10 rounded-2xl p-4">
        <select
          value={filters.status}
          onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          className="bg-background border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
        >
          <option value="">All Status</option>
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        
        <select
          value={filters.priority}
          onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
          className="bg-background border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <select
          value={filters.assigned_to}
          onChange={(e) => setFilters(prev => ({ ...prev, assigned_to: e.target.value }))}
          className="bg-background border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
        >
          <option value="">All Assignees</option>
          {users.map(u => (
            <option key={u.id} value={u.id}>{u.full_name || u.name}</option>
          ))}
        </select>
      </div>

      <div className="bg-surface border border-white/10 rounded-2xl overflow-hidden shadow-xl min-h-[300px]">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="text-center py-12 text-gray-400 text-sm animate-pulse">Loading tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">No tasks found</div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white/5 text-gray-400 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 font-medium">Title</th>
                  <th className="px-6 py-4 font-medium">Project</th>
                  <th className="px-6 py-4 font-medium">Priority</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Assigned To</th>
                  {isAdminOrManager && <th className="px-6 py-4 font-medium text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-200">
                {tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-medium text-white max-w-[200px] truncate" title={task.title}>{task.title}</td>
                    <td className="px-6 py-4 truncate max-w-[150px]">{getProjectName(task.project_id)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider ${
                        task.priority === "high" ? "bg-red-500/10 text-red-500 border border-red-500/20" :
                        task.priority === "medium" ? "bg-orange-500/10 text-orange-500 border border-orange-500/20" :
                        "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                      }`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative inline-block">
                        <button
                          onClick={() => {
                            if (task.assigned_to === user.id) {
                              setActiveStatusDropdown(activeStatusDropdown === task.id ? null : task.id);
                              setActiveAssignDropdown(null);
                            }
                          }}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${
                            task.status === "done" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                            task.status === "in_progress" ? "bg-primary/10 text-primary border-primary/20" :
                            "bg-white/5 text-gray-300 border-white/10"
                          } ${(task.assigned_to === user.id) ? "cursor-pointer hover:bg-white/10" : "cursor-default"}`}
                        >
                          {task.status.replace("_", " ")}
                          {task.assigned_to === user.id && <ChevronDown className="w-3 h-3" />}
                        </button>
                        {activeStatusDropdown === task.id && (
                          <div className="absolute top-full left-0 mt-1 w-32 bg-surface border border-white/10 rounded-lg shadow-xl overflow-hidden z-20">
                            {["todo", "in_progress", "done"].map(s => (
                              <button key={s} onClick={() => handleStatusUpdate(task.id, s)} className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:bg-white/5 hover:text-white transition-colors uppercase">
                                {s.replace("_", " ")}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">{getUserName(task.assigned_to)}</td>
                    {isAdminOrManager && (
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <div className="relative">
                            <button
                              onClick={() => {
                                setActiveAssignDropdown(activeAssignDropdown === task.id ? null : task.id);
                                setActiveStatusDropdown(null);
                              }}
                              className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                            >
                              Assign
                            </button>
                            {activeAssignDropdown === task.id && (
                              <div className="absolute right-0 top-full mt-1 w-48 bg-surface border border-white/10 rounded-lg shadow-xl overflow-hidden z-20">
                                {users.map(u => (
                                  <button key={u.id} onClick={() => handleAssign(task.id, u.id)} className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                                    {u.full_name || u.name}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => handleOpenModal(task)}
                            className="text-gray-400 hover:text-white transition-colors"
                          >
                            <PencilLine className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTask ? "Edit Task" : "New Task"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Task Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors"
              placeholder="e.g. Implement authentication"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors resize-none"
              placeholder="Task details..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Project</label>
            <select
              required
              value={formData.project_id}
              onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
              className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors"
            >
              <option value="" disabled>Select a project</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              {editingTask ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Tasks;
