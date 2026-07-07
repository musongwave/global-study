import { LinkButton } from '../ui/Button'
import { HeroParticles } from './HeroParticles'

const HERO_PHOTO =
  'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1800&q=80&auto=format'

const HERO_STATS = [
  { num: '3000+', label: 'студентов поступили' },
  { num: '30+', label: 'стран для обучения' },
  { num: '100%', label: 'помощь с грантами' },
] as const

export function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden bg-[#06070b]">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${HERO_PHOTO})` }}
        role="img"
        aria-label="Читальный зал университетской библиотеки"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(100deg, rgba(6,7,11,.94) 0%, rgba(6,7,11,.78) 40%, rgba(6,7,11,.30) 100%)',
        }}
      />
      <HeroParticles />
      <div className="relative z-10 container mx-auto px-6 py-32 pt-40 grid grid-cols-1 lg:grid-cols-[1.15fr_.85fr] gap-12 lg:gap-8 items-center">
        <div>
          <p className="text-gold font-syne text-sm font-semibold tracking-widest uppercase mb-4">
            Агентство международного образования
          </p>
          <h1 className="font-syne text-5xl md:text-7xl font-bold leading-tight mb-6 text-white">
            Обучение за рубежом
            <br />
            <span className="text-white/55">с гарантированной поддержкой</span>
          </h1>
          <p className="text-lg max-w-xl mb-10 leading-relaxed text-white/70">
            Ваш путь в топовые университеты мира. Гранты, визовое сопровождение и поддержка на
            каждом этапе.
          </p>
          <div className="flex flex-wrap gap-4">
            <LinkButton href="#contact" variant="gold">
              Начать путь
            </LinkButton>
            <LinkButton href="#universities" variant="glass">
              Университеты
            </LinkButton>
          </div>
        </div>
        <div className="flex flex-col gap-5 lg:gap-6 max-w-md lg:max-w-none mx-auto lg:mx-0 w-full [perspective:900px]">
          {HERO_STATS.map((s, i) => (
            <div
              key={s.label}
              className={`hero-float ${i === 1 ? 'lg:ml-[9%]' : ''} ${i === 2 ? 'lg:-ml-[4%]' : ''}`}
              style={{ animationDelay: `${-2 * i}s` }}
            >
              <div className="liquid-glass glass-tile">
                <div className="font-syne text-4xl md:text-5xl font-extrabold leading-none bg-gradient-to-b from-[#ffe9a8] to-gold bg-clip-text text-transparent [filter:drop-shadow(0_2px_8px_rgba(212,175,55,.35))]">
                  {s.num}
                </div>
                <div className="text-white/85 text-sm font-medium mt-2">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
