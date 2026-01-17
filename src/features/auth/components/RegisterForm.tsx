import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { Progress } from '@/shared/components/ui/progress';
import { useAuthStore } from '../store/authStore';

// Step 1: Account Info Schema
const step1Schema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Step 2: Personal Info Schema
const step2Schema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z.string().optional(),
});

// Step 3: Household Schema
const step3Schema = z.object({
  householdOption: z.enum(['create', 'join']),
  householdName: z.string().optional(),
  inviteCode: z.string().optional(),
}).refine((data) => {
  if (data.householdOption === 'create' && (!data.householdName || data.householdName.length < 2)) {
    return false;
  }
  if (data.householdOption === 'join' && (!data.inviteCode || data.inviteCode.length < 6)) {
    return false;
  }
  return true;
}, {
  message: 'Please provide household name or invite code',
  path: ['householdName'],
});

// Combined schema for final submission
const registerSchema = step1Schema.merge(step2Schema).merge(step3Schema);

type RegisterFormData = z.infer<typeof registerSchema>;

const steps = [
  { title: 'Account', description: 'Create your account' },
  { title: 'Profile', description: 'Tell us about yourself' },
  { title: 'Household', description: 'Set up your household' },
];

export function RegisterForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { register: registerUser, isLoading, error, clearError } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
    setValue,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phone: '',
      householdOption: 'create',
      householdName: '',
      inviteCode: '',
    },
    mode: 'onChange',
  });

  const householdOption = watch('householdOption');

  const validateStep = async () => {
    let fieldsToValidate: (keyof RegisterFormData)[] = [];

    switch (currentStep) {
      case 0:
        fieldsToValidate = ['email', 'password', 'confirmPassword'];
        break;
      case 1:
        fieldsToValidate = ['firstName', 'lastName'];
        break;
      case 2:
        fieldsToValidate = ['householdOption', 'householdName', 'inviteCode'];
        break;
    }

    const result = await trigger(fieldsToValidate);
    return result;
  };

  const nextStep = async () => {
    const isValid = await validateStep();
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data);
      navigate('/dashboard');
    } catch {
      // Error handled by store
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Create an account</CardTitle>
        <CardDescription className="text-center">
          {steps[currentStep].description}
        </CardDescription>

        {/* Progress indicator */}
        <div className="pt-4">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-2">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className={`text-xs ${
                  index <= currentStep
                    ? 'text-primary font-medium'
                    : 'text-muted-foreground'
                }`}
              >
                {index < currentStep ? (
                  <span className="flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    {step.title}
                  </span>
                ) : (
                  step.title
                )}
              </div>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Step 1: Account Info */}
          {currentStep === 0 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  autoComplete="email"
                  {...register('email', { onChange: () => clearError() })}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    autoComplete="new-password"
                    {...register('password')}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Min 8 characters with uppercase, lowercase, and number
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    {...register('confirmPassword')}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                )}
              </div>
            </>
          )}

          {/* Step 2: Personal Info */}
          {currentStep === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  autoComplete="given-name"
                  {...register('firstName')}
                />
                {errors.firstName && (
                  <p className="text-sm text-destructive">{errors.firstName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  autoComplete="family-name"
                  {...register('lastName')}
                />
                {errors.lastName && (
                  <p className="text-sm text-destructive">{errors.lastName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="555-123-4567"
                  autoComplete="tel"
                  {...register('phone')}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone.message}</p>
                )}
              </div>
            </>
          )}

          {/* Step 3: Household */}
          {currentStep === 2 && (
            <>
              <div className="space-y-4">
                <Label>How would you like to start?</Label>

                <div className="grid gap-3">
                  <div
                    className={`relative flex cursor-pointer rounded-lg border p-4 ${
                      householdOption === 'create'
                        ? 'border-primary bg-primary/5'
                        : 'border-muted hover:border-muted-foreground/50'
                    }`}
                    onClick={() => setValue('householdOption', 'create')}
                  >
                    <input
                      type="radio"
                      value="create"
                      {...register('householdOption')}
                      className="sr-only"
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">Create a new household</span>
                      <span className="text-sm text-muted-foreground">
                        Start fresh and invite your family members
                      </span>
                    </div>
                  </div>

                  <div
                    className={`relative flex cursor-pointer rounded-lg border p-4 ${
                      householdOption === 'join'
                        ? 'border-primary bg-primary/5'
                        : 'border-muted hover:border-muted-foreground/50'
                    }`}
                    onClick={() => setValue('householdOption', 'join')}
                  >
                    <input
                      type="radio"
                      value="join"
                      {...register('householdOption')}
                      className="sr-only"
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">Join existing household</span>
                      <span className="text-sm text-muted-foreground">
                        Use an invite code from a family member
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {householdOption === 'create' && (
                <div className="space-y-2">
                  <Label htmlFor="householdName">Household Name</Label>
                  <Input
                    id="householdName"
                    type="text"
                    placeholder="The Smith Family"
                    {...register('householdName')}
                  />
                  {errors.householdName && (
                    <p className="text-sm text-destructive">{errors.householdName.message}</p>
                  )}
                </div>
              )}

              {householdOption === 'join' && (
                <div className="space-y-2">
                  <Label htmlFor="inviteCode">Invite Code</Label>
                  <Input
                    id="inviteCode"
                    type="text"
                    placeholder="Enter 6-digit code"
                    {...register('inviteCode')}
                  />
                  {errors.inviteCode && (
                    <p className="text-sm text-destructive">{errors.inviteCode.message}</p>
                  )}
                </div>
              )}
            </>
          )}

          {/* Navigation buttons */}
          <div className="flex gap-2 pt-4">
            {currentStep > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={isLoading}
                className="flex-1"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            )}

            {currentStep < steps.length - 1 ? (
              <Button
                type="button"
                onClick={nextStep}
                disabled={isLoading}
                className="flex-1"
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create account'
                )}
              </Button>
            )}
          </div>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
