import { Check, User, Briefcase, Heart, Store } from "lucide-react";
import StepWrapper from "@/Components/ui/StepWrapper";

const GOALS = [
  { id: "creator", label: "Content Creator", desc: "Videos, art, music", icon: User },
  { id: "business", label: "Business / Brand", desc: "Sell services or products", icon: Briefcase },
  { id: "personal", label: "Personal Use", desc: "Share with friends", icon: Heart },
  { id: "store", label: "E-commerce", desc: "Online shop", icon: Store }
];

const GoalStep = ({ step, goal, setGoal, onNext }) => {
  return (
    <StepWrapper
      step={step}
      title="What brings you to DapLink?"
      subtitle="We’ll tailor your setup."
      onContinue={onNext}
      continueDisabled={!goal}
    >
      <div className="space-y-3">
        {GOALS.map((g) => (
          <button
            key={g.id}
            onClick={() => setGoal(g.id)}
            className={`w-full flex items-center p-4 rounded-2xl border-2 transition-all text-left
              ${
                goal === g.id
                  ? "border-purple-600 bg-purple-50"
                  : "border-slate-100 hover:border-slate-200"
              }`}
          >
            <div
              className={`p-3 rounded-xl mr-4 ${
                goal === g.id
                  ? "bg-purple-600 text-white"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              <g.icon size={22} />
            </div>

            <div>
              <h3 className="font-black">{g.label}</h3>
              <p className="text-xs text-slate-500">{g.desc}</p>
            </div>

            {goal === g.id && (
              <Check className="ml-auto text-purple-600" size={20} />
            )}
          </button>
        ))}
      </div>
    </StepWrapper>
  );
};

export default GoalStep;
