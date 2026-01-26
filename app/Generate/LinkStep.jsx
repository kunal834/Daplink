import { Link as LinkIcon } from "lucide-react";
import StepWrapper from "@/Components/ui/StepWrapper";

const LinksStep = ({
  step,
  platforms,
  links,
  setLink,
  onNext,
  onBack
}) => {
  return (
    <StepWrapper
      step={step}
      title="Add your links"
      subtitle="Paste profile URLs."
      onContinue={onNext}
      onBack={onBack}
      continueDisabled={Object.keys(links).length === 0}
    >
      <div className="w-full max-w-[560px] mx-auto space-y-6">

        {platforms.map((id) => (
          <div key={id} className="space-y-2">
            {/* Label */}
            <label className="ml-2 text-[10px] font-black uppercase tracking-[0.25em] text-slate-300">
              {id}
            </label>

            {/* Input */}
            <div className="relative">
              <LinkIcon
                size={16}
                className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                placeholder={`https://${id}.com/username`}
                value={links[id] || ""}
                onChange={(e) => setLink(id, e.target.value)}
                className="w-full pl-14 pr-6 py-5 rounded-[1.75rem] border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none font-bold text-base transition-all"
              />
            </div>
          </div>
        ))}

      </div>
    </StepWrapper>
  );
};

export default LinksStep;
