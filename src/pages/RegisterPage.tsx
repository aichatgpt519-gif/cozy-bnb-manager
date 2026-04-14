import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Hotel } from 'lucide-react';
import { toast } from 'sonner';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signUp(email, password, name);
      toast.success('Account created! Please check your email to verify.');
      navigate('/');
    } catch (err: any) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md border-border">
        <CardHeader className="text-center">
          <Link to="/" className="mx-auto mb-4 flex items-center gap-2">
            <Hotel className="h-7 w-7 text-primary" />
            <span className="font-heading text-xl font-bold">Grand Haven</span>
          </Link>
          <CardTitle className="font-heading text-2xl">Create Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Full Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Email</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Password</label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} className="mt-1" />
            </div>
            <Button variant="hero" className="w-full" type="submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Sign Up'}
            </Button>
          </form>
          <div className="my-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">OR</span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <Button variant="outline" className="w-full" onClick={() => signInWithGoogle()}>
            Continue with Google
          </Button>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary hover:underline">Sign In</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
