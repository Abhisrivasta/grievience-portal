import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}


export default MainLayout;
