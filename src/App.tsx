import { Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import TechStackPage from './pages/Teckstack';
import BlogPage from './pages/BlogPage';
import ContactPage from './pages/ContactPage';
import ProjectsPage from './pages/ProjectsPage';

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <MainLayout>
            <HomePage />
          </MainLayout>
        }
      />
      <Route
        path="/techstack"
        element={
          <MainLayout>
            <TechStackPage />
          </MainLayout>
        }
      />
      <Route
        path="/blog"
        element={
          <MainLayout>
            <BlogPage />
          </MainLayout>
        }
      />
      <Route
        path="/projects"
        element={
          <MainLayout>
            <ProjectsPage />
          </MainLayout>
        }
      />
      <Route
        path="/contact"
        element={
          <MainLayout>
            <ContactPage />
          </MainLayout>
        }
      />
    </Routes>
  );
}

export default App;
