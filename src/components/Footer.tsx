import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="py-4 text-center text-text-color dark:text-text-color border-t border-gray-200 dark:border-gray-700">
      <div>Irakli {new Date().getFullYear()}</div>

    </footer>
  );
};

export default Footer;
