import {
  useState,
  type FormEvent,
} from "react"

import AdminLogin from "./AdminLogin"
import ForgotPassword from "./ForgotPassword"
import ResetPassword from "./ResetPassword"
import AdminMedia from "./AdminMedia"

const whatsappNumber = "243817259728"

const whatsappMessage =
  "Bonjour JM GESTION, je souhaite avoir des informations sur vos solutions."

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
  category: string
  title: string | null
  alt_text: string | null
  active: boolean
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
  },
  {
    icon: "🏨",
    title: "JM GESTION HÔTEL",
    text: "Gestion des chambres, clients, réservations, ventes, dépenses, paiements et rapports.",
  },
  {
    icon: "🍽️",
    title: "JM GESTION RESTAURATION",
    text: "Gestion des produits, ventes, stocks, clients, dépenses, paiements et rapports.",
  },
  {
    icon: "🏢",
    title: "JM GESTION SUR MESURE",
    text: "Une solution adaptée aux besoins et au fonctionnement de votre entreprise.",
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

  if (
    text.includes("jm gestion") ||
    text.includes("gestion")
  ) {
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

  if (
    text.includes("site") ||
    text.includes("web")
  ) {
    return "Nous créons des sites web professionnels modernes et responsifs, avec accompagnement pour le domaine et la mise en ligne."
  }

  if (
    text.includes("application") ||
    text.includes("app")
  ) {
    return "Nous concevons des applications web et mobiles adaptées aux besoins des entreprises et organisations."
  }

  if (
    text.includes("formation") ||
    text.includes("apprendre")
  ) {
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
    return "Bonjour 👋 Bienvenue chez JM GESTION. Comment puis-je vous aider ?"
  }

  return "Merci pour votre message. Je peux vous renseigner sur JM GESTION, nos applications, nos sites web, nos tarifs, nos formations et nos solutions numériques."
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

  return (
    <div className={`jm-media-image ${className}`}>
      <img
        src={media.storage_path}
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

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false)

  const [assistantOpen, setAssistantOpen] =
    useState(false)

  const [assistantInput, setAssistantInput] =
    useState("")

  const [openFaq, setOpenFaq] =
    useState<number | null>(null)

  const [contactName, setContactName] =
    useState("")

  const [contactPhone, setContactPhone] =
    useState("")

  const [contactMessage, setContactMessage] =
    useState("")

  const [assistantMessages, setAssistantMessages] =
    useState<AssistantMessage[]>([
      {
        from: "assistant",
        text: "Bonjour 👋 Je suis l'assistant JM GESTION. Comment puis-je vous aider ?",
      },
    ])

  const getMedia = (
    _category: string,
  ): SiteMedia | undefined =>
    undefined

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  const sendAssistantMessage = () => {
    const message = assistantInput.trim()

    if (!message) {
      return
    }

    const answer = getAssistantAnswer(message)

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

  const submitContact = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    const message =
      `Bonjour JM GESTION,\n\n` +
      `Nom : ${contactName || "Non renseigné"}\n` +
      `Téléphone : ${contactPhone || "Non renseigné"}\n\n` +
      `Demande :\n${
        contactMessage ||
        "Je souhaite obtenir des informations sur vos solutions."
      }`

    openWhatsApp(message)
  }

  /*
   * =====================================================
   * ROUTAGE ADMINISTRATEUR
   * =====================================================
   */

  const pathname = window.location.pathname

  if (pathname === "/admin") {
    return <AdminLogin />
  }

  if (pathname === "/admin/forgot-password") {
    return <ForgotPassword />
  }

  if (pathname === "/admin/reset-password") {
    return <ResetPassword />
  }

  if (pathname === "/admin-media") {
    return <AdminMedia />
  }

  return (
    <div className="jm-site">
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
            <span className="jm-logo-mark">
              JM
            </span>

            <span>
              <strong>JM DIGITAL</strong>

              <small>
                Solutions numériques
              </small>
            </span>
          </a>

          <nav className="jm-nav-links">

            <a href="#accueil">
              Accueil
            </a>

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

            <a href="#formations">
              Formations
            </a>

            <a href="#blog">
              Blog
            </a>

            <a href="#faq">
              FAQ
            </a>

            <a href="#contact">
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
              onClick={closeMobileMenu}
            >
              Accueil
            </a>

            <a
              href="#apropos"
              onClick={closeMobileMenu}
            >
              À propos
            </a>

            <a
              href="#services"
              onClick={closeMobileMenu}
            >
              Services
            </a>

            <a
              href="#solutions"
              onClick={closeMobileMenu}
            >
              Solutions
            </a>

            <a
              href="#realisations"
              onClick={closeMobileMenu}
            >
              Réalisations
            </a>

            <a
              href="#formations"
              onClick={closeMobileMenu}
            >
              Formations
            </a>

            <a
              href="#blog"
              onClick={closeMobileMenu}
            >
              Blog
            </a>

            <a
              href="#faq"
              onClick={closeMobileMenu}
            >
              FAQ
            </a>

            <a
              href="#contact"
              onClick={closeMobileMenu}
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
        className="jm-hero"
      >

        <div className="jm-container jm-hero-inner">

          <div className="jm-hero-content">

            <div className="jm-eyebrow">
              JM DIGITAL • SOLUTIONS NUMÉRIQUES
            </div>

            <h1>
              Transformez votre activité

              <span>
                grâce au numérique.
              </span>
            </h1>

            <p className="jm-hero-text">
              Nous concevons des sites web,
              applications et logiciels de
              gestion adaptés aux besoins
              réels des entreprises,
              établissements et entrepreneurs.
            </p>

            <div className="jm-hero-actions">

              <a
                href="#solutions"
                className="jm-btn jm-btn-red"
              >
                Découvrir JM GESTION
              </a>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="jm-btn jm-btn-white"
              >
                💬 Nous contacter
              </a>

            </div>

          </div>

          <div className="jm-dashboard">

            <div className="jm-dashboard-body">

              <div className="jm-dashboard-side">

                <div className="jm-dashboard-brand">
                  JM
                </div>

                <div className="jm-dashboard-side-item active">
                  Tableau de bord
                </div>

                <div className="jm-dashboard-side-item">
                  Clients
                </div>

                <div className="jm-dashboard-side-item">
                  Ventes
                </div>

                <div className="jm-dashboard-side-item">
                  Stocks
                </div>

                <div className="jm-dashboard-side-item">
                  Paiements
                </div>

                <div className="jm-dashboard-side-item">
                  Rapports
                </div>

              </div>

              <div className="jm-dashboard-main">

                <div className="jm-dashboard-top">

                  <div>

                    <small>
                      Tableau de bord
                    </small>

                    <h3>
                      Bienvenue sur
                      JM GESTION
                    </h3>

                  </div>

                  <div className="jm-dashboard-user">
                    JM
                  </div>

                </div>

                <div className="jm-dashboard-cards">

                  <div className="jm-mini-card">

                    <span>
                      Clients
                    </span>

                    <strong>
                      248
                    </strong>

                    <small>
                      +12% ce mois
                    </small>

                  </div>

                  <div className="jm-mini-card">

                    <span>
                      Ventes
                    </span>

                    <strong>
                      1 284
                    </strong>

                    <small>
                      +18% ce mois
                    </small>

                  </div>

                  <div className="jm-mini-card">

                    <span>
                      Stock
                    </span>

                    <strong>
                      86%
                    </strong>

                    <small>
                      Niveau disponible
                    </small>

                  </div>

                </div>

                <div className="jm-dashboard-chart">

                  <div className="jm-dashboard-chart-head">

                    <strong>
                      Évolution de l'activité
                    </strong>

                    <span>
                      2026
                    </span>

                  </div>

                  <div className="jm-dashboard-chart-bars">

                    <span
                      style={{
                        height: "35%",
                      }}
                    />

                    <span
                      style={{
                        height: "52%",
                      }}
                    />

                    <span
                      style={{
                        height: "42%",
                      }}
                    />

                    <span
                      style={{
                        height: "68%",
                      }}
                    />

                    <span
                      style={{
                        height: "57%",
                      }}
                    />

                    <span
                      style={{
                        height: "82%",
                      }}
                    />

                    <span
                      style={{
                        height: "72%",
                      }}
                    />

                    <span
                      style={{
                        height: "91%",
                      }}
                    />

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          STATS
          ===================================================== */}

      <section className="jm-stats">

        <div className="jm-container jm-stats-grid">

          <div className="jm-stat">

            <strong>
              01
            </strong>

            <span>
              Solution principale
            </span>

          </div>

          <div className="jm-stat">

            <strong>
              08+
            </strong>

            <span>
              Services numériques
            </span>

          </div>

          <div className="jm-stat">

            <strong>
              06+
            </strong>

            <span>
              Secteurs accompagnés
            </span>

          </div>

          <div className="jm-stat">

            <strong>
              100%
            </strong>

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

      <section className="jm-section jm-section-dark">

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
                    {String(index + 1).padStart(
                      2,
                      "0",
                    )}
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
          RÉALISATIONS
          ===================================================== */}

      <section
        id="realisations"
        className="jm-section"
      >

        <div className="jm-container">

          <div className="jm-section-heading">

            <span className="jm-kicker">
              RÉALISATIONS
            </span>

            <h2>
              Des projets orientés
              vers des besoins réels.
            </h2>

            <p>
              Voici quelques domaines dans
              lesquels nos solutions peuvent
              être utilisées.
            </p>

          </div>

          <div className="jm-grid-3">

            <div className="jm-card">

              <MediaImage
                media={getMedia(
                  "realisation-ecole",
                )}
                fallbackIcon="🏫"
                fallbackTitle="Solution scolaire"
                fallbackText="Ajoutez une capture ou une photo de votre solution pour école."
              />

              <h3>
                Gestion scolaire
              </h3>

              <p>
                Gestion des élèves,
                enseignants, classes,
                frais, paiements,
                présences, notes et bulletins.
              </p>

            </div>

            <div className="jm-card">

              <MediaImage
                media={getMedia(
                  "realisation-hotel",
                )}
                fallbackIcon="🏨"
                fallbackTitle="Solution hôtel"
                fallbackText="Ajoutez une capture ou une photo de votre solution hôtelière."
              />

              <h3>
                Hôtel & maison d'hôtes
              </h3>

              <p>
                Gestion des chambres,
                clients, réservations,
                ventes, dépenses et rapports.
              </p>

            </div>

            <div className="jm-card">

              <MediaImage
                media={getMedia(
                  "realisation-restauration",
                )}
                fallbackIcon="🍽️"
                fallbackTitle="Solution restauration"
                fallbackText="Ajoutez une capture ou une photo de votre solution de restauration."
              />

              <h3>
                Restaurant & terrasse
              </h3>

              <p>
                Gestion des produits,
                ventes, stocks, clients,
                dépenses et paiements.
              </p>

            </div>

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

          <div className="jm-two-columns">

            <div>

              <span className="jm-kicker">
                FORMATIONS
              </span>

              <h2>
                Développez vos compétences
                numériques.
              </h2>

              <p>
                Nous proposons des formations
                pratiques destinées aux
                professionnels, entrepreneurs
                et organisations.
              </p>

              <div className="jm-feature-list">

                <div className="jm-feature">

                  <div className="jm-feature-icon">
                    💻
                  </div>

                  <div>

                    <strong>
                      Outils numériques
                    </strong>

                    <span>
                      Apprenez à utiliser efficacement
                      les outils informatiques.
                    </span>

                  </div>

                </div>

                <div className="jm-feature">

                  <div className="jm-feature-icon">
                    📊
                  </div>

                  <div>

                    <strong>
                      Gestion informatisée
                    </strong>

                    <span>
                      Découvrez comment organiser
                      votre activité avec des solutions
                      numériques.
                    </span>

                  </div>

                </div>

                <div className="jm-feature">

                  <div className="jm-feature-icon">
                    🚀
                  </div>

                  <div>

                    <strong>
                      Digitalisation
                    </strong>

                    <span>
                      Transformez progressivement
                      vos processus traditionnels.
                    </span>

                  </div>

                </div>

              </div>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="jm-btn jm-btn-red"
              >
                Demander une formation
              </a>

            </div>

            <MediaImage
              media={getMedia("formation")}
              fallbackIcon="🎓"
              fallbackTitle="Formation digitale"
              fallbackText="Ajoutez plus tard une photo de formation ou une image professionnelle."
            />

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
              Découvrez prochainement nos
              contenus consacrés au numérique,
              à la gestion et à la technologie.
            </p>

          </div>

          <div className="jm-grid-3">

            <article className="jm-blog-card">

              <div className="jm-blog-image">

                <Placeholder
                  icon="🌐"
                  title="Digitalisation"
                  text="Article à venir"
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

                <a href="#contact">
                  Lire prochainement →
                </a>

              </div>

            </article>

            <article className="jm-blog-card">

              <div className="jm-blog-image">

                <Placeholder
                  icon="📊"
                  title="Gestion"
                  text="Article à venir"
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

                <a href="#contact">
                  Lire prochainement →
                </a>

              </div>

            </article>

            <article className="jm-blog-card">

              <div className="jm-blog-image">

                <Placeholder
                  icon="🚀"
                  title="Technologie"
                  text="Article à venir"
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

                <a href="#contact">
                  Lire prochainement →
                </a>

              </div>

            </article>

          </div>

        </div>

      </section>

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
      >

        <div className="jm-container">

          <div className="jm-contact">

            <div className="jm-contact-info">

              <span className="jm-kicker">
                CONTACT
              </span>

              <h2>
                Parlons de votre projet.
              </h2>

              <p>
                Vous avez une idée, une activité
                à digitaliser ou besoin d'une
                application ? Écrivez-nous.
              </p>

              <div className="jm-contact-method">

                <div className="jm-contact-method-icon">
                  💬
                </div>

                <div>

                  <strong>
                    WhatsApp
                  </strong>

                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    +243 817 259 728
                  </a>

                </div>

              </div>

              <div className="jm-contact-method">

                <div className="jm-contact-method-icon">
                  ✉️
                </div>

                <div>

                  <strong>
                    E-mail
                  </strong>

                  <a
                    href={`mailto:${email}`}
                  >
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

                <label htmlFor="contact-name">
                  Nom
                </label>

                <input
                  id="contact-name"
                  type="text"
                  value={contactName}
                  onChange={(event) =>
                    setContactName(
                      event.target.value,
                    )
                  }
                  placeholder="Votre nom"
                />

              </div>

              <div className="jm-form-group">

                <label htmlFor="contact-phone">
                  Téléphone
                </label>

                <input
                  id="contact-phone"
                  type="tel"
                  value={contactPhone}
                  onChange={(event) =>
                    setContactPhone(
                      event.target.value,
                    )
                  }
                  placeholder="Votre numéro"
                />

              </div>

              <div className="jm-form-group">

                <label htmlFor="contact-message">
                  Votre demande
                </label>

                <textarea
                  id="contact-message"
                  value={contactMessage}
                  onChange={(event) =>
                    setContactMessage(
                      event.target.value,
                    )
                  }
                  placeholder="Expliquez-nous votre projet..."
                  rows={6}
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

                <span className="jm-logo-mark">
                  JM
                </span>

                <span>
                  <strong>
                    JM DIGITAL
                  </strong>

                  <small>
                    Solutions numériques
                  </small>
                </span>

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

        </div>

      </footer>

      {/* =====================================================
          ASSISTANT LOCAL
          ===================================================== */}

      {assistantOpen && (
        <div className="jm-assistant">

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
          BOUTON ASSISTANT
          ===================================================== */}

      <button
        type="button"
        className="jm-assistant-button"
        onClick={() =>
          setAssistantOpen(
            !assistantOpen,
          )
        }
        aria-label="Ouvrir l'assistant"
      >
        {assistantOpen ? "×" : "💬"}
      </button>

      {/* =====================================================
          WHATSAPP FLOTTANT
          ===================================================== */}

      <a
        href={whatsappLink}
        target="_blank"
        rel="noreferrer"
        className="jm-whatsapp"
        aria-label="Contacter JM DIGITAL sur WhatsApp"
      >
        💬
      </a>

    </div>
  )
}

export default App