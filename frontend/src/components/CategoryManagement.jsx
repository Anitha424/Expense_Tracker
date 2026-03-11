import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Edit2 } from 'lucide-react';
import { useLocalStorage, getDefaultCategories, generateId } from '../hooks/useLocalStorage';

const CategoryManagement = ({ onCategoriesUpdate = null }) => {
  const [categories, setCategories] = useLocalStorage('categories', getDefaultCategories());
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    color: '#FF6B6B',
    icon: '📌',
  });

  // Notify parent when categories change
  useEffect(() => {
    if (onCategoriesUpdate) {
      onCategoriesUpdate(categories);
    }
  }, [categories, onCategoriesUpdate]);

  const handleAddCategory = () => {
    if (newCategory.name.trim()) {
      const categoryToAdd = {
        id: editingId || generateId(),
        ...newCategory,
      };

      if (editingId) {
        setCategories(categories.map((cat) => (cat.id === editingId ? categoryToAdd : cat)));
        setEditingId(null);
      } else {
        setCategories([...categories, categoryToAdd]);
      }

      setNewCategory({ name: '', color: '#FF6B6B', icon: '📌' });
      setIsAdding(false);
    }
  };

  const handleEditCategory = (category) => {
    setNewCategory(category);
    setEditingId(category.id);
    setIsAdding(true);
  };

  const handleDeleteCategory = (id) => {
    // Don't allow deleting all categories, keep at least one
    if (categories.length > 1) {
      setCategories(categories.filter((cat) => cat.id !== id));
    }
  };

  const handleCancel = () => {
    setNewCategory({ name: '', color: '#FF6B6B', icon: '📌' });
    setEditingId(null);
    setIsAdding(false);
  };

  const colorOptions = [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#F7DC6F',
    '#BB8FCE',
    '#85C1E2',
    '#82E0AA',
    '#BDC3C7',
    '#F39C12',
    '#3498DB',
  ];

  const iconOptions = ['🍔', '🛍️', '🚗', '💡', '🎬', '⚕️', '📚', '📌', '🏠', '✈️'];

  return (
    <motion.div
      className="rounded-lg bg-gradient-to-br from-purple-900/50 to-purple-800/50 p-6 backdrop-blur-md border border-purple-700/50 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Categories</h3>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        )}
      </div>

      {/* Add/Edit Category Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            className="mb-6 p-4 rounded-lg bg-purple-950/50 border border-purple-700/50 space-y-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div>
              <label className="block text-sm text-gray-300 mb-2">Category Name</label>
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                placeholder="e.g., Groceries"
                className="w-full px-3 py-2 bg-purple-900 border border-purple-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">Icon</label>
              <div className="grid grid-cols-5 gap-2">
                {iconOptions.map((icon) => (
                  <button
                    key={icon}
                    onClick={() => setNewCategory({ ...newCategory, icon })}
                    className={`p-3 rounded-lg text-xl transition-all ${
                      newCategory.icon === icon
                        ? 'bg-purple-600 scale-110'
                        : 'bg-purple-900 hover:bg-purple-800'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">Color</label>
              <div className="grid grid-cols-5 gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    onClick={() => setNewCategory({ ...newCategory, color })}
                    className={`w-full p-3 rounded-lg transition-all border-2 ${
                      newCategory.color === color
                        ? 'border-white scale-110'
                        : 'border-transparent hover:opacity-80'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleAddCategory}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded transition-colors"
              >
                {editingId ? 'Update' : 'Add'} Category
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        <AnimatePresence mode="popLayout">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              className="p-4 rounded-lg border border-purple-600/50 hover:border-purple-500 transition-all hover:shadow-lg cursor-pointer group"
              style={{ backgroundColor: `${category.color}20` }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-3xl">{category.icon}</span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditCategory(category);
                    }}
                    className="p-1 hover:bg-blue-600 rounded"
                  >
                    <Edit2 className="w-4 h-4 text-white" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCategory(category.id);
                    }}
                    className="p-1 hover:bg-red-600 rounded"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-200 text-center truncate">
                {category.name}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {categories.length === 0 && (
        <motion.div
          className="text-center py-8 text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p>No categories yet. Add one to get started!</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CategoryManagement;
