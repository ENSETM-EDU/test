import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Users, RefreshCw } from 'lucide-react';
import { memberService } from '../services/members';
import type { Member } from '../types';

export function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [newMemberName, setNewMemberName] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const data = await memberService.getAll();
      setMembers(data);
    } catch (error) {
      console.error('Error loading members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    setAdding(true);
    try {
      const newMember = await memberService.create(newMemberName);
      setMembers([...members, newMember]);
      setNewMemberName('');
    } catch (error) {
      console.error('Error adding member:', error);
      alert('حدث خطأ أثناء إضافة العضو');
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteMember = async (id: string, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف العضو "${name}"؟`)) return;

    try {
      await memberService.delete(id);
      setMembers(members.filter(m => m.id !== id));
    } catch (error) {
      console.error('Error deleting member:', error);
      alert('حدث خطأ أثناء حذف العضو');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-reverse space-x-3">
          <Users className="w-8 h-8" />
          <span>إدارة الأعضاء</span>
        </h1>
        <div className="text-sm text-gray-600">
          إجمالي الأعضاء: {members.length}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">إضافة عضو جديد</h2>
        <form onSubmit={handleAddMember} className="flex gap-4">
          <input
            type="text"
            value={newMemberName}
            onChange={(e) => setNewMemberName(e.target.value)}
            placeholder="اسم العضو"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={adding}
          />
          <button
            type="submit"
            disabled={adding || !newMemberName.trim()}
            className="flex items-center space-x-reverse space-x-2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5" />
            <span>{adding ? 'جاري الإضافة...' : 'إضافة'}</span>
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">قائمة الأعضاء</h2>
        {members.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            لا يوجد أعضاء مسجلون بعد
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-800">{member.name}</span>
                <button
                  onClick={() => handleDeleteMember(member.id, member.name)}
                  className="text-red-600 hover:text-red-800 transition-colors p-1"
                  title="حذف العضو"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}