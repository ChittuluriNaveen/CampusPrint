import React, { useEffect, useState } from 'react';
import { Users, Search, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { apiClient } from '../../services/apiClient';

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'OPERATOR' | 'ADMIN' | 'SUPER_ADMIN';
  isEmailVerified: boolean;
  createdAt: string;
}

export const AdminUserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/admin/users');
      if (response.data?.data?.users) {
        setUsers(response.data.data.users);
      }
    } catch {
      console.warn('Fallback to demo admin users list');
      setUsers([
        {
          id: 'u-1',
          name: 'Naveen Chittuluri',
          email: 'naveen@campusprint.edu',
          role: 'STUDENT',
          isEmailVerified: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'u-2',
          name: 'Priya Sharma',
          email: 'priya@campusprint.edu',
          role: 'STUDENT',
          isEmailVerified: true,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: 'u-3',
          name: 'Operator Rajesh',
          email: 'rajesh.op@campusprint.edu',
          role: 'OPERATOR',
          isEmailVerified: true,
          createdAt: new Date(Date.now() - 172800000).toISOString(),
        },
        {
          id: 'u-4',
          name: 'System Administrator',
          email: 'admin@campusprint.edu',
          role: 'ADMIN',
          isEmailVerified: true,
          createdAt: new Date(Date.now() - 2592000000).toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      await apiClient.patch(`/admin/users/${userId}`, { role: newRole });
      fetchUsers();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to update user role');
    }
  };

  const handleToggleVerification = async (userId: string, currentStatus: boolean) => {
    try {
      await apiClient.patch(`/admin/users/${userId}`, { isEmailVerified: !currentStatus });
      fetchUsers();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to update user status');
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    if (roleFilter === 'ALL') return matchesSearch;
    return matchesSearch && u.role === roleFilter;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">User Accounts Management</h1>
          <p className="text-sm text-slate-500">Manage student, print operator, and admin permissions</p>
        </div>

        <button
          onClick={fetchUsers}
          className="p-2.5 bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 hover:bg-slate-50 rounded-xl transition-all"
        >
          <RefreshCw className={`w-4 h-4 text-slate-600 dark:text-slate-300 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Search & Role Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or institutional email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="flex space-x-1 bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 p-1 rounded-xl">
          {['ALL', 'STUDENT', 'OPERATOR', 'ADMIN'].map(role => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                roleFilter === role
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="p-4">User Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Registered</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span>{user.name}</span>
                  </td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">
                    <select
                      value={user.role}
                      onChange={e => handleUpdateRole(user.id, e.target.value)}
                      className="px-2 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold focus:outline-none"
                    >
                      <option value="STUDENT">STUDENT</option>
                      <option value="OPERATOR">OPERATOR</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                  <td className="p-4">
                    {user.isEmailVerified ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                        <CheckCircle className="w-3 h-3" />
                        <span>Active</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300">
                        <XCircle className="w-3 h-3" />
                        <span>Unverified / Locked</span>
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-slate-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleToggleVerification(user.id, user.isEmailVerified)}
                      className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-colors"
                    >
                      {user.isEmailVerified ? 'Lock Account' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
