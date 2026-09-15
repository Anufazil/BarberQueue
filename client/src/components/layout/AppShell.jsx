import Sidebar from "./Sidebar";
import Header from "./Header";
import PageContainer from "./PageContainer";

const AppShell = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />

        <PageContainer>
          {children}
        </PageContainer>
      </div>
    </div>
  );
};

export default AppShell;