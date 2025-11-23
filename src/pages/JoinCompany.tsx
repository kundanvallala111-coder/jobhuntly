import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Search, Building2, Users } from 'lucide-react';

interface Company {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  industry: string | null;
}

export default function JoinCompany() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

  useEffect(() => {
    loadCompanies();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCompanies(companies);
    } else {
      const filtered = companies.filter(
        (company) =>
          company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          company.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          company.industry?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCompanies(filtered);
    }
  }, [searchTerm, companies]);

  const loadCompanies = async () => {
    const { data, error } = await supabase
      .from('companies')
      .select('id, name, description, location, industry')
      .order('name');

    if (error) {
      toast({
        title: 'Error loading companies',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setCompanies(data || []);
      setFilteredCompanies(data || []);
    }
  };

  const handleJoin = async () => {
    if (!selectedCompany) {
      toast({
        title: 'Please select a company',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ company_id: selectedCompany })
        .eq('id', user!.id);

      if (error) throw error;

      toast({
        title: 'Successfully joined company!',
        description: 'You are now part of the company.',
      });

      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Failed to join company',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-3xl">
        <div className="mb-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-accent/10 p-3 rounded-full">
              <Users className="h-8 w-8 text-accent" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Join a Company</h1>
          <p className="text-muted-foreground">
            Search and select the company you want to join
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Search Companies</CardTitle>
            <CardDescription>Find your company by name, industry, or description</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="max-h-96 overflow-y-auto space-y-2">
              {filteredCompanies.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {searchTerm ? 'No companies found matching your search.' : 'No companies available.'}
                </div>
              ) : (
                filteredCompanies.map((company) => (
                  <Card
                    key={company.id}
                    className={`cursor-pointer transition-all ${
                      selectedCompany === company.id
                        ? 'border-primary bg-primary/5'
                        : 'hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedCompany(company.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <Building2 className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{company.name}</h3>
                          {company.description && (
                            <p className="text-sm text-muted-foreground mt-1">{company.description}</p>
                          )}
                          <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                            {company.location && <span>📍 {company.location}</span>}
                            {company.industry && <span>🏢 {company.industry}</span>}
                          </div>
                        </div>
                        {selectedCompany === company.id && (
                          <div className="bg-primary text-primary-foreground rounded-full p-1">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/company-setup')}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleJoin}
                disabled={loading || !selectedCompany}
                className="flex-1"
              >
                {loading ? 'Joining...' : 'Join Company'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}