import { useState, useEffect, useMemo } from "react";
import { Plus, PencilLine, Trash2 } from "lucide-react";
import { getAllUsers, inviteUser, updateUser, deleteUser } from "../../Helpers/companyApi";
import { useAuth } from "../../context/AuthContext";
import Modal from "../../Component/Modal";
import DataTable from "../../Component/DataTable";
import toast from "react-hot-toast";

const Team = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "member" });

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      console.log("Raw response from getAllUsers:", response.data);
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

  const handleOpenModal = (userToEdit = null) => {
    if (userToEdit) {
      setEditingUser(userToEdit);
      setFormData({
        name: userToEdit.name || userToEdit.full_name || "",
        email: userToEdit.email || "",
        password: "", // Password not editable here
        role: userToEdit.role || "member"
      });
    } else {
      setEditingUser(null);
      setFormData({ name: "", email: "", password: "", role: "member" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({ name: "", email: "", password: "", role: "member" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        // Remove password from payload if empty since it's not editable via this form
        const payload = {
          name: formData.name,
          email: formData.email,
          role: formData.role
        };
        await updateUser(editingUser.id, payload);
        toast.success("Member updated successfully");
      } else {
        await inviteUser(formData);
        toast.success("Member invited successfully");
      }
      handleCloseModal();
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to save member");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      try {
        await deleteUser(id);
        toast.success("Member deleted successfully");
        fetchUsers();
      } catch (error) {
        toast.error(error.response?.data?.detail || "Failed to delete member");
      }
    }
  };

  const columns = useMemo(() => {
    const cols = [
      {
        id: "name",
        accessorFn: (row) => row.full_name || row.name,
        header: () => <div className="text-center">Name</div>,
        cell: (info) => <div className="text-center font-medium text-white">{info.getValue()}</div>
      },
      {
        accessorKey: "email",
        header: () => <div className="text-center">Email</div>,
        cell: (info) => <div className="text-center text-gray-400">{info.getValue()}</div>
      },
      {
        accessorKey: "role",
        header: () => <div className="text-center">Role</div>,
        cell: (info) => {
          const role = info.getValue();
          return (
            <div className="flex justify-center">
              <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium uppercase tracking-wider ${
                role === "admin" ? "bg-red-500/10 text-red-500 border border-red-500/20" :
                role === "manager" ? "bg-orange-500/10 text-orange-500 border border-orange-500/20" :
                "bg-white/5 text-gray-300 border border-white/10"
              }`}>
                {role}
              </span>
            </div>
          );
        }
      }
    ];

    if (user?.role === "admin") {
      cols.push({
        id: "actions",
        header: () => <div className="text-center">Actions</div>,
        cell: ({ row }) => {
          const member = row.original;
          return (
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => handleOpenModal(member)}
                className="text-gray-400 hover:text-white transition-colors"
                title="Edit member"
              >
                <PencilLine className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(member.id)}
                className="text-red-500/70 hover:text-red-500 transition-colors"
                title="Delete member"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        }
      });
    }

    return cols;
  }, [user?.role]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4">
        {user?.role === "admin" && (
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Invite Member
          </button>
        )}
      </div>

      {console.log("Passing to DataTable data prop:", users)}
      <DataTable 
        columns={columns} 
        data={users} 
        loading={isLoading} 
        emptyMessage="No team members found" 
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingUser ? "Edit Member" : "Invite Member"}
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
          {!editingUser && (
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
          )}
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
              {editingUser ? "Update" : "Invite"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Team;
