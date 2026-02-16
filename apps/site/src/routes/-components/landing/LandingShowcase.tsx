interface StatItem {
  number: string;
  label: string;
}

const STATS: StatItem[] = [
  { number: "50+", label: "Cuisines" },
  { number: "2.4K", label: "Cooks" },
  { number: "15K", label: "Meals served" },
];

export function LandingShowcase() {
  return (
    <section id="showcase" className="scroll-mt-20 bg-warm-cream py-24 dark:bg-base-200">
      <div className="container">
        <div className="grid items-center gap-16 md:grid-cols-2">
          <div className="relative">
            <div className="relative">
              <img
                src="/cook-portrait.jpg"
                alt="Home cook serving food"
                className="w-full max-w-sm rounded-2xl shadow-2xl shadow-base-content/10"
                loading="lazy"
              />
              <div className="absolute -right-4 -bottom-8 md:-right-12">
                <img
                  src="/food-bowl.jpg"
                  alt="Delicious food bowl"
                  className="w-48 rounded-2xl border-4 border-base-100 shadow-2xl shadow-base-content/10 md:w-56"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="mb-6 font-serif text-4xl leading-tight text-base-content md:text-5xl">
              Every meal has a{" "}
              <span className="italic text-primary">story</span>
            </h2>
            <p className="mb-8 text-lg leading-relaxed text-base-content/60">
              Behind every dish on Dishi is a real person with a passion for
              cooking. Discover recipes passed down through generations, fusion
              experiments born from curiosity, and comfort food made with love.
            </p>

            <div className="grid grid-cols-3 gap-6">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <div className="font-serif text-3xl text-primary">
                    {stat.number}
                  </div>
                  <div className="mt-1 text-sm text-base-content/60">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
