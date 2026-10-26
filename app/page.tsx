import { Approach } from "@/components/approach";
import { Contact } from "@/components/contact";
import { Hero } from "@/components/hero";
import { MaterialProfile } from "@/components/material-profile";
import { Problem } from "@/components/problem";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhyCashmere } from "@/components/why-cashmere";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <Hero />
        <Problem />
        <Approach />
        <MaterialProfile />
        <WhyCashmere />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
