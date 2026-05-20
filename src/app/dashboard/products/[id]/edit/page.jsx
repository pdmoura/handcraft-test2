'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/providers/ToastProvider';
import { Save, Trash2, Upload } from 'lucide-react';
import CloudinaryUploadButton from '@/components/ui/CloudinaryUploadButton';
import { use } from 'react';
import { updateProductAction, deleteProductAction } from '@/lib/actions/products';

export default function EditProductPage({  params  }) {
  const { id } = use(params);
  const router = useRouter();
  const { showToast } = useToast();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', price: '', categoryId: '', tags: '', inventoryQty: '0', status: 'active' });
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch(`/api/products/${id}`).then(r => r.json()),
      fetch('/api/categories').then(r => r.json()),
    ]).then(([productData, catData]) => {
      if (productData.success) {
        const p = productData.data;
        setForm({ title: p.title, description: p.description, price: String(p.price), categoryId: String(p.categoryId), tags: (p.tags || []).join(', '), inventoryQty: String(p.inventoryQty), status: p.status });
        setImageUrls((p.images || []).map((img) => img.url));
      }
      if (catData.success) setCategories(catData.data);
    });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await updateProductAction(id, {
        ...form,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        images: imageUrls.map(url => ({ url })),
      });
      if (data.success) { showToast('Product updated!', 'success'); router.push('/dashboard/products'); }
      else showToast(data.error || 'Failed', 'error');
    } catch { showToast('Network error', 'error'); }
    finally { setIsLoading(false); }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this product?')) return;
    try {
      const data = await deleteProductAction(id);
      if (data.success) { showToast('Product deleted', 'success'); router.push('/dashboard/products'); }
      else showToast(data.error || 'Failed', 'error');
    } catch { showToast('Network error', 'error'); }
  };


  const inputClass = "w-full px-4 py-3 border border-border-light rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all";

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl text-primary uppercase">Edit Product</h1>
        <Button variant="danger" onClick={handleDelete}><Trash2 size={16} /> Delete</Button>
      </div>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-card p-6 md:p-8 max-w-3xl">
        <div className="space-y-5">
          <div><label htmlFor="title" className="font-ui text-sm font-medium text-text block mb-1.5">Title</label><input id="title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className={inputClass} required /></div>
          <div><label htmlFor="desc" className="font-ui text-sm font-medium text-text block mb-1.5">Description</label><textarea id="desc" value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={5} className={inputClass + ' resize-none'} required /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label htmlFor="price" className="font-ui text-sm font-medium text-text block mb-1.5">Price ($)</label><input id="price" type="number" step="0.01" min="0" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className={inputClass} required /></div>
            <div><label htmlFor="qty" className="font-ui text-sm font-medium text-text block mb-1.5">Inventory</label><input id="qty" type="number" min="0" value={form.inventoryQty} onChange={e => setForm({...form, inventoryQty: e.target.value})} className={inputClass} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label htmlFor="cat" className="font-ui text-sm font-medium text-text block mb-1.5">Category</label>
              <select id="cat" value={form.categoryId} onChange={e => setForm({...form, categoryId: e.target.value})} className={inputClass}><option value="">Select</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
            </div>
            <div><label htmlFor="status" className="font-ui text-sm font-medium text-text block mb-1.5">Status</label>
              <select id="status" value={form.status} onChange={e => setForm({...form, status: e.target.value})} className={inputClass}><option value="active">Active</option><option value="draft">Draft</option><option value="sold_out">Sold Out</option></select>
            </div>
          </div>
          <div><label htmlFor="tags" className="font-ui text-sm font-medium text-text block mb-1.5">Tags</label><input id="tags" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} className={inputClass} /></div>
          <div>
            <label className="font-ui text-sm font-medium text-text block mb-2">Images</label>
            <div className="mb-4">
              <CloudinaryUploadButton
                options={{ multiple: true }}
                onUpload={(url) => setImageUrls(prev => [...prev, url])}
                disabledFallback={<Button type="button" variant="outline" disabled><Upload size={16} className="mr-2 inline-block" /> Upload Image</Button>}
              >
                {({ open }) => (
                  <Button type="button" variant="outline" onClick={() => open()}>
                    <Upload size={16} className="mr-2 inline-block" /> Upload Image
                  </Button>
                )}
              </CloudinaryUploadButton>
            </div>
            {imageUrls.length > 0 && <div className="flex gap-2 flex-wrap">{imageUrls.map((url, i) => (
              <div key={i} className="relative group"><Image src={url} alt="" width={80} height={80} className="w-20 h-20 rounded-lg object-cover" /><button type="button" onClick={() => setImageUrls(imageUrls.filter((_, j) => j !== i))} className="absolute -top-1 -right-1 w-5 h-5 bg-error text-white rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">×</button></div>
            ))}</div>}
          </div>
        </div>
        <div className="mt-8"><Button type="submit" isLoading={isLoading} size="lg"><Save size={18} /> Update Product</Button></div>
      </form>
    </div>
  );
}
