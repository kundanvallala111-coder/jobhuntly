import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Briefcase, Shield, Users, Sparkles } from 'lucide-react';

export default function Auth() {
  const { signIn, signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Sign In State
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Sign Up State
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'candidate' | 'recruiter'>('candidate');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signIn(signInEmail, signInPassword);
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signUp(signUpEmail, signUpPassword, fullName, role);
    } catch (error) {
      console.error('Sign up error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 flex items-center justify-center">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-primary">
            <Briefcase className="h-10 w-10" />
            <div>
              <p className="text-sm uppercase tracking-widest text-primary/80">Job application OS</p>
              <h1 className="text-4xl font-bold text-white">Welcome to JobHuntly</h1>
            </div>
          </div>
          <p className="text-white/70 text-lg">
            A modern command center for candidates and recruiters. Track applications, stay on top of interviews,
            and manage talent pipelines in one beautiful dashboard.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="bg-white/5 rounded-2xl p-4 space-y-2 border border-white/10">
              <Shield className="h-6 w-6 text-primary" />
              <p className="text-sm text-white/60">Secure by default</p>
              <p className="text-white font-semibold text-lg">Role-based access</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 space-y-2 border border-white/10">
              <Users className="h-6 w-6 text-primary" />
              <p className="text-sm text-white/60">For teams & individuals</p>
              <p className="text-white font-semibold text-lg">Collaborative workspace</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm text-white/70">
            <Sparkles className="h-4 w-4 text-primary" />
            Trusted by 10,000+ job seekers
          </div>
        </div>

        <Card className="bg-slate-900/80 border border-white/10 shadow-2xl">
          <CardHeader className="text-center space-y-3">
            <CardTitle className="text-2xl text-white">Access your workspace</CardTitle>
            <CardDescription className="text-white/70">
              Sign in to continue or create a new account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="text-white">
              <TabsList className="grid w-full grid-cols-2 bg-white/5">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="you@example.com"
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="••••••••"
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>I am a</Label>
                    <RadioGroup value={role} onValueChange={(value) => setRole(value as 'candidate' | 'recruiter')}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="candidate" id="candidate" />
                        <Label htmlFor="candidate" className="font-normal cursor-pointer">
                          Candidate · Looking for jobs
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="recruiter" id="recruiter" />
                        <Label htmlFor="recruiter" className="font-normal cursor-pointer">
                          Recruiter · Hiring talent
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
