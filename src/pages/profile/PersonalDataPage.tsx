import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { CaretLeft, CheckCircle, Pencil, X, Camera } from "phosphor-react";
import { GlassCard } from "../../components/ui/GlassCard";
import { Skeleton } from "../../components/ui/Skeleton";
import { FieldError } from "../../components/ui/FieldError";
import { useAuth } from "../../hooks/useAuth";
import {
  getProfile,
  updateProfile,
  uploadPhoto,
} from "../../services/auth.service";
import type { ProfileData } from "../../types/auth";
import {
  emailRules,
  nameRules,
  phoneRules,
} from "../../utils/validation";

const CACHE_KEY = "cache_profile";
const MAX_PHOTO_SIZE = 2 * 1024 * 1024; // 2MB

interface EditProfileFormValues {
  name: string;
  email: string;
  phone: string;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function loadProfileCache(): ProfileData | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as ProfileData) : null;
  } catch {
    return null;
  }
}

function saveProfileCache(data: ProfileData) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // localStorage no disponible; se ignora
  }
}

interface InfoRowProps {
  label: string;
  value: string;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
        {label}
      </span>
      <span className="text-sm font-semibold text-text-primary">{value}</span>
    </div>
  );
}

export function PersonalDataPage() {
  const navigate = useNavigate();
  const { user, setUser, setProfile: setAuthProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cached = loadProfileCache();
  const [profile, setProfile] = useState<ProfileData | null>(cached);
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState("");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editPhoto, setEditPhoto] = useState<File | null>(null);
  const [editPhotoPreview, setEditPhotoPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<EditProfileFormValues>({
    defaultValues: { name: "", email: "", phone: "" },
    mode: "onBlur",
  });

  const editName = useWatch({ control, name: "name" });

  useEffect(() => {
    let cancelled = false;

    getProfile()
      .then((data) => {
        if (!cancelled) {
          setProfile(data);
          saveProfileCache(data);
        }
      })
      .catch((err) => {
        if (!cancelled)
          setError(
            err instanceof Error ? err.message : "Error al cargar datos",
          );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function openModal() {
    if (!profile) return;
    reset({
      name: profile.name,
      email: profile.email,
      phone: profile.phone || "",
    });
    setEditPhoto(null);
    setEditPhotoPreview(null);
    setSaveError("");
    setShowModal(true);
  }

  function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_PHOTO_SIZE) {
      setSaveError("La imagen no debe pesar más de 2MB");
      return;
    }

    setEditPhoto(file);
    setEditPhotoPreview(URL.createObjectURL(file));
    setSaveError("");
  }

  async function onValidSubmit({
    name,
    email,
    phone,
  }: EditProfileFormValues) {
    setSaving(true);
    setSaveError("");

    try {
      // Update profile fields
      const updated = await updateProfile({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
      });

      // Upload photo if selected
      if (editPhoto) {
        const photoUrl = await uploadPhoto(editPhoto);
        if (photoUrl) {
          updated.photo = photoUrl;
        }
      }

      setProfile(updated);
      saveProfileCache(updated);

      // Sync with AuthContext so Header/ProfilePage update too
      // Merge with existing context profile to preserve any fields not in PUT response
      const mergedProfile = { ...profile, ...updated };
      if (updated.photo) {
        mergedProfile.photo = updated.photo;
      }
      setAuthProfile(mergedProfile);
      saveProfileCache(mergedProfile);

      // Sync user photo in context so Header updates too
      if (updated.photo && user) {
        const updatedUser = { ...user, photo: updated.photo };
        setUser(updatedUser);
        try {
          localStorage.setItem('cache_user', JSON.stringify(updatedUser));
        } catch {
          // localStorage no disponible; se ignora
        }
      }

      setShowModal(false);
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "Error al guardar cambios",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-dvh relative">
      {/* Glow backgrounds */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-lg mx-auto pb-24">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-bg-deep/80 backdrop-blur-xl px-5 pt-10 pb-4 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-bg-card border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Volver"
          >
            <CaretLeft size={20} weight="bold" />
          </button>
          <h1 className="text-base font-bold text-text-primary">
            Datos Personales
          </h1>
        </header>

        <main className="px-5 space-y-6">
          {error && (
            <div className="px-4 py-3 rounded-xl bg-error/10 border border-error/20 text-error text-sm font-medium">
              {error}
            </div>
          )}

          {/* Profile Card */}
          <GlassCard className="overflow-hidden">
            {/* Gradient Header */}
            <div className="h-24 bg-gradient-to-br from-primary/30 via-accent-violet/20 to-accent-cyan/10 relative">
              <div className="absolute inset-0 bg-gradient-to-t from-bg-card/80 to-transparent" />
            </div>

            {/* Profile Info */}
            <div className="px-4 pb-6 -mt-12 relative z-10 flex flex-col items-center text-center">
              {loading ? (
                <>
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <Skeleton className="h-5 w-36 mt-3" />
                  <Skeleton className="h-4 w-48 mt-2" />
                </>
              ) : (
                <>
                  {/* Avatar with initial or photo */}
                  <div className="relative">
                    {profile?.photo ? (
                      <img
                        src={profile.photo}
                        alt={profile.name || "Usuario"}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/50"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center">
                        <span className="text-lg font-bold text-primary">
                          {getInitials(profile?.name || "U")}
                        </span>
                      </div>
                    )}
                  </div>
                  <h2 className="text-lg font-bold text-text-primary mt-3">
                    {profile?.name || "Usuario"}
                  </h2>
                  <p className="text-sm text-text-muted mt-0.5">
                    {profile?.email || ""}
                  </p>

                  {/* Account Status */}
                  {loading || !profile?.account ? (
                    <Skeleton className="h-6 w-28 mt-3 rounded-full" />
                  ) : (
                    <div
                      className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${
                        profile.account.status === "active"
                          ? "bg-success/10 border-success/20"
                          : "bg-error/10 border-error/20"
                      }`}
                    >
                      <CheckCircle
                        size={14}
                        weight="fill"
                        className={
                          profile.account.status === "active"
                            ? "text-success"
                            : "text-error"
                        }
                      />
                      <span
                        className={`text-xs font-semibold ${
                          profile.account.status === "active"
                            ? "text-success"
                            : "text-error"
                        }`}
                      >
                        Cuenta {profile.account.status === "active" ? "Activa" : "Inactiva"}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </GlassCard>

          {/* Personal Info */}
          <GlassCard className="overflow-hidden p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">
                Datos de la cuenta
              </h3>
              {!loading && (
                <button
                  onClick={openModal}
                  className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-primary hover:bg-primary/25 transition-colors"
                  aria-label="Editar datos"
                >
                  <Pencil size={14} weight="bold" />
                </button>
              )}
            </div>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-3"
                  >
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-4 w-36" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="divide-y divide-border">
                <InfoRow label="Nombre" value={profile?.name || "-"} />
                <InfoRow label="Correo" value={profile?.email || "-"} />
                <InfoRow label="Teléfono" value={profile?.phone || "-"} />
              </div>
            )}
          </GlassCard>
        </main>
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4"
          onClick={() => setShowModal(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal */}
          <div
            className="relative w-full sm:max-w-sm bg-bg-surface border border-border rounded-t-3xl sm:rounded-2xl p-6 space-y-5 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-bg-card border border-border flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
              aria-label="Cerrar"
            >
              <X size={16} weight="bold" />
            </button>

            <h3 className="text-base font-bold text-text-primary pr-8">
              Editar datos
            </h3>

            {saveError && (
              <div className="px-4 py-3 rounded-xl bg-error/10 border border-error/20 text-error text-sm font-medium">
                {saveError}
              </div>
            )}

            {/* Photo Upload */}
            <div className="flex flex-col items-center gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="relative group"
              >
                {editPhotoPreview || profile?.photo ? (
                  <img
                    src={editPhotoPreview || profile?.photo || ""}
                    alt="Foto de perfil"
                    className="w-20 h-20 rounded-full object-cover ring-2 ring-primary/50"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">
                      {getInitials(editName || "U")}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={20} className="text-white" weight="bold" />
                </div>
              </button>
              <p className="text-xs text-text-muted">
                Toca para cambiar foto (máx. 2MB)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoSelect}
              />
            </div>

            {/* Fields */}
            <form onSubmit={handleSubmit(onValidSubmit)} noValidate>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="edit-name"
                    className="block text-xs font-medium text-text-secondary mb-1.5"
                  >
                    Nombre
                  </label>
                  <input
                    id="edit-name"
                    type="text"
                    autoComplete="name"
                    aria-invalid={!!errors.name}
                    {...register("name", nameRules())}
                    className={`w-full h-11 px-4 rounded-xl bg-bg-deep border text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:ring-1 transition-colors ${
                      errors.name
                        ? "border-error focus:border-error focus:ring-error/25"
                        : "border-border focus:border-primary/50 focus:ring-primary/25"
                    }`}
                  />
                  <FieldError message={errors.name?.message} />
                </div>
                <div>
                  <label
                    htmlFor="edit-email"
                    className="block text-xs font-medium text-text-secondary mb-1.5"
                  >
                    Correo electrónico
                  </label>
                  <input
                    id="edit-email"
                    type="email"
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                    {...register("email", emailRules())}
                    className={`w-full h-11 px-4 rounded-xl bg-bg-deep border text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:ring-1 transition-colors ${
                      errors.email
                        ? "border-error focus:border-error focus:ring-error/25"
                        : "border-border focus:border-primary/50 focus:ring-primary/25"
                    }`}
                  />
                  <FieldError message={errors.email?.message} />
                </div>
                <div>
                  <label
                    htmlFor="edit-phone"
                    className="block text-xs font-medium text-text-secondary mb-1.5"
                  >
                    Teléfono
                  </label>
                  <input
                    id="edit-phone"
                    type="tel"
                    autoComplete="tel"
                    aria-invalid={!!errors.phone}
                    {...register("phone", phoneRules(false))}
                    className={`w-full h-11 px-4 rounded-xl bg-bg-deep border text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:ring-1 transition-colors ${
                      errors.phone
                        ? "border-error focus:border-error focus:ring-error/25"
                        : "border-border focus:border-primary/50 focus:ring-primary/25"
                    }`}
                  />
                  <FieldError message={errors.phone?.message} />
                </div>
              </div>

              {/* Save Button */}
              <button
                type="submit"
                disabled={saving}
                className="w-full h-12 mt-5 rounded-xl bg-primary text-bg-deep font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary-accent active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <div className="w-5 h-5 border-2 border-bg-deep/30 border-t-bg-deep rounded-full animate-spin" />
                ) : (
                  "Guardar cambios"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
