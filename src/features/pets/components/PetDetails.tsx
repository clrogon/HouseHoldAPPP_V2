import { ArrowLeft, Syringe, Calendar, Pill, Scale, Banknote, Dog, Cat, Bird, Fish, Rabbit } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { formatCurrency } from '@/shared/lib/currency';
import type { Pet, Vaccination, VetAppointment, Medication, WeightRecord, PetExpense } from '../types/pets.types';

interface PetDetailsProps {
  pet: Pet;
  vaccinations: Vaccination[];
  appointments: VetAppointment[];
  medications: Medication[];
  weightRecords: WeightRecord[];
  expenses: PetExpense[];
  onBack: () => void;
}

const speciesIcons = {
  dog: Dog,
  cat: Cat,
  bird: Bird,
  fish: Fish,
  rabbit: Rabbit,
  hamster: Rabbit,
  reptile: Fish,
  other: Dog,
};

export function PetDetails({
  pet,
  vaccinations,
  appointments,
  medications,
  weightRecords,
  expenses,
  onBack,
}: PetDetailsProps) {
  const SpeciesIcon = speciesIcons[pet.species] || Dog;

  const calculateAge = (dateOfBirth?: string) => {
    if (!dateOfBirth) return 'Unknown';
    const birth = new Date(dateOfBirth);
    const now = new Date();
    const years = Math.floor((now.getTime() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    const months = Math.floor(((now.getTime() - birth.getTime()) % (365.25 * 24 * 60 * 60 * 1000)) / (30.44 * 24 * 60 * 60 * 1000));

    if (years === 0) {
      return `${months} months`;
    }
    return `${years} years, ${months} months`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getVaccinationStatus = (nextDueDate?: string) => {
    if (!nextDueDate) return { status: 'unknown', label: 'Unknown' };
    const dueDate = new Date(nextDueDate);
    const now = new Date();
    const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilDue < 0) return { status: 'overdue', label: 'Overdue' };
    if (daysUntilDue <= 30) return { status: 'due-soon', label: 'Due Soon' };
    return { status: 'current', label: 'Current' };
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const activeMedications = medications.filter(m => m.isActive);
  const upcomingAppointments = appointments.filter(a => a.status === 'scheduled');

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Pets
      </Button>

      {/* Pet Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="h-32 w-32">
              <AvatarImage src={pet.photo} alt={pet.name} />
              <AvatarFallback>
                <SpeciesIcon className="h-16 w-16 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>

            <div className="text-center md:text-left space-y-2">
              <h1 className="text-3xl font-bold">{pet.name}</h1>
              <p className="text-lg text-muted-foreground">
                {pet.breed || pet.species.charAt(0).toUpperCase() + pet.species.slice(1)}
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                <Badge>{pet.gender.charAt(0).toUpperCase() + pet.gender.slice(1)}</Badge>
                <Badge variant="secondary">{calculateAge(pet.dateOfBirth)}</Badge>
                {pet.weight && (
                  <Badge variant="outline">{pet.weight} {pet.weightUnit}</Badge>
                )}
              </div>
            </div>

            <div className="md:ml-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-muted rounded-lg">
                <Syringe className="h-5 w-5 mx-auto mb-1 text-blue-500" />
                <p className="text-2xl font-bold">{vaccinations.length}</p>
                <p className="text-xs text-muted-foreground">Vaccinations</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <Calendar className="h-5 w-5 mx-auto mb-1 text-purple-500" />
                <p className="text-2xl font-bold">{upcomingAppointments.length}</p>
                <p className="text-xs text-muted-foreground">Upcoming</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <Pill className="h-5 w-5 mx-auto mb-1 text-green-500" />
                <p className="text-2xl font-bold">{activeMedications.length}</p>
                <p className="text-xs text-muted-foreground">Medications</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <Banknote className="h-5 w-5 mx-auto mb-1 text-amber-500" />
                <p className="text-2xl font-bold">{formatCurrency(totalExpenses)}</p>
                <p className="text-xs text-muted-foreground">Despesas</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different sections */}
      <Tabs defaultValue="health" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="health">Health</TabsTrigger>
          <TabsTrigger value="vaccinations">Vaccinations</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
        </TabsList>

        {/* Health Tab */}
        <TabsContent value="health">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Species</p>
                    <p className="font-medium">{pet.species.charAt(0).toUpperCase() + pet.species.slice(1)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Breed</p>
                    <p className="font-medium">{pet.breed || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date of Birth</p>
                    <p className="font-medium">{pet.dateOfBirth ? formatDate(pet.dateOfBirth) : 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Color</p>
                    <p className="font-medium">{pet.color || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Microchip</p>
                    <p className="font-medium font-mono text-sm">{pet.microchipNumber || 'Not registered'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Current Weight</p>
                    <p className="font-medium">{pet.weight ? `${pet.weight} ${pet.weightUnit}` : 'Not recorded'}</p>
                  </div>
                </div>
                {pet.notes && (
                  <div>
                    <p className="text-sm text-muted-foreground">Notes</p>
                    <p className="font-medium">{pet.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5" />
                  Weight History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {weightRecords.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No weight records</p>
                ) : (
                  <div className="space-y-2">
                    {weightRecords.slice(0, 5).map((record) => (
                      <div key={record.id} className="flex items-center justify-between py-2 border-b last:border-0">
                        <span className="text-sm">{formatDate(record.date)}</span>
                        <span className="font-medium">{record.weight} {record.unit}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Vaccinations Tab */}
        <TabsContent value="vaccinations">
          <Card>
            <CardHeader>
              <CardTitle>Vaccination Records</CardTitle>
            </CardHeader>
            <CardContent>
              {vaccinations.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No vaccination records</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vaccine</TableHead>
                      <TableHead>Date Given</TableHead>
                      <TableHead>Next Due</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Veterinarian</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vaccinations.map((vax) => {
                      const status = getVaccinationStatus(vax.nextDueDate);
                      return (
                        <TableRow key={vax.id}>
                          <TableCell className="font-medium">{vax.name}</TableCell>
                          <TableCell>{formatDate(vax.dateGiven)}</TableCell>
                          <TableCell>{vax.nextDueDate ? formatDate(vax.nextDueDate) : '-'}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                status.status === 'overdue' ? 'destructive' :
                                status.status === 'due-soon' ? 'secondary' : 'outline'
                              }
                            >
                              {status.label}
                            </Badge>
                          </TableCell>
                          <TableCell>{vax.veterinarian || '-'}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appointments Tab */}
        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle>Vet Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              {appointments.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No appointments</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Veterinarian</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Cost</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.map((apt) => (
                      <TableRow key={apt.id}>
                        <TableCell>{formatDate(apt.date)}</TableCell>
                        <TableCell>{apt.time}</TableCell>
                        <TableCell className="font-medium">{apt.reason}</TableCell>
                        <TableCell>{apt.veterinarian || '-'}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              apt.status === 'completed' ? 'default' :
                              apt.status === 'cancelled' ? 'destructive' : 'secondary'
                            }
                          >
                            {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{apt.cost ? formatCurrency(apt.cost) : '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Medications Tab */}
        <TabsContent value="medications">
          <Card>
            <CardHeader>
              <CardTitle>Medications</CardTitle>
            </CardHeader>
            <CardContent>
              {medications.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No medications</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Medication</TableHead>
                      <TableHead>Dosage</TableHead>
                      <TableHead>Frequency</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {medications.map((med) => (
                      <TableRow key={med.id}>
                        <TableCell className="font-medium">{med.name}</TableCell>
                        <TableCell>{med.dosage}</TableCell>
                        <TableCell>{med.frequency}</TableCell>
                        <TableCell>{formatDate(med.startDate)}</TableCell>
                        <TableCell>
                          <Badge variant={med.isActive ? 'default' : 'secondary'}>
                            {med.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Expenses Tab */}
        <TabsContent value="expenses">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Despesas</span>
                <span className="text-2xl">{formatCurrency(totalExpenses)}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {expenses.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No expenses recorded</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell>{formatDate(expense.date)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{expense.description}</TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(expense.amount)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
