import { useState, useEffect, useMemo, useRef } from "react";
import { Plus, PencilLine, ChevronDown } from "lucide-react";
import { getTasks, createTask, updateTask, assignTask, updateTaskStatus } from "../../Helpers/taskApi";
import { getProjects } from "../../Helpers/projectApi";
import { getAllUsers } from "../../Helpers/companyApi";
import { useAuth } from "../../context/AuthContext";
import Modal from "../../Component/Modal";
import DataTable from "../../Component/DataTable";
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
  const [assignDropdownCoords, setAssignDropdownCoords] = useState(null);
  const assignDropdownRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (assignDropdownRef.current && !assignDropdownRef.current.contains(e.target)) {
        setActiveAssignDropdown(null);
        setAssignDropdownCoords(null);
      }
    };
    if (activeAssignDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeAssignDropdown]);

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
      setAssignDropdownCoords(null);
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

  const columns = useMemo(() => {
    const cols = [
      {
        accessorKey: "title",
        header: "Title",
        cell: (info) => (
          <div className="flex justify-center">
            <div className="max-w-[200px] truncate text-center" title={info.getValue()}>
              {info.getValue()}
            </div>
          </div>
        )
      },
      {
        id: "project",
        accessorFn: (row) => getProjectName(row.project_id),
        header: "Project",
        cell: (info) => (
          <div className="flex justify-center">
            <div className="truncate max-w-[150px] text-center">{info.getValue()}</div>
          </div>
        )
      },
      {
        accessorKey: "priority",
        header: "Priority",
        cell: (info) => {
          const priority = info.getValue();
          return (
            <div className="flex justify-center">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider ${
                priority === "high" ? "bg-red-500/10 text-red-500 border border-red-500/20" :
                priority === "medium" ? "bg-orange-500/10 text-orange-500 border border-orange-500/20" :
                "bg-blue-500/10 text-blue-500 border border-blue-500/20"
              }`}>
                {priority}
              </span>
            </div>
          );
        }
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const task = row.original;
          return (
            <div className="flex justify-center">
              <div className="relative inline-block text-left">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (task.assigned_to === user.id) {
                      setActiveStatusDropdown(activeStatusDropdown === task.id ? null : task.id);
                      setActiveAssignDropdown(null);
                      setAssignDropdownCoords(null);
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
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-32 bg-surface border border-white/10 rounded-lg shadow-xl overflow-hidden z-20">
                    {["todo", "in_progress", "done"].map(s => (
                      <button key={s} onClick={(e) => { e.stopPropagation(); handleStatusUpdate(task.id, s); }} className="w-full text-center px-3 py-2 text-xs text-gray-300 hover:bg-white/5 hover:text-white transition-colors uppercase">
                        {s.replace("_", " ")}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        }
      },
      {
        id: "assigned_to",
        accessorFn: (row) => getUserName(row.assigned_to),
        header: "Assigned To",
        cell: (info) => <div className="text-center">{info.getValue()}</div>
      }
    ];

    if (isAdminOrManager) {
      cols.push({
        id: "actions",
        header: () => <div className="text-center">Actions</div>,
        cell: ({ row }) => {
          const task = row.original;
          return (
            <div className="flex items-center justify-center gap-3">
              <div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (activeAssignDropdown === task.id) {
                      setActiveAssignDropdown(null);
                      setAssignDropdownCoords(null);
                    } else {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setAssignDropdownCoords({
                        top: rect.bottom + 4,
                        left: rect.left + rect.width / 2
                      });
                      setActiveAssignDropdown(task.id);
                      setActiveStatusDropdown(null);
                    }
                  }}
                  className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Assign
                </button>
                {activeAssignDropdown === task.id && assignDropdownCoords && (
                  <div 
                    ref={assignDropdownRef}
                    className="fixed w-48 bg-surface border border-white/10 rounded-lg shadow-xl overflow-hidden z-50 -translate-x-1/2"
                    style={{ top: assignDropdownCoords.top, left: assignDropdownCoords.left }}
                  >
                    {users.filter(u => u.role !== "admin").map(u => (
                      <button 
                        key={u.id} 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          handleAssign(task.id, u.id); 
                        }} 
                        className="w-full text-center px-3 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                      >
                        {u.full_name || u.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenModal(task);
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <PencilLine className="w-4 h-4" />
              </button>
            </div>
          );
        }
      });
    }

    return cols;
  }, [projects, users, activeStatusDropdown, activeAssignDropdown, assignDropdownCoords, isAdminOrManager, user.id]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4">
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

      <DataTable 
        columns={columns} 
        data={tasks} 
        loading={isLoading} 
        emptyMessage="No tasks found" 
      />

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
