
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 text-center py-4">
      <p className="text-sm text-gray-600 dark:text-gray-300">
        © {new Date().getFullYear()} JobSprout. All rights reserved. <br />
        <Link to="/terms-and-conditions" className="text-blue-500 hover:underline">
          Terms and Conditions
        </Link>
      </p>
    </footer>
  );
};

export default Footer;