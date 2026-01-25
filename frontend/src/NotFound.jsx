import React from "react";

function NotFound() {
  return (
    <div className="hero min-h-screen bg-white">
      <div className="hero-content flex-col">
        <img src="/notfound.png" alt="Not Found" className="max-w-sm w-full" />
        <div className="text-center">
          <h1 className="text-5xl text-black font-bold">404</h1>
          <p className="py-4 text-black text-lg">
            Oops! The page you are looking for does not exist.
          </p>
          <button
            className="btn bg-teal-500 text-white font-bold text-lg w-50 h-12 mt-6 hover:scale-105 hover:bg-teal-600 transition-all"
            onClick={() => window.history.back()}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
