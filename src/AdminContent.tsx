import { useEffect, useState } from "react"
import { supabase } from "./lib/supabase"

type SiteContent = {
  id?: string
  content_key: string
  content_value: string
  label: string
  section: string
  active: boolean
  updated_at?: string
}

const DEFAULT_CONTENT: SiteContent[] = [
  {
    content_key: "hero.title1",
    content_value: "Transformons vos idées",
    label: "Titre accueil — ligne 1",
    section: "Accueil",
    active: true,
  },
  {
    content_key: "hero.title2",
    content_value: "en solutions numériques.",
    label: "Titre accueil — ligne 2",
    section: "Accueil",
    active: true,
  },
  {
    content_key: "hero.description",
    content_value:
      "Nous créons des sites web, des applications et des logiciels de gestion modernes pour accompagner les entreprises et organisations dans leur transformation digitale.",
    label: "Description accueil",
    section: "Accueil",
    active: true,
  },
  {
    content_key: "hero.primaryButton",
    content_value: "Découvrez nos services",
    label: "Bouton principal accueil",
    section: "Accueil",
    active: true,
  },
  {
    content_key: "hero.secondaryButton",
    content_value: "Demander une démonstration",
    label: "Bouton secondaire accueil",
    section: "Accueil",
    active: true,
  },
]

export default function AdminContent() {
  const [items, setItems] = useState<SiteContent[]>(DEFAULT_CONTENT)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    let cancelled = false

    const loadContent = async () => {
      if (!supabase) {
        if (!cancelled) {
          setLoading(false)
          setError("Supabase n'est pas configuré.")
        }
        return
      }

      try {
        const { data, error: loadError } = await supabase
          .from("site_content")
          .select(
            "id, content_key, content_value, label, section, active, updated_at"
          )
          .order("section", { ascending: true })
          .order("content_key", { ascending: true })

        if (cancelled) return

        if (loadError) {
          console.error("Erreur chargement site_content :", loadError)
          setError(`Erreur de chargement : ${loadError.message}`)
          setLoading(false)
          return
        }

        if (data && data.length > 0) {
          setItems(data as SiteContent[])
        }

        setLoading(false)
      } catch (err) {
        if (cancelled) return

        console.error("Erreur inattendue :", err)
        setError("Une erreur inattendue est survenue.")
        setLoading(false)
      }
    }

    void loadContent()

    return () => {
      cancelled = true
    }
  }, [])

  const update = (key: string, value: string) => {
    setItems((current) =>
      current.map((item) =>
        item.content_key === key
          ? {
              ...item,
              content_value: value,
            }
          : item
      )
    )

    setMessage("")
    setError("")
  }

  const save = async () => {
    if (!supabase) {
      setError("Supabase n'est pas configuré.")
      setMessage("")
      return
    }

    setSaving(true)
    setMessage("")
    setError("")

    try {
      const payload = items.map(({ id, updated_at, ...item }) => ({
        ...item,
        active: item.active ?? true,
      }))

      const { error: saveError } = await supabase
        .from("site_content")
        .upsert(payload, {
          onConflict: "content_key",
        })

      if (saveError) {
        console.error("Erreur enregistrement :", saveError)
        setError(`Erreur : ${saveError.message}`)
        setMessage("")
        return
      }

      setMessage("Informations enregistrées avec succès.")
    } catch (err) {
      console.error("Erreur inattendue :", err)
      setError("Une erreur inattendue est survenue pendant l'enregistrement.")
      setMessage("")
    } finally {
      setSaving(false)
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f6f7f9",
        padding: "32px 18px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          width: "100%",
        }}
      >
        {/* HEADER */}
        <header
          style={{
            background: "#090909",
            color: "#fff",
            borderRadius: 22,
            padding: "26px 28px",
            marginBottom: 22,
            boxShadow: "0 15px 45px rgba(0,0,0,.08)",
          }}
        >
          <strong
            style={{
              color: "#e11d2e",
              letterSpacing: ".08em",
              fontSize: 14,
            }}
          >
            JM DIGITAL
          </strong>

          <h1
            style={{
              margin: "8px 0",
              fontSize: "clamp(26px, 4vw, 38px)",
              lineHeight: 1.15,
            }}
          >
            Informations du site
          </h1>

          <p
            style={{
              margin: 0,
              color: "rgba(255,255,255,.72)",
              lineHeight: 1.6,
            }}
          >
            Modifiez les textes de votre site directement depuis cet espace
            d'administration.
          </p>
        </header>

        {/* CONTENU */}
        <section
          style={{
            background: "#fff",
            borderRadius: 22,
            padding: "clamp(18px, 4vw, 30px)",
            boxShadow: "0 15px 45px rgba(0,0,0,.08)",
          }}
        >
          {loading ? (
            <div
              style={{
                padding: "35px 10px",
                textAlign: "center",
                color: "#666",
                fontWeight: 600,
              }}
            >
              Chargement des informations...
            </div>
          ) : (
            <>
              {items.map((item) => (
                <div
                  key={item.content_key}
                  style={{
                    marginBottom: 24,
                  }}
                >
                  <label
                    htmlFor={`content-${item.content_key}`}
                    style={{
                      display: "block",
                      fontWeight: 800,
                      marginBottom: 8,
                      color: "#111827",
                    }}
                  >
                    {item.label}
                  </label>

                  {item.content_value.length > 140 ? (
                    <textarea
                      id={`content-${item.content_key}`}
                      value={item.content_value}
                      onChange={(e) =>
                        update(item.content_key, e.target.value)
                      }
                      rows={5}
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        padding: 14,
                        border: "1px solid #ddd",
                        borderRadius: 12,
                        font: "inherit",
                        resize: "vertical",
                        outline: "none",
                        color: "#111827",
                        background: "#fff",
                      }}
                    />
                  ) : (
                    <input
                      id={`content-${item.content_key}`}
                      type="text"
                      value={item.content_value}
                      onChange={(e) =>
                        update(item.content_key, e.target.value)
                      }
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        padding: 14,
                        border: "1px solid #ddd",
                        borderRadius: 12,
                        font: "inherit",
                        outline: "none",
                        color: "#111827",
                        background: "#fff",
                      }}
                    />
                  )}
                </div>
              ))}

              {/* BOUTON */}
              <button
                type="button"
                onClick={save}
                disabled={saving}
                style={{
                  border: 0,
                  borderRadius: 12,
                  padding: "13px 20px",
                  background: saving ? "#999" : "#e11d2e",
                  color: "#fff",
                  fontWeight: 800,
                  cursor: saving ? "not-allowed" : "pointer",
                  transition: "all .2s ease",
                }}
              >
                {saving
                  ? "Enregistrement..."
                  : "Enregistrer les informations"}
              </button>

              {/* MESSAGE SUCCÈS */}
              {message && (
                <p
                  style={{
                    marginTop: 14,
                    marginBottom: 0,
                    fontWeight: 700,
                    color: "#16803c",
                  }}
                >
                  {message}
                </p>
              )}

              {/* MESSAGE ERREUR */}
              {error && (
                <p
                  style={{
                    marginTop: 14,
                    marginBottom: 0,
                    fontWeight: 700,
                    color: "#c51f2b",
                  }}
                >
                  {error}
                </p>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  )
}