const PageContainer = ({ children }) => {
  return (
    <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto bg-slate-50">
      <div className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
        {children}
      </div>
    </main>
  );
};

export default PageContainer;