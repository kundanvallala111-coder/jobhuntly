import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Users,
  BarChart3,
  Shield,
  FileText,
  CheckCircle,
  TrendingUp,
  FolderOpen,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Twitter,
  Facebook,
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const features = [
    {
      icon: Briefcase,
      title: 'Application Tracking',
      description: 'Keep every job application organized with timelines, reminders, and custom tags.',
    },
    {
      icon: CheckCircle,
      title: 'Status Updates',
      description: 'Track interview stages, follow-ups, and next actions without losing momentum.',
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Visualize your job search progress with conversion rates and response trends.',
    },
    {
      icon: FolderOpen,
      title: 'Document Storage',
      description: 'Store resumes, cover letters, and portfolio links securely in one place.',
    },
  ];

  const stats = [
    { label: 'Job Seekers', value: '10,000+' },
    { label: 'Partner Companies', value: '500+' },
    { label: 'Success Rate', value: '95%' },
  ];

  const quickLinks = ['About', 'Pricing', 'Blog', 'Support'];

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>('[data-animate="true"]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute('data-visible', 'true');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white scroll-smooth overflow-x-hidden">
      <main>
        {/* Hero Section */}
        <section
          className="container mx-auto px-4 py-20 flex flex-col lg:flex-row items-center gap-12 transition-all duration-700 ease-out opacity-0 translate-y-10 data-[visible=true]:opacity-100 data-[visible=true]:translate-y-0"
          data-animate="true"
        >
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-2 text-primary">
              <Briefcase className="h-8 w-8" />
              <span className="text-2xl font-bold">JobHuntly</span>
            </div>
            <p className="text-sm tracking-widest uppercase text-primary">Job Application Tracking Platform</p>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Track Every Application, Land Your Dream Job
            </h1>
            <p className="text-lg text-white/70">
              JobHuntly keeps every resume, follow-up, and interview update in one beautiful workspace—so you can focus
              on landing offers, not managing spreadsheets.
            </p>
            <Button size="lg" className="w-fit" onClick={() => navigate('/auth')}>
              Get Started
            </Button>
            <div className="flex flex-wrap gap-8 pt-4 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                End-to-end encryption
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Collaboration ready
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Smart templates
              </div>
            </div>
          </div>

          <div className="flex-1 w-full">
            <div className="relative bg-gradient-to-br from-indigo-500 via-purple-500 to-sky-500 rounded-3xl p-6 shadow-xl">
              <div className="absolute inset-0 bg-grid-white/10 rounded-3xl pointer-events-none" />
              <div className="relative space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm">Weekly Applications</p>
                    <p className="text-3xl font-bold">18</p>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-200 text-sm font-medium">
                    <TrendingUp className="h-4 w-4" />
                    +24%
                  </div>
                </div>
                <div className="bg-white/10 rounded-2xl p-4 space-y-3">
                  {['Meta', 'Stripe', 'Notion'].map((company) => (
                    <div key={company} className="flex items-center justify-between text-sm">
                      <div>
                        <p className="font-semibold">{company}</p>
                        <p className="text-white/60">Product Designer</p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-white/10 text-white">
                        {company === 'Meta' ? 'Interview' : company === 'Stripe' ? 'Assessment' : 'Applied'}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 bg-white/10 rounded-2xl p-4">
                    <p className="text-white/70 text-sm">Follow-ups</p>
                    <p className="text-2xl font-bold">12</p>
                  </div>
                  <div className="flex-1 bg-white/10 rounded-2xl p-4">
                    <p className="text-white/70 text-sm">Saved docs</p>
                    <p className="text-2xl font-bold">37</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section
          id="dashboard"
          className="bg-slate-900/60 py-20 transition-all duration-700 ease-out opacity-0 translate-y-10 data-[visible=true]:opacity-100 data-[visible=true]:translate-y-0"
          data-animate="true"
        >
          <div className="container mx-auto px-4 space-y-12">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <p className="text-sm uppercase tracking-widest text-primary">Features</p>
              <h2 className="text-3xl md:text-4xl font-bold">Everything Organized & Optimized</h2>
              <p className="text-white/70">
                Replace scattered spreadsheets with one unified workspace that gives you clarity, confidence, and control
                over your job search.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="bg-slate-800/60 border border-white/5 rounded-2xl p-6 hover:-translate-y-1 hover:border-primary/50 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-white/70 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats & Testimonial */}
        <section
          id="analytics"
          className="container mx-auto px-4 py-20 space-y-12 transition-all duration-700 ease-out opacity-0 translate-y-10 data-[visible=true]:opacity-100 data-[visible=true]:translate-y-0"
          data-animate="true"
        >
          <div className="grid gap-6 md:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-slate-900/60 border border-white/5 rounded-2xl p-6 text-center">
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
                <p className="text-white/70 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="bg-gradient-to-r from-indigo-600/40 to-purple-600/40 border border-white/10 rounded-3xl p-8 md:p-12 flex flex-col lg:flex-row gap-10 items-center">
            <div className="space-y-4 flex-1">
              <p className="text-white/80 text-sm uppercase tracking-widest">Testimonial</p>
              <p className="text-2xl font-semibold">
                “JobHuntly helped me juggle 30+ applications, stay proactive with follow-ups, and land my dream role at a
                top tech company in under 8 weeks.”
              </p>
              <div className="text-white/70">
                <p className="font-semibold">Maya Patel</p>
                <p>Product Designer, Stripe</p>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <div className="bg-white/5 rounded-2xl p-4 text-center">
                <p className="text-sm text-white/70">Applications Managed</p>
                <p className="text-3xl font-bold text-white">74</p>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 text-center">
                <p className="text-sm text-white/70">Offer Acceptance</p>
                <p className="text-3xl font-bold text-emerald-300">3</p>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 text-center sm:col-span-2">
                <p className="text-sm text-white/70">Average Response Time</p>
                <p className="text-3xl font-bold text-amber-200">4.6 days</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        className="bg-slate-950 border-t border-white/10 transition-all duration-700 ease-out opacity-0 translate-y-10 data-[visible=true]:opacity-100 data-[visible=true]:translate-y-0"
        data-animate="true"
      >
        <div className="container mx-auto px-4 py-16 grid gap-10 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Briefcase className="h-7 w-7 text-primary" />
              <span className="text-xl font-semibold">JobHuntly</span>
            </div>
            <p className="text-white/70 text-sm">
              Track applications, follow-ups, interviews, and documents with confidence.
            </p>
            <div className="flex gap-3 text-white/70 text-sm">
              <Mail className="h-4 w-4" />
              hello@jobhuntly.com
            </div>
            <div className="flex gap-3 text-white/70 text-sm">
              <Phone className="h-4 w-4" />
              +1 (415) 555-0123
            </div>
            <div className="flex gap-3 text-white/70 text-sm">
              <MapPin className="h-4 w-4" />
              500 Howard St, San Francisco
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-white/70 text-sm">
              {quickLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-3">
              {[Linkedin, Twitter, Facebook].map((Icon, index) => (
                <a key={index} href="#" className="p-3 rounded-full border border-white/10 hover:border-primary transition">
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Stay in the loop</h4>
            <p className="text-white/70 text-sm mb-4">Weekly updates with job search insights and product tips.</p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Email address"
                className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button type="submit" className="w-full">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
        <div className="border-t border-white/10 py-6 text-center text-white/60 text-sm">
          © {new Date().getFullYear()} JobHuntly. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
