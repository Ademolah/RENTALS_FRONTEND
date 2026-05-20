import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-brand-slate">
      <Navbar />
      {/* 
        The pt-20 pushes the content down so it doesn't get hidden behind the fixed Navbar.
        The flex-grow ensures the footer is always pushed to the absolute bottom of the screen.
      */}
      <main className="flex-grow pt-20">
        <Outlet /> 
      </main>
      <Footer />
    </div>
  );
};