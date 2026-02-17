const Navbar = () => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
      <h2 className="text-lg font-semibold text-gray-900">Dashboard</h2>

      <div className="flex items-center gap-4">
        <div className="bg-gray-100 rounded-xl px-4 py-2 w-80">
          <input
            className="bg-transparent outline-none w-full text-sm"
            placeholder="Search candidate, vacancy..."
          />
        </div>

        <div className="w-10 h-10 rounded-full bg-green-400" />
      </div>
    </header>
  );
};

export default Navbar;
