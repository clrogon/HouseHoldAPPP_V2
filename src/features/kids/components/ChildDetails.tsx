import { ArrowLeft, BookOpen, GraduationCap, Heart, Users, Trophy, CheckSquare, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/shared/lib/currency';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Checkbox } from '@/shared/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
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

interface ChildDetailsProps {
  child: Child;
  schools: ChildSchool[];
  teachers: ChildTeacher[];
  homework: Homework[];
  grades: Grade[];
  medications: ChildMedication[];
  vaccinations: ChildVaccination[];
  appointments: ChildAppointment[];
  activities: ChildActivity[];
  friends: ChildFriend[];
  milestones: ChildMilestone[];
  chores: ChildChore[];
  growthRecords: GrowthRecord[];
  onBack: () => void;
  onToggleChore: (choreId: string) => void;
}

export function ChildDetails({
  child,
  schools,
  teachers,
  homework,
  grades,
  medications,
  vaccinations,
  appointments,
  activities,
  friends,
  milestones,
  chores,
  growthRecords,
  onBack,
  onToggleChore,
}: ChildDetailsProps) {
  const calculateAge = (dateOfBirth: string) => {
    const birth = new Date(dateOfBirth);
    const now = new Date();
    const years = Math.floor((now.getTime() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    const months = Math.floor(((now.getTime() - birth.getTime()) % (365.25 * 24 * 60 * 60 * 1000)) / (30.44 * 24 * 60 * 60 * 1000));
    return `${years} years, ${months} months`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const initials = `${child.firstName[0]}${child.lastName[0]}`.toUpperCase();
  const currentSchool = schools[0];
  const pendingHomework = homework.filter(h => h.status !== 'COMPLETED');
  const completedChoresCount = chores.filter(c => c.completed).length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NOT_STARTED':
        return <Badge variant="outline">Not Started</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="secondary">In Progress</Badge>;
      case 'COMPLETED':
        return <Badge variant="default">Completed</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Kids
      </Button>

      {/* Child Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="h-32 w-32">
              <AvatarImage src={child.photo} alt={child.firstName} />
              <AvatarFallback className="text-4xl">{initials}</AvatarFallback>
            </Avatar>

            <div className="text-center md:text-left space-y-2 flex-1">
              <h1 className="text-3xl font-bold">
                {child.firstName} {child.lastName}
                {child.nickname && (
                  <span className="text-lg text-muted-foreground ml-2">({child.nickname})</span>
                )}
              </h1>
              <p className="text-lg text-muted-foreground">{calculateAge(child.dateOfBirth)}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                {currentSchool && (
                  <Badge>{currentSchool.gradeLevel} at {currentSchool.schoolName}</Badge>
                )}
                {child.bloodType && (
                  <Badge variant="outline">Blood Type: {child.bloodType}</Badge>
                )}
              </div>
              {(child.allergies.length > 0 || child.medicalConditions.length > 0) && (
                <div className="flex flex-wrap justify-center md:justify-start gap-1 pt-2">
                  {child.allergies.map((allergy, i) => (
                    <Badge key={i} variant="destructive">{allergy}</Badge>
                  ))}
                  {child.medicalConditions.map((condition, i) => (
                    <Badge key={i} variant="secondary">{condition}</Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-muted rounded-lg">
                <BookOpen className="h-5 w-5 mx-auto mb-1 text-blue-500" />
                <p className="text-2xl font-bold">{pendingHomework.length}</p>
                <p className="text-xs text-muted-foreground">Homework</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <GraduationCap className="h-5 w-5 mx-auto mb-1 text-purple-500" />
                <p className="text-2xl font-bold">{grades.length}</p>
                <p className="text-xs text-muted-foreground">Grades</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <Trophy className="h-5 w-5 mx-auto mb-1 text-amber-500" />
                <p className="text-2xl font-bold">{activities.length}</p>
                <p className="text-xs text-muted-foreground">Activities</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <CheckSquare className="h-5 w-5 mx-auto mb-1 text-green-500" />
                <p className="text-2xl font-bold">{completedChoresCount}/{chores.length}</p>
                <p className="text-xs text-muted-foreground">Chores</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="school" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="school" className="flex items-center gap-1">
            <GraduationCap className="h-4 w-4" />
            <span className="hidden sm:inline">School</span>
          </TabsTrigger>
          <TabsTrigger value="health" className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">Health</span>
          </TabsTrigger>
          <TabsTrigger value="activities" className="flex items-center gap-1">
            <Trophy className="h-4 w-4" />
            <span className="hidden sm:inline">Activities</span>
          </TabsTrigger>
          <TabsTrigger value="friends" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Friends</span>
          </TabsTrigger>
          <TabsTrigger value="chores" className="flex items-center gap-1">
            <CheckSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Chores</span>
          </TabsTrigger>
          <TabsTrigger value="growth" className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Growth</span>
          </TabsTrigger>
        </TabsList>

        {/* School Tab */}
        <TabsContent value="school" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* School Info */}
            <Card>
              <CardHeader>
                <CardTitle>School Information</CardTitle>
              </CardHeader>
              <CardContent>
                {currentSchool ? (
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">School</p>
                      <p className="font-medium">{currentSchool.schoolName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Grade Level</p>
                      <p className="font-medium">{currentSchool.gradeLevel}</p>
                    </div>
                    {currentSchool.studentId && (
                      <div>
                        <p className="text-sm text-muted-foreground">Student ID</p>
                        <p className="font-medium">{currentSchool.studentId}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground">School Year</p>
                      <p className="font-medium">{currentSchool.schoolYear}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No school information</p>
                )}
              </CardContent>
            </Card>

            {/* Teachers */}
            <Card>
              <CardHeader>
                <CardTitle>Teachers</CardTitle>
              </CardHeader>
              <CardContent>
                {teachers.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No teachers added</p>
                ) : (
                  <div className="space-y-3">
                    {teachers.filter(t => t.isCurrent).map((teacher) => (
                      <div key={teacher.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{teacher.firstName} {teacher.lastName}</p>
                          <p className="text-sm text-muted-foreground">{teacher.subject}</p>
                        </div>
                        {teacher.email && (
                          <Badge variant="outline">{teacher.email}</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Homework */}
          <Card>
            <CardHeader>
              <CardTitle>Homework</CardTitle>
            </CardHeader>
            <CardContent>
              {homework.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No homework assignments</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Assignment</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Grade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {homework.map((hw) => (
                      <TableRow key={hw.id}>
                        <TableCell className="font-medium">{hw.subject}</TableCell>
                        <TableCell>{hw.title}</TableCell>
                        <TableCell>{formatDate(hw.dueDate)}</TableCell>
                        <TableCell>{getStatusBadge(hw.status)}</TableCell>
                        <TableCell>{hw.gradeReceived || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Grades */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Grades</CardTitle>
            </CardHeader>
            <CardContent>
              {grades.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No grades recorded</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Assignment</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Percentage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {grades.slice(0, 10).map((grade) => (
                      <TableRow key={grade.id}>
                        <TableCell className="font-medium">{grade.subject}</TableCell>
                        <TableCell>{grade.assignmentName}</TableCell>
                        <TableCell>{formatDate(grade.date)}</TableCell>
                        <TableCell>
                          <Badge variant={grade.percentage && grade.percentage >= 90 ? 'default' : 'secondary'}>
                            {grade.grade}
                          </Badge>
                        </TableCell>
                        <TableCell>{grade.percentage ? `${grade.percentage}%` : '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Health Tab */}
        <TabsContent value="health" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Medications */}
            <Card>
              <CardHeader>
                <CardTitle>Medications</CardTitle>
              </CardHeader>
              <CardContent>
                {medications.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No medications</p>
                ) : (
                  <div className="space-y-4">
                    {medications.map((med) => (
                      <div key={med.id} className="p-3 border rounded-lg">
                        <p className="font-medium">{med.name}</p>
                        <p className="text-sm text-muted-foreground">{med.dosage} - {med.frequency}</p>
                        {med.notes && <p className="text-xs text-muted-foreground mt-1">{med.notes}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Appointments */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                {appointments.filter(a => a.status === 'scheduled').length === 0 ? (
                  <p className="text-sm text-muted-foreground">No upcoming appointments</p>
                ) : (
                  <div className="space-y-4">
                    {appointments.filter(a => a.status === 'scheduled').map((apt) => (
                      <div key={apt.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{apt.reason}</p>
                          <Badge variant="outline">{apt.type}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(apt.date)} at {apt.time}
                        </p>
                        {apt.doctor && (
                          <p className="text-sm text-muted-foreground">{apt.doctor} - {apt.clinic}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Vaccinations */}
          <Card>
            <CardHeader>
              <CardTitle>Vaccinations</CardTitle>
            </CardHeader>
            <CardContent>
              {vaccinations.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No vaccination records</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vaccine</TableHead>
                      <TableHead>Date Given</TableHead>
                      <TableHead>Next Due</TableHead>
                      <TableHead>Clinic</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vaccinations.map((vax) => (
                      <TableRow key={vax.id}>
                        <TableCell className="font-medium">{vax.name}</TableCell>
                        <TableCell>{formatDate(vax.dateGiven)}</TableCell>
                        <TableCell>{vax.nextDueDate ? formatDate(vax.nextDueDate) : '-'}</TableCell>
                        <TableCell>{vax.clinic || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activities Tab */}
        <TabsContent value="activities">
          <Card>
            <CardHeader>
              <CardTitle>Activities & Extracurriculars</CardTitle>
            </CardHeader>
            <CardContent>
              {activities.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No activities registered</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{activity.name}</h4>
                        <Badge variant="outline">{activity.type}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{activity.schedule}</p>
                      {activity.location && (
                        <p className="text-sm">{activity.location}</p>
                      )}
                      {activity.instructorName && (
                        <p className="text-sm text-muted-foreground">
                          Instructor: {activity.instructorName}
                        </p>
                      )}
                      {activity.cost && (
                        <p className="text-sm font-medium mt-2">{formatCurrency(activity.cost)}/temporada</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Friends Tab */}
        <TabsContent value="friends">
          <Card>
            <CardHeader>
              <CardTitle>Friends</CardTitle>
            </CardHeader>
            <CardContent>
              {friends.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No friends added</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {friends.map((friend) => (
                    <div key={friend.id} className="p-4 border rounded-lg">
                      <h4 className="font-semibold">{friend.firstName} {friend.lastName}</h4>
                      {friend.age && <p className="text-sm text-muted-foreground">{friend.age} years old</p>}
                      {friend.school && <p className="text-sm">{friend.school}</p>}
                      {friend.parentName && (
                        <div className="mt-3 pt-3 border-t text-sm">
                          <p className="font-medium">Parent: {friend.parentName}</p>
                          {friend.parentPhone && <p className="text-muted-foreground">{friend.parentPhone}</p>}
                        </div>
                      )}
                      {friend.notes && (
                        <p className="text-xs text-muted-foreground mt-2">{friend.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Chores Tab */}
        <TabsContent value="chores">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Chores</span>
                <span className="text-sm font-normal text-muted-foreground">
                  {completedChoresCount} of {chores.length} completed
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {chores.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No chores assigned</p>
              ) : (
                <div className="space-y-3">
                  {chores.map((chore) => (
                    <div
                      key={chore.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={chore.completed}
                          onCheckedChange={() => onToggleChore(chore.id)}
                        />
                        <div>
                          <p className={chore.completed ? 'line-through text-muted-foreground' : 'font-medium'}>
                            {chore.name}
                          </p>
                          <p className="text-xs text-muted-foreground">{chore.frequency}</p>
                        </div>
                      </div>
                      {chore.allowanceAmount && (
                        <Badge variant="outline">{formatCurrency(chore.allowanceAmount)}</Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Growth Tab */}
        <TabsContent value="growth" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Growth Records */}
            <Card>
              <CardHeader>
                <CardTitle>Growth History</CardTitle>
              </CardHeader>
              <CardContent>
                {growthRecords.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No growth records</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Height</TableHead>
                        <TableHead>Weight</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {growthRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>{formatDate(record.date)}</TableCell>
                          <TableCell>{record.height ? `${record.height} ${record.heightUnit}` : '-'}</TableCell>
                          <TableCell>{record.weight ? `${record.weight} ${record.weightUnit}` : '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Milestones */}
            <Card>
              <CardHeader>
                <CardTitle>Milestones</CardTitle>
              </CardHeader>
              <CardContent>
                {milestones.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No milestones recorded</p>
                ) : (
                  <div className="space-y-4">
                    {milestones.map((milestone) => (
                      <div key={milestone.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium">{milestone.title}</p>
                          <Badge variant="secondary">{milestone.category}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{formatDate(milestone.dateAchieved)}</p>
                        {milestone.notes && (
                          <p className="text-xs text-muted-foreground mt-1">{milestone.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
