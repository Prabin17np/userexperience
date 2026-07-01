'use client';

interface Props {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  min?: number;
  max?: number;
}

export function QuantityStepper({ quantity, onIncrease, onDecrease, min = 1, max = 10 }: Props) {
  // #shared classes for both stepper buttons
  const btnBase =
    'w-8 h-8 flex items-center justify-center text-base border-none cursor-pointer font-[inherit] transition-all duration-200 leading-none bg-[var(--surface)] text-[var(--text)]';
  const btnEnabled = 'hover:bg-[var(--accent-light)] hover:text-[var(--accent)]';
  const btnDisabled = 'disabled:opacity-30 disabled:cursor-not-allowed';

  return (
    // #stepper wrapper: inline flex, single border wraps all three cells
    <div className="inline-flex items-center border-[1.5px] border-[var(--border2)] rounded-lg overflow-hidden">

      {/* #decrement */}
      <button
        type="button"
        onClick={onDecrease}
        disabled={quantity <= min}
        aria-label="Decrease quantity"
        className={`${btnBase} ${btnEnabled} ${btnDisabled}`}
      >
        −
      </button>

      {/* #count display */}
      <span className="w-9 text-center text-[0.9rem] font-semibold text-[var(--text)] bg-[var(--surface)]">
        {quantity}
      </span>

      {/* #increment */}
      <button
        type="button"
        onClick={onIncrease}
        disabled={quantity >= max}
        aria-label="Increase quantity"
        className={`${btnBase} ${btnEnabled} ${btnDisabled}`}
      >
        +
      </button>
    </div>
  );
}