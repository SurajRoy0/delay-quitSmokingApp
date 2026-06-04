import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Clock, BookOpen } from "lucide-react";
import { getTipById } from "@/lib/tips";

interface TipDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function TipDetailPage({ params }: TipDetailPageProps) {
  const { id } = await params;
  const tip = getTipById(id);

  if (!tip) {
    redirect("/tips");
  }

  return (
    <div className="flex flex-col min-h-screen pb-24 md:max-w-md md:mx-auto bg-background">
      {/* Top Banner Image with Floating Back Action */}
      <div className="relative h-60 w-full shrink-0 bg-muted">
        {/* Back Button */}
        <div className="absolute top-4 left-4 z-20">
          <Link
            href="/tips"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white text-xs font-semibold backdrop-blur-md transition-all active:scale-95 border border-white/10"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Tips
          </Link>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-black/35 to-transparent z-10" />

        {tip.image && (
          <img
            src={tip.image}
            alt={tip.title}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Content Container */}
      <div className="px-6 pt-6 flex-1 flex flex-col">
        {/* Category & Read Time Tags */}
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[10px] uppercase tracking-wider bg-brand-light/10 text-brand-light px-2.5 py-1 rounded-full font-bold">
            {tip.category}
          </span>
          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {tip.readTime}
          </span>
        </div>

        {/* Main Title */}
        <h1 className="text-2xl font-bold text-foreground leading-tight tracking-tight mb-6">
          {tip.title}
        </h1>

        {/* HTML Markup Content with Tailwind custom sub-selectors */}
        <div
          className="text-foreground/90 leading-relaxed space-y-4 text-sm
            [&_h3]:text-base [&_h3]:font-bold [&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:text-foreground
            [&_p]:text-sm [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_p]:mb-4
            [&_strong]:text-brand-light [&_strong]:font-semibold
            [&_em]:text-foreground [&_em]:not-italic [&_em]:underline [&_em]:decoration-brand-light/30
            [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_ul]:my-4 [&_ul]:text-muted-foreground [&_ul]:text-sm
            [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-2 [&_ol]:my-4 [&_ol]:text-muted-foreground [&_ol]:text-sm
            [&_li]:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: tip.description }}
        />
      </div>
    </div>
  );
}
