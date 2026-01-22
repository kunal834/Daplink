import { Rocket } from "lucide-react";

const PublishStep = ({ username, onComplete }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] animate-in fade-in">
      <div className="relative mb-8">
        <div className="w-24 h-24 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin" />
        <Rocket
          size={32}
          className="absolute inset-0 m-auto text-purple-600"
        />
      </div>

      <h2 className="text-2xl font-black mb-2">
        Publishing your page…
      </h2>
      <p className="text-slate-500 font-medium mb-8">
        Setting up @{username}
      </p>

      {/* Simulate publish */}
      <button
        onClick={onComplete}
        className="mt-6 px-8 py-4 bg-purple-600 text-white rounded-full font-black shadow-lg hover:bg-purple-700"
      >
        Continue
      </button>
    </div>
  );
};

export default PublishStep;
