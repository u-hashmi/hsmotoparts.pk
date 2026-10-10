export function PageHero({ title, sub }: { title: string; sub?: string }) {
  return (
    <section className="border-b-4 border-brand bg-ink-2 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 pt-8 pb-9">
        <h1 className="font-display text-5xl leading-none font-extrabold uppercase md:text-6xl">{title}</h1>
        {sub && <p className="text-[17px] text-soft">{sub}</p>}
      </div>
    </section>
  );
}
