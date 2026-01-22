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
      <div className="space-y-6">
        {platforms.map((id) => (
          <div key={id}>
            <label className="text-xs font-black uppercase">{id}</label>
            <div className="relative mt-2">
              <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                placeholder={`https://${id}.com/username`}
                value={links[id] || ""}
                onChange={(e) => setLink(id, e.target.value)}
                className="w-full pl-12 py-4 rounded-2xl border-2 border-slate-100 font-bold"
              />
            </div>
          </div>
        ))}
      </div>
    </StepWrapper>
  );
};

export default LinksStep;
