import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { getAllUsers, inviteUser } from "../../Helpers/companyApi";
import Modal from "../../Component/Modal";
import toast from "react-hot-toast";

const Team = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "member" });

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response.data);
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to load team members");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ name: "", email: "", password: "", role: "member" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await inviteUser(formData);
      toast.success("Member invited successfully");
      handleCloseModal();
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to invite member");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Team
          </h1>
          <p className="text-sm text-gray-400">
            Manage your company's team members
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Invite Member
        </button>
      </div>

      <div className="bg-surface border border-white/10 rounded-2xl overflow-hidden shadow-xl min-h-[300px]">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="text-center py-12 text-gray-400 text-sm animate-pulse">Loading team members...</div>
          ) : users.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">No team members found</div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white/5 text-gray-400 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-200">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{u.full_name || u.name}</td>
                    <td className="px-6 py-4 text-gray-400">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium uppercase tracking-wider ${
                        u.role === "admin" ? "bg-red-500/10 text-red-500 border border-red-500/20" :
                        u.role === "manager" ? "bg-orange-500/10 text-orange-500 border border-orange-500/20" :
                        "bg-white/5 text-gray-300 border border-white/10"
                      }`}>
                        {u.role}
                      </span>
                    </td>
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
        title="Invite Member"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Initial Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full bg-background border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors"
            >
              <option value="member">Member</option>
              <option value="manager">Manager</option>
            </select>
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
              Invite
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Team;
