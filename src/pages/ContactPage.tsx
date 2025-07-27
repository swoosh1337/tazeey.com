const ContactPage = () => {
  return (
    <div className="max-w-2xl mx-auto dark:bg-gray-800 text-text-color">
      <h1 className="text-3xl mb-6 text-text-color dark:text-text-color">Contact me</h1>
      <p className="mb-4 text-lg text-text-color dark:text-text-color">Want to get in touch? Send me an email!</p>
      <p className="mb-4">
        <a href="mailto:tazigriglia@gmail.com" className="text-blue-500 hover:underline dark:text-blue-400">
          tazigriglia@gmail.com
        </a>
      </p>

      {/* Social Links Section */}
      <div className="mt-10"> {/* Added margin top */}
        <h2 className="text-2xl mb-4 text-text-color dark:text-text-color">Find me on:</h2>
        <div className="flex flex-wrap gap-4"> {/* Use flex-wrap and gap for responsiveness */}
          <a
            href="https://www.linkedin.com/in/igrigolia/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline dark:text-blue-400"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/swoosh1337"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline dark:text-blue-400"
          >
            GitHub
          </a>
          <a
            href="https://www.instagram.com/tazeey/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline dark:text-blue-400"
          >
            Instagram
          </a>
          <a
            href="https://x.com/tamazeey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline dark:text-blue-400"
          >
            X 
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
