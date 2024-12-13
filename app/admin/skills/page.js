'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiCode } from 'react-icons/fi';
import * as Si from 'react-icons/si';

const iconOptions = [
  { name: 'Java', icon: 'SiJava' },
  { name: 'Python', icon: 'SiPython' },
  { name: 'JavaScript', icon: 'SiJavascript' },
  { name: 'React', icon: 'SiReact' },
  { name: 'Node.js', icon: 'SiNodedotjs' },
  { name: 'C++', icon: 'SiCplusplus' },
  { name: 'C#', icon: 'SiCsharp' },
  { name: 'PHP', icon: 'SiPhp' },
  { name: 'Ruby', icon: 'SiRuby' },
  { name: 'Swift', icon: 'SiSwift' },
  { name: 'Kotlin', icon: 'SiKotlin' },
  { name: 'Go', icon: 'SiGo' },
  { name: 'Docker', icon: 'SiDocker' },
  { name: 'Kubernetes', icon: 'SiKubernetes' },
  { name: 'AWS', icon: 'SiAmazonaws' },
  { name: 'Azure', icon: 'SiMicrosoftazure' },
  { name: 'MongoDB', icon: 'SiMongodb' },
  { name: 'MySQL', icon: 'SiMysql' },
  { name: 'PostgreSQL', icon: 'SiPostgresql' },
  { name: 'Git', icon: 'SiGit' },
];

const getSkillIcon = (iconName) => {
  return Si[iconName] || FiCode;
};

export default function ManageSkills() {
  const [skills, setSkills] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', icon: 'SiCode' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await fetch('/api/admin/skills');
      if (!response.ok) throw new Error('Failed to fetch skills');
      const data = await response.json();
      setSkills(data);
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        editingId ? `/api/admin/skills/${editingId}` : '/api/admin/skills',
        {
          method: editingId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error('Failed to save skill');
      await fetchSkills();
      resetForm();
    } catch (error) {
      console.error('Error saving skill:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return;
    
    try {
      const response = await fetch(`/api/admin/skills/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete skill');
      await fetchSkills();
    } catch (error) {
      console.error('Error deleting skill:', error);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', icon: 'SiCode' });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Manage Skills</h1>
            <p className="mt-1 text-sm text-gray-600">Add, edit, or remove your technical skills</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiPlus className="w-5 h-5 mr-1" />
            Add New Skill
          </motion.button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-medium mb-4">
              {editingId ? 'Edit Skill' : 'Add New Skill'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icon
                </label>
                <div className="relative">
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                  >
                    {iconOptions.map((option) => (
                      <option key={option.icon} value={option.icon}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-2.5 pointer-events-none text-gray-500">
                    {React.createElement(getSkillIcon(formData.icon), { className: "w-5 h-5" })}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skill Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  {editingId ? 'Update Skill' : 'Add Skill'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-4 text-sm font-medium text-gray-500">NAME</div>
              <div className="col-span-6 text-sm font-medium text-gray-500">DESCRIPTION</div>
              <div className="col-span-2 text-sm font-medium text-gray-500 text-right">ACTIONS</div>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {skills.map((skill) => (
              <div key={skill.id} className="px-6 py-4">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-4 flex items-center space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                      {React.createElement(getSkillIcon(skill.icon), { className: "w-4 h-4" })}
                    </div>
                    <span className="font-medium text-gray-900">{skill.name}</span>
                  </div>
                  <div className="col-span-6 flex items-center text-gray-600">
                    {skill.description}
                  </div>
                  <div className="col-span-2 flex justify-end items-center space-x-2">
                    <button
                      onClick={() => {
                        setFormData({ name: skill.name, description: skill.description, icon: skill.icon });
                        setEditingId(skill.id);
                        setShowForm(true);
                      }}
                      className="text-gray-400 hover:text-blue-600"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(skill.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {skills.length === 0 && (
            <div className="px-6 py-8 text-center text-gray-500">
              No skills added yet. Click "Add New Skill" to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
