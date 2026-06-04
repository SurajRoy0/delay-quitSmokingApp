import {
  Flame,
  ExternalLink,
  ChevronRight,
  Trophy,
  Cigarette,
  Banknote,
  Timer,
  Palette,
  Tag,
  HelpCircle,
  Mail,
} from "lucide-react";
import { getUserProfile, getUserStats } from "@/actions/user";
import { ThemeToggle } from "./theme-toggle-inline";
import { SignOutButton } from "@/components/sign-out-button";
import { EditProfileTrigger } from "./edit-profile-trigger";

export default async function ProfilePage() {
  const profile = await getUserProfile();
  const stats = await getUserStats();

  return (
    <div className="flex flex-col min-h-screen px-6 py-6 pb-24 md:max-w-md md:mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-brand" />
          <span className="text-xl">Delay</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-brand-light/10 rounded-full border border-brand-light/20">
          <Trophy className="w-3.5 h-3.5 text-brand-light" />
          <span className="text-brand-light text-xs font-medium tracking-wider">
            {stats.longestGap}
          </span>
        </div>
      </header>

      {/* User Info */}
      <section className="flex flex-col items-center mb-10 mt-4">
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full border-2 border-brand/30 overflow-hidden bg-muted">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl font-medium bg-gradient-to-br from-brand-dark to-brand text-white">
                {profile.name[0]}
              </div>
            )}
          </div>
          {profile.premium && (
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand to-brand-light text-background text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full shadow-lg">
              Premium
            </div>
          )}
        </div>
        <h2 className="text-2xl mt-2">{profile.name}</h2>
        <p className="text-muted-foreground text-xs mt-1">
          Member since {profile.memberSince}
        </p>
      </section>

      {/* Settings Sections */}
      <div className="flex flex-col gap-8">
        {/* Smoking Profile */}
        <section>
          <div className="flex items-center justify-between mb-3 ml-2">
            <h3 className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
              Smoking Profile
            </h3>
            <EditProfileTrigger smokingProfile={profile.smokingProfile} />
          </div>
          <div className="bg-card/40 border border-border/40 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border/40">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Cigarette className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">
                  Daily cigarettes
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {profile.smokingProfile.dailyCigarettes}
                </span>
                <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border-b border-border/40">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Banknote className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">
                  Price per cigarette
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {profile.smokingProfile.currencySymbol}
                  {profile.smokingProfile.pricePerCigarette}
                </span>
                <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
              </div>
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Timer className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">Gap target</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-brand-light">
                  {profile.smokingProfile.gapTarget}
                </span>
                <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
              </div>
            </div>
          </div>
        </section>

        {/* Appearance */}
        <section>
          <h3 className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3 ml-2 font-medium">
            Appearance
          </h3>
          <div className="bg-card/40 border border-border/40 rounded-2xl overflow-hidden p-4 flex items-center justify-between">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Palette className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-foreground">Theme</span>
            </div>
            <ThemeToggle />
          </div>
        </section>

        {/* Billing */}
        {profile.premium && (
          <section>
            <h3 className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3 ml-2 font-medium">
              Billing
            </h3>
            <div className="bg-card/40 border border-border/40 rounded-2xl overflow-hidden p-4 flex items-center justify-between cursor-pointer hover:bg-card/60 transition-colors">
              <div className="flex items-center gap-3">
                <div className="bg-brand-light/20 p-2 rounded-xl">
                  <Tag className="w-4 h-4 text-brand-light" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Premium Plan</span>
                  <span className="text-[10px] text-muted-foreground">
                    Active subscription
                  </span>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground/70" />
            </div>
          </section>
        )}

        {/* Support */}
        <section>
          <h3 className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3 ml-2 font-medium">
            Support
          </h3>
          <div className="bg-card/40 border border-border/40 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border/40 cursor-pointer hover:bg-card/60 transition-colors">
              <div className="flex items-center gap-3">
                <HelpCircle className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">FAQ</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
            </div>
            <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-card/60 transition-colors">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Contact Support</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
            </div>
          </div>
        </section>
      </div>

      {/* Sign Out */}
      <div className="mt-12 flex flex-col items-center gap-6 px-4">
        <SignOutButton />
        <span className="text-[9px] uppercase tracking-widest text-muted-foreground/50">
          Version 1.0.0
        </span>
      </div>
    </div>
  );
}
