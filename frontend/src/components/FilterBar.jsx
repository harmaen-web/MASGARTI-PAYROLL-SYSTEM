import { Search, X } from 'lucide-react';

export default function FilterBar({
  search,
  onSearchChange,
  department,
  onDepartmentChange,
  departments,
  designation,
  onDesignationChange,
  designations,
  minSalary,
  onMinSalaryChange,
  maxSalary,
  onMaxSalaryChange,
  onClear,
}) {
  const hasFilters =
    search || department !== 'All' || designation !== 'All' || minSalary || maxSalary;

  return (
    <div className="mb-5 space-y-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="grid flex-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="relative sm:col-span-2 xl:col-span-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search Employee Name or ID..."
              className="input-field pl-10"
            />
          </div>

          <select value={department} onChange={(e) => onDepartmentChange(e.target.value)} className="input-field">
            {departments.map((item) => (
              <option key={item} value={item}>Department: {item}</option>
            ))}
          </select>

          <select value={designation} onChange={(e) => onDesignationChange(e.target.value)} className="input-field">
            {designations.map((item) => (
              <option key={item} value={item}>Designation: {item}</option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              min="0"
              value={minSalary}
              onChange={(e) => onMinSalaryChange(e.target.value)}
              placeholder="Min salary"
              className="input-field"
            />
            <input
              type="number"
              min="0"
              value={maxSalary}
              onChange={(e) => onMaxSalaryChange(e.target.value)}
              placeholder="Max salary"
              className="input-field"
            />
          </div>
        </div>

        {hasFilters && (
          <button type="button" onClick={onClear} className="btn-secondary shrink-0">
            <X size={16} />
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}
