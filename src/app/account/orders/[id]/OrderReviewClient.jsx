'use client';
import { useState } from 'react';
import Button from '@/components/ui/Button';
import { Star, MessageSquare } from 'lucide-react';
import { useToast } from '@/components/providers/ToastProvider';
import { useRouter } from 'next/navigation';
import { createReviewAction } from '@/lib/actions/reviews';

export default function OrderReviewClient({  orderItemId, productId, hasReviewed  }) {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      showToast('Please select a rating', 'warning');
      return;
    }
    if (!comment.trim()) {
      showToast('Please write a review comment', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await createReviewAction({ productId, orderItemId, rating, comment: comment.trim() });
      
      if (data.success) {
        showToast('Review submitted successfully!', 'success');
        setIsOpen(false);
        router.refresh();
      } else {
        showToast(data.error || 'Failed to submit review', 'error');
      }
    } catch {
      showToast('Network error', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };


  if (hasReviewed) {
    return (
      <span className="inline-flex items-center gap-1 font-ui text-xs text-success font-semibold">
        <Star size={14} className="fill-current" /> You reviewed this item
      </span>
    );
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1 font-ui text-xs font-semibold text-accent hover:text-accent-hover transition-colors"
      >
        <MessageSquare size={14} /> Leave a Review
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="p-5 border-b border-border-light flex justify-between items-center bg-surface">
              <h3 className="font-display text-xl text-primary uppercase">Write a Review</h3>
              <button onClick={() => setIsOpen(false)} className="text-text-muted hover:text-text text-2xl leading-none">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-6">
                <label className="font-ui text-sm font-bold text-text mb-2 block">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        size={32}
                        className={`${rating >= star ? 'text-accent fill-accent' : 'text-border-light fill-transparent'} transition-colors`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="font-ui text-sm font-bold text-text mb-2 block">Your Review</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-border-light rounded-xl font-body text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent/30"
                  placeholder="What did you love about this item?"
                  required
                />
              </div>

              <div className="flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={isSubmitting} className="flex-1">
                  Submit Review
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
