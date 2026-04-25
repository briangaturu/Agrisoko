import { useState } from "react";
import { Search, Pencil, Check, X } from "lucide-react";
import { useGetAllUsersQuery, useUpdateUserMutation } from "../features/api/userApi";

const Users = () => {
  const { data, isLoading, isError } = useGetAllUsersQuery({});
  const users: any[] = data?.data ?? [];
  const [updateUser] = useUpdateUserMutation();
  const [search, setSearch]     = useState("");
  const [editId, setEditId]     = useState<string | null>(null);
  const [editData, setEditData] = useState({ fullName: "", email: "", phone: "", role: "" });

  const filtered = users.filter((u: any) =>
    u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const startEdit = (u: any) => {
    setEditId(u.id);
    setEditData({ fullName: u.fullName, email: u.email, phone: u.phone, role: u.role });
  };

  const saveEdit = async (id: string) => {
    await updateUser({ id, ...editData });
    setEditId(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Users</h1>
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="bg-gray-800 border border-gray-700 text-sm text-white pl-9 pr-4 py-2 rounded-lg focus:outline-none focus:border-green-500 w-52"
          />
        </div>
      </div>

      {isError && <p className="text-red-400 mb-4">Failed to load users</p>}

      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase">
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Email</th>
              <th className="text-left px-4 py-3">Phone</th>
              <th className="text-left px-4 py-3">Role</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} className="text-center py-8 text-gray-500">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-8 text-gray-500">No users found</td></tr>
            ) : filtered.map((u: any) => (
              <tr key={u.id} className="border-b border-gray-800/50 hover:bg-gray-800/40 transition">
                <td className="px-4 py-3">
                  {editId === u.id
                    ? <input value={editData.fullName} onChange={(e) => setEditData({ ...editData, fullName: e.target.value })} className="bg-gray-800 border border-green-500/50 text-white rounded px-2 py-1 text-sm w-32 focus:outline-none" />
                    : <span className="text-white font-medium">{u.fullName}</span>}
                </td>
                <td className="px-4 py-3">
                  {editId === u.id
                    ? <input value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} className="bg-gray-800 border border-green-500/50 text-white rounded px-2 py-1 text-sm w-40 focus:outline-none" />
                    : <span className="text-gray-400">{u.email}</span>}
                </td>
                <td className="px-4 py-3">
                  {editId === u.id
                    ? <input value={editData.phone} onChange={(e) => setEditData({ ...editData, phone: e.target.value })} className="bg-gray-800 border border-green-500/50 text-white rounded px-2 py-1 text-sm w-32 focus:outline-none" />
                    : <span className="text-gray-400">{u.phone}</span>}
                </td>
                <td className="px-4 py-3">
                  {editId === u.id
                    ? <select value={editData.role} onChange={(e) => setEditData({ ...editData, role: e.target.value })} className="bg-gray-800 border border-green-500/50 text-white rounded px-2 py-1 text-xs focus:outline-none">
                        {["BUYER", "FARMER", "ADMIN"].map((r) => <option key={r}>{r}</option>)}
                      </select>
                    : <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">{u.role}</span>}
                </td>
                <td className="px-4 py-3">
                  {editId === u.id ? (
                    <div className="flex gap-2">
                      <button onClick={() => saveEdit(u.id)} className="text-green-400 hover:text-green-300"><Check size={15} /></button>
                      <button onClick={() => setEditId(null)} className="text-red-400 hover:text-red-300"><X size={15} /></button>
                    </div>
                  ) : (
                    <button onClick={() => startEdit(u)} className="text-gray-400 hover:text-white"><Pencil size={15} /></button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;