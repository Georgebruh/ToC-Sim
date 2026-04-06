export function Header() {
  return (
    <header className="w-full h-14 bg-surface-container flex justify-between items-center px-6 shrink-0 relative z-50 shadow-md">
      <div className="flex items-center gap-8">
        <span className="text-xl font-bold tracking-tighter text-primary">ToC Console</span>
        <nav className="hidden md:flex gap-6 items-center">
          <a className="text-sm tracking-tight text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors px-3 py-1.5 rounded-md" href="#">File</a>
          <a className="text-sm tracking-tight text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors px-3 py-1.5 rounded-md" href="#">Edit</a>
          <a className="text-sm tracking-tight text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors px-3 py-1.5 rounded-md" href="#">View</a>
          <a className="text-sm tracking-tight text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors px-3 py-1.5 rounded-md" href="#">Terminal</a>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <button className="material-symbols-outlined text-on-surface-variant hover:text-on-surface transition-colors">account_circle</button>
      </div>
    </header>
  );
}
