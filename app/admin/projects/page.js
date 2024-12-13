'use client';

import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiGithub, FiExternalLink, FiImage } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function ManageProjects() {
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    imageUrl: '',
    githubUrl: '',
    liveUrl: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/admin/projects');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  useEffect(() => {
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

    fetchSkills();
    fetchProjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const projectData = {
      ...newProject,
      skills: selectedSkills,
    };

    try {
      const response = await fetch(
        editingId 
          ? `/api/admin/projects/${editingId}` 
          : '/api/admin/projects',
        {
          method: editingId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectData),
        }
      );

      if (!response.ok) throw new Error('Failed to save project');
      
      const result = await response.json();
      setProjects(prev => {
        if (editingId) {
          return prev.map(p => p.id === editingId ? result : p);
        }
        return [...prev, result];
      });
      
      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  const handleEdit = (project) => {
    setNewProject({
      title: project.title,
      description: project.description,
      imageUrl: project.imageUrl || '',
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
    });
    setSelectedSkills(project.skills.map(skill => skill.id));
    setIsEditing(true);
    setEditingId(project.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const response = await fetch(`/api/admin/projects/${id}`, {
          method: 'DELETE',
          body: JSON.stringify({ id }),
        });

        if (response.ok) {
          setProjects(prev => prev.filter(p => p.id !== id));
        }
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillToggle = (skillId) => {
    setSelectedSkills(prev => {
      const isSelected = prev.includes(skillId);
      if (isSelected) {
        return prev.filter(id => id !== skillId);
      } else {
        return [...prev, skillId];
      }
    });
  };

  const resetForm = () => {
    setNewProject({
      title: '',
      description: '',
      imageUrl: '',
      githubUrl: '',
      liveUrl: '',
    });
    setSelectedSkills([]);
    setIsEditing(false);
    setEditingId(null);
    setSelectedImage(null);
    setIsUploading(false);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.url) {
        setNewProject(prev => ({ ...prev, imageUrl: data.url }));
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Manage Projects
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Add, edit, or remove your portfolio projects
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setShowForm(!showForm);
              resetForm();
            }}
            className="inline-flex items-center px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <FiPlus className="w-5 h-5 mr-2" />
            Add New Project
          </motion.button>
        </div>

        {/* Project Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-xl p-6 shadow-sm mb-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Project Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newProject.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={newProject.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Image
                </label>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="project-image"
                    />
                    <label
                      htmlFor="project-image"
                      className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer"
                    >
                      <FiImage className="w-5 h-5 mr-2" />
                      Choose Image
                    </label>
                    {isUploading && (
                      <span className="text-sm text-gray-500">Uploading...</span>
                    )}
                  </div>
                  {newProject.imageUrl && (
                    <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={newProject.imageUrl}
                        alt="Project preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* URLs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700 mb-1">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    id="githubUrl"
                    name="githubUrl"
                    value={newProject.githubUrl}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://github.com/username/repo"
                  />
                </div>

                <div>
                  <label htmlFor="liveUrl" className="block text-sm font-medium text-gray-700 mb-1">
                    Live URL
                  </label>
                  <input
                    type="url"
                    id="liveUrl"
                    name="liveUrl"
                    value={newProject.liveUrl}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://your-project.com"
                  />
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Skills Used
                </label>
                <div className="flex flex-wrap gap-2">
                  {skills.map(skill => (
                    <label
                      key={skill.id}
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm cursor-pointer transition-colors duration-200 ${
                        selectedSkills.includes(skill.id)
                          ? 'bg-blue-100 text-blue-800 ring-2 ring-blue-600 ring-offset-2'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <input
                        type="checkbox"
                        value={skill.id}
                        checked={selectedSkills.includes(skill.id)}
                        onChange={() => handleSkillToggle(skill.id)}
                        className="sr-only"
                      />
                      {skill.name}
                    </label>
                  ))}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {isEditing ? 'Update Project' : 'Add Project'}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="p-6 space-y-4">
                {/* Project Image */}
                <div className="relative w-full aspect-[2/1] bg-gray-100 rounded-lg overflow-hidden">
                  {project.imageUrl ? (
                    <Image
                      src={project.imageUrl}
                      alt={project.title}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        e.target.src = '/placeholder.png';
                        e.target.className = 'object-contain p-4';
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FiImage className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Title and Description */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{project.description}</p>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-2">
                  {project.skills?.map(skill => (
                    <span
                      key={skill.id}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>

                {/* URLs */}
                <div className="flex gap-3">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      <FiGithub className="w-4 h-4 mr-2" />
                      View Code
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      <FiExternalLink className="w-4 h-4 mr-2" />
                      Live Demo
                    </a>
                  )}
                </div>

                {/* Admin Actions */}
                <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleEdit(project)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <FiEdit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
