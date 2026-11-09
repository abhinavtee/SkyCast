import { CloudSun, MapPin } from "lucide-react";

function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b  bg-whitesticky top-0 z-50 w-full border-b border-sky-100 bg-white/85 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/*Brand */}
        <div className="flex items-center gap-2">
          <CloudSun className="h-8 w-8 text-sky-600 sm:h-9 sm:w-9" />
          <span className="text-lg  font-bold tracking-tight text-slate-800 sm:text-xl">
            SkyCast
          </span>
        </div>
        {/* Dashboard label */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 sm:gap-2 sm:text-sm">
          <MapPin className="h-4 w-4 shrink-0 text-sky-500" />
          <span>Weather Dashboard</span>
        </div>
      </div>
    </header>
  );
}

export default AppHeader;