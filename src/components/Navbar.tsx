import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center p-4 border-b border-gray-200">
      <div className="flex items-center">
        <Link to="/" className="text-black no-underline mr-2">「irakli grigolia」</Link>
      </div>
      <div className="flex items-center">
        <Link to="/about" className="text-gray-600 no-underline mx-4 p-1 rounded hover:bg-gray-100">about</Link>
        <span className="text-gray-400">{"//"}</span>
        <Link to="/projects" className="text-gray-600 no-underline mx-4 p-1 rounded hover:bg-gray-100">projects</Link>
        <span className="text-gray-400">{"//"}</span>
        <Link to="/blog" className="text-gray-600 no-underline mx-4 p-1 rounded hover:bg-gray-100">blog</Link>
      </div>
    </nav>
  );
};

export default Navbar;
