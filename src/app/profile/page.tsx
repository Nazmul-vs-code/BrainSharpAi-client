"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authClient, useSession } from "@/lib/auth-client";
import { Button, Input, Spinner } from "@heroui/react";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Check,
  Mail,
  Save,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";

export default function ProfilePage() {
  const { data: session, isPending, refetch } = useSession();
  const user = session?.user;

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setName(user?.name ?? "");
    setImage(user?.image ?? "");
  }, [user?.name, user?.image]);

  const hasChanges =
    name.trim() !== (user?.name ?? "") ||
    image.trim() !== (user?.image ?? "");

  const handleCancel = () => {
    setName(user?.name ?? "");
    setImage(user?.image ?? "");
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!user) {
      toast.error("Please sign in first.");
      return;
    }

    const trimmedName = name.trim();
    const trimmedImage = image.trim();

    if (trimmedName.length < 2) {
      toast.error("Your name must contain at least 2 characters.");
      return;
    }

    if (
      trimmedImage &&
      !/^https?:\/\/\S+$/i.test(trimmedImage)
    ) {
      toast.error("Enter a valid image URL starting with http:// or https://.");
      return;
    }

    try {
      setIsSaving(true);

      const result = await authClient.updateUser({
        name: trimmedName,
        image: trimmedImage || null,
      });

      if (result.error) {
        throw new Error(
          result.error.message || "Unable to update your profile."
        );
      }

      await refetch();

      setName(trimmedName);
      setImage(trimmedImage);
      setIsEditing(false);

      toast.success("Profile updated successfully.");
    } catch (error) {
      console.error("Profile update failed:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Could not update your profile. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isPending) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <Spinner />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center px-5">
        <section className="w-full max-w-md space-y-4 text-center">
          <UserRound className="mx-auto" size={36} />

          <h1 className="text-2xl font-semibold">Your profile</h1>

          <p>Please sign in to view and update your account.</p>

          <Button
            className="bg-white text-black"
            onPress={() => {
              window.location.href = "/login";
            }}
          >
            Sign in
          </Button>
        </section>
      </main>
    );
  }

  const displayName = user.name || "BrainSharp Member";
  const email = user.email || "No email available";
  const avatarUrl = image.trim();
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Not available";

  return (
    <main className="min-h-screen px-4 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm"
          >
            <ArrowLeft size={17} />
            Back to home
          </Link>

          <Link
            href="/quest"
            className="inline-flex items-center gap-2 text-sm"
          >
            My Quest
            <ArrowUpRight size={16} />
          </Link>
        </header>

        <section className="mb-8">
          <p className="mb-2 text-sm font-medium text-orange-500">
            ACCOUNT SETTINGS
          </p>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Your profile
          </h1>

          <p className="mt-2 max-w-2xl text-sm opacity-70">
            Manage your personal information and account details.
          </p>
        </section>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[0.9fr_1.5fr]">
          {/* Account overview */}
          <section className="overflow-hidden rounded-3xl border">
            {/* Orange and green header */}
            <div className="relative flex min-h-44 items-center justify-center overflow-hidden rounded-b-[2.5rem] bg-gradient-to-r from-orange-500 via-orange-400 to-green-500 p-8">
              <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl border-2 border-white/70 bg-white text-3xl font-semibold text-black">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="h-full w-full object-cover"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  initials || <UserRound size={36} />
                )}
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <h2 className="break-words text-2xl font-semibold">
                {displayName}
              </h2>

              <p className="mt-2 flex items-center gap-2 break-all text-sm opacity-70">
                <Mail size={16} className="shrink-0" />
                {email}
              </p>

              <div className="my-6 border-t" />

              <div className="flex items-center gap-3">
                <CalendarDays size={19} className="shrink-0 text-orange-500" />

                <div>
                  <p className="text-sm opacity-60">Member since</p>
                  <p className="mt-1 text-sm font-medium">{memberSince}</p>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-3">
                <ShieldCheck size={19} className="shrink-0 text-green-600" />

                <div>
                  <p className="text-sm opacity-60">Account</p>
                  <p className="mt-1 text-sm font-medium">
                    Personal account
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Personal information */}
          <section className="rounded-3xl border p-6 sm:p-8">
            <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">
                  Personal information
                </h2>

                <p className="mt-2 text-sm opacity-65">
                  Update the information associated with your account.
                </p>
              </div>

              {!isEditing && (
                <Button
                  className="bg-white text-black"
                  onPress={() => setIsEditing(true)}
                >
                  Edit profile
                </Button>
              )}
            </div>

            <div className="space-y-6">
              {/* Name */}
              <div>
                <label
                  htmlFor="profile-name"
                  className="mb-2 block text-sm font-medium"
                >
                  Full name
                </label>

                {isEditing ? (
                  <Input
                    id="profile-name"
                    aria-label="Full name"
                    className="w-full"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    isDisabled={isSaving}
                  />
                ) : (
                  <div className="flex min-h-11 items-center rounded-xl border px-3 py-2 text-sm">
                    {user.name || "No name added"}
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Email address
                </label>

                <div className="flex min-h-11 items-center gap-3 rounded-xl border px-3 py-2">
                  <Mail size={17} className="shrink-0 opacity-60" />

                  <span className="break-all text-sm">{email}</span>

                  <ShieldCheck
                    size={17}
                    className="ml-auto shrink-0 text-green-600"
                  />
                </div>

                <p className="mt-2 text-xs opacity-60">
                  Your email is managed by your authentication account.
                </p>
              </div>

              {/* Image URL */}
              {isEditing && (
                <div>
                  <label
                    htmlFor="profile-image"
                    className="mb-2 block text-sm font-medium"
                  >
                    Profile image URL
                  </label>

                  <Input
                    id="profile-image"
                    aria-label="Profile image URL"
                    className="w-full"
                    placeholder="https://example.com/image.jpg"
                    value={image}
                    onChange={(event) => setImage(event.target.value)}
                    isDisabled={isSaving}
                  />

                  <p className="mt-2 text-xs opacity-60">
                    Paste a publicly accessible image URL, or leave it empty
                    to remove your custom image.
                  </p>
                </div>
              )}

              {isEditing && (
                <div className="flex flex-wrap gap-3 border-t pt-6">
                  <Button
                    className="bg-white text-black"
                    onPress={handleSave}
                    isDisabled={isSaving || !hasChanges}
                  >
                    {isSaving ? (
                      <>
                        <Spinner size="sm" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        Save changes
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    onPress={handleCancel}
                    isDisabled={isSaving}
                  >
                    <X size={16} />
                    Cancel
                  </Button>
                </div>
              )}

              {!isEditing && (
                <div className="flex items-start gap-3 border-t pt-6">
                  <Check size={18} className="mt-0.5 shrink-0 text-green-600" />

                  <div>
                    <p className="text-sm font-medium">
                      Profile information
                    </p>

                    <p className="mt-1 text-sm opacity-60">
                      Your information is displayed from your signed-in
                      account.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        <footer className="mt-8 border-t pt-6 text-sm opacity-60">
          BrainSharp AI
        </footer>
      </div>
    </main>
  );
}