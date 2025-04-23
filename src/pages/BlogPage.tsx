const BlogPage = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-gray-500 text-sm mb-2">
        {new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric', 
          month: 'long',
          day: 'numeric'
        })}
      </div>
      <h1 className="text-3xl mb-8">Post name...</h1>

      <div className="space-y-4">
        <p className="leading-relaxed">Blog post conent</p>

        <p className="leading-relaxed">
         Blog post content will appear here once I start writing.
        </p>




      </div>
    </div>
  );
};

export default BlogPage;
