import { useState, useEffect, useMemo } from "react";
import { Plus } from "lucide-react";
import { getAllUsers, inviteUser } from "../../Helpers/companyApi";
import Modal from "../../Component/Modal";
import DataTable from "../../Component/DataTable";
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

  const columns = useMemo(() => [
    {
      id: "name",
      accessorFn: (row) => row.full_name || row.name,
      header: "Name",
      cell: (info) => <span className="font-medium text-white">{info.getValue()}</span>
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: (info) => <span className="text-gray-400">{info.getValue()}</span>
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: (info) => {
        const role = info.getValue();
        return (
          <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium uppercase tracking-wider ${
            role === "admin" ? "bg-red-500/10 text-red-500 border border-red-500/20" :
            role === "manager" ? "bg-orange-500/10 text-orange-500 border border-orange-500/20" :
            "bg-white/5 text-gray-300 border border-white/10"
          }`}>
            {role}
          </span>
        );
      }
    }
  ], []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Invite Member
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={users} 
        loading={isLoading} 
        emptyMessage="No team members found" 
      />

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
