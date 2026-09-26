import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { ShieldCheck, ArrowRight, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCase } from '@/features/case';
import { metadata } from '@/features/ui';

export const Route = createFileRoute('/auth')({
  head: () => metadata('Sign in', 'Sign in or create a demo account to continue your Claim Saathi workspace.'),
  component: AuthPage,
});

function AuthPage() {
  const { user, signIn } = useCase();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) { setError('Please enter a valid email address.'); return; }
    if (password.length < 4) { setError('Please enter a password (any 4+ characters for this demo).'); return; }
    if (mode === 'signup' && name.trim().length < 2) { setError('Please enter your name.'); return; }
    const displayName = mode === 'signup' ? name.trim() : (email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Family member');
    signIn({ name: displayName, email });
    navigate({ to: '/' });
  };

  if (user) {
    return (
      <div className="mx-auto max-w-md py-10 text-center">
        <span className="mx-auto mb-5 flex size-12 items-center justify-center rounded-md bg-primary text-primary-foreground"><ShieldCheck className="size-6" strokeWidth={1.7} /></span>
        <h1 className="page-title">You're signed in</h1>
        <p className="mt-2 text-sm text-muted-foreground">Welcome, {user.name}. Your demo workspace is ready.</p>
        <Button className="mt-6" onClick={() => navigate({ to: '/' })}>Go to Overview <ArrowRight className="size-4" /></Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md py-6 md:py-10">
      <div className="mb-8 text-center">
        <span className="mx-auto mb-5 flex size-12 items-center justify-center rounded-md bg-primary text-primary-foreground"><ShieldCheck className="size-6" strokeWidth={1.7} /></span>
        <h1 className="page-title">{mode === 'signin' ? 'Welcome back' : 'Create your account'}</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{mode === 'signin' ? 'Sign in to continue organizing your family workspace.' : 'Set up a calm, private space to organize what comes next.'}</p>
      </div>

      <div className="surface p-6 md:p-8">
        <div className="mb-6 grid grid-cols-2 gap-1 rounded-md bg-muted p-1">
          {(['signin', 'signup'] as const).map(m => (
            <button key={m} type="button" onClick={() => { setMode(m); setError(''); }}
              className={`rounded px-3 py-2 text-sm font-medium transition-colors ${mode === m ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
              {m === 'signin' ? 'Sign in' : 'Sign up'}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-4">
          {mode === 'signup' && (
            <div className="space-y-1.5">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" autoComplete="name" />
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="email">Email address</Label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} />
          </div>
          {error && <p className="rounded-md bg-danger-soft px-3 py-2 text-xs font-medium text-danger-ink">{error}</p>}
          <Button type="submit" className="w-full">{mode === 'signin' ? 'Sign in' : 'Create account'} <ArrowRight className="size-4" /></Button>
        </form>

        <p className="mt-5 flex items-start gap-2 rounded-md bg-teal-soft px-3 py-2.5 text-xs leading-5 text-teal">
          <Info className="mt-0.5 size-3.5 shrink-0" />
          Demo mode: no real account is created and nothing leaves your browser. Any email and password will work.
        </p>
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Prefer to explore first? <Link to="/" className="font-medium text-teal underline-offset-2 hover:underline">Continue as guest</Link>
      </p>
    </div>
  );
}
