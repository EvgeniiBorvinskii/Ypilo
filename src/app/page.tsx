import { HeroSection } from '@/components/sections/hero-section'
import { ServicesSection } from '@/components/sections/services-section'
import { AboutSection } from '@/components/sections/about-section'
import { ContactSection } from '@/components/sections/contact-section'
import { IndustriesSection } from '@/components/sections/industries-section'
import { WhyChooseUsSection } from '@/components/sections/why-choose-us-section'

export default function Home() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <IndustriesSection />
      <WhyChooseUsSection />
      <AboutSection />
      <ContactSection />
    </>
  )
}