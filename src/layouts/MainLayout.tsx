import type { ReactNode } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAF9F6]">
      <Navbar />
      <main className="flex flex-1 flex-col justify-center items-center max-w-3xl mx-auto px-4 py-8 w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
