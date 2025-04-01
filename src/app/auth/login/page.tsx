"use client";

import { useState, useEffect } from "react";
import supabase from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { X, Mail, Lock, ArrowRight, CheckCircle } from "lucide-react";
import axios from "axios";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [formFocus, setFormFocus] = useState(null);
  const router = useRouter();

  async function handleSignup() {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post("/api/auth/signup", {
        email,
        password,
      });

      setShowVerificationModal(true);
    } catch (err: any) {
      setError(err.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin() {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post("/api/auth/login", {
        email,
        password,
      });

      const result = res.data;

      // Store session if available
      if (result.session) {
        localStorage.setItem(
          "supabase.auth.token",
          JSON.stringify(result.session)
        );
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  // Function to handle form submission
  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (isLogin) {
      handleLogin();
    } else {
      handleSignup();
    }
  };

  // Handle keyboard events
  const handleKeyDown = (e: any) => {
    if (e.key === "Enter" && !loading) {
      e.preventDefault();
      if (isLogin) {
        handleLogin();
      } else {
        handleSignup();
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900">
      <div className="w-full max-w-md p-8 mx-4 bg-black bg-opacity-30 backdrop-blur-lg rounded-xl shadow-2xl border border-white border-opacity-10">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <div className="relative">
            <div
              className="w-12 h-6 bg-gray-800 rounded-full flex items-center p-1 cursor-pointer"
              onClick={() => setIsLogin(!isLogin)}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                  isLogin ? "" : "transform translate-x-6"
                }`}
              ></div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div
            className={`relative ${
              formFocus === "email" ? "ring-2 ring-indigo-400" : ""
            } transition-all duration-300`}
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              placeholder="Email"
              className="w-full py-4 pl-10 pr-4 bg-gray-800 bg-opacity-50 text-white placeholder-gray-400 border-0 rounded-lg focus:outline-none focus:ring-0"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              // @ts-ignore
              onFocus={() => setFormFocus("email")}
              onBlur={() => setFormFocus(null)}
              onKeyDown={handleKeyDown}
              autoComplete="email"
              required
            />
          </div>

          <div
            className={`relative ${
              formFocus === "password" ? "ring-2 ring-indigo-400" : ""
            } transition-all duration-300`}
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="password"
              placeholder="Password"
              className="w-full py-4 pl-10 pr-4 bg-gray-800 bg-opacity-50 text-white placeholder-gray-400 border-0 rounded-lg focus:outline-none focus:ring-0"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              // @ts-ignore
              onFocus={() => setFormFocus("password")}
              onBlur={() => setFormFocus(null)}
              onKeyDown={handleKeyDown}
              autoComplete={isLogin ? "current-password" : "new-password"}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-lg transition-all hover:from-indigo-600 hover:to-purple-700 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                {isLogin ? "Sign In" : "Create Account"}
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>

          {error && (
            <div className="p-3 bg-red-500 bg-opacity-20 border border-red-500 border-opacity-30 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

          <div className="text-center">
            <p className="text-gray-400">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-indigo-400 hover:text-indigo-300 font-medium"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>
        </form>
      </div>

      {/* Email Verification Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-900 rounded-xl p-8 max-w-md w-full border border-purple-500 border-opacity-20 shadow-lg transform transition-all">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">
                Verify Your Email
              </h3>
              <button
                onClick={() => setShowVerificationModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex flex-col items-center justify-center py-8">
              <div className="bg-indigo-500 bg-opacity-20 p-4 rounded-full mb-6">
                <CheckCircle className="h-12 w-12 text-indigo-400" />
              </div>
              <h4 className="text-xl font-medium text-white mb-2">
                Check your inbox
              </h4>
              <p className="text-gray-400 text-center mb-6">
                We've sent a verification link to{" "}
                <span className="text-indigo-400 font-medium">{email}</span>.
                Please check your email and click the link to verify your
                account.
              </p>
              <button
                onClick={() => {
                  setShowVerificationModal(false);
                  setIsLogin(true);
                }}
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all"
              >
                Go to Login
              </button>
            </div>

            <div className="mt-6 text-center text-sm text-gray-500">
              Didn't receive the email? Check your spam folder or
              <button
                onClick={handleSignup}
                className="ml-1 text-indigo-400 hover:text-indigo-300"
              >
                resend verification email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
