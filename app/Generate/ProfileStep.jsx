import { Camera } from "lucide-react";
import StepWrapper from "@/Components/ui/StepWrapper";

const ProfileStep = ({
  step,
  displayName,
  bio,
  avatar,
  setDisplayName,
  setBio,
  setAvatar,
  onNext,
  onBack
}) => {
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setAvatar(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <StepWrapper
      step={step}
      title="Introduce yourself."
      subtitle="This is how your page will look to others."
      onContinue={onNext}
      onBack={onBack}
      continueDisabled={!displayName}
    >
      <div className="w-full max-w-[560px] mx-auto">

        {/* Avatar */}
        <div className="flex justify-center mb-10">
          <div className="relative group">
            <div className="w-28 h-28 rounded-[2.5rem] bg-slate-50 border-2 border-slate-100 flex items-center justify-center overflow-hidden shadow-[0_20px_40px_-20px_rgba(0,0,0,0.15)] transition group-hover:scale-[1.02]">
              {avatar ? (
                <img
                  src={avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl font-black text-slate-700">
                  {displayName?.[0] || "?"}
                </span>
              )}
            </div>

            <label className="absolute -bottom-2 -right-2 bg-slate-900 text-white p-3 rounded-[1.25rem] cursor-pointer shadow-xl hover:bg-black transition active:scale-95 ring-8 ring-white">
              <Camera size={18} strokeWidth={2.5} />
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImage}
              />
            </label>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-6">

          {/* Name */}
          <div className="space-y-2">
            <label className="ml-2 text-[10px] font-black uppercase tracking-[0.25em] text-slate-300">
              Your name
            </label>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your display name"
              className="w-full px-7 py-5 rounded-[1.75rem] border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none font-black text-lg transition-all"
            />
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <label className="ml-2 text-[10px] font-black uppercase tracking-[0.25em] text-slate-300">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="A short bio about you…"
              rows={2}
              className="w-full px-7 py-5 rounded-[1.75rem] border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none resize-none text-base font-medium leading-relaxed transition-all"
            />
          </div>

        </div>

      </div>
    </StepWrapper>
  );
};

export default ProfileStep;
