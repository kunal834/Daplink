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
      title="Tell us about yourself"
      subtitle="This is how people see you."
      onContinue={onNext}
      onBack={onBack}
      continueDisabled={!displayName}
    >
      <div className="flex flex-col items-center mb-8">
        <div className="relative">
          <div className="w-28 h-28 rounded-full bg-purple-50 flex items-center justify-center overflow-hidden border-4 border-white shadow-xl">
            {avatar ? (
              <img src={avatar} className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl font-black text-purple-600">
                {displayName?.[0] || "?"}
              </span>
            )}
          </div>

          <label className="absolute bottom-1 right-1 bg-slate-900 text-white p-2 rounded-full cursor-pointer">
            <Camera size={16} />
            <input type="file" hidden accept="image/*" onChange={handleImage} />
          </label>
        </div>
      </div>

      <div className="space-y-4">
        <input
          placeholder="Full name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 font-black"
        />

        <textarea
          placeholder="Short bio (optional"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={2}
          className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 resize-none"
        />
      </div>
    </StepWrapper>
  );
};

export default ProfileStep;
