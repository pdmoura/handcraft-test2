import { Leaf, Heart, Globe, Users, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata = { title: 'About', description: 'Learn about Handcrafted Haven — our mission, values, and how we connect artisans with customers worldwide.' };

export default async function AboutPage() {
  return (
    <>
      <section className="bg-primary py-20 md:py-28 text-center">
        <div className="container-app">
          <Leaf size={40} className="text-cta mx-auto mb-6" />
          <h1 className="font-display text-4xl md:text-5xl text-white uppercase mb-4">About Handcrafted Haven</h1>
          <p className="font-body text-lg text-white/80 max-w-2xl mx-auto">A community-driven marketplace connecting artisans with customers who value handmade, sustainable products.</p>
        </div>
      </section>
      <section className="py-16 md:py-24">
        <div className="container-app max-w-4xl">
          <h2 className="font-display text-3xl text-primary uppercase text-center mb-12">Our Mission</h2>
          <p className="font-body text-text-muted text-lg leading-relaxed text-center mb-16">We believe every handmade product has a story. Handcrafted Haven exists to amplify the voices of artisans around the world, giving them a platform to showcase their craft and connect directly with people who appreciate quality, sustainability, and authenticity.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Heart, title: 'Handmade with Love', desc: 'Every product is crafted by hand, ensuring uniqueness and quality in every piece.' },
              { icon: Globe, title: 'Sustainable', desc: 'We champion eco-friendly practices and support artisans who use sustainable materials.' },
              { icon: Users, title: 'Community First', desc: 'We foster direct connections between creators and supporters, building lasting relationships.' },
            ].map((item) => (
              <div key={item.title} className="text-center p-6 bg-white rounded-xl shadow-card">
                <div className="w-14 h-14 rounded-full bg-cta/10 flex items-center justify-center mx-auto mb-4"><item.icon size={24} className="text-cta" /></div>
                <h3 className="font-display text-lg text-primary uppercase mb-2">{item.title}</h3>
                <p className="font-body text-sm text-text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 md:py-24 bg-surface-warm">
        <div className="container-app max-w-4xl">
          <h2 className="font-display text-3xl text-primary uppercase text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="font-display text-xl text-primary uppercase mb-4 flex items-center gap-2"><Sparkles size={20} className="text-cta" /> For Buyers</h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <span className="bg-cta text-text w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-ui font-bold text-xs">1</span>
                  <span className="font-body text-sm text-text-muted">Browse our curated collection of handmade products.</span>
                </li>
                <li className="flex gap-3">
                  <span className="bg-cta text-text w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-ui font-bold text-xs">2</span>
                  <span className="font-body text-sm text-text-muted">Add your favorites to the cart and checkout.</span>
                </li>
                <li className="flex gap-3">
                  <span className="bg-cta text-text w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-ui font-bold text-xs">3</span>
                  <span className="font-body text-sm text-text-muted">Receive your handcrafted goods and leave a review!</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-display text-xl text-primary uppercase mb-4 flex items-center gap-2"><ShieldCheck size={20} className="text-cta" /> For Sellers</h3>
              <ol className="space-y-4 font-body text-sm text-text-muted">
                <li className="flex gap-3"><span className="bg-accent text-white w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-ui font-bold text-xs">1</span>Create your free seller account and set up your profile.</li>
                <li className="flex gap-3"><span className="bg-accent text-white w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-ui font-bold text-xs">2</span>List your handcrafted products with photos and descriptions.</li>
                <li className="flex gap-3"><span className="bg-accent text-white w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-ui font-bold text-xs">3</span>Connect with customers, manage orders, and grow your craft.</li>
              </ol>
            </div>
          </div>
          <div className="text-center mt-12">
            <Link href="/sell" className="inline-flex items-center gap-2 bg-cta hover:bg-cta-hover text-text font-body font-semibold px-8 py-3.5 rounded-full transition-colors">
              Start Selling Today
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-surface-warm">
        <div className="container-app max-w-3xl">
          <h2 className="font-display text-3xl text-primary uppercase text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              {
                q: "How do I know the products are really handmade?",
                a: "We personally vet every artisan that joins Handcrafted Haven. Sellers must provide proof of their crafting process, ensuring you only receive authentic, handcrafted goods."
              },
              {
                q: "Can I return a custom order?",
                a: "Because custom orders are made specifically for you, they generally cannot be returned unless they arrive damaged or defective. Please check individual shop policies for details."
              },
              {
                q: "How does shipping work?",
                a: "Sellers ship directly from their own workshops. Shipping times and costs vary depending on the seller's location and the item's size. You can view shipping details on every product page."
              },
              {
                q: "How can I become a seller?",
                a: "It's easy! Just click the 'Start Selling Today' button above or navigate to our Sell page to set up your artisan shop and start listing your products."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-border-light">
                <h3 className="font-ui font-bold text-lg text-primary mb-2 flex items-start gap-3">
                  <span className="text-accent font-display text-2xl leading-none">Q.</span> {faq.q}
                </h3>
                <p className="font-body text-text-muted leading-relaxed pl-8">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
