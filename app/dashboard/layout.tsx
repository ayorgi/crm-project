import Sidebar from '../../components/Sidebar';
import TopNav from '../../components/TopNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-full flex overflow-hidden bg-gradient-to-br from-gray-50 to-gray-200">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-y-auto p-8" style={{ scrollbarGutter: 'stable' }}>
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
