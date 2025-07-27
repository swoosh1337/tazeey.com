import { Link } from 'react-router-dom'; // Assuming project names might be links later
import IconBar from '../components/IconBar'; // Import the IconBar component

const HomePage = () => {
  return (
    <div className="text-center text-text-color">
      {/* "Doko" Section - Modified for inline h1 and img */}
      <section className="mb-12 pt-8">
        <div className="flex justify-center items-center mb-3">
          <h1 className="text-5xl font-normal mr-4 text-text-color"> 
            「irakli grigolia」
          </h1>
          {/* <img src="/cat.gif" alt="" width="40" height="40" /> */}
        </div>
        <h2 className="text-xl font-normal mb-4 text-text-color dark:text-text-color"> {/* Removed opacity-80, added text-gray-500 and font-normal */}
          software engineer.
        </h2>
      </section>

      {/* About Section */}
      <section className="mb-8">
        <p className="mb-4">
        I'm a software engineer with experience across a wide range of programming languages and technologies. Outside of my work, I'm especially interested in AI, security, and low-level systems.
        </p>
        <p>
          Currently working @ Healthcare.com as Full Stack Software Engineer
        </p>
        <IconBar />
      </section>

      <hr className="my-8 border-gray-300 dark:border-gray-700" />
    </div>
  );
};

export default HomePage;
