import React, { useState, useEffect } from 'react';

const SidebarClock: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <p className="text-3xl font-black text-slate-700 dark:text-white tabular-nums tracking-tight">
        {currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
    </p>
  );
};

export default SidebarClock;
