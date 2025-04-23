import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="flex justify-between items-center w-full p-2 text-xs text-gray-400 border-t border-gray-200">
      <div>Irakli © {new Date().getFullYear()}</div>
      <div>
        <Link to="/contact" className="text-gray-600 no-underline hover:underline">contact</Link>
      </div>
    </footer>
  );
};

export default Footer;
