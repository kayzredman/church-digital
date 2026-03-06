import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Card, Input, Button } from '@/components';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const { signUp } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const validateForm = () => {
    const newErrors: any = {};

    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!firstName) newErrors.firstName = 'First name is required';
    if (!lastName) newErrors.lastName = 'Last name is required';
    if (!contactNumber) newErrors.contactNumber = 'Contact number is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      await signUp(email, password, firstName, lastName, contactNumber);
      toast.success('Account created successfully!');
      router.push('/');
    } catch (error: any) {
      toast.error(error.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen text-white flex items-center justify-center px-4 overflow-hidden">
      {/* Gradient Background with Transparency */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-400 via-blue-600 to-blue-900 opacity-90"></div>
      
      {/* Content */}
      <div className="relative">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Us</h1>
          <p className="text-gray-600">Create your account to get started</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="First Name"
              placeholder="John"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              error={errors.firstName}
              required
            />
            <Input
              label="Last Name"
              placeholder="Doe"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              error={errors.lastName}
              required
            />
          </div>
          <Input
            label="Contact Number"
            placeholder="e.g. 08012345678"
            value={contactNumber}
            onChange={e => setContactNumber(e.target.value)}
            error={errors.contactNumber}
            required
          />

          <Input
            type="email"
            label="Email Address"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            required
          />

          <Input
            type="password"
            label="Password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            helpText="At least 6 characters"
            required
          />

          <Input
            type="password"
            label="Confirm Password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
            required
          />

          <div className="flex items-start">
            <input
              type="checkbox"
              id="terms"
              className="mt-1 w-4 h-4"
              required
            />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
              I agree to the{' '}
              <Link href="/terms" className="text-blue-600 hover:text-blue-700">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-blue-600 hover:text-blue-700">
                Privacy Policy
              </Link>
            </label>
          </div>

          <Button
            type="submit"
            className="w-full py-3 text-lg font-bold"
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create My Account'}
          </Button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">
            Sign in
          </Link>
        </p>
      </Card>
      </div>
    </div>
  );
}
