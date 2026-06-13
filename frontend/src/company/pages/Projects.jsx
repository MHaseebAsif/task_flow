import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, PencilLine, Trash2 } from "lucide-react";
import { getProjects, createProject, updateProject, deleteProject } from "../../Helpers/projectApi";
import { useAuth } from "../../context/AuthContext";
import Modal from "../../Component/Modal";
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

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Projects
          </h1>
          <p className="text-sm text-gray-400">
            Manage all company projects
          </p>
        </div>
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

      {isLoading ? (
        <div className="text-center py-12 text-gray-400 text-sm animate-pulse">Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-sm bg-surface border border-white/10 rounded-2xl">
          No projects yet
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => handleCardClick(project.id)}
              className="bg-surface border border-white/10 rounded-2xl p-6 hover:border-primary/50 transition-colors cursor-pointer group relative flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-white line-clamp-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {project.name}
                </h3>
                {isAdminOrManager && (
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenModal(project);
                      }}
                      className="p-1.5 text-gray-400 hover:text-white bg-white/5 rounded-md transition-colors"
                    >
                      <PencilLine className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, project.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 bg-white/5 rounded-md transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-400 line-clamp-3 mb-6 flex-grow">
                {project.description || "No description provided."}
              </p>
              <div className="text-xs text-gray-500 mt-auto pt-4 border-t border-white/10">
                Created {new Date(project.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

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
