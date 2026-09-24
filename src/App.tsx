import AdminLogin from "./AdminLogin"
import AdminMedia from "./AdminMedia"
import {
  useEffect,
  useState,
  type FormEvent,
} from "react"
import { supabase } from "./lib/supabase"

const whatsappNumber = "243817259728"

const whatsappMessage =
  "Bonjour JM DIGITAL, je souhaite avoir des informations sur vos solutions numériques."

const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
  whatsappMessage,
)}`

const email = "jmgestion15@gmail.com"

type AssistantMessage = {
  from: "user" | "assistant"
  text: string
}

type SiteMedia = {
  id: string
  storage_path: string
  url: string | null
  category: string
  title: string | null
  alt_text: string | null
  active: boolean
  created_at: string
}


const services = [
  {
    icon: "🌐",
    title: "Sites web professionnels",
    text: "Création de sites modernes, rapides, responsifs et adaptés à votre activité.",
  },
  {
    icon: "📱",
    title: "Applications web & mobiles",
    text: "Conception d'applications accessibles sur ordinateur, tablette et téléphone.",
  },
  {
    icon: "💼",
    title: "Logiciels de gestion",
    text: "Solutions personnalisées pour écoles, commerces, restaurants, hôtels et entreprises.",
  },
  {
    icon: "☁️",
    title: "Hébergement & domaines",
    text: "Accompagnement pour mettre votre solution en ligne et gérer votre présence numérique.",
  },
  {
    icon: "✉️",
    title: "E-mails professionnels",
    text: "Mise en place d'adresses professionnelles pour renforcer votre image.",
  },
  {
    icon: "🔍",
    title: "Audit d'applications",
    text: "Analyse et amélioration des applications et systèmes existants.",
  },
  {
    icon: "🎓",
    title: "Formation digitale",
    text: "Formation pratique aux outils numériques, logiciels et solutions de gestion.",
  },
  {
    icon: "🚀",
    title: "Conseil & digitalisation",
    text: "Transformation des processus traditionnels en solutions numériques efficaces.",
  },
]

const sectors = [
  "Écoles & universités",
  "Maisons d'hôtes & hôtels",
  "Restaurants & terrasses",
  "Salles de fête & événements",
  "Commerces & boutiques",
  "Pharmacies & entreprises",
]

const products = [
  {
    icon: "🏫",
    title: "JM GESTION ÉCOLE",
    text: "Gestion des élèves, enseignants, classes, matières, frais scolaires, paiements, présences, notes et bulletins.",
    mediaCategory: "solution-ecole",
  },
  {
    icon: "🏨",
    title: "JM GESTION HÔTEL",
    text: "Gestion des chambres, clients, réservations, ventes, dépenses, paiements et rapports.",
    mediaCategory: "solution-hotel",
  },
  {
    icon: "🍽️",
    title: "JM GESTION RESTAURATION",
    text: "Gestion des produits, ventes, stocks, clients, dépenses, paiements et rapports.",
    mediaCategory: "solution-restauration",
  },
  {
    icon: "🏢",
    title: "JM GESTION SUR MESURE",
    text: "Une solution adaptée aux besoins et au fonctionnement de votre entreprise.",
    mediaCategory: "solution-sur-mesure",
  },
]

const faqs = [
  {
    question: "Combien coûte une application ?",
    answer:
      "Le prix dépend du type de projet, des fonctionnalités et du niveau de personnalisation. Contactez-nous pour discuter de votre besoin et obtenir une estimation.",
  },
  {
    question: "Pouvez-vous créer une application pour mon entreprise ?",
    answer:
      "Oui. JM GESTION peut être adapté à différents secteurs : école, hôtel, restaurant, terrasse, boutique, pharmacie, salle de fête et autres activités.",
  },
  {
    question: "Est-ce que les applications fonctionnent sur téléphone ?",
    answer:
      "Oui. Nous privilégions des solutions modernes et responsives accessibles depuis ordinateur, tablette et téléphone.",
  },
  {
    question: "Puis-je demander une démonstration ?",
    answer:
      "Oui. Vous pouvez nous contacter sur WhatsApp pour présenter votre activité et demander une démonstration.",
  },
  {
    question: "Proposez-vous l'hébergement ?",
    answer:
      "Oui. Nous pouvons vous accompagner pour la mise en ligne de votre site ou application ainsi que pour la configuration du domaine.",
  },
  {
    question: "Faites-vous aussi la maintenance ?",
    answer:
      "Oui. Nous pouvons assurer les corrections, améliorations, mises à jour et évolutions de votre solution.",
  },
]

function getAssistantAnswer(message: string) {
  const text = message.toLowerCase()

  if (
    text.includes("prix") ||
    text.includes("tarif") ||
    text.includes("coût") ||
    text.includes("cout")
  ) {
    return "Le tarif dépend de votre projet et des fonctionnalités souhaitées. Contactez-nous sur WhatsApp au +243 817 259 728 pour discuter de votre besoin."
  }

  if (text.includes("jm gestion") || text.includes("gestion")) {
    return "JM GESTION est notre solution principale de gestion. Elle peut être adaptée aux écoles, hôtels, restaurants, terrasses, boutiques et autres activités."
  }

  if (
    text.includes("école") ||
    text.includes("ecole") ||
    text.includes("université") ||
    text.includes("universite")
  ) {
    return "Nous proposons JM GESTION ÉCOLE pour gérer notamment les élèves, enseignants, classes, matières, frais scolaires, paiements, présences, notes et bulletins."
  }

  if (text.includes("site") || text.includes("web")) {
    return "Nous créons des sites web professionnels modernes et responsifs, avec accompagnement pour le domaine et la mise en ligne."
  }

  if (text.includes("application") || text.includes("app")) {
    return "Nous concevons des applications web et mobiles adaptées aux besoins des entreprises et organisations."
  }

  if (text.includes("formation") || text.includes("apprendre")) {
    return "Nous proposons des formations pratiques sur les outils numériques, les logiciels et les solutions de gestion."
  }

  if (
    text.includes("contact") ||
    text.includes("whatsapp") ||
    text.includes("conseiller")
  ) {
    return "Vous pouvez nous contacter sur WhatsApp au +243 817 259 728 ou par e-mail à jmgestion15@gmail.com."
  }

  if (
    text.includes("bonjour") ||
    text.includes("salut") ||
    text.includes("bonsoir")
  ) {
    return "Bonjour 👋 Bienvenue chez JM DIGITAL. Comment puis-je vous aider ?"
  }

  return "Merci pour votre message. Je peux vous renseigner sur JM DIGITAL, JM GESTION, nos applications, nos sites web, nos tarifs, nos formations et nos solutions numériques."
}

function Placeholder({
  icon,
  title,
  text,
  className = "",
}: {
  icon: string
  title: string
  text: string
  className?: string
}) {
  return (
    <div className={`jm-placeholder ${className}`}>
      <div className="jm-placeholder-pattern" />

      <div className="jm-placeholder-content">
        <div className="jm-placeholder-icon">
          {icon}
        </div>

        <strong>{title}</strong>

        <span>{text}</span>
      </div>
    </div>
  )
}

/*
 * Correction importante :
 * Supabase peut être typé comme nullable dans ton projet.
 * On vérifie donc sa présence avant utilisation.
 */

function getPublicMediaUrl(media?: SiteMedia) {
  if (!media) {
    return ""
  }

  // L'URL enregistrée dans site_media.url reste prioritaire.
  if (media.url) {
    return media.url
  }

  // Si url est vide, on reconstruit l'URL depuis Supabase Storage.
  if (!media.storage_path || !supabase) {
    return ""
  }

  const { data } = supabase.storage
    .from("site-media")
    .getPublicUrl(media.storage_path)

  return data?.publicUrl || ""
}

function MediaImage({
  media,
  fallbackIcon,
  fallbackTitle,
  fallbackText,
  className = "",
}: {
  media?: SiteMedia
  fallbackIcon: string
  fallbackTitle: string
  fallbackText: string
  className?: string
}) {
  if (!media) {
    return (
      <Placeholder
        icon={fallbackIcon}
        title={fallbackTitle}
        text={fallbackText}
        className={className}
      />
    )
  }

  const publicUrl = getPublicMediaUrl(media)

  if (!publicUrl) {
    return (
      <Placeholder
        icon={fallbackIcon}
        title={fallbackTitle}
        text={fallbackText}
        className={className}
      />
    )
  }

  return (
    <div className={`jm-media-image ${className}`}>
      <img
        src={publicUrl}
        alt={
          media.alt_text ||
          media.title ||
          fallbackTitle
        }
        onError={(event) => {
          event.currentTarget.style.display = "none"
        }}
      />
    </div>
  )
}

function MediaGallery({
  media,
  fallbackIcon,
  fallbackTitle,
  fallbackText,
}: {
  media: SiteMedia[]
  fallbackIcon: string
  fallbackTitle: string
  fallbackText: string
}) {
  if (!media.length) {
    return (
      <Placeholder
        icon={fallbackIcon}
        title={fallbackTitle}
        text={fallbackText}
      />
    )
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(120px, 1fr))",
        gap: "10px",
      }}
    >
      {media.map((item) => {
        const publicUrl = getPublicMediaUrl(item)

        if (!publicUrl) {
          return null
        }

        return (
          <img
            key={item.id}
            src={publicUrl}
            alt={
              item.alt_text ||
              item.title ||
              fallbackTitle
            }
            loading="lazy"
            style={{
              width: "100%",
              aspectRatio: "16 / 10",
              objectFit: "cover",
              borderRadius: "14px",
              display: "block",
            }}
            onError={(event) => {
              event.currentTarget.style.display = "none"
            }}
          />
        )
      })}
    </div>
  )
}

function BlogImage({
  media,
  fallbackUrl,
  alt,
}: {
  media?: SiteMedia
  fallbackUrl: string
  alt: string
}) {
  const src = media ? getPublicMediaUrl(media) : fallbackUrl

  return (
    <img
      src={src || fallbackUrl}
      alt={alt}
      loading="lazy"
      onError={(event) => {
        if (event.currentTarget.src !== fallbackUrl) {
          event.currentTarget.src = fallbackUrl
        }
      }}
    />
  )
}

function App() {
  /*
   * =====================================================
   * ROUTAGE ADMINISTRATEUR
   * =====================================================
   *
   * IMPORTANT :
   * Ces constantes doivent être dans App(),
   * mais PAS dans loadMedia().
   */
  const pathname = window.location.pathname

  const isAdminLoginPage =
    pathname === "/admin" ||
    window.location.hash === "#admin"

  const isAdminMediaPage =
    pathname === "/admin-media"

  /*
   * =====================================================
   * ÉTAT DU SITE
   * =====================================================
   */

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false)

  const [activePage, setActivePage] =
    useState(() => {
      const hash = window.location.hash.replace("#", "")
      return hash || "accueil"
    })

  const [assistantOpen, setAssistantOpen] =
    useState(false)

  const [assistantInput, setAssistantInput] =
    useState("")

  const [openFaq, setOpenFaq] =
    useState<number | null>(null)

  const [selectedArticle, setSelectedArticle] =
    useState<string | null>(null)

  const [heroSlide, setHeroSlide] =
    useState(0)

  const [contactName, setContactName] =
    useState("")

  const [contactPhone, setContactPhone] =
    useState("")

  const [contactMessage, setContactMessage] =
    useState("")

  const [media, setMedia] =
    useState<SiteMedia[]>([])

  const [mediaLoaded, setMediaLoaded] =
    useState(false)

  const [assistantMessages, setAssistantMessages] =
    useState<AssistantMessage[]>([
      {
        from: "assistant",
        text: "Bonjour 👋 Je suis l'assistant JM DIGITAL. Comment puis-je vous aider ?",
      },
    ])

  /*
   * =====================================================
   * CHARGEMENT DES MÉDIAS
   * =====================================================
   */

  useEffect(() => {
    if (isAdminLoginPage || isAdminMediaPage) {
      setMediaLoaded(true)
      return
    }

    const client = supabase

    if (!client) {
      setMedia([])
      setMediaLoaded(true)
      return
    }

    let cancelled = false

    const loadMedia = async () => {
      try {
        const { data, error } = await client
          .from("site_media")
          .select(
            "id, storage_path, url, category, title, alt_text, active, created_at",
          )
          .eq("active", true)
          .order("created_at", { ascending: false })

        if (cancelled) return

        if (error) {
          console.error("Erreur chargement médias Supabase :", error)
          setMedia([])
          setMediaLoaded(true)
          return
        }

        setMedia((data ?? []) as SiteMedia[])
        setMediaLoaded(true)
      } catch (error) {
        if (cancelled) return

        console.error("Erreur inattendue Supabase médias :", error)
        setMedia([])
        setMediaLoaded(true)
      }
    }

    void loadMedia()

    return () => {
      cancelled = true
    }
  }, [isAdminLoginPage, isAdminMediaPage])


  /*
   * =====================================================
   * ROUTES ADMIN
   * =====================================================
   *
   * C'est ici que nous affichons réellement
   * AdminLogin et AdminMedia.
   *
   * /admin       -> connexion/création admin
   * /admin-media -> espace médias
   */

  if (isAdminLoginPage) {
    return <AdminLogin />
  }

  if (isAdminMediaPage) {
    return <AdminMedia />
  }

  /*
   * =====================================================
   * FONCTIONS
   * =====================================================
   */

  const getMediaList = (category: string) => {
    const activeMedia = media.filter(
      (item) => item.active === true,
    )

    const categoryAliases: Record<
      string,
      string[]
    > = {
      "realisation-ecole": ["universite"],
      "realisation-hotel": ["maison_hotes"],
      "realisation-restauration": [
        "restaurant",
        "terrasse",
      ],

      // Solutions JM GESTION
      "solution-ecole": ["universite"],
      "solution-hotel": ["maison_hotes"],
      "solution-restauration": ["restaurant"],
      "solution-sur-mesure": ["photo", "banner"],

      // Activités métier
      ecole: ["universite"],
      universite: ["universite"],
      hotel: ["maison_hotes"],
      maison_hotes: ["maison_hotes"],
      restaurant: ["restaurant"],
      terrasse: ["terrasse"],
      salle_fete: ["salle_fete"],
      boutique: ["boutique"],
      pharmacie: ["pharmacie"],
      cosmetique: ["cosmetique"],
      quincaillerie: ["quincaillerie"],
      salon: ["salon"],

      // Blog et sections générales
      "blog-digitalisation": ["photo", "banner"],
      "blog-gestion": ["photo", "banner"],
      "blog-technologie": ["photo", "banner"],
      "hero-city": ["hero-city", "banner", "photo"],
      logo: ["logo"],
      "team-direction": ["team-direction", "photo", "banner"],
      "team-developpement": ["team-developpement", "photo", "banner"],
      "team-conseil": ["team-conseil", "photo", "banner"],
      about: ["photo", "banner"],
      why: ["photo", "banner"],
      formation: [
        "photo",
        "universite",
        "banner",
      ],
      gestion: ["photo", "banner"],
    }

    const categoriesToSearch = [
      category,
      ...(categoryAliases[category] || []),
    ]

    const seen = new Set<string>()
    const result: SiteMedia[] = []

    for (const currentCategory of categoriesToSearch) {
      for (const item of activeMedia) {
        if (
          item.category === currentCategory &&
          !seen.has(item.id)
        ) {
          seen.add(item.id)
          result.push(item)
        }
      }
    }

    return result
  }

  const getMedia = (category: string) => {
    return getMediaList(category)[0]
  }

  const getBlogMedia = (category: string, index: number) => {
    return getMediaList(category)[index]
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  const navigateToPage = (page: string) => {
    const safePage = page || "accueil"
    setActivePage(safePage)
    setMobileMenuOpen(false)
    window.history.replaceState(null, "", `#${safePage}`)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "")
      const allowedPages = new Set([
        "accueil",
        "apropos",
        "services",
        "solutions",
        "realisations",
        "formations",
        "blog",
        "faq",
        "contact",
      ])
      const nextPage = allowedPages.has(hash) ? hash : "accueil"
      setActivePage(nextPage)
      window.scrollTo({ top: 0, behavior: "auto" })
    }

    window.addEventListener("hashchange", handleHashChange)
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [])

  // Diaporama automatique des photos d'accueil
  useEffect(() => {
    const heroImages = getMediaList("hero-city")

    if (heroImages.length <= 1) {
      setHeroSlide(0)
      return
    }

    const interval = window.setInterval(() => {
      setHeroSlide((current) => (current + 1) % heroImages.length)
    }, 5000)

    return () => window.clearInterval(interval)
  }, [media])

  const sendAssistantMessage = () => {
    const message = assistantInput.trim()

    if (!message) {
      return
    }

    const answer =
      getAssistantAnswer(message)

    setAssistantMessages((current) => [
      ...current,
      {
        from: "user",
        text: message,
      },
      {
        from: "assistant",
        text: answer,
      },
    ])

    setAssistantInput("")
  }

  const openWhatsApp = (
    customMessage?: string,
  ) => {
    const message =
      customMessage || whatsappMessage

    const url =
      `https://wa.me/${whatsappNumber}` +
      `?text=${encodeURIComponent(message)}`

    window.open(url, "_blank")
  }

  const openFormationWhatsApp = (
    message: string,
  ) => {
    openWhatsApp(message)
  }

  const closeArticle = () => {
    setSelectedArticle(null)
  }

  const submitContact = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    const message =
      `Bonjour JM DIGITAL,\n\n` +
      `Nom : ${contactName || "Non renseigné"}\n` +
      `Téléphone : ${contactPhone || "Non renseigné"}\n\n` +
      `Demande :\n${
        contactMessage ||
        "Je souhaite obtenir des informations sur vos solutions."
      }`

    openWhatsApp(message)
  }

  /*
   * Évite l'avertissement TypeScript concernant
   * mediaLoaded qui sert uniquement à suivre le chargement.
   */
  void mediaLoaded

  return (
    <div className="jm-site" data-active-page={activePage}>

      <style>{`
        :root {
          --jm-red: #e11d2e;
          --jm-red-dark: #b80f1f;
          --jm-black: #090909;
          --jm-white: #ffffff;
          --jm-ink: #171717;
          --jm-muted: #686868;
        }

        html {
          scroll-behavior: smooth;
          scroll-padding-top: 88px;
        }

        body {
          margin: 0;
          background: #ffffff;
          color: var(--jm-ink);
        }

        .jm-site {
          --jm-red: #e11d2e;
          --jm-black: #090909;
          --jm-white: #ffffff;
          --jm-ink: #171717;
          --jm-muted: #686868;
          min-height: 100vh;
          background: #fff;
        }

        /* Menu toujours visible pendant le défilement */
        .jm-nav {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          z-index: 9999 !important;
          background: rgba(9, 9, 9, 0.96) !important;
          border-bottom: 1px solid rgba(255,255,255,.10) !important;
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          box-shadow: 0 8px 30px rgba(0,0,0,.20);
        }

        .jm-site > .jm-nav + * {
          margin-top: 0;
        }

        .jm-nav-links a,
        .jm-mobile-menu a {
          transition: color .2s ease, opacity .2s ease;
        }

        .jm-nav-links a:hover,
        .jm-mobile-menu a:hover {
          color: var(--jm-red) !important;
        }

        .jm-nav-button,
        .jm-btn-red,
        .jm-button-primary {
          background: var(--jm-red) !important;
          border-color: var(--jm-red) !important;
          color: #fff !important;
        }

        .jm-kicker,
        .jm-blog-content > span {
          color: var(--jm-red) !important;
        }

        .jm-section-light {
          background: #fff !important;
        }

        .jm-section-dark {
          background: #090909 !important;
          color: #fff !important;
        }

        /* Identité visuelle JM DIGITAL : rouge, noir, blanc */
        .jm-section,
        .jm-section-light,
        #blog,
        #blog.jm-section-light {
          background: #fff !important;
          color: #090909 !important;
        }

        .jm-section-heading h2,
        .jm-section-heading h3,
        .jm-blog-content h3 {
          color: #090909 !important;
        }

        .jm-section-heading p,
        .jm-blog-content p {
          color: #555 !important;
        }

        .jm-blog-card {
          background: #fff !important;
          border: 1px solid #dedede !important;
          box-shadow: 0 18px 45px rgba(0,0,0,.08) !important;
        }

        .jm-blog-content > span,
        .jm-kicker {
          color: var(--jm-red) !important;
        }

        .jm-btn-red,
        .jm-button-primary {
          background: var(--jm-red) !important;
          color: #fff !important;
          border-color: var(--jm-red) !important;
        }

        .jm-btn-red:hover,
        .jm-button-primary:hover {
          background: var(--jm-red-dark) !important;
          border-color: var(--jm-red-dark) !important;
        }

        /* Navigation fixe : elle reste visible même pendant un long défilement */
        body {
          overflow-x: hidden;
        }

        /* Navigation = vraies pages visuelles. Accueil garde la page complète. */
        .jm-site[data-active-page="apropos"] section:not(#apropos),
        .jm-site[data-active-page="services"] section:not(#services),
        .jm-site[data-active-page="solutions"] section:not(#solutions),
        .jm-site[data-active-page="realisations"] section:not(#realisations),
        .jm-site[data-active-page="formations"] section:not(#formations),
        .jm-site[data-active-page="blog"] section:not(#blog),
        .jm-site[data-active-page="faq"] section:not(#faq),
        .jm-site[data-active-page="contact"] section:not(#contact) {
          display: none !important;
        }

        .jm-site[data-active-page="apropos"] .jm-final-cta,
        .jm-site[data-active-page="services"] .jm-final-cta,
        .jm-site[data-active-page="solutions"] .jm-final-cta,
        .jm-site[data-active-page="realisations"] .jm-final-cta,
        .jm-site[data-active-page="formations"] .jm-final-cta,
        .jm-site[data-active-page="blog"] .jm-final-cta,
        .jm-site[data-active-page="faq"] .jm-final-cta,
        .jm-site[data-active-page="contact"] .jm-final-cta {
          display: none !important;
        }

        /* =====================================================
           ACCUEIL / HERO — RESPONSIVE ADAPTATIF
           Grands écrans • laptops • tablettes • téléphones
           Hauteurs d'écran différentes
           ===================================================== */
        .jm-hero-city {
          min-height: 100vh !important;
          min-height: 100svh !important;
          height: max(100vh, 640px);
          height: max(100svh, 640px);
          padding: clamp(88px, 10vh, 132px) 0 clamp(56px, 8vh, 96px) !important;
          position: relative !important;
          overflow: hidden !important;
          display: flex !important;
          align-items: center !important;
          background: #080808 !important;
        }

        .jm-hero-city-background {
          position: absolute !important;
          inset: 0 !important;
          width: 100% !important;
          height: 100% !important;
          z-index: 0 !important;
        }

        .jm-hero-city-background img {
          position: absolute !important;
          inset: 0 !important;
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          object-position: center center !important;
          display: block !important;
          opacity: 0 !important;
          transform: scale(1.01);
          transition: opacity .9s ease, transform 6s ease !important;
        }

        .jm-hero-city-background img.jm-hero-slide-active {
          opacity: 1 !important;
          transform: scale(1) !important;
        }

        .jm-hero-city-overlay {
          position: absolute !important;
          inset: 0 !important;
          z-index: 1 !important;
          background: linear-gradient(90deg, rgba(0,0,0,.82) 0%, rgba(0,0,0,.68) 48%, rgba(0,0,0,.52) 100%) !important;
        }

        .jm-hero-grid {
          position: relative !important;
          z-index: 2 !important;
          width: 100%;
          min-height: 100%;
          display: flex !important;
          align-items: center !important;
          padding-top: clamp(18px, 4vh, 54px);
          padding-bottom: clamp(18px, 4vh, 54px);
        }

        .jm-hero-content {
          width: min(100%, 820px) !important;
          max-width: 820px !important;
          padding: 0 clamp(0px, 1vw, 14px);
        }

        .jm-hero-content h1 {
          font-size: clamp(2.35rem, 5.2vw, 5.8rem) !important;
          line-height: clamp(1.02, 1.06, 1.12) !important;
          letter-spacing: clamp(-0.055em, -0.035vw, -0.02em);
          margin: clamp(12px, 2vh, 22px) 0 clamp(16px, 2.4vh, 28px) !important;
          max-width: 900px;
        }

        .jm-hero-content p {
          font-size: clamp(1rem, 1.35vw, 1.28rem) !important;
          line-height: 1.7 !important;
          max-width: min(700px, 100%);
          margin: 0 0 clamp(20px, 3vh, 34px) !important;
        }

        .jm-hero-content .jm-eyebrow {
          font-size: clamp(.75rem, .9vw, .95rem) !important;
          letter-spacing: clamp(.12em, .25vw, .22em);
        }

        .jm-hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: clamp(10px, 1.2vw, 16px);
        }

        .jm-hero-actions .jm-button {
          min-height: clamp(46px, 5.5vh, 58px);
          padding: 0 clamp(18px, 2vw, 30px) !important;
          font-size: clamp(.9rem, 1vw, 1rem) !important;
        }

        .jm-hero-trust {
          display: flex;
          flex-wrap: wrap;
          gap: clamp(10px, 1.5vw, 22px);
          margin-top: clamp(18px, 3vh, 30px);
          font-size: clamp(.78rem, .9vw, .95rem);
        }

        .jm-hero-city-badge {
          max-width: calc(100% - 32px);
          right: clamp(16px, 3vw, 48px) !important;
          bottom: clamp(16px, 3vh, 34px) !important;
          padding: clamp(10px, 1vw, 16px) clamp(12px, 1.4vw, 20px) !important;
        }

        .jm-hero-city-badge strong {
          font-size: clamp(.78rem, .9vw, .95rem) !important;
        }

        .jm-hero-city-badge small {
          font-size: clamp(.68rem, .75vw, .8rem) !important;
        }

        .jm-hero-content h1,
        .jm-hero-content p,
        .jm-hero-content .jm-eyebrow {
          color: #fff !important;
        }

        .jm-hero-content h1 span {
          color: #ff5261 !important;
        }

        /* Blog : cartes nettes et boutons réellement cliquables */
        .jm-blog-card {
          background: #fff !important;
          border: 1px solid #ececec !important;
          box-shadow: 0 14px 40px rgba(0,0,0,.07) !important;
        }

        .jm-blog-image {
          height: 250px;
          overflow: hidden;
          background: #111;
        }

        .jm-blog-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
          transition: transform .5s ease;
        }

        .jm-blog-card:hover .jm-blog-image img {
          transform: scale(1.04);
        }

        /* =====================================================
           SECTEURS — CONTRASTE ET LISIBILITÉ
           ===================================================== */
        .jm-secteurs-section {
          background: #f5f6f8 !important;
          color: #111827 !important;
        }

        .jm-secteurs-section .jm-section-heading h2 {
          color: #111827 !important;
        }

        .jm-secteurs-section .jm-section-heading p {
          color: #5f6675 !important;
        }

        .jm-secteurs-section .jm-kicker {
          color: #c51f2b !important;
        }

        .jm-secteurs-section .jm-sector {
          background: #ffffff !important;
          color: #111827 !important;
          border: 1px solid #e2e5ea !important;
          border-radius: 16px;
          padding: 24px !important;
          min-height: 100px;
          display: flex;
          align-items: center;
          gap: 18px;
          box-shadow: 0 8px 24px rgba(17, 24, 39, .06);
          transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
        }

        .jm-secteurs-section .jm-sector:hover {
          transform: translateY(-3px);
          border-color: #c51f2b !important;
          box-shadow: 0 12px 30px rgba(17, 24, 39, .10);
        }

        .jm-secteurs-section .jm-sector > span {
          color: #c51f2b !important;
          font-size: 18px;
          font-weight: 800;
          line-height: 1;
          min-width: 32px;
        }

        .jm-secteurs-section .jm-sector > strong {
          color: #111827 !important;
          font-size: 17px;
          font-weight: 700;
          line-height: 1.4;
        }

        /* Responsive général de la feuille d'accueil */
        @media (min-width: 1400px) {
          .jm-hero-city {
            height: max(100svh, 720px);
          }

          .jm-hero-content h1 {
            max-width: 1000px;
          }
        }

        @media (max-height: 760px) and (min-width: 901px) {
          .jm-hero-city {
            min-height: 680px !important;
            height: max(100svh, 680px);
            padding-top: 96px !important;
            padding-bottom: 54px !important;
          }

          .jm-hero-content h1 {
            font-size: clamp(2.35rem, 4.6vw, 4.7rem) !important;
            margin-top: 10px !important;
            margin-bottom: 14px !important;
          }

          .jm-hero-content p {
            line-height: 1.55 !important;
            margin-bottom: 18px !important;
          }

          .jm-hero-trust {
            margin-top: 16px;
          }
        }

        @media (max-width: 1100px) {
          .jm-hero-content {
            max-width: 760px !important;
          }
        }

        @media (max-width: 900px) {
          .jm-nav-links, .jm-nav-button { display: none !important; }
          .jm-mobile-button { display: inline-flex !important; }

          .jm-hero-city {
            min-height: 100svh !important;
            height: auto !important;
            padding: 104px 0 84px !important;
          }

          .jm-hero-grid {
            min-height: calc(100svh - 188px) !important;
            height: auto !important;
            padding-top: 24px;
            padding-bottom: 80px;
          }

          .jm-hero-content {
            width: 100% !important;
            max-width: 720px !important;
            padding: 0 !important;
          }

          .jm-hero-content h1 {
            font-size: clamp(2.25rem, 8vw, 4rem) !important;
          }

          .jm-hero-content p {
            font-size: clamp(.98rem, 2.3vw, 1.15rem) !important;
          }

          .jm-hero-city-badge {
            left: 16px !important;
            right: auto !important;
            bottom: 18px !important;
          }
        }

        @media (max-width: 640px) {
          .jm-hero-city {
            min-height: 100svh !important;
            padding: 94px 0 92px !important;
          }

          .jm-hero-grid {
            min-height: calc(100svh - 186px) !important;
            padding-bottom: 76px;
          }

          .jm-hero-content h1 {
            font-size: clamp(2rem, 10.5vw, 3rem) !important;
            line-height: 1.04 !important;
            letter-spacing: -.045em;
          }

          .jm-hero-content p {
            font-size: 1rem !important;
            line-height: 1.62 !important;
          }

          .jm-hero-actions {
            flex-direction: column;
            align-items: stretch;
          }

          .jm-hero-actions .jm-button {
            width: 100%;
            justify-content: center;
            text-align: center;
          }

          .jm-hero-trust {
            display: grid;
            grid-template-columns: 1fr;
            gap: 8px;
            font-size: .82rem;
          }

          .jm-hero-city-badge {
            max-width: calc(100% - 32px);
            padding: 10px 12px !important;
          }

          .jm-secteurs-section .jm-sector {
            padding: 20px !important;
            min-height: 80px;
          }

          .jm-secteurs-section .jm-sector > strong {
            font-size: 15px;
          }

          .jm-secteurs-section .jm-sector > span {
            font-size: 16px;
            min-width: 28px;
          }
        }

        @media (max-width: 380px) {
          .jm-hero-city {
            padding-top: 88px !important;
          }

          .jm-hero-content h1 {
            font-size: 1.85rem !important;
          }

          .jm-hero-content p {
            font-size: .94rem !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .jm-hero-city-background img,
          .jm-hero-city-background img.jm-hero-slide-active,
          .jm-secteurs-section .jm-sector {
            transition: none !important;
            transform: none !important;
          }
        }
      `}</style>

      {/* =====================================================
          NAVIGATION
          ===================================================== */}

      <header className="jm-nav">
        <div className="jm-container jm-nav-inner">

          <a
            href="#accueil"
            className="jm-logo"
            onClick={closeMobileMenu}
          >
            {getMedia("logo") ? (
              <img
                src={getPublicMediaUrl(getMedia("logo"))}
                alt="JM DIGITAL"
                style={{
                  height: "70px",
                  width: "auto",
                  maxWidth: "240px",
                  objectFit: "contain",
                  display: "block",
                }}
                onError={(event) => {
                  event.currentTarget.style.display = "none"
                }}
              />
            ) : (
              <>
                <span className="jm-logo-mark">
                  JM
                </span>

                <span>
                  <strong>JM DIGITAL</strong>

                  <small>
                    Solutions numériques
                  </small>
                </span>
              </>
            )}
          </a>

          <nav className="jm-nav-links">

            <a href="#accueil" onClick={(event) => { event.preventDefault(); navigateToPage("accueil") }}>
              Accueil
            </a>

            <a href="#apropos" onClick={(event) => { event.preventDefault(); navigateToPage("apropos") }}>
              À propos
            </a>

            <a href="#services" onClick={(event) => { event.preventDefault(); navigateToPage("services") }}>
              Services
            </a>

            <a href="#solutions" onClick={(event) => { event.preventDefault(); navigateToPage("solutions") }}>
              Produits
            </a>

            <a href="#realisations" onClick={(event) => { event.preventDefault(); navigateToPage("realisations") }}>
              Réalisations
            </a>

            <a href="#formations" onClick={(event) => { event.preventDefault(); navigateToPage("formations") }}>
              Formations
            </a>

            <a href="#blog" onClick={(event) => { event.preventDefault(); navigateToPage("blog") }}>
              Blog
            </a>

            <a href="#faq" onClick={(event) => { event.preventDefault(); navigateToPage("faq") }}>
              FAQ
            </a>

            <a href="#contact" onClick={(event) => { event.preventDefault(); navigateToPage("contact") }}>
              Contact
            </a>

          </nav>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="jm-nav-button"
          >
            Nous contacter
          </a>

          <button
            type="button"
            className="jm-mobile-button"
            onClick={() =>
              setMobileMenuOpen(
                !mobileMenuOpen,
              )
            }
            aria-label="Ouvrir le menu"
          >
            ☰
          </button>

        </div>

        {mobileMenuOpen && (
          <div className="jm-mobile-menu">

            <a
              href="#accueil"
              onClick={(event) => { event.preventDefault(); navigateToPage("accueil") }}
            >
              Accueil
            </a>

            <a
              href="#apropos"
              onClick={(event) => { event.preventDefault(); navigateToPage("apropos") }}
            >
              À propos
            </a>

            <a
              href="#services"
              onClick={(event) => { event.preventDefault(); navigateToPage("services") }}
            >
              Services
            </a>

            <a
              href="#solutions"
              onClick={(event) => { event.preventDefault(); navigateToPage("solutions") }}
            >
              Produits
            </a>

            <a
              href="#realisations"
              onClick={(event) => { event.preventDefault(); navigateToPage("realisations") }}
            >
              Réalisations
            </a>

            <a
              href="#formations"
              onClick={(event) => { event.preventDefault(); navigateToPage("formations") }}
            >
              Formations
            </a>

            <a
              href="#blog"
              onClick={(event) => { event.preventDefault(); navigateToPage("blog") }}
            >
              Blog
            </a>

            <a
              href="#faq"
              onClick={(event) => { event.preventDefault(); navigateToPage("faq") }}
            >
              FAQ
            </a>

            <a
              href="#contact"
              onClick={(event) => { event.preventDefault(); navigateToPage("contact") }}
            >
              Contact
            </a>

          </div>
        )}

      </header>

      {/* =====================================================
          HERO
          ===================================================== */}

      <section
        id="accueil"
        className="jm-hero jm-hero-city"
      >

        <div
          className="jm-hero-city-background"
          aria-hidden="true"
        >
          {getMediaList("hero-city").map((item, index) => {
            const imageUrl = getPublicMediaUrl(item)

            if (!imageUrl) return null

            return (
              <img
                key={item.id}
                src={imageUrl}
                alt={
                  item.alt_text ||
                  item.title ||
                  "JM DIGITAL — solution numérique"
                }
                className={index === heroSlide ? "jm-hero-slide-active" : "jm-hero-slide"}
                onError={(event) => {
                  event.currentTarget.style.display = "none"
                }}
              />
            )
          })}
        </div>

        <div
          className="jm-hero-city-overlay"
          aria-hidden="true"
        />

        <div className="jm-container jm-hero-grid">

          <div className="jm-hero-content">

            <span className="jm-eyebrow">
              JM DIGITAL
            </span>

            <h1>
              Transformons vos idées
              <br />
              <span>
                en solutions numériques.
              </span>
            </h1>

            <p>
              Nous créons des sites web, des
              applications et des logiciels de
              gestion modernes pour accompagner
              les entreprises et organisations
              dans leur transformation digitale.
            </p>

            <div className="jm-hero-actions">

              <a
                href="#services"
                className="jm-button jm-button-primary"
              >
                Découvrir nos services
              </a>

              <button
                type="button"
                className="jm-button jm-button-secondary jm-hero-secondary"
                onClick={() =>
                  openWhatsApp(
                    "Bonjour JM DIGITAL, je souhaite demander une démonstration de vos solutions.",
                  )
                }
              >
                Demander une démonstration
              </button>

            </div>

            <div className="jm-hero-trust">
              <span>✓ Solutions sur mesure</span>
              <span>✓ Design moderne</span>
              <span>✓ Assistance</span>
            </div>

          </div>

        </div>

        <div className="jm-hero-city-badge">
          <span className="jm-hero-city-dot" />

          <div>
            <strong>
              JM DIGITAL
            </strong>

            <small>
              Solutions numériques modernes
            </small>
          </div>
        </div>

      </section>

      {/* =====================================================
          STATS
          ===================================================== */}

      <section className="jm-stats">

        <div className="jm-container jm-stats-grid">

          <div className="jm-stat">
            <strong>01</strong>
            <span>
              Solution principale
            </span>
          </div>

          <div className="jm-stat">
            <strong>08+</strong>
            <span>
              Services numériques
            </span>
          </div>

          <div className="jm-stat">
            <strong>06+</strong>
            <span>
              Secteurs accompagnés
            </span>
          </div>

          <div className="jm-stat">
            <strong>100%</strong>
            <span>
              Solutions personnalisables
            </span>
          </div>

        </div>

      </section>

      {/* =====================================================
          À PROPOS
          ===================================================== */}

      <section
        id="apropos"
        className="jm-section"
      >

        <div className="jm-container">

          <div className="jm-section-heading">

            <span className="jm-kicker">
              À PROPOS
            </span>

            <h2>
              Une technologie pensée
              pour votre activité.
            </h2>

            <p>
              JM DIGITAL accompagne les
              entreprises et organisations
              dans leur transformation
              numérique.
            </p>

          </div>

          <div className="jm-two-columns">

            <div>

              <MediaImage
                media={getMedia("about")}
                fallbackIcon="💻"
                fallbackTitle="Photo professionnelle à ajouter"
                fallbackText="Cet espace est réservé à une future photo professionnelle de JM GESTION."
              />

            </div>

            <div>

              <p>
                Notre objectif est simple :
                rendre la technologie utile,
                accessible et adaptée aux
                réalités de chaque activité.
              </p>

              <p>
                Nous développons des solutions
                modernes qui permettent de
                centraliser les informations,
                automatiser certaines tâches,
                suivre les activités et prendre
                de meilleures décisions.
              </p>

              <div className="jm-feature-list">

                <div className="jm-feature">

                  <div className="jm-feature-icon">
                    ✓
                  </div>

                  <div>

                    <strong>
                      Solutions personnalisées
                    </strong>

                    <span>
                      Votre activité possède ses
                      propres besoins.
                    </span>

                  </div>

                </div>

                <div className="jm-feature">

                  <div className="jm-feature-icon">
                    ✓
                  </div>

                  <div>

                    <strong>
                      Simples à utiliser
                    </strong>

                    <span>
                      Des interfaces conçues pour
                      être pratiques au quotidien.
                    </span>

                  </div>

                </div>

                <div className="jm-feature">

                  <div className="jm-feature-icon">
                    ✓
                  </div>

                  <div>

                    <strong>
                      Évolutives
                    </strong>

                    <span>
                      Votre solution peut évoluer
                      avec votre entreprise.
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          JM GESTION
          ===================================================== */}

      <section
        id="jm-gestion"
        className="jm-section jm-section-light"
      >

        <div className="jm-container">

          <div className="jm-section-heading">

            <span className="jm-kicker">
              NOTRE SOLUTION
            </span>

            <h2>
              JM GESTION
            </h2>

            <p>
              Une plateforme conçue pour
              simplifier la gestion de votre
              activité.
            </p>

          </div>

          <div className="jm-two-columns">

            <div>

              <h3>
                Gérez votre activité
                au même endroit.
              </h3>

              <p>
                JM GESTION permet de centraliser
                les informations essentielles de
                votre activité et d'améliorer le
                suivi quotidien.
              </p>

              <div className="jm-feature-list">

                <div className="jm-feature">

                  <div className="jm-feature-icon">
                    👥
                  </div>

                  <div>

                    <strong>
                      Clients
                    </strong>

                    <span>
                      Centralisez les informations
                      de vos clients.
                    </span>

                  </div>

                </div>

                <div className="jm-feature">

                  <div className="jm-feature-icon">
                    💰
                  </div>

                  <div>

                    <strong>
                      Ventes & paiements
                    </strong>

                    <span>
                      Suivez les opérations de
                      votre activité.
                    </span>

                  </div>

                </div>

                <div className="jm-feature">

                  <div className="jm-feature-icon">
                    📦
                  </div>

                  <div>

                    <strong>
                      Stocks
                    </strong>

                    <span>
                      Gardez une meilleure visibilité
                      sur vos produits.
                    </span>

                  </div>

                </div>

                <div className="jm-feature">

                  <div className="jm-feature-icon">
                    📊
                  </div>

                  <div>

                    <strong>
                      Rapports
                    </strong>

                    <span>
                      Analysez votre activité plus
                      facilement.
                    </span>

                  </div>

                </div>

              </div>

            </div>

            <MediaImage
              media={getMedia("gestion")}
              fallbackIcon="📊"
              fallbackTitle="Aperçu JM GESTION"
              fallbackText="Ajoutez plus tard une capture d'écran ou une image de votre solution."
            />

          </div>

        </div>

      </section>

      {/* =====================================================
          DÉMONSTRATION
          ===================================================== */}

      <section className="jm-demo">

        <div className="jm-container">

          <div className="jm-demo-box">

            <div className="jm-demo-screen">

              <div className="jm-demo-screen-grid">

                <div className="jm-demo-side">

                  <div className="jm-dashboard-brand">
                    JM
                  </div>

                  <div className="jm-demo-side-item active">
                    Tableau de bord
                  </div>

                  <div className="jm-demo-side-item">
                    Clients
                  </div>

                  <div className="jm-demo-side-item">
                    Ventes
                  </div>

                  <div className="jm-demo-side-item">
                    Stocks
                  </div>

                  <div className="jm-demo-side-item">
                    Dépenses
                  </div>

                  <div className="jm-demo-side-item">
                    Rapports
                  </div>

                </div>

                <div className="jm-demo-content">

                  <div className="jm-demo-content-top">

                    <div>

                      <small>
                        Vue générale
                      </small>

                      <h3>
                        Votre activité
                      </h3>

                    </div>

                    <span>
                      Aujourd'hui
                    </span>

                  </div>

                  <div className="jm-grid-3">

                    <div className="jm-card">

                      <div className="jm-card-icon">
                        👥
                      </div>

                      <strong>
                        248
                      </strong>

                      <span>
                        Clients
                      </span>

                    </div>

                    <div className="jm-card">

                      <div className="jm-card-icon">
                        💰
                      </div>

                      <strong>
                        1 284
                      </strong>

                      <span>
                        Ventes
                      </span>

                    </div>

                    <div className="jm-card">

                      <div className="jm-card-icon">
                        📦
                      </div>

                      <strong>
                        86%
                      </strong>

                      <span>
                        Stock
                      </span>

                    </div>

                  </div>

                  <div className="jm-dashboard-chart">

                    <div className="jm-dashboard-chart-head">

                      <strong>
                        Activité mensuelle
                      </strong>

                    </div>

                    <div className="jm-dashboard-chart-bars">

                      <span
                        style={{
                          height: "30%",
                        }}
                      />

                      <span
                        style={{
                          height: "44%",
                        }}
                      />

                      <span
                        style={{
                          height: "51%",
                        }}
                      />

                      <span
                        style={{
                          height: "64%",
                        }}
                      />

                      <span
                        style={{
                          height: "48%",
                        }}
                      />

                      <span
                        style={{
                          height: "75%",
                        }}
                      />

                      <span
                        style={{
                          height: "87%",
                        }}
                      />

                    </div>

                  </div>

                </div>

              </div>

            </div>

            <div className="jm-demo-info">

              <span className="jm-kicker">
                DÉMONSTRATION
              </span>

              <h2>
                Découvrez comment
                JM GESTION peut
                simplifier votre travail.
              </h2>

              <p>
                Une solution claire pour
                centraliser vos données et
                suivre votre activité.
              </p>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="jm-btn jm-btn-red"
              >
                Demander une démonstration
              </a>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          SERVICES
          ===================================================== */}

      <section
        id="services"
        className="jm-section"
      >

        <div className="jm-container">

          <div className="jm-section-heading">

            <span className="jm-kicker">
              NOS SERVICES
            </span>

            <h2>
              Des services numériques
              pour faire avancer votre activité.
            </h2>

            <p>
              De la création à la mise en ligne,
              nous vous accompagnons dans votre
              projet numérique.
            </p>

          </div>

          <div className="jm-grid-4">

            {services.map(
              (service) => (
                <div
                  className="jm-card"
                  key={service.title}
                >

                  <div className="jm-card-icon">
                    {service.icon}
                  </div>

                  <h3>
                    {service.title}
                  </h3>

                  <p>
                    {service.text}
                  </p>

                </div>
              ),
            )}

          </div>

        </div>

      </section>

      {/* =====================================================
          SECTEURS
          ===================================================== */}

      <section className="jm-section jm-section-dark jm-secteurs-section">

        <div className="jm-container">

          <div className="jm-section-heading">

            <span className="jm-kicker">
              SECTEURS
            </span>

            <h2>
              Une solution pour
              plusieurs activités.
            </h2>

            <p>
              Nous adaptons nos outils aux
              réalités de votre secteur.
            </p>

          </div>

          <div className="jm-grid-3">

            {sectors.map(
              (sector, index) => (
                <div
                  className="jm-sector"
                  key={sector}
                >

                  <span>
                    0{index + 1}
                  </span>

                  <strong>
                    {sector}
                  </strong>

                </div>
              ),
            )}

          </div>

        </div>

      </section>

      {/* =====================================================
          SOLUTIONS
          ===================================================== */}

      <section
        id="solutions"
        className="jm-section"
      >

        <div className="jm-container">

          <div className="jm-section-heading">

            <span className="jm-kicker">
              SOLUTIONS
            </span>

            <h2>
              Découvrez les solutions
              JM GESTION.
            </h2>

            <p>
              Des outils spécialisés pour
              répondre aux besoins de votre
              activité.
            </p>

          </div>

          <div className="jm-grid-4">

            {products.map(
              (product) => (
                <div
                  className="jm-card jm-dark-card"
                  key={product.title}
                >

                  <MediaGallery
                    media={getMediaList(product.mediaCategory)}
                    fallbackIcon={product.icon}
                    fallbackTitle={product.title}
                    fallbackText="Ajoutez une ou plusieurs photos de cette solution dans AdminMedia."
                  />

                  <div className="jm-card-icon">
                    {product.icon}
                  </div>

                  <h3>
                    {product.title}
                  </h3>

                  <p>
                    {product.text}
                  </p>

                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    En savoir plus →
                  </a>

                </div>
              ),
            )}

          </div>

        </div>

      </section>

      {/* =====================================================
          POURQUOI NOUS
          ===================================================== */}

      <section className="jm-section jm-section-light">

        <div className="jm-container">

          <div className="jm-two-columns">

            <div>

              <span className="jm-kicker">
                POURQUOI JM DIGITAL
              </span>

              <h2>
                Nous ne créons pas
                seulement des logiciels.
              </h2>

              <p>
                Nous cherchons à comprendre
                votre activité afin de construire
                une solution réellement utile.
              </p>

              <div className="jm-number-list">

                <div className="jm-number-item">

                  <span className="jm-number">
                    01
                  </span>

                  <div>

                    <strong>
                      Comprendre
                    </strong>

                    <p>
                      Nous analysons vos besoins
                      et votre manière de travailler.
                    </p>

                  </div>

                </div>

                <div className="jm-number-item">

                  <span className="jm-number">
                    02
                  </span>

                  <div>

                    <strong>
                      Concevoir
                    </strong>

                    <p>
                      Nous construisons une solution
                      adaptée à votre activité.
                    </p>

                  </div>

                </div>

                <div className="jm-number-item">

                  <span className="jm-number">
                    03
                  </span>

                  <div>

                    <strong>
                      Améliorer
                    </strong>

                    <p>
                      Nous faisons évoluer la solution
                      selon vos nouveaux besoins.
                    </p>

                  </div>

                </div>

              </div>

            </div>

            <MediaImage
              media={getMedia("why")}
              fallbackIcon="🚀"
              fallbackTitle="Votre future solution"
              fallbackText="Ajoutez une image présentant votre équipe, votre technologie ou votre solution."
              className="jm-media-image"
            />

          </div>

        </div>

      </section>

      {/* =====================================================
          ACTIVITÉS & RÉALISATIONS
          ===================================================== */}

      <section
        id="realisations"
        className="jm-section"
      >

        <div className="jm-container">

          <div className="jm-section-heading">

            <span className="jm-kicker">
              ACTIVITÉS & RÉALISATIONS
            </span>

            <h2>
              Chaque activité peut avoir
              ses propres photos.
            </h2>

            <p>
              Ajoutez une ou plusieurs photos
              dans AdminMedia, choisissez la
              catégorie correspondante et elles
              apparaîtront automatiquement ici.
            </p>

          </div>

          <div className="jm-grid-3">

            {[
              {
                category: "universite",
                icon: "🏫",
                title: "École & université",
                text: "Solutions numériques pour la gestion scolaire.",
              },
              {
                category: "maison_hotes",
                icon: "🏨",
                title: "Hôtel & maison d'hôtes",
                text: "Gestion des chambres, clients et réservations.",
              },
              {
                category: "restaurant",
                icon: "🍽️",
                title: "Restaurant",
                text: "Gestion des produits, ventes, stocks et paiements.",
              },
              {
                category: "terrasse",
                icon: "🌴",
                title: "Terrasse",
                text: "Solutions adaptées aux activités de terrasse.",
              },
              {
                category: "salle_fete",
                icon: "🎉",
                title: "Salle de fête",
                text: "Gestion et digitalisation des événements.",
              },
              {
                category: "boutique",
                icon: "🛍️",
                title: "Boutique",
                text: "Gestion des produits, ventes et activité commerciale.",
              },
              {
                category: "pharmacie",
                icon: "💊",
                title: "Pharmacie",
                text: "Organisation et gestion des activités de pharmacie.",
              },
              {
                category: "cosmetique",
                icon: "💄",
                title: "Cosmétique",
                text: "Solutions pour les activités de beauté et cosmétique.",
              },
              {
                category: "quincaillerie",
                icon: "🔧",
                title: "Quincaillerie",
                text: "Gestion des articles, ventes et stocks.",
              },
              {
                category: "salon",
                icon: "💇",
                title: "Salon",
                text: "Solutions numériques pour les salons et activités de beauté.",
              },
            ].map((activity) => (
              <div
                className="jm-card"
                key={activity.category}
              >

                <MediaGallery
                  media={getMediaList(activity.category)}
                  fallbackIcon={activity.icon}
                  fallbackTitle={activity.title}
                  fallbackText="Ajoutez une ou plusieurs photos de cette activité dans AdminMedia."
                />

                <h3>
                  {activity.title}
                </h3>

                <p>
                  {activity.text}
                </p>

              </div>
            ))}

          </div>

        </div>

      </section>

      {/* =====================================================
          ÉQUIPE
          ===================================================== */}

      <section className="jm-section jm-section-light">

        <div className="jm-container">

          <div className="jm-section-heading">

            <span className="jm-kicker">
              NOTRE ÉQUIPE
            </span>

            <h2>
              Des compétences au service
              de vos projets numériques.
            </h2>

            <p>
              Une équipe orientée vers le
              développement, le conseil et
              l'accompagnement des entreprises.
            </p>

          </div>

          <div className="jm-grid-3">

            <div className="jm-person">

              <MediaImage
                media={getMedia(
                  "team-direction",
                )}
                fallbackIcon="👨‍💼"
                fallbackTitle="Direction"
                fallbackText="Photo professionnelle à ajouter."
                className="jm-person-photo"
              />

              <div className="jm-person-info">

                <span>
                  DIRECTION
                </span>

                <h3>
                  Direction & stratégie
                </h3>

                <p>
                  Vision, stratégie et
                  accompagnement des projets
                  numériques.
                </p>

              </div>

            </div>

            <div className="jm-person">

              <MediaImage
                media={getMedia(
                  "team-developpement",
                )}
                fallbackIcon="💻"
                fallbackTitle="Développement"
                fallbackText="Photo professionnelle à ajouter."
                className="jm-person-photo"
              />

              <div className="jm-person-info">

                <span>
                  DÉVELOPPEMENT
                </span>

                <h3>
                  Développement logiciel
                </h3>

                <p>
                  Conception et développement
                  de sites, applications et
                  logiciels modernes.
                </p>

              </div>

            </div>

            <div className="jm-person">

              <MediaImage
                media={getMedia(
                  "team-conseil",
                )}
                fallbackIcon="📈"
                fallbackTitle="Conseil"
                fallbackText="Photo professionnelle à ajouter."
                className="jm-person-photo"
              />

              <div className="jm-person-info">

                <span>
                  CONSEIL
                </span>

                <h3>
                  Conseil & digitalisation
                </h3>

                <p>
                  Analyse des besoins et
                  accompagnement dans la
                  transformation numérique.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          FORMATIONS
          ===================================================== */}

      <section
        id="formations"
        className="jm-section"
      >

        <div className="jm-container">

          <div className="jm-section-heading">

            <span className="jm-kicker">
              FORMATIONS
            </span>

            <h2>
              Développez vos compétences numériques.
            </h2>

            <p>
              Des parcours pratiques pour apprendre,
              progresser et accompagner la transformation
              numérique de votre activité.
            </p>

          </div>

          <div className="jm-grid-3">

            <article className="jm-card">
              <div className="jm-card-icon">🎓</div>
              <h3>Suivre une formation</h3>
              <p>
                Accédez à nos parcours, ateliers et formations
                pratiques pour développer vos compétences numériques.
              </p>
              <a
                href="https://cat-app.org/cat_aca/"
                target="_blank"
                rel="noreferrer"
                className="jm-btn jm-btn-red"
              >
                Suivre une formation →
              </a>
            </article>

            <article className="jm-card">
              <div className="jm-card-icon">📚</div>
              <h3>Proposer vos formations</h3>
              <p>
                Vous êtes formateur, centre ou structure ?
                Présentez votre expertise et lancez vos formations.
              </p>
              <a
                href="https://cat-app.org/cat_aca/"
                target="_blank"
                rel="noreferrer"
                className="jm-btn jm-btn-red"
              >
                Proposer une formation →
              </a>
            </article>

            <article className="jm-card">
              <div className="jm-card-icon">🏢</div>
              <h3>Former votre équipe</h3>
              <p>
                Nous pouvons accompagner les entreprises, écoles
                et organisations pour leurs besoins de montée en compétence.
              </p>
              <button
                type="button"
                className="jm-btn jm-btn-red"
                onClick={() =>
                  openFormationWhatsApp(
                    "Bonjour JM DIGITAL, je souhaite discuter d'un besoin de formation pour mon équipe.",
                  )
                }
              >
                Discuter d’un besoin →
              </button>
            </article>

          </div>

          <div
            style={{
              marginTop: "34px",
              padding: "28px",
              borderRadius: "24px",
              background: "linear-gradient(135deg, #090909 0%, #1a1a1a 62%, #8f101d 100%)",
              color: "#fff",
              boxShadow: "0 22px 60px rgba(15, 23, 42, 0.16)",
            }}
          >
            <span className="jm-kicker">
              PARCOURS JM DIGITAL
            </span>
            <h3 style={{ color: "#fff", marginTop: "8px" }}>
              Une compétence peut ouvrir une nouvelle opportunité.
            </h3>
            <p style={{ color: "rgba(255,255,255,0.78)", maxWidth: "760px" }}>
              Choisissez une formation, contactez-nous pour votre équipe
              ou accédez à la plateforme de formation pour découvrir les parcours disponibles.
            </p>
          </div>

        </div>

      </section>

      {/* =====================================================
          BLOG
          ===================================================== */}

      <section
        id="blog"
        className="jm-section jm-section-light"
      >

        <div className="jm-container">

          <div className="jm-section-heading">

            <span className="jm-kicker">
              BLOG
            </span>

            <h2>
              Conseils et actualités
              numériques.
            </h2>

            <p>
              Découvrez des conseils pratiques de JM DIGITAL sur la
              digitalisation, la gestion et les technologies utiles aux entreprises.
              Cliquez sur « Lire l’article » pour ouvrir le contenu complet.
            </p>

          </div>

          <div className="jm-grid-3">

            <article className="jm-blog-card">

              <div className="jm-blog-image">

                <BlogImage
                  media={getBlogMedia("blog-digitalisation", 0)}
                  fallbackUrl="https://yxjayeymzhsnuiwghdri.supabase.co/storage/v1/object/public/site-media/photo/chatgpt-image-3-sept-2026-01_33_17-1789657884661.png"
                  alt="Digitalisation et transformation numérique"
                />

              </div>

              <div className="jm-blog-content">

                <span>
                  DIGITALISATION
                </span>

                <h3>
                  Pourquoi digitaliser
                  son activité ?
                </h3>

                <p>
                  Découvrez comment les outils
                  numériques peuvent vous aider
                  à mieux organiser votre activité.
                </p>

                <button
                  type="button"
                  className="jm-btn jm-btn-red"
                  onClick={() => setSelectedArticle("digitalisation")}
                >
                  Lire l’article →
                </button>

              </div>

            </article>

            <article className="jm-blog-card">

              <div className="jm-blog-image">

                <BlogImage
                  media={getBlogMedia("blog-gestion", 1)}
                  fallbackUrl="https://yxjayeymzhsnuiwghdri.supabase.co/storage/v1/object/public/site-media/banner/accueil-1-1790190369395.jpg"
                  alt="Gestion numérique d'entreprise"
                />

              </div>

              <div className="jm-blog-content">

                <span>
                  GESTION
                </span>

                <h3>
                  Mieux gérer son entreprise
                  grâce au numérique.
                </h3>

                <p>
                  Centraliser les informations
                  permet de gagner du temps et
                  d'améliorer le suivi.
                </p>

                <button
                  type="button"
                  className="jm-btn jm-btn-red"
                  onClick={() => setSelectedArticle("gestion")}
                >
                  Lire l’article →
                </button>

              </div>

            </article>

            <article className="jm-blog-card">

              <div className="jm-blog-image">

                <BlogImage
                  media={getBlogMedia("blog-technologie", 2)}
                  fallbackUrl="https://yxjayeymzhsnuiwghdri.supabase.co/storage/v1/object/public/site-media/banner/accueil-2-1790025488943.jpg"
                  alt="Technologie pour les entreprises"
                />

              </div>

              <div className="jm-blog-content">

                <span>
                  TECHNOLOGIE
                </span>

                <h3>
                  Les outils numériques
                  pour les entreprises.
                </h3>

                <p>
                  Découvrez les technologies
                  qui peuvent accompagner la
                  croissance de votre activité.
                </p>

                <button
                  type="button"
                  className="jm-btn jm-btn-red"
                  onClick={() => setSelectedArticle("technologie")}
                >
                  Lire l’article →
                </button>

              </div>

            </article>

          </div>

        </div>

      </section>

      {selectedArticle && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Article JM DIGITAL"
          onClick={closeArticle}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(7, 10, 30, 0.72)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            backdropFilter: "blur(8px)",
          }}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            style={{
              width: "min(860px, 100%)",
              maxHeight: "90vh",
              overflowY: "auto",
              background: "#fff",
              borderRadius: "26px",
              padding: "34px",
              boxShadow: "0 30px 100px rgba(0,0,0,0.3)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: "20px", alignItems: "flex-start" }}>
              <div>
                <span className="jm-kicker">
                  {selectedArticle === "digitalisation"
                    ? "DIGITALISATION"
                    : selectedArticle === "gestion"
                      ? "GESTION"
                      : "TECHNOLOGIE"}
                </span>
                <h2 style={{ marginTop: "10px" }}>
                  {selectedArticle === "digitalisation"
                    ? "Pourquoi digitaliser son activité ?"
                    : selectedArticle === "gestion"
                      ? "Mieux gérer son entreprise grâce au numérique."
                      : "Les outils numériques pour les entreprises."}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeArticle}
                aria-label="Fermer l'article"
                style={{
                  border: "0",
                  background: "#f1f3f8",
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  fontSize: "24px",
                  cursor: "pointer",
                  flex: "0 0 auto",
                }}
              >
                ×
              </button>
            </div>

            <div style={{ marginTop: "22px", lineHeight: 1.8, color: "#4b5563" }}>
              {selectedArticle === "digitalisation" && (
                <>
                  <p>
                    La digitalisation permet de transformer progressivement
                    une activité en utilisant des outils numériques adaptés
                    à ses besoins réels. Elle peut simplifier le suivi des
                    clients, des ventes, des documents et des opérations quotidiennes.
                  </p>
                  <p>
                    Chez JM DIGITAL, nous commençons par comprendre votre activité
                    avant de proposer un site, une application ou une solution de gestion.
                  </p>
                </>
              )}

              {selectedArticle === "gestion" && (
                <>
                  <p>
                    Centraliser les informations aide à réduire les tâches répétitives
                    et à garder une meilleure visibilité sur l'activité. Une solution
                    de gestion peut réunir clients, ventes, stocks, paiements et rapports.
                  </p>
                  <p>
                    JM GESTION peut être adapté au fonctionnement d'une école,
                    d'un hôtel, d'un restaurant, d'une boutique ou d'une autre activité.
                  </p>
                </>
              )}

              {selectedArticle === "technologie" && (
                <>
                  <p>
                    Les bons outils numériques ne servent pas seulement à moderniser
                    une entreprise : ils peuvent aussi améliorer l'organisation,
                    la communication et le suivi des opérations.
                  </p>
                  <p>
                    Le choix dépend toujours du besoin : site web, application,
                    logiciel de gestion, hébergement, e-mails professionnels ou accompagnement.
                  </p>
                </>
              )}
            </div>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "26px" }}>
              <button
                type="button"
                className="jm-btn jm-btn-red"
                onClick={() => {
                  closeArticle()
                  navigateToPage("contact")
                }}
              >
                Discuter de mon projet →
              </button>
              <button
                type="button"
                className="jm-btn"
                onClick={closeArticle}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          FAQ
          ===================================================== */}

      <section
        id="faq"
        className="jm-section"
      >

        <div className="jm-container">

          <div className="jm-section-heading">

            <span className="jm-kicker">
              FAQ
            </span>

            <h2>
              Questions fréquentes.
            </h2>

            <p>
              Quelques réponses aux questions
              que vous pouvez vous poser avant
              de démarrer votre projet.
            </p>

          </div>

          <div className="jm-faq">

            {faqs.map(
              (faq, index) => (
                <div
                  className="jm-faq-item"
                  key={faq.question}
                >

                  <button
                    type="button"
                    className="jm-faq-question"
                    onClick={() =>
                      setOpenFaq(
                        openFaq === index
                          ? null
                          : index,
                      )
                    }
                  >

                    <span>
                      {faq.question}
                    </span>

                    <strong>
                      {openFaq === index
                        ? "−"
                        : "+"}
                    </strong>

                  </button>

                  {openFaq === index && (
                    <div className="jm-faq-answer">

                      <p>
                        {faq.answer}
                      </p>

                    </div>
                  )}

                </div>
              ),
            )}

          </div>

        </div>

      </section>

      {/* =====================================================
          CONTACT
          ===================================================== */}

      <section
        id="contact"
        className="jm-section jm-section-light"
        style={{ paddingTop: 0 }}
      >

        <div
          style={{
            background: "linear-gradient(135deg, #080808 0%, #171717 58%, #8f101d 100%)",
            color: "#fff",
            overflow: "hidden",
          }}
        >
          <div className="jm-container" style={{ paddingTop: "72px", paddingBottom: "72px" }}>
            <div className="jm-two-columns" style={{ alignItems: "center" }}>
              <div>
                <span className="jm-kicker" style={{ color: "#ff3347" }}>
                  CONTACT JM DIGITAL
                </span>
                <h2 style={{ color: "#fff", fontSize: "clamp(2.4rem, 5vw, 4.8rem)", lineHeight: 1.02, margin: "12px 0 18px" }}>
                  Un projet, une question ou un besoin ? Parlons-en.
                </h2>
                <p style={{ color: "rgba(255,255,255,0.78)", maxWidth: "680px", lineHeight: 1.7 }}>
                  Expliquez-nous votre besoin par formulaire, WhatsApp ou e-mail.
                  Nous vous orientons vers la solution numérique la plus adaptée à votre activité.
                </p>

                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "28px" }}>
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    className="jm-btn jm-btn-red"
                  >
                    WhatsApp officiel →
                  </a>
                  <a
                    href={`mailto:${email}`}
                    className="jm-btn jm-btn-white"
                  >
                    Envoyer un e-mail
                  </a>
                </div>
              </div>

              <div style={{ display: "grid", gap: "12px" }}>
                <div style={{ padding: "18px 20px", borderRadius: "18px", background: "rgba(255,255,255,0.09)", border: "1px solid rgba(255,255,255,0.14)" }}>
                  <strong style={{ display: "block", marginBottom: "5px" }}>📞 Contact WhatsApp</strong>
                  <a href={whatsappLink} target="_blank" rel="noreferrer" style={{ color: "#fff", textDecoration: "none", fontWeight: 700 }}>
                    +243 817 259 728
                  </a>
                </div>
                <div style={{ padding: "18px 20px", borderRadius: "18px", background: "rgba(255,255,255,0.09)", border: "1px solid rgba(255,255,255,0.14)" }}>
                  <strong style={{ display: "block", marginBottom: "5px" }}>✉️ E-mail</strong>
                  <a href={`mailto:${email}`} style={{ color: "#fff", textDecoration: "none", fontWeight: 700 }}>
                    {email}
                  </a>
                </div>
                <div style={{ padding: "18px 20px", borderRadius: "18px", background: "rgba(255,255,255,0.09)", border: "1px solid rgba(255,255,255,0.14)" }}>
                  <strong style={{ display: "block", marginBottom: "5px" }}>📍 Adresse</strong>
                  <span style={{ color: "rgba(255,255,255,0.76)" }}>
                    Mama Yemo, Likasi / Centre-ville
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="jm-container" style={{ paddingTop: "60px", paddingBottom: "20px" }}>
          <div className="jm-contact" style={{ alignItems: "start" }}>
            <div className="jm-contact-info">
              <span className="jm-kicker">
                ÉCRIVEZ-NOUS
              </span>
              <h2>
                Envoyer un message à JM DIGITAL
              </h2>
              <p>
                Votre demande est préparée pour être envoyée directement sur WhatsApp.
              </p>

              <div className="jm-contact-method">
                <div className="jm-contact-method-icon">💬</div>
                <div>
                  <strong>WhatsApp</strong>
                  <a href={whatsappLink} target="_blank" rel="noreferrer">
                    +243 817 259 728
                  </a>
                </div>
              </div>

              <div className="jm-contact-method">
                <div className="jm-contact-method-icon">✉️</div>
                <div>
                  <strong>E-mail</strong>
                  <a href={`mailto:${email}`}>
                    {email}
                  </a>
                </div>
              </div>
            </div>

            <form
              className="jm-contact-form"
              onSubmit={submitContact}
            >
              <div className="jm-form-group">
                <label htmlFor="contact-name">Nom</label>
                <input
                  id="contact-name"
                  type="text"
                  value={contactName}
                  onChange={(event) => setContactName(event.target.value)}
                  placeholder="Votre nom"
                />
              </div>

              <div className="jm-form-group">
                <label htmlFor="contact-phone">Téléphone / WhatsApp</label>
                <input
                  id="contact-phone"
                  type="tel"
                  value={contactPhone}
                  onChange={(event) => setContactPhone(event.target.value)}
                  placeholder="Votre numéro"
                />
              </div>

              <div className="jm-form-group">
                <label htmlFor="contact-message">Votre message</label>
                <textarea
                  id="contact-message"
                  value={contactMessage}
                  onChange={(event) => setContactMessage(event.target.value)}
                  placeholder="Expliquez-nous votre projet en quelques lignes..."
                  rows={7}
                />
              </div>

              <button
                type="submit"
                className="jm-btn jm-btn-red"
              >
                Envoyer sur WhatsApp →
              </button>
            </form>
          </div>
        </div>

      </section>

      {/* =====================================================
          CTA FINAL
          ===================================================== */}

      <section className="jm-final-cta">

        <div className="jm-container">

          <div className="jm-final-cta-inner">

            <div>

              <span className="jm-kicker">
                VOTRE PROJET COMMENCE ICI
              </span>

              <h2>
                Votre activité mérite
                de meilleurs outils.
              </h2>

              <p>
                Parlons de votre besoin et
                construisons ensemble une
                solution numérique adaptée.
              </p>

            </div>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="jm-btn jm-btn-white"
            >
              Démarrer une discussion
            </a>

          </div>

        </div>

      </section>

      {/* =====================================================
          FOOTER
          ===================================================== */}

      <footer className="jm-footer">

        <div className="jm-container">

          <div className="jm-footer-grid">

            <div>

              <a
                href="#accueil"
                className="jm-logo"
              >
                {getMedia("logo") ? (
                  <img
                    src={getPublicMediaUrl(getMedia("logo"))}
                    alt="JM DIGITAL"
                    style={{
                      height: "70px",
                      width: "auto",
                      maxWidth: "240px",
                      objectFit: "contain",
                      display: "block",
                    }}
                  />
                ) : (
                  <>
                    <span className="jm-logo-mark">
                      JM
                    </span>

                    <span>
                      <strong>JM DIGITAL</strong>
                      <small>
                        Solutions numériques
                      </small>
                    </span>
                  </>
                )}
              </a>

              <p>
                Nous concevons des solutions
                numériques modernes pour les
                entreprises et organisations.
              </p>

            </div>

            <div>

              <h3>
                Navigation
              </h3>

              <a href="#apropos">
                À propos
              </a>

              <a href="#services">
                Services
              </a>

              <a href="#solutions">
                Solutions
              </a>

              <a href="#realisations">
                Réalisations
              </a>

            </div>

            <div>

              <h3>
                Solutions
              </h3>

              <a href="#solutions">
                JM GESTION ÉCOLE
              </a>

              <a href="#solutions">
                JM GESTION HÔTEL
              </a>

              <a href="#solutions">
                JM GESTION RESTAURATION
              </a>

              <a href="#solutions">
                JM GESTION SUR MESURE
              </a>

            </div>

            <div>

              <h3>
                Contact
              </h3>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
              >
                +243 817 259 728
              </a>

              <a
                href={`mailto:${email}`}
              >
                {email}
              </a>

            </div>

          </div>

          <div className="jm-footer-bottom">

            <span>
              © 2026 JM DIGITAL —
              Tous droits réservés.
            </span>

            <span>
              JM GESTION • Solutions numériques
            </span>

          </div>

          {/* =================================================
              ACCÈS ADMINISTRATEUR DÉVELOPPEUR
              ================================================= */}

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "18px",
              paddingTop: "10px",
            }}
          >
            <a
              href="/admin"
              title="Espace administrateur"
              aria-label="Accéder à l'espace administrateur"
              style={{
                color:
                  "rgba(255,255,255,0.28)",
                fontSize: "11px",
                textDecoration: "none",
                letterSpacing: "0.4px",
                opacity: 0.7,
                transition:
                  "all 0.2s ease",
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.color =
                  "rgba(255,255,255,0.7)"

                event.currentTarget.style.opacity =
                  "1"
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.color =
                  "rgba(255,255,255,0.28)"

                event.currentTarget.style.opacity =
                  "0.7"
              }}
            >
              Administration
            </a>
          </div>

        </div>

      </footer>

      {/* =====================================================
          ASSISTANT
          ===================================================== */}

      {assistantOpen && (
        <div
          className="jm-assistant"
          style={{
            position: "fixed",
            right: "24px",
            bottom: "150px",
            zIndex: 9998,
          }}
        >

          <div className="jm-assistant-header">

            <div>

              <strong>
                Assistant JM GESTION
              </strong>

              <span>
                Disponible maintenant
              </span>

            </div>

            <button
              type="button"
              onClick={() =>
                setAssistantOpen(false)
              }
              aria-label="Fermer l'assistant"
            >
              ×
            </button>

          </div>

          <div className="jm-assistant-messages">

            {assistantMessages.map(
              (message, index) => (
                <div
                  key={`${message.from}-${index}`}
                  className={`jm-assistant-message ${
                    message.from === "user"
                      ? "user"
                      : "assistant"
                  }`}
                >
                  {message.text}
                </div>
              ),
            )}

          </div>

          <div className="jm-assistant-quick">

            <button
              type="button"
              onClick={() => {
                setAssistantInput(
                  "Combien coûte une application ?",
                )
              }}
            >
              💰 Tarifs
            </button>

            <button
              type="button"
              onClick={() => {
                setAssistantInput(
                  "Présentez-moi JM GESTION.",
                )
              }}
            >
              📊 JM GESTION
            </button>

            <button
              type="button"
              onClick={() => {
                setAssistantInput(
                  "Je voudrais une formation.",
                )
              }}
            >
              🎓 Formation
            </button>

          </div>

          <div className="jm-assistant-input">

            <input
              type="text"
              value={assistantInput}
              onChange={(event) =>
                setAssistantInput(
                  event.target.value,
                )
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault()
                  sendAssistantMessage()
                }
              }}
              placeholder="Écrivez votre question..."
            />

            <button
              type="button"
              onClick={sendAssistantMessage}
              aria-label="Envoyer"
            >
              ➤
            </button>

          </div>

        </div>
      )}

      {/* =====================================================
          BOUTON ASSISTANT FLOTTANT À DROITE
          ===================================================== */}

      {!assistantOpen && (
        <button
          type="button"
          className="jm-assistant-button jm-assistant-button-visible"
          onClick={() =>
            setAssistantOpen(true)
          }
          aria-label="Ouvrir l'assistant JM DIGITAL"
          style={{
            position: "fixed",
            right: "24px",
            bottom: "90px",
            zIndex: 9997,
          }}
        >

          <span className="jm-assistant-icon">
            🤖
          </span>

          <span className="jm-assistant-button-content">

            <strong>
              Assistant JM DIGITAL
            </strong>

            <small>
              <span className="jm-assistant-online-dot" />
              En ligne · Besoin d'aide ?
            </small>

          </span>

          <span className="jm-assistant-arrow">
            →
          </span>

        </button>
      )}

      {/* =====================================================
          WHATSAPP FLOTTANT
          ===================================================== */}

      <a
        href={whatsappLink}
        target="_blank"
        rel="noreferrer"
        className="jm-whatsapp"
        aria-label="Contacter JM DIGITAL sur WhatsApp"
        style={{
          position: "fixed",
          right: "24px",
          bottom: "24px",
          zIndex: 9997,
        }}
      >
        💬
      </a>

    </div>
  )
}

export default App