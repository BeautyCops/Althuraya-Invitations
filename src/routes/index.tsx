import { createFileRoute } from "@tanstack/react-router";

import { absoluteSharePreviewImage } from "@/lib/share-preview-image";
import { BackgroundField } from "@/components/site/BackgroundField";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Features } from "@/components/site/Features";
import { Services } from "@/components/site/Services";
import { HowItWorks } from "@/components/site/HowItWorks";
import { Pricing } from "@/components/site/Pricing";
import { Testimonials } from "@/components/site/Testimonials";
import { FAQ } from "@/components/site/FAQ";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "الثريا — منصة الدعوات الإلكترونية الفاخرة" },
      {
        name: "description",
        content:
          "صمّم، أرسل، وأدر دعواتك الإلكترونية للمناسبات الخاصة أو المؤتمرات والفعاليات العامة بكل سهولة — مع نظام RSVP ذكي وتحليلات حضور لحظية.",
      },
      {
        property: "og:title",
        content: "الثريا — منصة الدعوات الإلكترونية الفاخرة",
      },
      {
        property: "og:description",
        content:
          "صمّم، أرسل، وأدر دعواتك الإلكترونية للمناسبات الخاصة أو المؤتمرات والفعاليات العامة بكل سهولة — مع نظام RSVP ذكي وتحليلات حضور لحظية.",
      },
      { property: "og:type", content: "website" },
      {
        property: "og:image",
        content: absoluteSharePreviewImage(),
      },
      {
        property: "og:image:alt",
        content: "الثريا — منصة الدعوات الإلكترونية",
      },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:image",
        content: absoluteSharePreviewImage(),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <BackgroundField />
      <main className="relative" dir="rtl">
        <Navbar />
        <Hero />
        <Features />
        <Services />
        <HowItWorks />
        <Pricing />
        <Testimonials />
        <FAQ />
        <Contact />
        <Footer />
      </main>
    </>
  );
}
