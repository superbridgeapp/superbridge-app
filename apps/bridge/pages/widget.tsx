const Widget = () => {
  return (
    <div className="bg-slate-200 flex flex-col min-h-screen">
      <nav className="p-6 bg-slate-50 border-bottom border-slate-300 flex justify-between items-center shadow-xl">
        <h1 className="font-bold text-lg">Acme Inc.</h1>
        <div className="flex gap-4">
          <span>Home</span>
          <span>Product</span>
          <span>About</span>
        </div>
      </nav>
      <div className="flex items-center justify-center px-12 py-4 grow">
        {/* TODO: Make these iframe styles *not* tailwind */}
        <iframe
          src="http://localhost:3004/?widget=true"
          className="w-full max-w-[420px] rounded-[24px] md:rounded-[32px] shadow-lg h-[606px]"
        />
      </div>
    </div>
  );
};

export default Widget;
