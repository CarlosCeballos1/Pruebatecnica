import React from 'react';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-white/50 text-center p-6">
      <div className="text-5xl mb-4 opacity-30">📝</div>
      <p className="text-sm leading-relaxed">No hay tareas en esta columna</p>
    </div>
  );
} 