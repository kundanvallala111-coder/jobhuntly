import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Users, ArrowRight, X } from 'lucide-react';

export default function CompanySetup() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to JobHuntly!</h1>
          <p className="text-muted-foreground">
            To get started, you need to create or join a company.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/company-setup/create')}
          >
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Create New Company</CardTitle>
              </div>
              <CardDescription>
                Start fresh and create a new company profile for your organization.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                Create Company <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/company-setup/join')}
          >
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-accent/10 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Join Existing Company</CardTitle>
              </div>
              <CardDescription>
                Join a company that&rsquo;s already using JobHuntly.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                Join Company <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 text-center">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="mr-2 h-4 w-4" />
            Skip for now
          </Button>
        </div>
      </div>
    </div>
  );
}