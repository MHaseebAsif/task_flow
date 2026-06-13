import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, PencilLine, Trash2 } from "lucide-react";
import { getProjects, createProject, updateProject, deleteProject } from "../../Helpers/projectApi";
import { useAuth } from "../../context/AuthContext";
import Modal from "../../Component/Modal";
import DataTable from "../../Component/DataTable";
import toast from "react-hot-toast";

const Projects = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  
  const [formData, setFormData] = useState({ name: "", description: "" });

  const isAdminOrManager = user?.role === "admin" || user?.role === "manager";

  const fetchProjects = async () => {
    try {
      const response = await getProjects();
      setProjects(response.data);
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to load projects");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleOpenModal = (project = null) => {
    if (project) {
      setEditingProject(project);
      setFormData({ name: project.name, description: project.description || "" });
    } else {
      setEditingProject(null);
      setFormData({ name: "", description: "" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setFormData({ name: "", description: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProject) {
        await updateProject(editingProject.id, formData);
        toast.success("Project updated");
      } else {
        await createProject(formData);
        toast.success("Project created");
      }
      handleCloseModal();
      fetchProjects();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to save project");
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteProject(id);
        toast.success("Project deleted");
        fetchProjects();
      } catch (error) {
        toast.error(error.response?.data?.detail || "Failed to delete project");
      }
    }
  };

  const handleCardClick = (id) => {
    navigate(`/company/projects/${id}`);
  };

  const columns = useMemo(() => {
    const cols = [
      {
        accessorKey: "name",
        header: () => <div className="text-center">Name</div>,
        cell: (info) => (
          <div className="flex justify-center">
            <button 
              onClick={() => handleCardClick(info.row.original.id)}
              className="font-medium text-white hover:text-primary transition-colors text-center"
            >
              {info.getValue()}
            </button>
          </div>
        )
      },
      {
        accessorKey: "description",
        header: () => <div className="text-center">Description</div>,
        cell: (info) => (
          <div className="flex justify-center">
            <span 
              className="text-gray-400 block max-w-xs md:max-w-md truncate text-center" 
              title={info.getValue()}
            >
              {info.getValue() || "No description provided."}
            </span>
          </div>
        )
      },
      {
        accessorKey: "created_at",
        header: () => <div className="text-center">Created Date</div>,
        cell: (info) => (
          <div className="text-center text-gray-400">
            {new Date(info.getValue()).toLocaleDateString()}
          </div>
        )
      }
    ];

    if (isAdminOrManager) {
      cols.push({
        id: "actions",
        header: () => <div className="text-center">Actions</div>,
        cell: ({ row }) => {
          const project = row.original;
          return (
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenModal(project);
                }}
                className="text-gray-400 hover:text-white transition-colors"
                title="Edit project"
              >
                <PencilLine className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => handleDelete(e, project.id)}
                className="text-red-500/70 hover:text-red-500 transition-colors"
                title="Delete project"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        }
      });
    }

    return cols;
  }, [isAdminOrManager]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4">
        {isAdminOrManager && (
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>
        )}
      </div>

      <DataTable 
        columns={columns} 
        data={projects} 
        loading={isLoading} 
        emptyMessage="No projects yet" 
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingProject ? "Edit Project" : "New Project"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Project Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors"
              placeholder="e.g. Website Redesign"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors resize-none"
              placeholder="Brief description of the project..."
            />
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
              {editingProject ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Projects;
