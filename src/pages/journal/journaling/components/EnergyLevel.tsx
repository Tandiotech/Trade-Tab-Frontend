export default function EnergyLevel({
  energyLevels,
  energyLevel,
  setEnergyLevel,
}: {
  energyLevels: { level: number; emoji: string; label: string }[];
  energyLevel: number;
  setEnergyLevel: (level: number) => void;
}) {
  return (
    <div className='tt-journal-segment' role='group' aria-label='Energy level'>
      {energyLevels.map(item => (
        <button
          key={item.level}
          type='button'
          onClick={() => setEnergyLevel(item.level)}
          className={`tt-journal-segment__btn flex flex-col items-center gap-0.5 ${
            energyLevel === item.level ? 'tt-journal-segment__btn--active' : ''
          }`}
          aria-pressed={energyLevel === item.level}
        >
          <span className='text-base leading-none' aria-hidden>
            {item.emoji}
          </span>
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}
