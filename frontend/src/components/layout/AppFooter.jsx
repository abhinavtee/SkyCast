
function AppFooter() {
  return (
    <footer className="mt-12 border-t border-sky-100 bg-white/70 py-6">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <p className="text-sm text-slate-500">
          Developed with <span className="text-red-500">♥</span> by{" "}
          <span className="font-semibold text-sky-700">
            Abhinav Tripathi
          </span>
        </p>
        <p className="mt-2 text-xs text-slate-400">
          © {new Date().getFullYear()} SkyCast. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default AppFooter;
