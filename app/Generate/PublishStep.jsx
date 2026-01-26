import { Rocket } from "lucide-react";

const PublishStep = ({ username }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full animate-in fade-in duration-1000">

      {/* Loader */}
      <div className="relative mb-12">
        <div className="w-32 h-32 border-[4px] border-slate-50 border-t-slate-900 rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Rocket
            size={44}
            className="text-slate-900 animate-bounce"
            strokeWidth={1.5}
          />
        </div>
      </div>

      {/* Text */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-black tracking-tight text-slate-900">
          Deploying your page…
        </h2>

        <div className="px-8 py-3 bg-slate-50 rounded-full border border-slate-100 inline-flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm font-black text-slate-500 tracking-tight uppercase">
            daplink.online/{username}
          </span>
        </div>
      </div>

    </div>
  );
};

export default PublishStep;
