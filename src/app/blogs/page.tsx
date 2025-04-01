'use client'
import { useState, useEffect } from "react";
import { NextPage } from "next";
import Head from "next/head";

interface Blog {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

const BlogPage: NextPage = () => {
  const [authToken, setAuthToken] = useState<string>("");
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    // Check if auth token exists in local storage
     const data = localStorage.getItem("supabase.auth.token");
     const parsedData = data ? JSON.parse(data) : null;
     const session = parsedData?.access_token || null;
     const userData = parsedData?.user || null;
    const token = parsedData?.access_token || null;
    if (token) {
      setAuthToken(token);
      fetchBlogs(token);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const token = (document.getElementById("token") as HTMLInputElement).value;
    if (token) {
      localStorage.setItem("authToken", token);
      setAuthToken(token);
      fetchBlogs(token);
    }
  };

  const fetchBlogs = async (token: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/blogs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch blogs");
      }

      const data = await response.json();
      setBlogs(data);
    } catch (err) {
      setError("Error fetching blogs. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        throw new Error("Failed to create blog post");
      }

      // Reset form and fetch updated blogs
      setTitle("");
      setContent("");
      fetchBlogs(authToken);
    } catch (err) {
      setError("Error creating blog post. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 sticky top-0">
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Blog Platform</h1>

        {!authToken ? (
          <div className="bg-indigo-900 rounded-lg shadow p-6 max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4">Login</h2>
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label
                  htmlFor="token"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Auth Token
                </label>
                <input
                  type="text"
                  id="token"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your auth token"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Login
              </button>
            </form>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 ">
            {/* Blog Post Form */}
            <div className="bg-gradient-to-br  from-indigo-900 to-zinc-800 border border-indigo-600 shadow-indigo-800 rounded-lg shadow p-6 sm:sticky sm:top-8 sm:self-start sm:max-h-screen">
              <h2 className="text-xl font-semibold mb-4">
                Create New Blog Post
              </h2>
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter blog title"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="content"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Content
                  </label>
                  <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={8}
                    placeholder="Write your blog content here..."
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                  disabled={loading}
                >
                  {loading ? "Publishing..." : "Publish Blog Post"}
                </button>
              </form>
            </div>

            {/* Blog List */}
            <div className="bg-gradient-to-br  from-indigo-900 to-zinc-800 border max-h-screen overflow-x-auto border-indigo-600 shadow-indigo-800 rounded-lg shadow p-6 overflow-scroll">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Blog Posts</h2>
                <button
                  onClick={() => fetchBlogs(authToken)}
                  className="p-3 bg-gradient-to-br from-indigo-700 to-zinc-500 border border-indigo-600 shadow-indigo-800 rounded-md transition-colors hover:bg-gradient-to-bl"
                >
                  Refresh
                </button>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-6">
                  <div className="loader">Loading...</div>
                </div>
              ) : blogs.length > 0 ? (
                <div className="space-y-4">
                  {blogs.map((blog) => (
                    <div key={blog.id} className="border-b pb-4">
                      <h3 className="text-lg font-medium">{blog.title}</h3>
                      <p className="text-sm text-gray-200 mb-2">
                        Posted on{" "}
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-white">{blog.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-6 text-gray-500">
                  No blog posts found.
                </p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default BlogPage;
