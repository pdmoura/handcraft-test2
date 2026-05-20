'use client';

import { useState } from 'react';
import Image from 'next/image';
import StarRating from '@/components/ui/StarRating';
import Button from '@/components/ui/Button';
import { useAuth } from '@/components/providers/AuthProvider';
import { useToast } from '@/components/providers/ToastProvider';
import { formatDate } from '@/lib/utils';
import { MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { replyToReviewAction } from '@/lib/actions/reviews';

export default function ReviewSection({  productId, sellerId, reviews: initialReviews, avgRating, reviewCount  }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [reviews, setReviews] = useState(initialReviews);

  // Seller reply state
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  const isSeller = user?.id === sellerId;

  const handleReplySubmit = async (reviewId, forcedText = null) => {
    const textToSubmit = forcedText !== null ? forcedText : replyText.trim();
    if (forcedText === null && !textToSubmit) {
      showToast('Please provide a reply', 'warning');
      return;
    }

    setIsSubmittingReply(true);
    try {
      const data = await replyToReviewAction(reviewId, textToSubmit);
      if (data.success) {
        setReviews(reviews.map((r) => r.id === reviewId ? {
          ...r,
          sellerReply: data.data.sellerReply,
          sellerReplyAt: data.data.sellerReplyAt,
        } : r));
        setReplyingTo(null);
        setReplyText('');
        showToast(textToSubmit === '' ? 'Reply deleted!' : 'Reply saved!', 'success');
      } else {
        showToast(data.error || 'Failed to save reply', 'error');
      }
    } catch {
      showToast('Network error', 'error');
    } finally {
      setIsSubmittingReply(false);
    }
  };

  return (
    <section className="pt-6 pb-12 border-t border-border-light" id="reviews">
      <div className="w-full">
        <h2 className="font-display text-2xl text-primary uppercase mb-2">
          Reviews & Ratings
        </h2>

        {/* Summary */}
        <div className="flex items-center gap-4 mb-8">
          <div className="text-4xl font-body font-bold text-primary">
            {avgRating.toFixed(1)}
          </div>
          <div>
            <StarRating rating={avgRating} size={20} />
            <p className="font-ui text-sm text-text-muted mt-1">
              Based on {reviewCount} review{reviewCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Review Form Prompt */}
        {!user ? (
          <div className="bg-surface-warm rounded-xl p-6 mb-8 text-center">
            <p className="font-body text-sm text-text-muted mb-3">
              Sign in to leave a review after purchasing
            </p>
            <Link
              href="/auth/login?redirect=/shop"
              className="inline-flex items-center gap-2 bg-cta hover:bg-cta-hover text-text font-body font-semibold px-5 py-2 rounded-full transition-colors text-sm"
            >
              Sign In
            </Link>
          </div>
        ) : (
          <div className="bg-surface-warm rounded-xl p-6 mb-8 text-center flex flex-col items-center justify-center gap-3">
            <p className="font-body text-sm text-text-muted">
              To leave a review for this product, please visit your Orders page after purchasing.
            </p>
            <Link
              href="/account"
              className="inline-flex items-center gap-2 text-accent hover:text-accent-hover font-ui text-sm font-semibold transition-colors"
            >
              Go to My Orders
            </Link>
          </div>
        )}

        {/* Reviews List */}
        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-xl p-6 shadow-card animate-fade-in">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {review.user?.avatarUrl ? (
                      <Image
                        src={review.user.avatarUrl}
                        alt=""
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-ui font-bold text-primary text-sm">
                        {review.user?.name?.charAt(0) || '?'}
                      </div>
                    )}
                    <div>
                      <p className="font-body font-semibold text-sm text-text">
                        {review.user?.name || 'Anonymous'}
                      </p>
                      <p className="font-ui text-xs text-text-muted">
                        {formatDate(review.createdAt)}
                      </p>
                    </div>
                  </div>
                  <StarRating rating={review.rating} size={14} />
                </div>
                <p className="font-body text-sm text-text-muted leading-relaxed">
                  {review.comment}
                </p>

                {/* Seller Reply Display */}
                {review.sellerReply && (
                  <div className="mt-4 pl-4 border-l-2 border-accent/30 bg-surface/50 p-4 rounded-r-xl">
                    <p className="font-ui text-xs font-semibold text-accent mb-1">
                      Response from Seller {review.sellerReplyAt && <span className="text-text-muted font-normal ml-2">{formatDate(review.sellerReplyAt)}</span>}
                    </p>
                    <p className="font-body text-sm text-text-muted leading-relaxed">
                      {review.sellerReply}
                    </p>
                  </div>
                )}

                {/* Seller Reply Action */}
                {isSeller && replyingTo !== review.id && (
                  <div className="mt-4 flex items-center gap-4">
                    <button
                      onClick={() => {
                        setReplyingTo(review.id);
                        setReplyText(review.sellerReply || '');
                      }}
                      className="text-xs font-body font-semibold text-accent hover:text-accent-hover transition-colors flex items-center gap-1"
                    >
                      <MessageSquare size={14} />
                      {review.sellerReply ? 'Edit Reply' : 'Reply to Review'}
                    </button>
                    {review.sellerReply && (
                      <button
                        onClick={async () => {
                          await handleReplySubmit(review.id, '');
                        }}
                        className="text-xs font-body font-semibold text-red-500 hover:text-red-700 transition-colors"
                      >
                        Delete Reply
                      </button>
                    )}
                  </div>
                )}

                {/* Seller Reply Form */}
                {isSeller && replyingTo === review.id && (
                  <div className="mt-4 bg-surface-warm p-4 rounded-xl">
                    <label className="font-ui text-xs font-bold text-text mb-2 block">Your Reply</label>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-border-light rounded-lg font-body text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent/30 mb-3"
                      placeholder="Thank the buyer for their review..."
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleReplySubmit(review.id)} isLoading={isSubmittingReply}>
                        Save Reply
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => { setReplyingTo(null); setReplyText(''); }}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <MessageSquare size={32} className="text-text-muted mx-auto mb-3" />
            <p className="font-body text-sm text-text-muted">No reviews yet. Be the first to review!</p>
          </div>
        )}
      </div>
    </section>
  );
}
