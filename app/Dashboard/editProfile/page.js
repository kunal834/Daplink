"use client";

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Check,
  Globe,
  GripVertical,
  Layout,
  Palette,
  Plus,
  Save,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  Upload,
  UserCircle,
} from "lucide-react";
import { useAuth } from "@/context/Authenticate";
import { useTheme } from "@/context/ThemeContext";

const PRESETS = [
  {
    id: "classic",
    name: "Midnight",
    bg: "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700",
    text: "text-white",
    defaultAccent: "#8b5cf6",
    defaultBg: "#0f172a",
    font: "Inter, system-ui, sans-serif",
  },
  {
    id: "light",
    name: "Paper",
    bg: "bg-gradient-to-br from-zinc-100 via-slate-100 to-zinc-200",
    text: "text-zinc-900",
    defaultAccent: "#0ea5e9",
    defaultBg: "#f4f4f5",
    font: "'Plus Jakarta Sans', system-ui, sans-serif",
  },
  {
    id: "modern",
    name: "Electric",
    bg: "bg-gradient-to-br from-violet-700 via-fuchsia-600 to-blue-600",
    text: "text-white",
    defaultAccent: "#ec4899",
    defaultBg: "#3b0764",
    font: "'Poppins', system-ui, sans-serif",
  },
  {
    id: "sunset",
    name: "Sunset",
    bg: "bg-gradient-to-br from-orange-500 via-rose-500 to-fuchsia-600",
    text: "text-white",
    defaultAccent: "#f97316",
    defaultBg: "#7c2d12",
    font: "'Nunito Sans', system-ui, sans-serif",
  },
  {
    id: "forest",
    name: "Forest",
    bg: "bg-gradient-to-br from-emerald-700 via-green-700 to-lime-700",
    text: "text-white",
    defaultAccent: "#22c55e",
    defaultBg: "#14532d",
    font: "'Manrope', system-ui, sans-serif",
  },
  {
    id: "ocean",
    name: "Ocean",
    bg: "bg-gradient-to-br from-cyan-700 via-blue-700 to-indigo-800",
    text: "text-white",
    defaultAccent: "#06b6d4",
    defaultBg: "#082f49",
    font: "'DM Sans', system-ui, sans-serif",
  },
];

const ACCENTS = ["#8b5cf6", "#0ea5e9", "#22c55e", "#f97316", "#ec4899", "#ef4444"];
const BG_STYLES = ["soft", "mesh", "spotlight"];
const BTN_STYLES = ["solid", "glass", "outline"];
const FONTS = [
  { label: "Inter", value: "Inter, system-ui, sans-serif" },
  { label: "Plus Jakarta", value: "'Plus Jakarta Sans', system-ui, sans-serif" },
  { label: "Poppins", value: "'Poppins', system-ui, sans-serif" },
  { label: "Manrope", value: "'Manrope', system-ui, sans-serif" },
  { label: "Nunito Sans", value: "'Nunito Sans', system-ui, sans-serif" },
  { label: "DM Sans", value: "'DM Sans', system-ui, sans-serif" },
];
const DEFAULT_VIBE = {
  accent: ACCENTS[0],
  backgroundColor: "#0f172a",
  bgStyle: "soft",
  buttonStyle: "solid",
  radius: 18,
  blur: 10,
  softText: true,
  font: FONTS[0].value,
  customBackground: "",
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, Number(value) || min));
const mergeVibe = (source = {}) => ({
  ...DEFAULT_VIBE,
  ...source,
  radius: clamp(source.radius ?? DEFAULT_VIBE.radius, 8, 30),
  blur: clamp(source.blur ?? DEFAULT_VIBE.blur, 0, 24),
});

const hexToRgb = (hex) => {
  const cleaned = String(hex || "").replace("#", "");
  if (!/^[0-9A-Fa-f]{6}$/.test(cleaned)) return null;
  return {
    r: parseInt(cleaned.slice(0, 2), 16),
    g: parseInt(cleaned.slice(2, 4), 16),
    b: parseInt(cleaned.slice(4, 6), 16),
  };
};

const getContrastTextColor = (bgHex, fallback = "#ffffff") => {
  const rgb = hexToRgb(bgHex);
  if (!rgb) return fallback;
  const yiq = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  return yiq >= 150 ? "#18181b" : "#ffffff";
};

function PhonePreview({ profile, links, preset, vibe }) {
  const active = links.filter((l) => l.active && l.title.trim());
  const textColor = getContrastTextColor(vibe.backgroundColor, preset.id === "light" ? "#18181b" : "#ffffff");

  const overlayClass =
    vibe.bgStyle === "mesh"
      ? "bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.26),transparent_42%),radial-gradient(circle_at_85%_0%,rgba(255,255,255,0.18),transparent_44%)]"
      : vibe.bgStyle === "spotlight"
        ? "bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.33),transparent_52%)]"
        : "bg-gradient-to-b from-transparent to-black/10";

  const buttonStyle =
    vibe.buttonStyle === "glass"
      ? {
          backgroundColor: "rgba(255,255,255,0.14)",
          border: "1px solid rgba(255,255,255,0.4)",
          color: textColor,
          backdropFilter: `blur(${vibe.blur}px)`,
          boxShadow: `0 8px 24px ${vibe.accent}40`,
        }
      : vibe.buttonStyle === "outline"
        ? {
            backgroundColor: "transparent",
            border: `1px solid ${vibe.accent}`,
            color: textColor,
            boxShadow: "none",
          }
        : {
            backgroundColor: vibe.accent,
            border: "1px solid transparent",
            color: "#fff",
            boxShadow: `0 10px 24px ${vibe.accent}55`,
          };

  return (
    <div className="relative mx-auto h-[640px] w-[320px] overflow-hidden rounded-[3rem] border-[8px] border-zinc-800 bg-black shadow-2xl">
      <div className="absolute inset-0" style={{ backgroundColor: vibe.backgroundColor }} />
      {!vibe.customBackground ? (
        <div className={`absolute inset-0 ${preset.bg} opacity-85`} />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${vibe.customBackground})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.75,
          }}
        />
      )}
      <div className={`absolute inset-0 ${overlayClass}`} />

      <div className="relative z-10 flex h-full flex-col items-center overflow-y-auto p-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" style={{ fontFamily: vibe.font }}>
        <div className="mt-8 mb-4 h-20 w-20 overflow-hidden rounded-full border-2 border-white/15 bg-zinc-700">
          <img
            src={profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profile.name || "user")}`}
            alt="avatar"
            className="h-full w-full object-cover"
          />
        </div>
        <h2 className="mb-1 text-xl font-black" style={{ color: textColor }}>
          {profile.name || "Your Name"}
        </h2>
        <p className={`mb-6 px-4 text-center text-xs ${vibe.softText ? "opacity-75" : "opacity-95"}`} style={{ color: textColor }}>
          {profile.bio || "Write something about yourself..."}
        </p>

        <div className="w-full space-y-3">
          {active.map((link) => (
            <div
              key={link.id}
              className="w-full cursor-pointer px-4 py-3.5 text-center text-sm font-semibold transition-transform active:scale-95"
              style={{ ...buttonStyle, borderRadius: `${vibe.radius}px` }}
            >
              {link.title}
            </div>
          ))}
        </div>

        <div className="mt-auto pt-8 text-[10px] font-bold tracking-wider" style={{ color: `${textColor}99` }}>
          DAPLINK PREVIEW
        </div>
      </div>
    </div>
  );
}

export default function EditProfilePage() {
  const queryClient = useQueryClient();
  const { user, loading: authLoading } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [tab, setTab] = useState("links");
  const [profile, setProfile] = useState({ name: "", bio: "", avatar: "", location: "" });
  const [links, setLinks] = useState([]);
  const [draggedLinkId, setDraggedLinkId] = useState(null);
  const [preset, setPreset] = useState(PRESETS[0]);
  const [vibe, setVibe] = useState(mergeVibe());
  const [message, setMessage] = useState("");
  const daplink = user?.daplinkID;

  const ui = isDark
    ? {
        text: "text-white",
        muted: "text-zinc-500",
        panel: "border-zinc-800 bg-zinc-900/70",
        input: "border-zinc-800 bg-zinc-950 text-white placeholder:text-zinc-500",
        activeTab: "bg-white text-black",
        tab: "text-zinc-500 hover:text-white",
        border: "border-zinc-800",
      }
    : {
        text: "text-zinc-900",
        muted: "text-zinc-500",
        panel: "border-zinc-200 bg-white",
        input: "border-zinc-200 bg-zinc-50 text-zinc-900 placeholder:text-zinc-400",
        activeTab: "bg-zinc-900 text-white",
        tab: "text-zinc-500 hover:text-zinc-900",
        border: "border-zinc-200",
      };

  useEffect(() => {
    if (!daplink) return;
    const dbPreset = PRESETS.find((p) => p.id === daplink.theme) || PRESETS[0];
    const mappedLinks = Array.isArray(daplink.links)
      ? daplink.links.map((l, idx) => ({
          id: `${idx + 1}`,
          title: l.linktext || "",
          url: l.link || "",
          active: true,
        }))
      : [];

    setPreset(dbPreset);
    setVibe(
      mergeVibe({
        accent: dbPreset.defaultAccent,
        backgroundColor: dbPreset.defaultBg,
        font: dbPreset.font,
        ...(daplink.themeConfig || {}),
      })
    );
    setProfile({
      name: daplink.handle || "",
      bio: daplink.script || "",
      avatar: daplink.profile || "",
      location: daplink.location || "",
    });
    setLinks(mappedLinks.length ? mappedLinks : [{ id: "1", title: "My Link", url: "", active: true }]);
  }, [daplink]);

  const mutation = useMutation({
    mutationFn: async (payload) => axios.put("/api/Updatedetails", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daplink", user?.daplinkID?._id || user?._id] });
      setMessage("Changes published");
      setTimeout(() => setMessage(""), 2200);
    },
    onError: (error) => {
      setMessage(error?.response?.data?.message || "Failed to publish");
    },
  });

  const activeLinks = useMemo(() => links.filter((l) => l.active).length, [links]);

  const publishChanges = () => {
    mutation.mutate({
      handle: profile.name,
      script: profile.bio,
      profile: profile.avatar,
      location: profile.location,
      theme: preset.id,
      themeConfig: vibe,
      links: links.map((l) => ({ title: l.title, url: l.url })),
    });
  };

  const addLink = () => setLinks((prev) => [...prev, { id: String(Date.now()), title: "New Link", url: "", active: true }]);
  const updateLink = (id, key, value) => setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, [key]: value } : l)));
  const removeLink = (id) => setLinks((prev) => prev.filter((l) => l.id !== id));
  const toggleLink = (id) => setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, active: !l.active } : l)));
  const reorderLinks = (fromId, toId) => {
    if (!fromId || !toId || fromId === toId) return;
    setLinks((prev) => {
      const fromIndex = prev.findIndex((l) => l.id === fromId);
      const toIndex = prev.findIndex((l) => l.id === toId);
      if (fromIndex < 0 || toIndex < 0) return prev;
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  };

  const handleDragStart = (id) => (e) => {
    setDraggedLinkId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDrop = (targetId) => (e) => {
    e.preventDefault();
    const sourceId = draggedLinkId || e.dataTransfer.getData("text/plain");
    reorderLinks(sourceId, targetId);
    setDraggedLinkId(null);
  };

  const handleDragEnd = () => setDraggedLinkId(null);

  const onAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setProfile((p) => ({ ...p, avatar: String(reader.result || "") }));
    reader.readAsDataURL(file);
  };

  const onThemeBackgroundUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMessage("Please upload an image file");
      return;
    }
    if (file.size > 1024 * 1024) {
      setMessage("Theme background must be under 1MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setVibe((v) => ({ ...v, customBackground: String(reader.result || "") }));
      setMessage("Theme background added");
      setTimeout(() => setMessage(""), 1800);
    };
    reader.readAsDataURL(file);
  };

  if (authLoading) return <div className={`flex h-64 items-center justify-center ${ui.muted}`}>Loading...</div>;

  return (
    <div className={`flex flex-col gap-12 xl:flex-row ${ui.text}`}>
      <div className="flex-1 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-black ${ui.text}`}>Edit Your Bio</h1>
            <p className={`text-sm ${ui.muted}`}>Looks better and fully usable now.</p>
          </div>
          <button
            onClick={publishChanges}
            disabled={mutation.isPending}
            className={`flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition ${
              isDark ? "bg-white text-black" : "bg-zinc-900 text-white"
            } disabled:opacity-60`}
          >
            {mutation.isPending ? "Publishing..." : "Publish Changes"}
            <Save size={16} />
          </button>
        </div>

        <div className={`flex w-fit gap-1 rounded-2xl border p-1 ${ui.panel}`}>
          {[
            { id: "links", icon: Layout, label: `Blocks (${activeLinks})` },
            { id: "appearance", icon: Palette, label: "Vibe" },
            { id: "profile", icon: UserCircle, label: "Profile" },
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-bold ${tab === t.id ? ui.activeTab : ui.tab}`}
              >
                <Icon size={15} />
                {t.label}
              </button>
            );
          })}
        </div>

        {tab === "links" && (
          <div className="space-y-4">
            <button onClick={addLink} className={`flex w-full items-center justify-center gap-2 rounded-3xl border-2 border-dashed py-4 font-bold ${ui.border} ${ui.muted}`}>
              <Plus size={18} />
              Add New Block
            </button>
            {links.map((link) => (
              <div
                key={link.id}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop(link.id)}
                className={`flex items-center gap-4 rounded-3xl border p-5 ${ui.panel} ${draggedLinkId === link.id ? "ring-2 ring-violet-500/60" : ""}`}
              >
                <button
                  type="button"
                  draggable
                  onDragStart={handleDragStart(link.id)}
                  onDragEnd={handleDragEnd}
                  className={`cursor-grab active:cursor-grabbing ${ui.muted}`}
                  aria-label="Drag to reorder block"
                  title="Drag to reorder"
                >
                  <GripVertical size={18} />
                </button>
                <div className="flex-1 space-y-1">
                  <input
                    value={link.title}
                    onChange={(e) => updateLink(link.id, "title", e.target.value)}
                    className={`w-full border-2 bg-transparent p-2 font-bold focus:ring-0 ${ui.input} ${ui.text}`}
                  />
                  <div className="flex items-center gap-2">
                    <Globe size={12} className={ui.muted} />
                    <input
                      value={link.url}
                      onChange={(e) => updateLink(link.id, "url", e.target.value)}
                      className={`w-full border-2 bg-transparent p-2 text-xs focus:ring-0 ${ui.input}`}
                    />
                  </div>
                </div>
                <button onClick={() => toggleLink(link.id)} className={`relative h-5 w-10 rounded-full ${link.active ? "bg-violet-600" : "bg-zinc-400/40"}`}>
                  <span className={`absolute top-1 h-3 w-3 rounded-full bg-white ${link.active ? "left-6" : "left-1"}`} />
                </button>
                <button onClick={() => removeLink(link.id)} className={ui.muted}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {tab === "profile" && (
          <div className={`rounded-3xl border p-5 ${ui.panel}`}>
            <div className="mb-6 flex items-center gap-5">
              <div className={`group relative h-24 w-24 overflow-hidden rounded-full ${ui.border}`}>
                <img
                  src={profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profile.name || "user")}`}
                  alt="avatar"
                  className="h-full w-full object-cover"
                />
                <label className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/50 opacity-0 transition group-hover:opacity-100  ">
                  <Plus size={18} className="text-white" />
                  <input type="file" accept="image/*" className="hidden" onChange={onAvatarUpload} />
                </label>
              </div>
              <p className={`text-sm ${ui.muted}`}>Upload avatar, edit location and bio.</p>
            </div>
            <div className="space-y-3">
            <label className={`text-md font-semibold mx-2 ${ui.muted}`}>Display Handle</label>
              <input
                value={profile?.name}
                // onChange={(e) => setProfile((p) => ({ ...p, handle: e.target.value }))}
                disabled={true}
                className={`w-full rounded-2xl border px-4 py-3 mb-4 cursor-not-allowed ${ui.input}`}
                placeholder="Display Handle"
              />
              {/* <label className={`text-xs font-semibold ${ui.muted}`}>Note: Display Handle cannot be changed due to technical limitations. Please contact support if you want to change it.</label> */}

              <label className={`text-md font-semibold m-2 ${ui.muted}`}>Location</label>
              <input
                value={profile.location}
                onChange={(e) => setProfile((p) => ({ ...p, location: e.target.value }))}
                className={`w-full rounded-2xl border px-4 py-3 ${ui.input}`}
                placeholder="Location"
              />
              <label className={`text-md font-semibold m-2 ${ui.muted}`}>Bio</label>
              <textarea
                rows={3}
                value={profile.bio}
                onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                className={`w-full resize-none rounded-2xl border px-4 py-3 ${ui.input}`}
                placeholder="Bio"
              />

            </div>
          </div>
        )}

        {tab === "appearance" && (
          <div className="space-y-5">
            <div className={`relative overflow-hidden rounded-3xl border p-5 ${ui.panel}`}>
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl" style={{ background: `${vibe.accent}77` }} />
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <p className={`text-xs font-bold uppercase tracking-[0.2em] ${ui.muted}`}>Vibe Studio</p>
                  <h3 className="mt-1 text-lg font-black">Make It Yours</h3>
                </div>
                <span className={`rounded-full border px-3 py-1 text-xs font-bold ${ui.border}`}>{preset.name}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setPreset(p);
                    setVibe((v) =>
                      mergeVibe({
                        ...v,
                        accent: p.defaultAccent,
                        backgroundColor: p.defaultBg,
                        font: p.font,
                      })
                    );
                  }}
                  className={`rounded-3xl border p-2 text-left transition ${preset.id === p.id ? "ring-2 ring-violet-500" : ""} ${ui.border}`}
                >
                  <div className={`h-24 rounded-2xl ${p.bg}`} />
                  <div className="mt-2 flex items-center justify-between px-1">
                    <span className="text-xs font-bold">{p.name}</span>
                    {preset.id === p.id ? <Check size={14} /> : null}
                  </div>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className={`rounded-3xl border p-4 ${ui.panel}`}>
                <div className="mb-2 flex items-center gap-2">
                  <Sparkles size={15} style={{ color: vibe.accent }} />
                  <p className="text-sm font-bold">Accent Color</p>
                </div>
                <div className="mb-3 flex items-center gap-3">
                  <input
                    type="color"
                    value={vibe.accent}
                    onChange={(e) => setVibe((v) => ({ ...v, accent: e.target.value }))}
                    className="h-10 w-12 cursor-pointer rounded-lg border border-zinc-400/40 bg-transparent p-1"
                  />
                  <input
                    value={vibe.accent}
                    onChange={(e) => setVibe((v) => ({ ...v, accent: e.target.value }))}
                    className={`w-full rounded-xl border px-3 py-2 text-xs ${ui.input}`}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {ACCENTS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setVibe((v) => ({ ...v, accent: c }))}
                      className={`h-8 w-8 rounded-full ${vibe.accent === c ? "ring-2 ring-offset-2 ring-violet-500" : ""}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className={`rounded-3xl border p-4 ${ui.panel}`}>
                <div className="mb-2 flex items-center gap-2">
                  <Palette size={15} className={ui.muted} />
                  <p className="text-sm font-bold">Background Color</p>
                </div>
                <div className="mb-3 flex items-center gap-3">
                  <input
                    type="color"
                    value={vibe.backgroundColor}
                    onChange={(e) => setVibe((v) => ({ ...v, backgroundColor: e.target.value }))}
                    className="h-10 w-12 cursor-pointer rounded-lg border border-zinc-400/40 bg-transparent p-1"
                  />
                  <input
                    value={vibe.backgroundColor}
                    onChange={(e) => setVibe((v) => ({ ...v, backgroundColor: e.target.value }))}
                    className={`w-full rounded-xl border px-3 py-2 text-xs ${ui.input}`}
                  />
                </div>
                <label className={`mb-2 block text-xs font-semibold ${ui.muted}`}>Custom Background Upload</label>
                <div className="flex gap-2">
                  <label className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold ${ui.border}`}>
                    <Upload size={12} />
                    Upload
                    <input type="file" accept="image/*" className="hidden" onChange={onThemeBackgroundUpload} />
                  </label>
                  <button
                    type="button"
                    onClick={() => setVibe((v) => ({ ...v, customBackground: "" }))}
                    className={`rounded-xl border px-3 py-2 text-xs font-bold ${ui.border}`}
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className={`rounded-3xl border p-4 ${ui.panel}`}>
                <div className="mb-2 flex items-center gap-2">
                  <Palette size={15} className={ui.muted} />
                  <p className="text-sm font-bold">Background Style</p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {BG_STYLES.map((b) => (
                    <button
                      key={b}
                      onClick={() => setVibe((v) => ({ ...v, bgStyle: b }))}
                      className={`rounded-xl border px-2 py-2 text-xs font-semibold ${vibe.bgStyle === b ? "border-violet-500 text-violet-500" : ui.border}`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div className={`rounded-3xl border p-4 ${ui.panel}`}>
                <div className="mb-2 flex items-center gap-2">
                  <UserCircle size={15} className={ui.muted} />
                  <p className="text-sm font-bold">Font Family</p>
                </div>
                <select
                  value={vibe.font}
                  onChange={(e) => setVibe((v) => ({ ...v, font: e.target.value }))}
                  className={`w-full rounded-xl border px-3 py-2 text-xs ${ui.input}`}
                >
                  {FONTS.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className={`rounded-3xl border p-4 ${ui.panel}`}>
                <div className="mb-2 flex items-center gap-2">
                  <Layout size={15} className={ui.muted} />
                  <p className="text-sm font-bold">Button Style</p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {BTN_STYLES.map((b) => (
                    <button
                      key={b}
                      onClick={() => setVibe((v) => ({ ...v, buttonStyle: b }))}
                      className={`rounded-xl border px-2 py-2 text-xs font-semibold ${vibe.buttonStyle === b ? "border-violet-500 text-violet-500" : ui.border}`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div className={`rounded-3xl border p-4 ${ui.panel}`}>
                <div className="mb-2 flex items-center gap-2">
                  <SlidersHorizontal size={15} className={ui.muted} />
                  <p className="text-sm font-bold">Fine Tune</p>
                </div>
                <label className={`mb-1 block text-xs ${ui.muted}`}>Radius ({vibe.radius})</label>
                <input
                  type="range"
                  min={8}
                  max={30}
                  value={vibe.radius}
                  onChange={(e) => setVibe((v) => ({ ...v, radius: Number(e.target.value) }))}
                  className="w-full accent-violet-500"
                />
                <label className={`mb-1 mt-3 block text-xs ${ui.muted}`}>Glass Blur ({vibe.blur})</label>
                <input
                  type="range"
                  min={0}
                  max={24}
                  value={vibe.blur}
                  onChange={(e) => setVibe((v) => ({ ...v, blur: Number(e.target.value) }))}
                  className="w-full accent-violet-500"
                />
              </div>
            </div>
          </div>
        )}

        <div className={`border-t pt-6 ${ui.border}`}>
          <p className={`text-xs ${ui.muted}`}>
            Status: <span className={ui.text}>{message || "Ready"}</span>
          </p>
        </div>
      </div>

      <div className="hidden w-[400px] xl:block">
        <div className="sticky top-24">
          <PhonePreview profile={profile} links={links} preset={preset} vibe={vibe} />
        </div>
      </div>
    </div>
  );
}
