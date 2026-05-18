'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useToast } from '@/components/providers/ToastProvider';
import Button from '@/components/ui/Button';
import { Save } from 'lucide-react';

export default function DashboardProfilePage() {
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ bio: '', location: '', instagram: '', twitter: '', website: '' });

  useEffect(() => {
    if (user) {
      const social = user.socialLinks;
      setForm({ bio: user.bio || '', location: user.location || '', instagram: social?.instagram || '', twitter: social?.twitter || '', website: social?.website || '' });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault(); setIsLoading(true);
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bio: form.bio, location: form.location, socialLinks: { instagram: form.instagram, twitter: form.twitter, website: form.website } }),
      });
      const data = await res.json();
      if (data.success) { showToast('Profile updated!', 'success'); refreshUser(); }
      else showToast(data.error || 'Failed', 'error');
    } catch { showToast('Network error', 'error'); }
    finally { setIsLoading(false); }
  };

  const inputClass = "w-full px-4 py-3 border border-border-light rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all";

  return (
    <div>
      <h1 className="font-display text-2xl text-primary uppercase mb-8">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-card p-6 md:p-8 max-w-2xl">
        <div className="space-y-5">
          <div><label htmlFor="bio" className="font-ui text-sm font-medium text-text block mb-1.5">Bio / Story</label><textarea id="bio" value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} rows={4} className={inputClass + ' resize-none'} placeholder="Tell your story as an artisan..." /></div>
          <div><label htmlFor="location" className="font-ui text-sm font-medium text-text block mb-1.5">Location</label><input id="location" value={form.location} onChange={e => setForm({...form, location: e.target.value})} className={inputClass} placeholder="Portland, Oregon" /></div>
          <hr className="border-border-light" />
          <h3 className="font-display text-lg text-primary uppercase">Social Links</h3>
          <div><label htmlFor="instagram" className="font-ui text-sm font-medium text-text block mb-1.5">Instagram</label><input id="instagram" value={form.instagram} onChange={e => setForm({...form, instagram: e.target.value})} className={inputClass} placeholder="https://instagram.com/..." /></div>
          <div><label htmlFor="twitter" className="font-ui text-sm font-medium text-text block mb-1.5">Twitter / X</label><input id="twitter" value={form.twitter} onChange={e => setForm({...form, twitter: e.target.value})} className={inputClass} placeholder="https://twitter.com/..." /></div>
          <div><label htmlFor="website" className="font-ui text-sm font-medium text-text block mb-1.5">Website</label><input id="website" value={form.website} onChange={e => setForm({...form, website: e.target.value})} className={inputClass} placeholder="https://..." /></div>
        </div>
        <div className="mt-8"><Button type="submit" isLoading={isLoading} size="lg"><Save size={18} /> Save Profile</Button></div>
      </form>
    </div>
  );
}
