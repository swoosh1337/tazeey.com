const TechStackPage = () => {
  return (
    <div className="max-w-3xl mx-auto text-center py-24 px-6">
      <h1 className="text-4xl font-semibold mb-12">Tech Stack「栈」</h1>

      <div className="text-lg space-y-8">
        <div>
          <h2 className="text-xl font-medium mb-1">Languages</h2>
          <p>Python / JavaScript / TypeScript / Go / Swift / Scala / SQL</p>
        </div>
        <div>
          <h2 className="text-xl font-medium mb-1">Frameworks & Libraries</h2>
          <p>FastAPI / Node.js / React / SwiftUI / Fiber / PyTorch / Tailwind CSS</p>
        </div>
        <div>
          <h2 className="text-xl font-medium mb-1">DevOps & Tools</h2>
          <p>AWS / Docker / Git / GitHub Actions / Linux</p>
        </div>
        <div>
          <h2 className="text-xl font-medium mb-1">Databases</h2>
          <p>PostgreSQL / MongoDB / Redis / SQLite</p>
        </div>
        <div>
          <h2 className="text-xl font-medium mb-1">Other Skills</h2>
          <p>CI/CD / REST APIs / GraphQL / OAuth / WebSockets / Web Scraping / Microservices</p>
        </div>
      </div>
    </div>
  );
};

export default TechStackPage;
