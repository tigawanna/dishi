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
              <picture>
                <source
                  type="image/webp"
                  srcSet="/cook-portrait-320w.webp 320w, /cook-portrait-480w.webp 480w"
                  sizes="(max-width: 768px) 100vw, 384px"
                />
                <source
                  type="image/jpeg"
                  srcSet="/cook-portrait-320w.jpg 320w, /cook-portrait-480w.jpg 480w"
                  sizes="(max-width: 768px) 100vw, 384px"
                />
                <img
                  src="/cook-portrait-480w.jpg"
                  alt="Home cook serving food"
                  className="w-full max-w-sm rounded-2xl shadow-2xl shadow-base-content/10"
                  loading="lazy"
                />
              </picture>
              <div className="absolute -right-4 -bottom-8 md:-right-12">
                <picture>
                  <source
                    type="image/webp"
                    srcSet="/food-bowl-224w.webp 224w, /food-bowl-320w.webp 320w"
                    sizes="(max-width: 768px) 192px, 224px"
                  />
                  <source
                    type="image/jpeg"
                    srcSet="/food-bowl-224w.jpg 224w, /food-bowl-320w.jpg 320w"
                    sizes="(max-width: 768px) 192px, 224px"
                  />
                  <img
                    src="/food-bowl-320w.jpg"
                    alt="Delicious food bowl"
                    className="w-48 rounded-2xl border-4 border-base-100 shadow-2xl shadow-base-content/10 md:w-56"
                    loading="lazy"
                  />
                </picture>
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
