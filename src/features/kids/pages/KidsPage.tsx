import { useState, useEffect } from 'react';
import { ChildCard } from '../components/ChildCard';
import { ChildDetails } from '../components/ChildDetails';
import { AddChildDialog } from '../components/AddChildDialog';
import { EditChildDialog } from '../components/EditChildDialog';
import type {
  Child,
  ChildSchool,
  ChildTeacher,
  Homework,
  Grade,
  ChildMedication,
  ChildVaccination,
  ChildAppointment,
  ChildActivity,
  ChildFriend,
  ChildMilestone,
  ChildChore,
  GrowthRecord,
} from '../types/kids.types';
import {
  mockChildren,
  mockSchools,
  mockTeachers,
  mockHomework,
  mockGrades,
  mockMedications,
  mockVaccinations,
  mockAppointments,
  mockActivities,
  mockFriends,
  mockMilestones,
  mockChores,
  mockGrowthRecords,
  addChild,
  deleteChild,
  toggleChore,
  updateChild,
} from '@/mocks/kids';

export function KidsPage() {
  const [children, setChildren] = useState<Child[]>([]);
  const [schools, setSchools] = useState<ChildSchool[]>([]);
  const [teachers, setTeachers] = useState<ChildTeacher[]>([]);
  const [homework, setHomework] = useState<Homework[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [medications, setMedications] = useState<ChildMedication[]>([]);
  const [vaccinations, setVaccinations] = useState<ChildVaccination[]>([]);
  const [appointments, setAppointments] = useState<ChildAppointment[]>([]);
  const [activities, setActivities] = useState<ChildActivity[]>([]);
  const [friends, setFriends] = useState<ChildFriend[]>([]);
  const [milestones, setMilestones] = useState<ChildMilestone[]>([]);
  const [chores, setChores] = useState<ChildChore[]>([]);
  const [growthRecords, setGrowthRecords] = useState<GrowthRecord[]>([]);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load mock data
    setTimeout(() => {
      setChildren([...mockChildren]);
      setSchools([...mockSchools]);
      setTeachers([...mockTeachers]);
      setHomework([...mockHomework]);
      setGrades([...mockGrades]);
      setMedications([...mockMedications]);
      setVaccinations([...mockVaccinations]);
      setAppointments([...mockAppointments]);
      setActivities([...mockActivities]);
      setFriends([...mockFriends]);
      setMilestones([...mockMilestones]);
      setChores([...mockChores]);
      setGrowthRecords([...mockGrowthRecords]);
      setIsLoading(false);
    }, 300);
  }, []);

  const handleAddChild = async (childData: Omit<Child, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newChild = await addChild(childData);
    setChildren(prev => [...prev, newChild]);
  };

  const handleEditChild = (child: Child) => {
    setEditingChild(child);
  };

  const handleSaveChild = async (updatedChild: Child) => {
    const saved = await updateChild(updatedChild.id, updatedChild);
    setChildren(prev => prev.map(c => c.id === saved.id ? saved : c));
    if (selectedChild?.id === saved.id) {
      setSelectedChild(saved);
    }
  };

  const handleDeleteChild = async (child: Child) => {
    if (window.confirm(`Are you sure you want to remove ${child.firstName}?`)) {
      await deleteChild(child.id);
      setChildren(prev => prev.filter(c => c.id !== child.id));
      if (selectedChild?.id === child.id) {
        setSelectedChild(null);
      }
    }
  };

  const handleToggleChore = async (choreId: string) => {
    const updatedChore = await toggleChore(choreId);
    setChores(prev => prev.map(c => c.id === choreId ? updatedChore : c));
  };

  // Helper functions to get data for specific child
  const getChildData = (childId: string) => ({
    schools: schools.filter(s => s.childId === childId),
    teachers: teachers.filter(t => t.childId === childId),
    homework: homework.filter(h => h.childId === childId),
    grades: grades.filter(g => g.childId === childId),
    medications: medications.filter(m => m.childId === childId),
    vaccinations: vaccinations.filter(v => v.childId === childId),
    appointments: appointments.filter(a => a.childId === childId),
    activities: activities.filter(a => a.childId === childId),
    friends: friends.filter(f => f.childId === childId),
    milestones: milestones.filter(m => m.childId === childId),
    chores: chores.filter(c => c.childId === childId),
    growthRecords: growthRecords.filter(g => g.childId === childId),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (selectedChild) {
    const childData = getChildData(selectedChild.id);
    return (
      <ChildDetails
        child={selectedChild}
        schools={childData.schools}
        teachers={childData.teachers}
        homework={childData.homework}
        grades={childData.grades}
        medications={childData.medications}
        vaccinations={childData.vaccinations}
        appointments={childData.appointments}
        activities={childData.activities}
        friends={childData.friends}
        milestones={childData.milestones}
        chores={childData.chores}
        growthRecords={childData.growthRecords}
        onBack={() => setSelectedChild(null)}
        onToggleChore={handleToggleChore}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kids</h1>
          <p className="text-muted-foreground">
            Manage your children's education, health, activities, and more.
          </p>
        </div>
        <AddChildDialog onAddChild={handleAddChild} />
      </div>

      {children.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[400px] border rounded-lg bg-muted/10">
          <p className="text-lg font-medium">No children added yet</p>
          <p className="text-sm text-muted-foreground mb-4">Add your first child to get started</p>
          <AddChildDialog onAddChild={handleAddChild} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {children.map((child) => {
            const childData = getChildData(child.id);
            return (
              <ChildCard
                key={child.id}
                child={child}
                homework={childData.homework}
                appointments={childData.appointments}
                chores={childData.chores}
                onSelect={setSelectedChild}
                onEdit={handleEditChild}
                onDelete={handleDeleteChild}
              />
            );
          })}
        </div>
      )}

      {/* Edit Child Dialog */}
      {editingChild && (
        <EditChildDialog
          child={editingChild}
          open={!!editingChild}
          onOpenChange={(open) => !open && setEditingChild(null)}
          onSave={handleSaveChild}
        />
      )}
    </div>
  );
}
