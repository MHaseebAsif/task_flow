import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Clock } from "lucide-react";
import { getProject } from "../../Helpers/projectApi";
import { getTasks } from "../../Helpers/taskApi";
import toast from "react-hot-toast";

const ProjectDetails = () => {
  const { id } = useParams();
  
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectRes, tasksRes] = await Promise.all([
          getProject(id),
          getTasks({ project_id: id })
        ]);
        setProject(projectRes.data);
        setTasks(tasksRes.data);
      } catch (error) {
        toast.error(error.response?.data?.detail || "Failed to load project details");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (isLoading) {
    return <div className="text-center py-12 text-gray-400 text-sm animate-pulse">Loading details...</div>;
  }

  if (!project) {
    return <div className="text-center py-12 text-red-500 text-sm">Project not found</div>;
  }

  return (
    <div className="space-y-8">
      <Link to="/company/projects" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to projects
      </Link>

      <div className="bg-surface border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">
        <h1 className="text-3xl font-semibold text-white mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {project.name}
        </h1>
        <p className="text-gray-400 max-w-3xl">
          {project.description || "No description provided."}
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Tasks
        </h2>
        
        {tasks.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm bg-surface border border-white/10 rounded-2xl">
            No tasks found for this project
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <div key={task.id} className="bg-surface border border-white/10 rounded-2xl p-5 hover:border-primary/50 transition-colors flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-white font-medium line-clamp-2">{task.title}</h3>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider ${
                    task.priority === "high" ? "bg-red-500/10 text-red-500 border border-red-500/20" :
                    task.priority === "medium" ? "bg-orange-500/10 text-orange-500 border border-orange-500/20" :
                    "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                  }`}>
                    {task.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-400 line-clamp-2 mb-4 flex-grow">
                  {task.description || "No description"}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${
                    task.status === "done" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                    task.status === "in_progress" ? "bg-primary/10 text-primary border-primary/20" :
                    "bg-white/5 text-gray-300 border-white/10"
                  }`}>
                    {task.status === "done" ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    {task.status.replace("_", " ")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;
