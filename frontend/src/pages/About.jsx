import { Flame, Leaf, Users, Award } from "lucide-react";

const About = () => {
  return (
    <div>
      <section className="border-b border-ink/10 bg-terracotta/40 py-16">
        <div className="container-page text-center">
          <h1 className="text-3xl font-semibold sm:text-4xl">Our story</h1>
          <p className="mx-auto mt-4 max-w-xl text-ink/65">
            Copperleaf Kitchen began in 2014 as a single wood-fired oven in a family courtyard. Today
            we're a full kitchen with the same rule we started with: nothing goes out that we wouldn't
            serve at our own table.
          </p>
        </div>
      </section>

      <section className="container-page grid grid-cols-1 items-center gap-12 py-16 md:grid-cols-2">
        <img
          src="https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800&q=80"
          alt="Copperleaf Kitchen dining room"
          className="aspect-[4/3] w-full rounded-card border border-ink/10 object-cover"
        />
        <div>
          <h2 className="text-2xl font-semibold">From courtyard oven to city kitchen</h2>
          <p className="mt-4 text-ink/65">
            What started as weekend cooking for neighbors grew into a proper restaurant, but the
            approach never changed — small batches, real ingredients, and a menu we can vouch for
            dish by dish. Every recipe on our menu has been through years of small adjustments before
            we consider it finished.
          </p>
          <p className="mt-4 text-ink/65">
            We now serve thousands of guests a month, in the dining room and at their doorstep, without
            losing the thing that got us started: cooking food we're genuinely proud of.
          </p>
        </div>
      </section>

      <section className="border-y border-ink/10 bg-ink py-16 text-cream">
        <div className="container-page grid grid-cols-2 gap-8 text-center sm:grid-cols-4">
          <div><Flame className="mx-auto text-copper" size={26} /><p className="mt-3 font-display text-2xl font-semibold">10+</p><p className="text-xs text-cream/50">Years cooking</p></div>
          <div><Leaf className="mx-auto text-olive" size={26} /><p className="mt-3 font-display text-2xl font-semibold">30+</p><p className="text-xs text-cream/50">Local suppliers</p></div>
          <div><Users className="mx-auto text-gold" size={26} /><p className="mt-3 font-display text-2xl font-semibold">40k+</p><p className="text-xs text-cream/50">Guests served</p></div>
          <div><Award className="mx-auto text-copper" size={26} /><p className="mt-3 font-display text-2xl font-semibold">12</p><p className="text-xs text-cream/50">City awards</p></div>
        </div>
      </section>

      <section className="container-page py-16">
        <h2 className="text-center text-2xl font-semibold">What we believe in</h2>
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="rounded-card border border-ink/10 bg-white p-6">
            <h3 className="font-display text-lg font-semibold">Real ingredients</h3>
            <p className="mt-2 text-sm text-ink/60">No shortcuts on produce, dairy, or spice. If it isn't good enough for our own kitchen at home, it doesn't go on the menu.</p>
          </div>
          <div className="rounded-card border border-ink/10 bg-white p-6">
            <h3 className="font-display text-lg font-semibold">Unhurried technique</h3>
            <p className="mt-2 text-sm text-ink/60">Slow-simmered gravies, hand-rolled pasta, dough proofed overnight. Good food takes the time it takes.</p>
          </div>
          <div className="rounded-card border border-ink/10 bg-white p-6">
            <h3 className="font-display text-lg font-semibold">A menu we can vouch for</h3>
            <p className="mt-2 text-sm text-ink/60">We'd rather do fewer dishes brilliantly than a long menu that spreads the kitchen thin.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
