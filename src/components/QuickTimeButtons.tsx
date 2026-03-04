const QUICK_TIMES = [
  "18:00",
  "18:30",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
  "23:00",
  "00:00",
  "01:00"
];

interface QuickTimeButtonsProps {
  value: string;
  onSelect: (time: string) => void;
}

export function QuickTimeButtons({ value, onSelect }: QuickTimeButtonsProps) {
  return (
    <div className="quick-grid">
      {QUICK_TIMES.map((time) => (
        <button
          key={time}
          type="button"
          className={value === time ? "quick-btn active" : "quick-btn"}
          onClick={() => onSelect(time)}
        >
          {time}
        </button>
      ))}
    </div>
  );
}
