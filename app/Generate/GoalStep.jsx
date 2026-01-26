import { User, Briefcase, Heart, Store } from "lucide-react";
import StepWrapper from "@/Components/ui/StepWrapper";

const GOALS = [
  { id: "creator", name: "Creator", icon: User, desc: "Digital & Social Media" },
  { id: "business", name: "Business", icon: Briefcase, desc: "Professional Services" },
  { id: "personal", name: "Personal", icon: Heart, desc: "Personal Networking" },
  { id: "store", name: "E-commerce", icon: Store, desc: "Shops & Products" }
];

const GoalStep = ({ step, goal, setGoal, onNext }) => {
  return (
    <StepWrapper
      step={step}
      title="What's your focus?"
      subtitle="Choose a goal to personalize your page."
      onContinue={onNext}
      continueDisabled={!goal}
    >
      <div className="grid grid-cols-2 gap-5 w-full max-w-[640px]">

        {GOALS.map((g) => {
          const selected = goal === g.id;
          return (
            <button
              key={g.id}
              onClick={() => setGoal(g.id)}
              className={`flex flex-col p-5 rounded-3xl border-2 transition text-left
                ${
                  selected
                    ? "border-slate-900 bg-white shadow-lg"
                    : "border-slate-100 bg-white hover:border-slate-300"
                }
              `}
            >
              {/* Icon */}
              <div
                className={`p-3 rounded-2xl mb-4 w-fit
                  ${
                    selected
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600"
                  }
                `}
              >
                <g.icon size={22} />
              </div>

              {/* Text */}
              <h3 className="font-black text-base text-slate-900">
                {g.name}
              </h3>
              <p className="text-sm text-slate-500 mt-1 leading-snug">
                {g.desc}
              </p>
            </button>
          );
        })}

      </div>
    </StepWrapper>
  );
};

export default GoalStep;
