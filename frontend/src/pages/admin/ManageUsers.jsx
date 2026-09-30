import { useEffect, useState } from "react";
import { Trash2, ShieldCheck, ShieldOff } from "lucide-react";
import toast from "react-hot-toast";
import { getAllUsers, updateUserRole, deleteUser } from "../../api/orderApi.js";
import { useAuth } from "../../context/AuthContext.jsx";
import AdminLayout from "../../layouts/AdminLayout.jsx";
import LoadingSkeleton from "../../components/LoadingSkeleton.jsx";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";
import EmptyState from "../../components/EmptyState.jsx";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { user: currentUser } = useAuth();

  const load = async () => {
    try {
      const { data } = await getAllUsers();
      setUsers(data.users);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleRoleToggle = async (targetUser) => {
    const newRole = targetUser.role === "admin" ? "customer" : "admin";
    try {
      await updateUserRole(targetUser._id, newRole);
      toast.success(`${targetUser.name} is now ${newRole === "admin" ? "an admin" : "a customer"}`);
      setUsers((prev) => prev.map((u) => (u._id === targetUser._id ? { ...u, role: newRole } : u)));
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update role");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser(deleteTarget._id);
      toast.success("User deleted");
      setUsers((prev) => prev.filter((u) => u._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete user");
      setDeleteTarget(null);
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold">Manage users</h1>
      <p className="mt-1 text-sm text-ink/60">{users.length} registered accounts</p>

      <div className="mt-6">
        {loading ? (
          <LoadingSkeleton type="spinner" />
        ) : users.length === 0 ? (
          <EmptyState title="No users found" />
        ) : (
          <div className="overflow-x-auto rounded-card border border-ink/10 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink/10 text-left text-xs font-semibold uppercase tracking-wide text-ink/40">
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Joined</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b border-ink/5 last:border-0">
                    <td className="p-4 font-medium">{u.name}</td>
                    <td className="p-4 text-ink/60">{u.email}</td>
                    <td className="p-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${u.role === "admin" ? "bg-copper/15 text-copper" : "bg-ink/10 text-ink/60"}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-ink/50">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleRoleToggle(u)}
                          disabled={u._id === currentUser._id}
                          className="flex h-8 w-8 items-center justify-center rounded-card border border-ink/15 text-ink/60 hover:bg-ink/5 disabled:opacity-30"
                          title={u.role === "admin" ? "Revoke admin" : "Make admin"}
                        >
                          {u.role === "admin" ? <ShieldOff size={14} /> : <ShieldCheck size={14} />}
                        </button>
                        <button
                          onClick={() => setDeleteTarget(u)}
                          disabled={u._id === currentUser._id}
                          className="flex h-8 w-8 items-center justify-center rounded-card border border-ink/15 text-red-500 hover:bg-red-50 disabled:opacity-30"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title={`Delete ${deleteTarget?.name}?`}
        description="This will permanently remove their account."
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminLayout>
  );
};

export default ManageUsers;
