'use client';

import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import Button from '@/components/ui/Button';
import QuantitySelector from '@/components/ui/QuantitySelector';
import { useCart } from '@/components/providers/CartProvider';
import { useAuth } from '@/components/providers/AuthProvider';
import { useToast } from '@/components/providers/ToastProvider';
import { useRouter } from 'next/navigation';

export default function AddToCartButton({  productId, maxQty, disabled  }) {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { addItem } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const handleAddToCart = async () => {
    if (!user) {
      router.push('/auth/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    setIsLoading(true);
    const result = await addItem(productId, quantity);
    setIsLoading(false);

    if (result.success) {
      showToast('Added to cart!', 'success');
    } else {
      showToast(result.error || 'Failed to add to cart', 'error');
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <QuantitySelector
        quantity={quantity}
        onChange={setQuantity}
        max={maxQty}
        disabled={disabled}
      />
      <Button
        onClick={handleAddToCart}
        isLoading={isLoading}
        disabled={disabled}
        size="lg"
        className="w-full sm:w-auto"
      >
        <ShoppingCart size={18} />
        {disabled ? 'Out of Stock' : 'Add to Cart'}
      </Button>
    </div>
  );
}
