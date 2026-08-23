import HeroSection from '../../components/about/HeroSection';
import StatsSection from '../../components/about/StatsSection';
import StorySection from '../../components/about/StorySection';
import ValuesSection from '../../components/about/ValuesSection';
import CTASection from '../../components/about/CTASection';
import ProductsSection from '../../components/about/ProductSection';

export default function About() {
  return (
    <main className="bg-white text-gray-900">
      <HeroSection />
      {/* <StatsSection /> */}
      <StorySection />
      <ValuesSection />
      <ProductsSection />
      <CTASection />
    </main>
  );
}