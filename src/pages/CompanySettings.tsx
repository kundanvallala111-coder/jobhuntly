import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { Building2 } from 'lucide-react';

interface Company {
  id: string;
  name: string;
  description: string | null;
  website: string | null;
  location: string | null;
  industry: string | null;
}

export default function CompanySettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState<Company | null>(null);
  const [loadingCompany, setLoadingCompany] = useState(true);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [location, setLocation] = useState('');
  const [industry, setIndustry] = useState('');

  useEffect(() => {
    loadCompany();
  }, []);

  const loadCompany = async () => {
    setLoadingCompany(true);
    try {
      // Get user's company_id
      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user!.id)
        .single();

      if (!profile?.company_id) {
        toast({
          title: 'No company found',
          description: 'You are not associated with any company.',
          variant: 'destructive',
        });
        return;
      }

      // Get company details
      const { data: companyData, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', profile.company_id)
        .single();

      if (error) throw error;

      setCompany(companyData);
      setName(companyData.name);
      setDescription(companyData.description || '');
      setWebsite(companyData.website || '');
      setLocation(companyData.location || '');
      setIndustry(companyData.industry || '');
    } catch (error: any) {
      toast({
        title: 'Error loading company',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoadingCompany(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('companies')
        .update({
          name,
          description: description || null,
          website: website || null,
          location: location || null,
          industry: industry || null,
        })
        .eq('id', company.id);

      if (error) throw error;

      toast({
        title: 'Company updated!',
        description: 'Your company information has been saved.',
      });

      loadCompany();
    } catch (error: any) {
      toast({
        title: 'Failed to update company',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loadingCompany) {
    return (
      <div className="p-8">
        <div className="text-center">Loading company information...</div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">No company found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Company Settings</h1>
        </div>
        <p className="text-muted-foreground mt-2">Manage your company information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>Update your company details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="TechCorp Inc."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell us about your company..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="San Francisco, CA"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="Technology, Healthcare, Finance..."
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}