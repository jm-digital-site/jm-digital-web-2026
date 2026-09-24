import AdminLogin from "./AdminLogin"
import AdminMedia from "./AdminMedia"
import AdminSiteSettings from "./AdminSiteSettings"
import {
  useEffect,
  useState,
  type FormEvent,
} from "react"
import { supabase } from "./lib/supabase"

const DEFAULT_SITE_SETTINGS = {
  company_name: "JM DIGITAL",
  tagline: "Solutions numériques modernes",
  address: "Mama Yemo, Likasi / Centre-ville",
  phone: "+243 817 259 728",
  whatsapp: "243817259728",
  email: "jmgestion15@gmail.com",
  footer_description:
    "Nous concevons des solutions numériques modernes pour les entreprises et organisations.",
}

type SiteSettings = typeof DEFAULT_SITE_SETTINGS

const whatsappMessage =
  "Bonjour JM DIGITAL, je souhaite avoir des informations sur vos solutions numériques."

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
    text: "Création de sites modernes, rapides, responsifs et pensés pour transformer vos visiteurs en contacts.",
    intro: "Une présence web claire, crédible et adaptée à votre activité, avec une expérience mobile soignée.",
    detailTitle: "Créons un site qui présente votre activité avec impact.",
    details: [
      ["01", "Site vitrine & institutionnel", "Présentez votre entreprise, vos services, votre équipe, vos références et vos contacts dans une interface claire."],
      ["02", "Boutique & catalogue", "Présentez vos produits, catégories et offres avec un parcours simple pour demander un prix ou commander."],
      ["03", "Plateforme & espace client", "Ajoutez des comptes, formulaires, inscriptions, réservations ou autres fonctionnalités métier selon votre besoin."],
      ["04", "Administration du contenu", "Gérez les textes, images, services et actualités sans devoir modifier le code à chaque changement."],
      ["05", "Visibilité & performance", "Structure responsive, bonnes pratiques techniques, vitesse et bases SEO pour une présence plus professionnelle."],
      ["06", "Mise en ligne", "Domaine, hébergement, certificat SSL et accompagnement pour publier votre site dans de bonnes conditions."],
    ],
  },
  {
    icon: "📱",
    title: "Applications web & mobiles",
    text: "Conception d'applications accessibles sur ordinateur, tablette et téléphone, selon les besoins de votre activité.",
    intro: "Nous transformons une idée ou un processus manuel en une application pratique et évolutive.",
    detailTitle: "Une application pensée autour de votre façon de travailler.",
    details: [
      ["01", "Analyse du besoin", "Nous identifions les utilisateurs, les tâches et les informations essentielles avant de définir la solution."],
      ["02", "Interface moderne", "Des écrans simples et responsifs pour une utilisation confortable sur téléphone et ordinateur."],
      ["03", "Fonctionnalités métier", "Tableaux de bord, comptes, formulaires, notifications, paiements ou workflows selon votre projet."],
      ["04", "Données & sécurité", "Organisation des données et contrôle des accès adaptés à l'usage prévu de l'application."],
      ["05", "Tests & amélioration", "Nous vérifions les principaux parcours et améliorons progressivement l'expérience."],
      ["06", "Accompagnement", "Mise en ligne, prise en main et évolutions possibles après la première version."],
    ],
  },
  {
    icon: "💼",
    title: "Logiciels de gestion",
    text: "Solutions personnalisées pour écoles, commerces, restaurants, hôtels, pharmacies et autres entreprises.",
    intro: "Centralisez vos opérations et remplacez les tâches dispersées par un outil adapté à votre organisation.",
    detailTitle: "Votre activité mérite un outil qui comprend votre métier.",
    details: [
      ["01", "Gestion centralisée", "Clients, produits, élèves, chambres, ventes ou autres données réunis dans un même espace."],
      ["02", "Suivi des opérations", "Suivez les entrées, sorties, paiements, dépenses, stocks et activités importantes."],
      ["03", "Rapports & tableaux de bord", "Disposez d'informations structurées pour mieux suivre votre activité au quotidien."],
      ["04", "Accès par utilisateur", "Définissez les rôles et les accès selon les responsabilités de votre équipe."],
      ["05", "Solutions sectorielles", "JM GESTION peut être adapté aux écoles, hôtels, restaurants, boutiques et autres activités."],
      ["06", "Évolution sur mesure", "Le logiciel peut évoluer avec votre organisation et vos nouveaux besoins."],
    ],
  },
  {
    icon: "☁️",
    title: "Hébergement & domaines",
    text: "Nous vous accompagnons pour choisir, configurer et maintenir votre présence en ligne.",
    intro: "De l'adresse web à la publication, nous vous aidons à garder une présence numérique accessible et professionnelle.",
    detailTitle: "Mettez votre projet en ligne sans vous perdre dans la technique.",
    details: [
      ["01", "Nom de domaine", "Choix et configuration de l'adresse qui représentera votre entreprise sur Internet."],
      ["02", "Hébergement", "Mise en place d'un espace adapté aux besoins de votre site ou application."],
      ["03", "SSL & sécurité", "Configuration des éléments essentiels pour une connexion sécurisée."],
      ["04", "Déploiement", "Publication du site ou de l'application et vérification du bon fonctionnement."],
      ["05", "Sauvegardes", "Organisation de sauvegardes et bonnes pratiques pour réduire les risques de perte."],
      ["06", "Assistance technique", "Accompagnement lorsque vous avez besoin d'une intervention sur votre environnement en ligne."],
    ],
  },
  {
    icon: "✉️",
    title: "E-mails professionnels",
    text: "Donnez à votre entreprise une identité plus professionnelle avec des adresses liées à votre domaine.",
    intro: "Une adresse professionnelle cohérente renforce votre communication avec vos clients et partenaires.",
    detailTitle: "Communiquez avec une identité numérique cohérente.",
    details: [
      ["01", "Adresses professionnelles", "Créez des adresses liées à votre domaine pour votre équipe et vos services."],
      ["02", "Configuration", "Aide à la mise en place sur les outils et appareils utilisés par votre équipe."],
      ["03", "Organisation", "Définissez les boîtes et usages adaptés à votre entreprise."],
      ["04", "Accompagnement", "Nous vous guidons lors de la configuration et des changements nécessaires."],
    ],
  },
  {
    icon: "🔍",
    title: "Audit d'applications",
    text: "Analysez votre site, application ou système existant pour identifier les améliorations prioritaires.",
    intro: "Nous examinons les points techniques et fonctionnels qui peuvent limiter votre outil actuel.",
    detailTitle: "Comprendre ce qui peut être amélioré avant d'investir davantage.",
    details: [
      ["01", "Diagnostic", "Analyse de la structure, des fonctionnalités et des principaux parcours utilisateurs."],
      ["02", "Performance", "Recherche des points qui peuvent ralentir ou compliquer l'utilisation."],
      ["03", "Expérience utilisateur", "Identification des écrans ou parcours qui méritent d'être simplifiés."],
      ["04", "Plan d'amélioration", "Priorisation des corrections et évolutions selon leur impact."],
    ],
  },
  {
    icon: "🎓",
    title: "Formation digitale",
    text: "Formez votre équipe aux outils numériques, logiciels et solutions de gestion utilisés dans votre activité.",
    intro: "Des formations pratiques orientées vers l'utilisation réelle de vos outils.",
    detailTitle: "Faites monter votre équipe en compétence avec des formations pratiques.",
    details: [
      ["01", "Formation personnalisée", "Le contenu est adapté au niveau des participants et aux objectifs de votre organisation."],
      ["02", "Outils numériques", "Apprenez à utiliser efficacement les outils nécessaires à votre activité."],
      ["03", "Logiciels de gestion", "Accompagnement à la prise en main de vos solutions de gestion."],
      ["04", "Support pédagogique", "Exercices et accompagnement pour faciliter l'application des acquis."],
    ],
  },
  {
    icon: "🚀",
    title: "Conseil & digitalisation",
    text: "Transformez progressivement vos méthodes de travail en processus numériques plus simples et mieux organisés.",
    intro: "Nous vous aidons à identifier les outils numériques réellement utiles à votre entreprise.",
    detailTitle: "Passez du fonctionnement manuel à une organisation plus numérique.",
    details: [
      ["01", "Analyse de l'activité", "Comprendre comment votre entreprise travaille aujourd'hui et où se trouvent les blocages."],
      ["02", "Priorités numériques", "Identifier les tâches qui peuvent être simplifiées, automatisées ou centralisées."],
      ["03", "Choix des outils", "Proposer une approche cohérente avec votre budget, vos équipes et vos objectifs."],
      ["04", "Mise en œuvre", "Construire la solution par étapes et accompagner son adoption par votre équipe."],
    ],
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

const realizationProjects = [
  { category: "ÉCOLE & UNIVERSITÉ", mediaCategory: "universite", title: "Solutions digitales pour l'éducation", text: "Gestion scolaire, inscriptions, frais, présences, notes, rapports et communication.", result: "Une organisation plus claire des informations et des opérations scolaires." },
  { category: "HÔTEL & MAISON D'HÔTES", mediaCategory: "maison_hotes", title: "Gestion hôtelière", text: "Réservations, chambres, clients, paiements, ventes, dépenses et rapports.", result: "Une meilleure visibilité sur les réservations et l'activité quotidienne." },
  { category: "RESTAURATION", mediaCategory: "restaurant", title: "Gestion restaurant & terrasse", text: "Produits, ventes, stocks, paiements et suivi des opérations.", result: "Un suivi centralisé pour faciliter la gestion du restaurant." },
  { category: "COMMERCE", mediaCategory: "boutique", title: "Digitalisation d'une boutique", text: "Catalogue, ventes, produits, stocks et suivi de l'activité commerciale.", result: "Des opérations regroupées dans une solution simple à utiliser." },
  { category: "PHARMACIE", mediaCategory: "pharmacie", title: "Outil de gestion adapté", text: "Organisation des produits, ventes, stocks et informations utiles à l'activité.", result: "Une base de travail structurée et adaptable aux besoins du client." },
  { category: "SUR MESURE", mediaCategory: "photo", title: "Projet numérique personnalisé", text: "Nous construisons une solution selon les processus, objectifs et contraintes de votre entreprise.", result: "Une solution évolutive conçue autour du besoin réel." },
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

  const isAdminSettingsPage =
    pathname === "/admin-settings"

  /*
   * =====================================================
   * ÉTAT DU SITE
   * =====================================================
   */

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

  const [media, setMedia] =
    useState<SiteMedia[]>([])

  const [mediaLoaded, setMediaLoaded] =
    useState(false)

  const [siteSettings, setSiteSettings] =
    useState<SiteSettings>(DEFAULT_SITE_SETTINGS)

  const [selectedProject, setSelectedProject] =
    useState<number | null>(null)

  const [assistantMessages, setAssistantMessages] =
    useState<AssistantMessage[]>([
      {
        from: "assistant",
        text: "Bonjour 👋 Je suis l'assistant JM DIGITAL. Comment puis-je vous aider ?",
      },
    ])

  const [selectedService, setSelectedService] =
    useState<number | null>(null)

  const [serviceDetailOpen, setServiceDetailOpen] =
    useState(false)

  const [serviceOrderOpen, setServiceOrderOpen] =
    useState(false)

  const [orderForm, setOrderForm] =
    useState({
      company: "",
      name: "",
      email: "",
      phone: "",
      type: "",
      objective: "",
      domain: "À définir",
      pages: "Je ne sais pas",
      budget: "Non défini",
      priority: "Standard — planning normal",
      deadline: "Flexible",
      features: [] as string[],
      details: "",
      maintenance: false,
    })

  const selectedServiceData =
    selectedService !== null
      ? services[selectedService]
      : null

  const selectedProjectData =
    selectedProject !== null
      ? realizationProjects[selectedProject]
      : null

  const dynamicWhatsappNumber =
    siteSettings.whatsapp.replace(/\D/g, "") ||
    DEFAULT_SITE_SETTINGS.whatsapp

  const whatsappNumber = dynamicWhatsappNumber

  const whatsappLink =
    `https://wa.me/${dynamicWhatsappNumber}` +
    `?text=${encodeURIComponent(whatsappMessage)}`

  const email = siteSettings.email
  const phone = siteSettings.phone

  const openProject = (index: number) => {
    setSelectedProject(index)
  }

  const closeProject = () => {
    setSelectedProject(null)
  }

  const openServiceDetail = (index: number) => {
    setSelectedService(index)
    setServiceDetailOpen(true)
    setServiceOrderOpen(false)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const openServiceOrder = (index: number) => {
    const service = services[index]
    setSelectedService(index)
    setOrderForm((current) => ({
      ...current,
      type: service.title,
    }))
    setServiceDetailOpen(false)
    setServiceOrderOpen(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const closeServicePanels = () => {
    setServiceDetailOpen(false)
    setServiceOrderOpen(false)
  }

  const toggleOrderFeature = (feature: string) => {
    setOrderForm((current) => ({
      ...current,
      features: current.features.includes(feature)
        ? current.features.filter((item) => item !== feature)
        : [...current.features, feature],
    }))
  }

  const submitServiceOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const serviceName = selectedServiceData?.title || orderForm.type || "Projet numérique"
    const featureText = orderForm.features.length
      ? orderForm.features.join(", ")
      : "Aucune fonctionnalité sélectionnée"

    const message = [
      "Bonjour JM DIGITAL 👋",
      "",
      `Je souhaite démarrer un projet : ${serviceName}.`,
      "",
      "INFORMATIONS ENTREPRISE",
      `Entreprise : ${orderForm.company || "Non précisée"}`,
      `Nom : ${orderForm.name || "Non précisé"}`,
      `E-mail : ${orderForm.email || "Non précisé"}`,
      `WhatsApp / téléphone : ${orderForm.phone || "Non précisé"}`,
      "",
      "PROJET",
      `Type : ${orderForm.type || serviceName}`,
      `Objectif : ${orderForm.objective || "À définir"}`,
      `Domaine : ${orderForm.domain}`,
      `Nombre de pages : ${orderForm.pages}`,
      `Budget indicatif : ${orderForm.budget}`,
      `Priorité : ${orderForm.priority}`,
      `Délai souhaité : ${orderForm.deadline}`,
      `Fonctionnalités : ${featureText}`,
      `Précisions : ${orderForm.details || "Aucune précision supplémentaire"}`,
      `Maintenance après livraison : ${orderForm.maintenance ? "Oui" : "Non"}`,
      "",
      "Merci, j'aimerais échanger avec JM DIGITAL pour définir le projet.",
    ].join("\n")

    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    )
  }

  /*
   * =====================================================
   * CHARGEMENT DES MÉDIAS
   * =====================================================
   */

  useEffect(() => {
    if (isAdminLoginPage || isAdminMediaPage || isAdminSettingsPage) {
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
  }, [isAdminLoginPage, isAdminMediaPage, isAdminSettingsPage])

  useEffect(() => {
    if (isAdminLoginPage || isAdminMediaPage || isAdminSettingsPage) return
    const client = supabase
    if (!client) return
    let cancelled = false

    const loadSiteSettings = async () => {
      try {
        const { data, error } = await client
          .from("site_settings")
          .select("key, value")
          .eq("active", true)

        if (cancelled) return
        if (error) {
          console.warn("Paramètres du site non disponibles : valeurs par défaut utilisées.")
          return
        }

        const next = { ...DEFAULT_SITE_SETTINGS }
        for (const row of data ?? []) {
          if (row.key in next && typeof row.value === "string") {
            next[row.key as keyof SiteSettings] = row.value as never
          }
        }
        setSiteSettings(next)
      } catch (error) {
        console.warn("Impossible de charger les paramètres du site.", error)
      }
    }

    void loadSiteSettings()
    return () => { cancelled = true }
  }, [isAdminLoginPage, isAdminMediaPage, isAdminSettingsPage])


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

  if (isAdminSettingsPage) {
    return <AdminSiteSettings />
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

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

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
    <div className="jm-site">

      <style>{`
        :root { --jm-navy:#080d4b; --jm-navy-2:#151b73; --jm-red:#e11d2e; --jm-ink:#121a33; --jm-muted:#687083; }
        html { scroll-behavior:smooth; scroll-padding-top:88px; }
        .jm-nav { position:sticky !important; top:0; z-index:1000; background:rgba(8,13,75,.97) !important; backdrop-filter:blur(14px); box-shadow:0 8px 28px rgba(8,13,75,.16); }
        .jm-section { scroll-margin-top:88px; }
        .jm-page-hero { background:linear-gradient(110deg,#080d4b 0%,#151b73 58%,#35105f 100%); color:#fff; padding:76px 0 72px; position:relative; overflow:hidden; }
        .jm-page-hero:after { content:""; position:absolute; width:360px; height:360px; right:-120px; bottom:-220px; border:1px solid rgba(255,255,255,.12); border-radius:50%; }
        .jm-page-hero-inner { position:relative; z-index:2; max-width:900px; }
        .jm-page-hero h1 { font-size:clamp(42px,5vw,72px); line-height:1; margin:10px 0 18px; letter-spacing:-.04em; }
        .jm-page-hero h1 span { color:#ff5968; }
        .jm-page-hero p { max-width:760px; color:rgba(255,255,255,.78); font-size:17px; line-height:1.7; }
        .jm-page-actions { display:flex; flex-wrap:wrap; gap:12px; margin-top:26px; }
        .jm-outline-white { border:1px solid rgba(255,255,255,.38); background:transparent; color:#fff; }
        .jm-outline-white:hover { background:#fff; color:var(--jm-navy); }
        .jm-mini-label { color:var(--jm-red); font-size:11px; font-weight:900; letter-spacing:.16em; text-transform:uppercase; }
        .jm-realizations-intro { display:grid; grid-template-columns:1.4fr .8fr; gap:40px; align-items:end; margin-bottom:34px; }
        .jm-realizations-intro h2 { font-size:clamp(30px,4vw,48px); margin:8px 0; letter-spacing:-.03em; }
        .jm-realizations-intro p { color:var(--jm-muted); line-height:1.65; }
        .jm-project-card { overflow:hidden; border:1px solid #e6e9f0; border-radius:20px; background:#fff; box-shadow:0 8px 28px rgba(8,13,75,.06); transition:.22s; }
        .jm-project-card:hover { transform:translateY(-5px); box-shadow:0 18px 40px rgba(8,13,75,.12); }
        .jm-project-image { height:190px; background:#eef1f7; }
        .jm-project-image img { width:100%; height:100%; object-fit:cover; display:block; }
        .jm-project-body { padding:22px; }
        .jm-project-body h3 { margin:8px 0 10px; font-size:20px; }
        .jm-project-body p { color:var(--jm-muted); line-height:1.65; font-size:14px; }
        .jm-project-actions { display:flex; gap:9px; flex-wrap:wrap; margin-top:18px; }
        .jm-small-btn { border:0; border-radius:9px; padding:10px 13px; font-weight:800; font-size:12px; cursor:pointer; }
        .jm-small-btn-primary { background:var(--jm-red); color:#fff; }
        .jm-small-btn-secondary { background:#f1f3f8; color:var(--jm-ink); }
        .jm-products-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:20px; }
        .jm-product-card { border:1px solid #e5e8ef; border-radius:20px; overflow:hidden; background:#fff; box-shadow:0 8px 28px rgba(8,13,75,.06); }
        .jm-product-media { height:220px; background:#101650; }
        .jm-product-media img { width:100%; height:100%; object-fit:cover; display:block; }
        .jm-product-body { padding:22px; }
        .jm-product-body h3 { margin:7px 0 10px; }
        .jm-product-body p { color:var(--jm-muted); line-height:1.6; min-height:70px; }
        .jm-product-status { display:inline-flex; margin-top:12px; padding:5px 8px; border-radius:999px; background:#e9f7ef; color:#157347; font-size:10px; font-weight:800; }
        .jm-info-band { background:linear-gradient(110deg,#080d4b,#171d75 65%,#3a0d5d); color:#fff; border-radius:22px; padding:28px 30px; display:flex; justify-content:space-between; align-items:center; gap:18px; }
        .jm-info-band h3 { margin:0 0 6px; font-size:24px; }
        .jm-info-band p { margin:0; color:rgba(255,255,255,.72); }
        .jm-about-cards { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-top:28px; }
        .jm-about-card { background:#fff; border:1px solid #e4e7ee; border-radius:16px; padding:20px; }
        .jm-about-card strong { display:block; margin:9px 0 7px; }
        .jm-about-card span { color:var(--jm-muted); font-size:13px; line-height:1.5; }
        .jm-modal-close { position:absolute; top:16px; right:16px; width:42px; height:42px; border-radius:50%; border:1px solid rgba(255,255,255,.25); background:rgba(255,255,255,.12); color:#fff; font-size:20px; cursor:pointer; }
        @media(max-width:980px){ .jm-nav-links,.jm-nav-button{display:none !important;} .jm-about-cards,.jm-products-grid{grid-template-columns:repeat(2,minmax(0,1fr));} .jm-realizations-intro{grid-template-columns:1fr;} }
        @media(max-width:640px){ .jm-about-cards,.jm-products-grid{grid-template-columns:1fr;} .jm-page-hero{padding:56px 0;} .jm-page-hero h1{font-size:42px;} .jm-info-band{align-items:flex-start;flex-direction:column;} .jm-project-image{height:170px;} }
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

            <a href="#accueil">
              Accueil
            </a>

            <a href="#apropos">
              À propos
            </a>

            <a href="#services">
              Services
            </a>

            <a href="#produits">
              Produits
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
              href="#produits"
              onClick={closeMobileMenu}
            >
              Produits
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
        className="jm-hero jm-hero-city"
      >

        <div
          className="jm-hero-city-background"
          aria-hidden="true"
        >
          {getMedia("hero-city") && (
            <img
              src={getPublicMediaUrl(
                getMedia("hero-city"),
              )}
              alt="Ville moderne et technologique"
              onError={(event) => {
                event.currentTarget.style.display =
                  "none"
              }}
            />
          )}
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

      <section className="jm-page-hero">
        <div className="jm-container jm-page-hero-inner">
          <span className="jm-kicker" style={{ color: "#ff5968" }}>À PROPOS DE JM DIGITAL</span>
          <h1>Une agence numérique<br /><span>construite pour votre croissance.</span></h1>
          <p>JM DIGITAL conçoit des sites web, applications, logiciels de gestion et solutions numériques adaptés aux réalités des entreprises et organisations.</p>
          <div className="jm-page-actions">
            <a href="#contact" className="jm-btn jm-btn-red">Démarrer un projet →</a>
            <a href="#realisations" className="jm-btn jm-outline-white">Voir nos réalisations →</a>
          </div>
        </div>
      </section>

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

          <div className="jm-about-cards">
            <div className="jm-about-card"><div className="jm-card-icon">🎯</div><strong>Présence digitale</strong><span>Sites modernes et crédibles pour présenter votre activité.</span></div>
            <div className="jm-about-card"><div className="jm-card-icon">⚙️</div><strong>Applications & logiciels</strong><span>Des outils conçus autour de vos processus métier.</span></div>
            <div className="jm-about-card"><div className="jm-card-icon">📊</div><strong>Organisation</strong><span>Centralisez les informations et simplifiez le suivi.</span></div>
            <div className="jm-about-card"><div className="jm-card-icon">🎓</div><strong>Formation</strong><span>Accompagnement et montée en compétence numérique.</span></div>
          </div>

          <div className="jm-two-columns" style={{ marginTop: "42px" }}>

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

      <section className="jm-section jm-section-light" style={{ paddingTop: "10px" }}>
        <div className="jm-container">
          <div className="jm-section-heading">
            <span className="jm-kicker">NOTRE ENGAGEMENT</span>
            <h2>Ce que nous voulons construire.</h2>
            <p>Une marque numérique proche de ses clients, avec des solutions concrètes et évolutives.</p>
          </div>
          <div className="jm-grid-3">
            <div className="jm-card"><span className="jm-mini-label">Vision</span><h3>Rendre le numérique utile.</h3><p>Des outils accessibles et adaptés aux réalités de chaque activité.</p></div>
            <div className="jm-card"><span className="jm-mini-label">Mission</span><h3>Transformer les besoins en solutions.</h3><p>De l'idée à la mise en ligne, nous avançons avec le client.</p></div>
            <div className="jm-card"><span className="jm-mini-label">Engagement</span><h3>Construire pour durer.</h3><p>Des solutions pensées pour évoluer avec votre entreprise.</p></div>
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

      <section className="jm-page-hero">
        <div className="jm-container jm-page-hero-inner">
          <span className="jm-kicker" style={{ color: "#ff5968" }}>SERVICES JM DIGITAL</span>
          <h1>Des solutions numériques qui répondent à<br /><span>de vrais besoins.</span></h1>
          <p>Choisissez votre besoin. Nous construisons la solution, puis nous vous accompagnons dans sa mise en ligne, son utilisation et ses évolutions.</p>
          <div className="jm-page-actions">
            <a href="#services" className="jm-btn jm-btn-red">Voir les services →</a>
            <a href="#contact" className="jm-btn jm-outline-white">Demander un devis →</a>
          </div>
        </div>
      </section>

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
              (service, index) => (
                <article
                  className="jm-card"
                  key={service.title}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "330px",
                  }}
                >

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "18px",
                    }}
                  >
                    <div className="jm-card-icon">
                      {service.icon}
                    </div>
                    <span
                      style={{
                        fontSize: "42px",
                        fontWeight: 800,
                        color: "rgba(17,24,39,0.06)",
                        lineHeight: 1,
                      }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3>
                    {service.title}
                  </h3>

                  <p style={{ marginBottom: "24px" }}>
                    {service.text}
                  </p>

                  <div
                    style={{
                      marginTop: "auto",
                      paddingTop: "16px",
                      borderTop: "1px solid rgba(17,24,39,0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "10px",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => openServiceDetail(index)}
                      style={{
                        border: 0,
                        background: "transparent",
                        padding: 0,
                        cursor: "pointer",
                        fontWeight: 700,
                        color: "#111827",
                      }}
                    >
                      Lire plus ↗
                    </button>

                    <button
                      type="button"
                      onClick={() => openServiceOrder(index)}
                      className="jm-btn jm-btn-red"
                      style={{
                        padding: "10px 14px",
                        fontSize: "12px",
                      }}
                    >
                      Commander
                    </button>
                  </div>

                </article>
              ),
            )}

          </div>

        </div>

      </section>

      <section className="jm-section" style={{ paddingTop: "20px" }}>
        <div className="jm-container">
          <div className="jm-info-band">
            <div><h3>Vous obtenez une solution adaptée à votre activité.</h3><p>Expliquez-nous votre besoin et recevez une première orientation directement sur WhatsApp.</p></div>
            <a href="#contact" className="jm-btn jm-btn-white">Parler à JM DIGITAL →</a>
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
          PRODUITS
          ===================================================== */}

      <section className="jm-page-hero">
        <div className="jm-container jm-page-hero-inner">
          <span className="jm-kicker" style={{ color: "#ff5968" }}>ÉCOSYSTÈME JM DIGITAL</span>
          <h1>Des logiciels conçus pour<br /><span>vos activités.</span></h1>
          <p>Découvrez nos solutions JM GESTION et choisissez celle qui correspond à votre activité. Chaque solution peut être présentée, personnalisée et faire l'objet d'une démonstration.</p>
          <div className="jm-page-actions">
            <a href="#produits" className="jm-btn jm-btn-red">Découvrir les produits →</a>
            <a href="#contact" className="jm-btn jm-outline-white">Demander une démonstration →</a>
          </div>
        </div>
      </section>

      <section
        id="produits"
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

          <div className="jm-products-grid">

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

                  <span className="jm-product-status">Disponible sur demande</span>
                  <div className="jm-project-actions">
                    <button type="button" className="jm-small-btn jm-small-btn-primary" onClick={() => openWhatsApp(`Bonjour JM DIGITAL, je souhaite découvrir ${product.title}.`)}>Demander une démo →</button>
                    <a href="#contact" className="jm-small-btn jm-small-btn-secondary">Contacter</a>
                  </div>

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

      <section id="realisations" className="jm-section">
        <div className="jm-container">
          <div className="jm-realizations-intro">
            <div><span className="jm-mini-label">PORTFOLIO JM DIGITAL</span><h2>Des projets qui montrent notre capacité à livrer.</h2></div>
            <p>Chaque réalisation présente le besoin, la solution apportée et le résultat recherché pour le client.</p>
          </div>
          <div className="jm-grid-3">
            {realizationProjects.map((project, index) => {
              const media = getMediaList(project.mediaCategory)[0]
              const imageUrl = getPublicMediaUrl(media)
              return (
                <article className="jm-project-card" key={project.title}>
                  <div className="jm-project-image">
                    {imageUrl ? <img src={imageUrl} alt={project.title} loading="lazy" /> : <Placeholder icon="💻" title={project.category} text="Ajoutez une photo de cette réalisation dans AdminMedia." />}
                  </div>
                  <div className="jm-project-body">
                    <span className="jm-mini-label">{project.category}</span>
                    <h3>{project.title}</h3>
                    <p>{project.text}</p>
                    <div className="jm-project-actions">
                      <button type="button" className="jm-small-btn jm-small-btn-secondary" onClick={() => openProject(index)}>Voir le projet →</button>
                      <button type="button" className="jm-small-btn jm-small-btn-primary" onClick={() => openWhatsApp(`Bonjour JM DIGITAL, je souhaite parler de votre réalisation « ${project.title} » et de mon projet.`)}>Demander un projet</button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
          <div className="jm-info-band" style={{ marginTop: "34px" }}>
            <div><h3>Votre activité a un besoin différent ?</h3><p>Nous pouvons construire une solution sur mesure à partir de votre fonctionnement réel.</p></div>
            <a href="#contact" className="jm-btn jm-btn-white">Parler de mon projet →</a>
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

                <MediaGallery
                  media={getMediaList("blog-digitalisation")}
                  fallbackIcon="🌐"
                  fallbackTitle="Digitalisation"
                  fallbackText="Ajoutez une photo sur la digitalisation dans AdminMedia."
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

                <MediaGallery
                  media={getMediaList("blog-gestion")}
                  fallbackIcon="📊"
                  fallbackTitle="Gestion"
                  fallbackText="Ajoutez une photo sur la gestion dans AdminMedia."
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

                <MediaGallery
                  media={getMediaList("blog-technologie")}
                  fallbackIcon="🚀"
                  fallbackTitle="Technologie"
                  fallbackText="Ajoutez une photo sur la technologie dans AdminMedia."
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
                    {phone}
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

              <div className="jm-contact-method">
                <div className="jm-contact-method-icon">📍</div>
                <div><strong>Adresse</strong><span style={{ display:"block", color:"inherit" }}>{siteSettings.address}</span></div>
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
                {siteSettings.footer_description}
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

              <a href="#produits">
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

              <a href="#produits">
                JM GESTION ÉCOLE
              </a>

              <a href="#produits">
                JM GESTION HÔTEL
              </a>

              <a href="#produits">
                JM GESTION RESTAURATION
              </a>

              <a href="#produits">
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
              <span style={{ display:"block", marginTop:"10px", color:"rgba(255,255,255,.65)", lineHeight:1.5 }}>📍 {siteSettings.address}</span>

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
            <span style={{ color: "rgba(255,255,255,.2)", margin: "0 8px" }}>·</span>
            <a href="/admin-settings" style={{ color: "rgba(255,255,255,.28)", fontSize: "11px", textDecoration: "none" }}>
              Informations du site
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

      {/* =====================================================
          DÉTAIL D'UNE RÉALISATION
          ===================================================== */}

      {selectedProjectData && (
        <div role="dialog" aria-modal="true" aria-label={`Détail de la réalisation ${selectedProjectData.title}`} style={{ position:"fixed", inset:0, zIndex:10000, overflowY:"auto", background:"rgba(5,10,45,.74)", backdropFilter:"blur(8px)", padding:"28px 14px" }}>
          <div style={{ width:"min(980px,100%)", margin:"0 auto", background:"#fff", borderRadius:"26px", overflow:"hidden", boxShadow:"0 30px 90px rgba(0,0,0,.3)" }}>
            <div style={{ background:"linear-gradient(135deg,#080d4b,#171d75 65%,#c51f32)", color:"#fff", padding:"38px", position:"relative" }}>
              <button className="jm-modal-close" type="button" onClick={closeProject}>×</button>
              <span style={{ fontSize:"12px", fontWeight:800, letterSpacing:".12em", opacity:.75 }}>{selectedProjectData.category}</span>
              <h2 style={{ fontSize:"clamp(30px,5vw,54px)", lineHeight:1.05, margin:"12px 0" }}>{selectedProjectData.title}</h2>
              <p style={{ maxWidth:"720px", color:"rgba(255,255,255,.82)", lineHeight:1.7 }}>{selectedProjectData.text}</p>
            </div>
            <div style={{ padding:"32px" }}>
              <div className="jm-two-columns">
                <div><span className="jm-mini-label">RÉSULTAT RECHERCHÉ</span><h3 style={{ margin:"10px 0" }}>Une solution concrète et adaptée.</h3><p style={{ color:"var(--jm-muted)", lineHeight:1.7 }}>{selectedProjectData.result}</p></div>
                <div><strong>Vous avez un projet similaire ?</strong><p style={{ color:"var(--jm-muted)", lineHeight:1.6 }}>Échangez directement avec JM DIGITAL pour définir les fonctionnalités et les prochaines étapes.</p><button type="button" className="jm-btn jm-btn-red" onClick={() => openWhatsApp(`Bonjour JM DIGITAL, je souhaite discuter d'un projet similaire à « ${selectedProjectData.title} ».`)}>Démarrer mon projet →</button></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          DÉTAIL D'UN SERVICE
          ===================================================== */}

      {serviceDetailOpen && selectedServiceData && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Détails du service ${selectedServiceData.title}`}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 10000,
            overflowY: "auto",
            background: "rgba(5,10,45,0.72)",
            backdropFilter: "blur(8px)",
            padding: "30px 16px",
          }}
        >
          <div
            style={{
              width: "min(1120px, 100%)",
              margin: "0 auto",
              background: "#fff",
              borderRadius: "28px",
              overflow: "hidden",
              boxShadow: "0 30px 90px rgba(0,0,0,0.28)",
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg,#080d4b,#151b73 58%,#c51f32)",
                color: "#fff",
                padding: "42px",
                position: "relative",
              }}
            >
              <button
                type="button"
                onClick={closeServicePanels}
                aria-label="Fermer"
                style={{
                  position: "absolute",
                  top: "18px",
                  right: "18px",
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  border: "1px solid rgba(255,255,255,.25)",
                  background: "rgba(255,255,255,.12)",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: "20px",
                }}
              >
                ×
              </button>

              <span style={{ fontSize: "13px", fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", opacity: .78 }}>
                SERVICE JM DIGITAL · {String((selectedService ?? 0) + 1).padStart(2, "0")}
              </span>

              <h2 style={{ fontSize: "clamp(30px,5vw,54px)", lineHeight: 1.05, margin: "14px 0" }}>
                {selectedServiceData.detailTitle}
              </h2>

              <p style={{ maxWidth: "760px", fontSize: "17px", lineHeight: 1.7, margin: 0, color: "rgba(255,255,255,.84)" }}>
                {selectedServiceData.intro}
              </p>
            </div>

            <div style={{ padding: "38px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
                  gap: "16px",
                }}
              >
                {selectedServiceData.details.map(([number, title, text]) => (
                  <div
                    key={number}
                    style={{
                      border: "1px solid #e8eaf0",
                      borderRadius: "18px",
                      padding: "22px",
                      background: "#fff",
                    }}
                  >
                    <span style={{ color: "#e11d2e", fontWeight: 900, fontSize: "13px" }}>
                      {number}
                    </span>
                    <h3 style={{ margin: "10px 0 8px", fontSize: "18px" }}>{title}</h3>
                    <p style={{ margin: 0, color: "#687083", lineHeight: 1.65, fontSize: "14px" }}>{text}</p>
                  </div>
                ))}
              </div>

              <div
                style={{
                  marginTop: "28px",
                  borderRadius: "20px",
                  padding: "24px",
                  background: "#f7f8fc",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "18px",
                }}
              >
                <div>
                  <strong style={{ display: "block", fontSize: "18px", marginBottom: "6px" }}>
                    Votre projet ressemble à ce service ?
                  </strong>
                  <span style={{ color: "#687083", fontSize: "14px" }}>
                    Décrivez-nous votre besoin et recevez une première orientation.
                  </span>
                </div>
                <button
                  type="button"
                  className="jm-btn jm-btn-red"
                  onClick={() => selectedService !== null && openServiceOrder(selectedService)}
                >
                  Démarrer mon projet →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          FORMULAIRE DE COMMANDE SERVICE
          ===================================================== */}

      {serviceOrderOpen && selectedServiceData && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Commander ${selectedServiceData.title}`}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 10000,
            overflowY: "auto",
            background: "rgba(5,10,45,0.72)",
            backdropFilter: "blur(8px)",
            padding: "24px 14px",
          }}
        >
          <div style={{ width: "min(1180px,100%)", margin: "0 auto", background: "#fff", borderRadius: "26px", overflow: "hidden", boxShadow: "0 30px 90px rgba(0,0,0,.3)" }}>
            <div style={{ background: "linear-gradient(135deg,#080d4b,#171d75)", color: "#fff", padding: "34px 38px", position: "relative" }}>
              <button type="button" onClick={closeServicePanels} aria-label="Fermer" style={{ position: "absolute", top: "18px", right: "18px", width: "42px", height: "42px", borderRadius: "50%", border: "1px solid rgba(255,255,255,.25)", background: "rgba(255,255,255,.12)", color: "#fff", cursor: "pointer", fontSize: "20px" }}>×</button>
              <span style={{ fontSize: "12px", fontWeight: 800, letterSpacing: ".12em", opacity: .75 }}>DÉMARRER UN PROJET AVEC JM DIGITAL</span>
              <h2 style={{ fontSize: "clamp(28px,4vw,48px)", margin: "10px 0" }}>Construisons une solution qui correspond à votre activité.</h2>
              <p style={{ margin: 0, maxWidth: "800px", color: "rgba(255,255,255,.82)", lineHeight: 1.6 }}>Présentez-nous votre besoin en quelques étapes. Nous vous répondrons avec une proposition adaptée à votre projet.</p>
            </div>

            <form onSubmit={submitServiceOrder} style={{ padding: "32px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.6fr)", gap: "28px" }}>
                <aside style={{ background: "#f7f8fc", borderRadius: "20px", padding: "24px", height: "fit-content", position: "sticky", top: "12px" }}>
                  <span style={{ color: "#e11d2e", fontSize: "12px", fontWeight: 900, letterSpacing: ".1em" }}>01 · VOTRE BESOIN</span>
                  <h3 style={{ fontSize: "24px", margin: "10px 0" }}>{selectedServiceData.title}</h3>
                  <p style={{ color: "#687083", lineHeight: 1.65, fontSize: "14px" }}>{selectedServiceData.text}</p>
                  <div style={{ marginTop: "20px", paddingTop: "18px", borderTop: "1px solid #e3e5eb", fontSize: "13px", color: "#687083", lineHeight: 1.7 }}>
                    ✓ Analyse du besoin<br />
                    ✓ Estimation fonctionnelle<br />
                    ✓ Échange par WhatsApp ou e-mail<br />
                    ✓ Suivi du projet
                  </div>
                </aside>

                <div>
                  <section style={{ marginBottom: "28px" }}>
                    <h3 style={{ marginBottom: "16px" }}>02 · Votre entreprise</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "14px" }}>
                      {[
                        ["company", "Nom de l'entreprise", "Ex. JM DIGITAL"],
                        ["name", "Votre nom", "Votre nom complet"],
                        ["email", "E-mail professionnel", "vous@entreprise.com"],
                        ["phone", "WhatsApp / téléphone", "+243 ..."],
                      ].map(([key,label,placeholder]) => (
                        <label key={key} style={{ display: "grid", gap: "7px", fontSize: "13px", fontWeight: 700 }}>
                          {label}
                          <input required={key === "name" || key === "phone"} value={orderForm[key as keyof typeof orderForm] as string} onChange={(event) => setOrderForm((current) => ({ ...current, [key]: event.target.value }))} placeholder={placeholder} style={{ width: "100%", boxSizing: "border-box", border: "1px solid #dfe3eb", borderRadius: "11px", padding: "12px 13px", outline: "none" }} />
                        </label>
                      ))}
                    </div>
                  </section>

                  <section style={{ marginBottom: "28px" }}>
                    <h3 style={{ marginBottom: "16px" }}>03 · Votre projet</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "14px" }}>
                      {[
                        ["type", "Type de projet", [selectedServiceData.title, "Site vitrine", "Application web", "Application mobile", "Logiciel de gestion", "Autre"]],
                        ["objective", "Objectif principal", ["Présenter mon entreprise", "Obtenir plus de demandes", "Vendre en ligne", "Automatiser une activité", "Gérer mon entreprise", "Autre"]],
                        ["domain", "Nom de domaine", ["À définir", "J'ai déjà un domaine", "Je veux être accompagné"]],
                        ["pages", "Volume / taille du projet", ["Je ne sais pas", "Petit projet", "Projet moyen", "Projet complet", "Sur mesure"]],
                        ["budget", "Budget indicatif", ["Non défini", "Moins de 200 USD", "200 à 500 USD", "500 à 1 000 USD", "Plus de 1 000 USD"]],
                        ["priority", "Priorité", ["Standard — planning normal", "Priorité urgente — à confirmer"]],
                        ["deadline", "Délai souhaité", ["Flexible", "Moins de 2 semaines", "2 à 4 semaines", "1 à 2 mois", "Plus de 2 mois"]],
                      ].map(([key,label,options]) => (
                        <label key={key as string} style={{ display: "grid", gap: "7px", fontSize: "13px", fontWeight: 700 }}>
                          {label as string}
                          <select value={orderForm[key as keyof typeof orderForm] as string} onChange={(event) => setOrderForm((current) => ({ ...current, [key as string]: event.target.value }))} style={{ width: "100%", boxSizing: "border-box", border: "1px solid #dfe3eb", borderRadius: "11px", padding: "12px 13px", background: "#fff" }}>
                            {(options as string[]).map((option) => <option key={option}>{option}</option>)}
                          </select>
                        </label>
                      ))}
                    </div>
                  </section>

                  <section style={{ marginBottom: "28px" }}>
                    <h3 style={{ marginBottom: "14px" }}>04 · Fonctionnalités souhaitées</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: "9px" }}>
                      {["Administration", "Formulaires", "Paiement en ligne", "Réservation", "Comptes utilisateurs", "Blog / actualités", "Multilingue", "WhatsApp", "E-mails automatiques", "SEO renforcé", "Hébergement", "Maintenance"].map((feature) => (
                        <label key={feature} style={{ display: "flex", gap: "8px", alignItems: "center", padding: "10px", border: "1px solid #e7e9ef", borderRadius: "10px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
                          <input type="checkbox" checked={orderForm.features.includes(feature)} onChange={() => toggleOrderFeature(feature)} />
                          {feature}
                        </label>
                      ))}
                    </div>
                  </section>

                  <section style={{ marginBottom: "22px" }}>
                    <h3 style={{ marginBottom: "14px" }}>05 · Quelques précisions</h3>
                    <textarea value={orderForm.details} onChange={(event) => setOrderForm((current) => ({ ...current, details: event.target.value }))} rows={6} placeholder="Décrivez votre activité, ce que vous voulez obtenir et les fonctions importantes pour vous..." style={{ width: "100%", boxSizing: "border-box", border: "1px solid #dfe3eb", borderRadius: "12px", padding: "13px", resize: "vertical" }} />
                    <label style={{ display: "flex", alignItems: "center", gap: "9px", marginTop: "14px", fontSize: "13px", fontWeight: 600 }}>
                      <input type="checkbox" checked={orderForm.maintenance} onChange={(event) => setOrderForm((current) => ({ ...current, maintenance: event.target.checked }))} />
                      Je souhaite aussi un accompagnement / une maintenance après livraison.
                    </label>
                  </section>

                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "14px", padding: "18px", borderRadius: "16px", background: "#fff3f4", border: "1px solid #ffd5d9" }}>
                    <div style={{ fontSize: "13px", color: "#5f6675", lineHeight: 1.55 }}>
                      <strong style={{ color: "#161b2d" }}>Besoin d'une réponse rapide ?</strong><br />
                      Votre demande sera préparée et envoyée directement à JM DIGITAL sur WhatsApp.
                    </div>
                    <button type="submit" className="jm-btn jm-btn-red" style={{ padding: "13px 20px" }}>
                      Envoyer ma demande →
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

export default App