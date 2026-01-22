import {
  Instagram,
  Twitter,
  Youtube,
  Globe
} from "lucide-react";
import StepWrapper from "@/Components/ui/StepWrapper";
import { FiFacebook, FiLinkedin, FiTwitch, FiTwitter, FiYoutube } from "react-icons/fi";

const PLATFORMS = [
  { id: 'instagram', name: 'Instagram', icon: Instagram, placeholder: 'instagram.com/username' },
  // { id: 'tiktok', name: 'TikTok', icon: Music, placeholder: 'tiktok.com/@username' },
  { id: 'twitter', name: 'Twitter', icon: FiTwitter, placeholder: 'twitter.com/username' },
  { id: 'youtube', name: 'YouTube', icon: FiYoutube, placeholder: 'youtube.com/c/channel' },
  { id: 'twitch', name: 'Twitch', icon: FiTwitch, placeholder: 'twitch.tv/username' },
  { id: 'facebook', name: 'Facebook', icon: FiFacebook, placeholder: 'facebook.com/username' },
  { id: 'linkedin', name: 'LinkedIn', icon: FiLinkedin, placeholder: 'linkedin.com/in/username' },
  { id: 'website', name: 'Website', icon: Globe, placeholder: 'https://yourwebsite.com' },
];

const PlatformStep = ({
  step,
  selected,
  toggle,
  onNext,
  onBack
}) => {
  return (
    <StepWrapper
      step={step}
      title="Where are you active?"
      subtitle="Choose up to 5 platforms."
      onContinue={onNext}
      onBack={onBack}
      continueDisabled={selected.length === 0}
      skipLabel="Skip"
    >
      <div className="grid grid-cols-2 gap-3">
        {PLATFORMS.map((p) => {
          const isSelected = selected.includes(p.id);
          return (
            <button
              key={p.id}
              onClick={() => toggle(p.id)}
              className={`p-4 rounded-2xl border-2 flex items-center gap-3
                ${isSelected ? "border-purple-600 bg-purple-50" : "border-slate-100"}`}
            >
              <div className={`p-2 rounded-lg ${isSelected ? "bg-purple-600 text-white" : "bg-slate-100"}`}>
                <p.icon size={18} />
              </div>
              <span className="font-black text-xs">{p.name}</span>
            </button>
          );
        })}
      </div>
    </StepWrapper>
  );
};

export default PlatformStep;
