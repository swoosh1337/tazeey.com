import { Link } from 'react-router-dom'; // Assuming project names might be links later

const HomePage = () => {
  return (
    <div className="text-center">
      {/* "Doko" Section - Modified for inline h1 and img */}
      <section className="mb-12 pt-8">
        <div className="flex justify-center items-center mb-3">
          <h1 className="text-5xl font-normal mr-4"> 
            「irakli grigolia」
          </h1>
          <img src="/cat.gif" alt="" width="40" height="40" />
        </div>
        <h2 className="text-xl text-gray-500 font-normal mb-4"> {/* Removed opacity-80, added text-gray-500 and font-normal */}
          software engineer!
        </h2>
      </section>

      {/* About Section */}
      <section className="mb-8">
        <p className="mb-4">
        I'm a software engineer with experience across a wide range of programming languages and technologies. I take a flexible, practical approach to problem-solving, regardless of the language or stack. Outside of core engineering, I'm especially interested in AI, security, and low-level systems.
        </p>
        <p>
          Currently working @ Healthcare.com
        </p>
      </section>

      <hr className="my-8 border-gray-300" />
    </div>
  );
};

export default HomePage;
