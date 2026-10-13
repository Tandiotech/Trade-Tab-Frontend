const StarsEffect: React.FC = () => {
  return (
    <div className='relative left-1/4'>
      <div className='-mt-40 z-30 h-40 w-1/2 absolute overflow-hidden'>
        {/* Copos de nieve */}
        {Array.from({ length: 100 }).map((_, index) => (
          <div
            key={index}
            className='star-sky'
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 10 + 10}s`, // Más lento (10s a 20s)
              animationDelay: `${Math.random() * 10}s`, // Retraso ajustado (0s a 10s)
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default StarsEffect;
