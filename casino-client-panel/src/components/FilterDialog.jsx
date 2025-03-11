import React from 'react';
import { X } from 'lucide-react';


export default function FilterDialog({ isOpen, onClose, onApply, fields }) {
  const [filters, setFilters] = React.useState({});

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Filter</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              {field.type === 'select' ? (
                <select
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  onChange={(e) => setFilters({ ...filters, [field.name]: e.target.value })}
                  value={filters[field.name] || ''}
                >
                  <option value="">All</option>
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : field.type === 'date' ? (
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  onChange={(e) => setFilters({ ...filters, [field.name]: e.target.value })}
                  value={filters[field.name] || ''}
                />
              ) : (
                <input
                  type={field.type}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  onChange={(e) => setFilters({ ...filters, [field.name]: e.target.value })}
                  value={filters[field.name] || ''}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                />
              )}
            </div>
          ))}
        </div>
        
        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={() => {
              setFilters({});
              onApply({});
              onClose();
            }}
            className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
          >
            Reset
          </button>
          <button
            onClick={() => {
              onApply(filters);
              onClose();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}