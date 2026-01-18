import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Label } from '@/shared/components/ui/label';

export interface TaskFilters {
  search: string;
  status: string[];
  priority: string[];
  assignee: string;
}

interface TaskFiltersProps {
  filters: TaskFilters;
  onFiltersChange: (filters: TaskFilters) => void;
  assignees: { id: string; name: string }[];
}

export function TaskFiltersComponent({ filters, onFiltersChange, assignees }: TaskFiltersProps) {
  const activeFiltersCount =
    filters.status.length +
    filters.priority.length +
    (filters.assignee ? 1 : 0);

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value });
  };

  const handleStatusChange = (status: string, checked: boolean) => {
    const newStatus = checked
      ? [...filters.status, status]
      : filters.status.filter(s => s !== status);
    onFiltersChange({ ...filters, status: newStatus });
  };

  const handlePriorityChange = (priority: string, checked: boolean) => {
    const newPriority = checked
      ? [...filters.priority, priority]
      : filters.priority.filter(p => p !== priority);
    onFiltersChange({ ...filters, priority: newPriority });
  };

  const handleAssigneeChange = (assignee: string) => {
    onFiltersChange({ ...filters, assignee: assignee === 'all' ? '' : assignee });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      status: [],
      priority: [],
      assignee: '',
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          value={filters.search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Assignee Filter */}
      <Select value={filters.assignee || 'all'} onValueChange={handleAssigneeChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All assignees" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All assignees</SelectItem>
          {assignees.map(assignee => (
            <SelectItem key={assignee.id} value={assignee.id}>
              {assignee.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Advanced Filters */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="space-y-4">
            <div className="font-medium">Filter Tasks</div>

            {/* Status */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Status</Label>
              <div className="space-y-2">
                {['pending', 'in_progress', 'completed'].map(status => (
                  <div key={status} className="flex items-center space-x-2">
                    <Checkbox
                      id={`status-${status}`}
                      checked={filters.status.includes(status)}
                      onCheckedChange={(checked) => handleStatusChange(status, checked === true)}
                    />
                    <Label htmlFor={`status-${status}`} className="text-sm font-normal capitalize">
                      {status.replace('_', ' ')}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Priority</Label>
              <div className="space-y-2">
                {['high', 'medium', 'low'].map(priority => (
                  <div key={priority} className="flex items-center space-x-2">
                    <Checkbox
                      id={`priority-${priority}`}
                      checked={filters.priority.includes(priority)}
                      onCheckedChange={(checked) => handlePriorityChange(priority, checked === true)}
                    />
                    <Label htmlFor={`priority-${priority}`} className="text-sm font-normal capitalize">
                      {priority}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="w-full">
                <X className="h-4 w-4 mr-2" />
                Clear filters
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
