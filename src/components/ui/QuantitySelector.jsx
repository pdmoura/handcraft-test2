'use client';

import { Minus, Plus } from 'lucide-react';

export default function QuantitySelector({ 
  quantity,
  onChange,
  min = 1,
  max = 99,
  disabled = false,
 }) {
  return (
    <div className="inline-flex items-center border border-border-light rounded-lg overflow-hidden">
      <button
        onClick={() => onChange(Math.max(min, quantity - 1))}
        disabled={disabled || quantity <= min}
        className="px-3 py-2 hover:bg-surface transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-text"
        aria-label="Decrease quantity"
      >
        <Minus size={16} />
      </button>
      <input
        type="number"
        value={quantity}
        onChange={(e) => {
          const val = parseInt(e.target.value) || min;
          onChange(Math.max(min, Math.min(max, val)));
        }}
        min={min}
        max={max}
        disabled={disabled}
        className="w-12 text-center py-2 font-ui text-sm font-medium border-x border-border-light bg-white text-text focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        aria-label="Quantity"
      />
      <button
        onClick={() => onChange(Math.min(max, quantity + 1))}
        disabled={disabled || quantity >= max}
        className="px-3 py-2 hover:bg-surface transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-text"
        aria-label="Increase quantity"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
