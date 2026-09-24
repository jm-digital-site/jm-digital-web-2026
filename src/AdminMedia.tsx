import { useEffect, useState } from "react"
import { supabase as supabaseClient } from "./lib/supabase"

const supabase = supabaseClient!

type MediaCategory =
  | "logo"
  | "hero-city"
  | "team-direction"
  | "team-developpement"
  | "team-conseil"
  | "photo"
  | "banner"
  | "universite"
  | "cosmetique"
  | "maison_hotes"
  | "restaurant"
  | "terrasse"
  | "salle_fete"
  | "boutique"
  | "pharmacie"
  | "quincaillerie"
  | "salon"

type SiteMedia = {
  id: string
  storage_path: string
  url: string | null
  category: MediaCategory
  title: string
  alt_text: string | null
  active: boolean
  created_at: string
}

const categories: {
  value: MediaCategory
  label: string
}[] = [
  {
    value: "logo",
    label: "Logo JM DIGITAL",
  },
  {
    value: "hero-city",
    label: "Photo d'accueil",
  },
  {
    value: "team-direction",
    label: "Direction & stratégie",
  },
  {
    value: "team-developpement",
    label: "Développement logiciel",
  },
  {
    value: "team-conseil",
    label: "Conseil & digitalisation",
  },
  {
    value: "banner",
    label: "Bannière / Affiche principale",
  },
  {
    value: "photo",
    label: "Photo",
  },
  {
    value: "universite",
    label: "Université",
  },
  {
    value: "cosmetique",
    label: "Maison cosmétique",
  },
  {
    value: "maison_hotes",
    label: "Maison d'hôtes",
  },
  {
    value: "restaurant",
    label: "Restaurant",
  },
  {
    value: "terrasse",
    label: "Terrasse",
  },
  {
    value: "salle_fete",
    label: "Salle de fête",
  },
  {
    value: "boutique",
    label: "Boutique",
  },
  {
    value: "pharmacie",
    label: "Pharmacie",
  },
  {
    value: "quincaillerie",
    label: "Quincaillerie",
  },
  {
    value: "salon",
    label: "Salon",
  },
]

function AdminMedia() {
  const [media, setMedia] = useState<SiteMedia[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  const [file, setFile] = useState<File | null>(null)

  const [category, setCategory] =
    useState<MediaCategory>("photo")

  const [title, setTitle] = useState("")
  const [altText, setAltText] = useState("")

  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  // ============================================================
  // CHARGER LES MÉDIAS
  // ============================================================

  async function loadMedia() {
    setLoading(true)
    setError("")

    try {
      const {
        data: sessionData,
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError) {
        throw new Error(
          `Erreur session : ${sessionError.message}`,
        )
      }

      const user = sessionData.session?.user

      if (!user) {
        throw new Error(
          "Vous devez être connecté pour accéder à cette page.",
        )
      }

      const {
        data,
        error: databaseError,
      } = await supabase
        .from("site_media")
        .select(
          "id, storage_path, url, category, title, alt_text, active, created_at",
        )
        .order("created_at", {
          ascending: false,
        })

      if (databaseError) {
        throw new Error(
          `Erreur chargement : ${databaseError.message}`,
        )
      }

      setMedia(
        (data || []) as SiteMedia[],
      )
    } catch (err) {
      console.error(
        "Erreur chargement médias :",
        err,
      )

      setError(
        err instanceof Error
          ? err.message
          : "Impossible de charger les médias.",
      )
    } finally {
      setLoading(false)
    }
  }

  // ============================================================
  // VÉRIFICATION ADMIN
  // ============================================================

  async function checkAdmin() {
    const {
      data: sessionData,
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError) {
      throw new Error(
        `Erreur de session : ${sessionError.message}`,
      )
    }

    const user = sessionData.session?.user

    if (!user) {
      throw new Error(
        "Aucune session active. Connectez-vous en tant qu'administrateur.",
      )
    }

    const {
      data: admin,
      error: adminError,
    } = await supabase
      .from("site_admins")
      .select("id, actif")
      .eq("user_id", user.id)
      .eq("actif", true)
      .maybeSingle()

    if (adminError) {
      throw new Error(
        `Erreur vérification administrateur : ${adminError.message}`,
      )
    }

    if (!admin) {
      throw new Error(
        "Votre compte ne possède pas les droits administrateur.",
      )
    }

    return user
  }

  // ============================================================
  // INITIALISATION
  // ============================================================

  useEffect(() => {
    void loadMedia()
  }, [])

  // ============================================================
  // NETTOYER LE NOM DU FICHIER
  // ============================================================

  function cleanFileName(fileName: string) {
    const extension =
      fileName.includes(".")
        ? fileName.substring(
            fileName.lastIndexOf("."),
          )
        : ""

    const baseName =
      fileName
        .substring(
          0,
          fileName.lastIndexOf(".") > -1
            ? fileName.lastIndexOf(".")
            : fileName.length,
        )
        .normalize("NFD")
        .replace(
          /[\u0300-\u036f]/g,
          "",
        )
        .replace(
          /[^a-zA-Z0-9-_]/g,
          "-",
        )
        .replace(
          /-+/g,
          "-",
        )
        .replace(
          /^-|-$/g,
          "",
        )
        .toLowerCase()

    return `${
      baseName || "image"
    }-${Date.now()}${extension.toLowerCase()}`
  }

  // ============================================================
  // IMPORTER UNE IMAGE
  // ============================================================

  async function handleUpload() {
    setMessage("")
    setError("")

    if (!file) {
      setError(
        "Veuillez sélectionner une image.",
      )
      return
    }

    if (!file.type.startsWith("image/")) {
      setError(
        "Le fichier sélectionné n'est pas une image.",
      )
      return
    }

    // Limite de 10 MB
    const maxSize =
      10 * 1024 * 1024

    if (file.size > maxSize) {
      setError(
        "L'image ne doit pas dépasser 10 MB.",
      )
      return
    }

    setUploading(true)

    let storagePath = ""

    try {
      // --------------------------------------------------------
      // 1. VÉRIFIER L'ADMIN
      // --------------------------------------------------------

      await checkAdmin()

      // --------------------------------------------------------
      // 2. PRÉPARER LE FICHIER
      // --------------------------------------------------------

      const fileName =
        cleanFileName(file.name)

      storagePath =
        `${category}/${fileName}`

      console.log(
        "Fichier sélectionné :",
        file.name,
      )

      console.log(
        "Type MIME :",
        file.type,
      )

      console.log(
        "Catégorie :",
        category,
      )

      console.log(
        "Chemin Storage :",
        storagePath,
      )

      // --------------------------------------------------------
      // 3. UPLOAD STORAGE
      // --------------------------------------------------------

      const {
        error: uploadError,
      } = await supabase.storage
        .from("site-media")
        .upload(
          storagePath,
          file,
          {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type,
          },
        )

      if (uploadError) {
        throw new Error(
          `Erreur Storage : ${uploadError.message}`,
        )
      }

      console.log(
        "Upload Storage réussi.",
      )

      // --------------------------------------------------------
      // 4. SI LOGO : DÉSACTIVER LES ANCIENS
      // --------------------------------------------------------

      if (category === "logo") {
        const {
          error: logoUpdateError,
        } = await supabase
          .from("site_media")
          .update({
            active: false,
          })
          .eq(
            "category",
            "logo",
          )
          .eq(
            "active",
            true,
          )

        if (logoUpdateError) {
          console.warn(
            "Impossible de désactiver les anciens logos :",
            logoUpdateError.message,
          )
        }
      }

      // --------------------------------------------------------
      // 5. GÉNÉRER L'URL PUBLIQUE
      // --------------------------------------------------------

      const {
        data: publicUrlData,
      } = supabase.storage
        .from("site-media")
        .getPublicUrl(
          storagePath,
        )

      const publicUrl =
        publicUrlData?.publicUrl || ""

      console.log(
        "URL publique générée :",
        publicUrl,
      )

      if (!publicUrl) {
        await supabase.storage
          .from("site-media")
          .remove([
            storagePath,
          ])

        throw new Error(
          "Impossible de générer l'URL publique de l'image.",
        )
      }

      // --------------------------------------------------------
      // 6. ENREGISTRER DANS site_media
      // --------------------------------------------------------

      const {
        data: databaseData,
        error: databaseError,
      } = await supabase
        .from("site_media")
        .insert({
          storage_path: storagePath,
          url: publicUrl,
          category: category,
          title:
            title.trim() ||
            file.name,
          alt_text:
            altText.trim() ||
            title.trim() ||
            file.name,
          active: true,
        })
        .select()
        .single()

      if (databaseError) {
        console.error(
          "Erreur détaillée base de données :",
          databaseError,
        )

        await supabase.storage
          .from("site-media")
          .remove([
            storagePath,
          ])

        throw new Error(
          `Erreur base de données : ${databaseError.message}`,
        )
      }

      console.log(
        "Enregistrement base de données :",
        databaseData,
      )

      // --------------------------------------------------------
      // 7. SUCCÈS
      // --------------------------------------------------------

      setMessage(
        "✅ Image importée avec succès.",
      )

      setFile(null)
      setTitle("")
      setAltText("")

      const fileInput =
        document.getElementById(
          "media-file",
        ) as HTMLInputElement | null

      if (fileInput) {
        fileInput.value = ""
      }

      await loadMedia()
    } catch (err) {
      console.error(
        "Erreur importation :",
        err,
      )

      setError(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue lors de l'importation.",
      )
    } finally {
      setUploading(false)
    }
  }

  // ============================================================
  // ACTIVER / DÉSACTIVER
  // ============================================================

  async function toggleActive(
    item: SiteMedia,
  ) {
    setError("")
    setMessage("")

    try {
      await checkAdmin()

      const {
        error: updateError,
      } = await supabase
        .from("site_media")
        .update({
          active:
            !item.active,
        })
        .eq(
          "id",
          item.id,
        )

      if (updateError) {
        throw new Error(
          `Erreur modification : ${updateError.message}`,
        )
      }

      setMessage(
        item.active
          ? "Image désactivée."
          : "Image activée.",
      )

      await loadMedia()
    } catch (err) {
      console.error(
        "Erreur activation/désactivation :",
        err,
      )

      setError(
        err instanceof Error
          ? err.message
          : "Impossible de modifier cette image.",
      )
    }
  }

  // ============================================================
  // SUPPRIMER UNE IMAGE
  // ============================================================

  async function deleteMedia(
    item: SiteMedia,
  ) {
    const confirmation =
      window.confirm(
        `Voulez-vous vraiment supprimer "${item.title}" ?`,
      )

    if (!confirmation) {
      return
    }

    setError("")
    setMessage("")

    try {
      await checkAdmin()

      // --------------------------------------------------------
      // 1. SUPPRIMER DU STORAGE
      // --------------------------------------------------------

      const {
        error: storageError,
      } = await supabase.storage
        .from("site-media")
        .remove([
          item.storage_path,
        ])

      if (storageError) {
        throw new Error(
          `Erreur suppression Storage : ${storageError.message}`,
        )
      }

      // --------------------------------------------------------
      // 2. SUPPRIMER DE LA BASE
      // --------------------------------------------------------

      const {
        error: databaseError,
      } = await supabase
        .from("site_media")
        .delete()
        .eq(
          "id",
          item.id,
        )

      if (databaseError) {
        throw new Error(
          `Erreur suppression base de données : ${databaseError.message}`,
        )
      }

      setMessage(
        "🗑️ Image supprimée avec succès.",
      )

      await loadMedia()
    } catch (err) {
      console.error(
        "Erreur suppression :",
        err,
      )

      setError(
        err instanceof Error
          ? err.message
          : "Impossible de supprimer cette image.",
      )
    }
  }

  // ============================================================
  // URL PUBLIQUE
  // ============================================================

  function getPublicUrl(
    item: SiteMedia,
  ) {
    if (item.url) {
      return item.url
    }

    if (item.storage_path) {
      const {
        data,
      } = supabase.storage
        .from("site-media")
        .getPublicUrl(
          item.storage_path,
        )

      return data?.publicUrl || ""
    }

    return ""
  }

  // ============================================================
  // FORMAT DATE
  // ============================================================

  function formatDate(
    date: string,
  ) {
    return new Date(
      date,
    ).toLocaleDateString(
      "fr-FR",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      },
    )
  }

  // ============================================================
  // INTERFACE
  // ============================================================

  return (
    <div
      style={{
        minHeight:
          "100vh",
        background:
          "#f5f5f5",
        padding:
          "30px",
        fontFamily:
          "Arial, sans-serif",
        boxSizing:
          "border-box",
      }}
    >
      <div
        style={{
          maxWidth:
            "1200px",
          margin:
            "0 auto",
        }}
      >

        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <div
          style={{
            background:
              "#111",
            color:
              "#fff",
            padding:
              "25px",
            borderRadius:
              "14px",
            marginBottom:
              "25px",
            borderLeft:
              "6px solid #e00000",
          }}
        >
          <h1
            style={{
              margin:
                "0 0 8px 0",
              fontSize:
                "28px",
            }}
          >
            JM DIGITAL
          </h1>

          <p
            style={{
              margin:
                0,
              color:
                "#ddd",
            }}
          >
            Gestion des images du site
          </p>
        </div>

        {/* ================================================== */}
        {/* MESSAGES */}
        {/* ================================================== */}

        {message && (
          <div
            style={{
              background:
                "#e8f8ee",
              border:
                "1px solid #40a060",
              color:
                "#176b35",
              padding:
                "15px",
              borderRadius:
                "10px",
              marginBottom:
                "20px",
              fontWeight:
                600,
            }}
          >
            {message}
          </div>
        )}

        {error && (
          <div
            style={{
              background:
                "#fff0f0",
              border:
                "1px solid #d00000",
              color:
                "#b00000",
              padding:
                "15px",
              borderRadius:
                "10px",
              marginBottom:
                "20px",
              fontWeight:
                600,
              whiteSpace:
                "pre-wrap",
            }}
          >
            ❌ {error}
          </div>
        )}

        {/* ================================================== */}
        {/* FORMULAIRE */}
        {/* ================================================== */}

        <div
          style={{
            background:
              "#fff",
            padding:
              "25px",
            borderRadius:
              "14px",
            boxShadow:
              "0 4px 18px rgba(0,0,0,0.08)",
            marginBottom:
              "30px",
          }}
        >
          <h2
            style={{
              marginTop:
                0,
              color:
                "#111",
            }}
          >
            Importer une image
          </h2>

          {/* CATÉGORIE */}

          <div
            style={{
              marginBottom:
                "18px",
            }}
          >
            <label
              style={{
                display:
                  "block",
                fontWeight:
                  700,
                marginBottom:
                  "8px",
              }}
            >
              Catégorie
            </label>

            <select
              value={category}
              onChange={(event) =>
                setCategory(
                  event.target.value as MediaCategory,
                )
              }
              style={{
                width:
                  "100%",
                padding:
                  "12px",
                border:
                  "1px solid #ccc",
                borderRadius:
                  "8px",
                fontSize:
                  "15px",
                background:
                  "#fff",
                boxSizing:
                  "border-box",
              }}
            >
              {categories.map(
                (item) => (
                  <option
                    key={
                      item.value
                    }
                    value={
                      item.value
                    }
                  >
                    {item.label}
                  </option>
                ),
              )}
            </select>
          </div>

          {/* FICHIER */}

          <div
            style={{
              marginBottom:
                "18px",
            }}
          >
            <label
              htmlFor="media-file"
              style={{
                display:
                  "block",
                fontWeight:
                  700,
                marginBottom:
                  "8px",
              }}
            >
              Image
            </label>

            <input
              id="media-file"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
              onChange={(event) => {
                const selectedFile =
                  event.target.files?.[0] ||
                  null

                setFile(
                  selectedFile,
                )
              }}
              style={{
                width:
                  "100%",
                padding:
                  "10px",
                border:
                  "1px solid #ccc",
                borderRadius:
                  "8px",
                background:
                  "#fff",
                boxSizing:
                  "border-box",
              }}
            />
          </div>

          {/* TITRE */}

          <div
            style={{
              marginBottom:
                "18px",
            }}
          >
            <label
              style={{
                display:
                  "block",
                fontWeight:
                  700,
                marginBottom:
                  "8px",
              }}
            >
              Titre
            </label>

            <input
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(
                  event.target.value,
                )
              }
              placeholder="Ex : Logo JM DIGITAL"
              style={{
                width:
                  "100%",
                boxSizing:
                  "border-box",
                padding:
                  "12px",
                border:
                  "1px solid #ccc",
                borderRadius:
                  "8px",
                fontSize:
                  "15px",
              }}
            />
          </div>

          {/* TEXTE ALTERNATIF */}

          <div
            style={{
              marginBottom:
                "20px",
            }}
          >
            <label
              style={{
                display:
                  "block",
                fontWeight:
                  700,
                marginBottom:
                  "8px",
              }}
            >
              Texte alternatif
            </label>

            <input
              type="text"
              value={altText}
              onChange={(event) =>
                setAltText(
                  event.target.value,
                )
              }
              placeholder="Description de l'image"
              style={{
                width:
                  "100%",
                boxSizing:
                  "border-box",
                padding:
                  "12px",
                border:
                  "1px solid #ccc",
                borderRadius:
                  "8px",
                fontSize:
                  "15px",
              }}
            />
          </div>

          {/* BOUTON */}

          <button
            type="button"
            onClick={
              handleUpload
            }
            disabled={
              uploading ||
              !file
            }
            style={{
              width:
                "100%",
              padding:
                "14px",
              border:
                "none",
              borderRadius:
                "8px",
              background:
                uploading ||
                !file
                  ? "#777"
                  : "#e00000",
              color:
                "#fff",
              fontSize:
                "16px",
              fontWeight:
                700,
              cursor:
                uploading ||
                !file
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            {uploading
              ? "Importation en cours..."
              : "📤 Importer l'image"}
          </button>

          {/* FICHIER SÉLECTIONNÉ */}

          {file && (
            <div
              style={{
                marginTop:
                  "15px",
                padding:
                  "12px",
                background:
                  "#f5f5f5",
                borderRadius:
                  "8px",
              }}
            >
              <p
                style={{
                  margin:
                    "0 0 5px 0",
                  color:
                    "#555",
                }}
              >
                Fichier sélectionné :
              </p>

              <strong
                style={{
                  color:
                    "#111",
                  wordBreak:
                    "break-word",
                }}
              >
                {file.name}
              </strong>

              <p
                style={{
                  margin:
                    "5px 0 0 0",
                  color:
                    "#777",
                  fontSize:
                    "13px",
                }}
              >
                Taille :{" "}
                {(
                  file.size /
                  1024 /
                  1024
                ).toFixed(2)}{" "}
                MB
              </p>
            </div>
          )}
        </div>

        {/* ================================================== */}
        {/* LISTE DES MÉDIAS */}
        {/* ================================================== */}

        <div
          style={{
            background:
              "#fff",
            padding:
              "25px",
            borderRadius:
              "14px",
            boxShadow:
              "0 4px 18px rgba(0,0,0,0.08)",
          }}
        >
          <div
            style={{
              display:
                "flex",
              justifyContent:
                "space-between",
              alignItems:
                "center",
              gap:
                "15px",
              marginBottom:
                "20px",
              flexWrap:
                "wrap",
            }}
          >
            <div>
              <h2
                style={{
                  margin:
                    "0 0 5px 0",
                  color:
                    "#111",
                }}
              >
                Médias disponibles
              </h2>

              <p
                style={{
                  margin:
                    0,
                  color:
                    "#777",
                  fontSize:
                    "14px",
                }}
              >
                {media.length} image
                {media.length !==
                1
                  ? "s"
                  : ""}{" "}
                enregistrée
                {media.length !==
                1
                  ? "s"
                  : ""}.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                void loadMedia()
              }
              disabled={
                loading
              }
              style={{
                padding:
                  "10px 16px",
                border:
                  "1px solid #222",
                borderRadius:
                  "8px",
                background:
                  "#fff",
                cursor:
                  loading
                    ? "not-allowed"
                    : "pointer",
                fontWeight:
                  600,
              }}
            >
              {loading
                ? "Chargement..."
                : "🔄 Actualiser"}
            </button>
          </div>

          {/* CHARGEMENT */}

          {loading ? (
            <div
              style={{
                padding:
                  "40px",
                textAlign:
                  "center",
                color:
                  "#666",
              }}
            >
              Chargement des images...
            </div>
          ) : media.length ===
            0 ? (
            <div
              style={{
                padding:
                  "30px",
                textAlign:
                  "center",
                background:
                  "#f7f7f7",
                borderRadius:
                  "10px",
                color:
                  "#666",
              }}
            >
              Aucune image enregistrée
              pour le moment.
            </div>
          ) : (
            <div
              style={{
                display:
                  "grid",
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(260px, 1fr))",
                gap:
                  "20px",
              }}
            >
              {media.map(
                (item) => {
                  const publicUrl =
                    getPublicUrl(
                      item,
                    )

                  const categoryLabel =
                    categories.find(
                      (cat) =>
                        cat.value ===
                        item.category,
                    )?.label ||
                    item.category

                  return (
                    <div
                      key={
                        item.id
                      }
                      style={{
                        border:
                          "1px solid #ddd",
                        borderRadius:
                          "12px",
                        overflow:
                          "hidden",
                        background:
                          "#fff",
                      }}
                    >
                      {/* IMAGE */}

                      <div
                        style={{
                          width:
                            "100%",
                          height:
                            "200px",
                          background:
                            "#eee",
                          display:
                            "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "center",
                          overflow:
                            "hidden",
                        }}
                      >
                        {publicUrl ? (
                          <img
                            src={
                              publicUrl
                            }
                            alt={
                              item.alt_text ||
                              item.title
                            }
                            loading="lazy"
                            onError={(event) => {
                              console.error(
                                "Impossible d'afficher l'image :",
                                publicUrl,
                              )

                              event.currentTarget.style.display =
                                "none"
                            }}
                            style={{
                              width:
                                "100%",
                              height:
                                "100%",
                              objectFit:
                                "cover",
                              display:
                                "block",
                            }}
                          />
                        ) : (
                          <span
                            style={{
                              color:
                                "#777",
                              padding:
                                "20px",
                              textAlign:
                                "center",
                            }}
                          >
                            Image indisponible
                          </span>
                        )}
                      </div>

                      {/* INFORMATIONS */}

                      <div
                        style={{
                          padding:
                            "15px",
                        }}
                      >
                        <h3
                          style={{
                            margin:
                              "0 0 8px 0",
                            fontSize:
                              "17px",
                            color:
                              "#111",
                            wordBreak:
                              "break-word",
                          }}
                        >
                          {
                            item.title
                          }
                        </h3>

                        <p
                          style={{
                            margin:
                              "5px 0",
                            color:
                              "#555",
                            fontSize:
                              "14px",
                          }}
                        >
                          <strong>
                            Catégorie :
                          </strong>{" "}
                          {
                            categoryLabel
                          }
                        </p>

                        <p
                          style={{
                            margin:
                              "5px 0",
                            color:
                              "#777",
                            fontSize:
                              "13px",
                          }}
                        >
                          <strong>
                            Statut :
                          </strong>{" "}
                          {item.active
                            ? "🟢 Active"
                            : "🔴 Inactive"}
                        </p>

                        <p
                          style={{
                            margin:
                              "5px 0 8px 0",
                            color:
                              "#888",
                            fontSize:
                              "12px",
                          }}
                        >
                          {formatDate(
                            item.created_at,
                          )}
                        </p>

                        <p
                          style={{
                            margin:
                              "5px 0 15px 0",
                            color:
                              "#aaa",
                            fontSize:
                              "11px",
                            wordBreak:
                              "break-all",
                          }}
                        >
                          {item.storage_path}
                        </p>

                        {/* BOUTONS */}

                        <div
                          style={{
                            display:
                              "flex",
                            gap:
                              "8px",
                            flexWrap:
                              "wrap",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              void toggleActive(
                                item,
                              )
                            }
                            style={{
                              flex:
                                1,
                              minWidth:
                                "110px",
                              padding:
                                "10px",
                              border:
                                "1px solid #222",
                              borderRadius:
                                "7px",
                              background:
                                "#fff",
                              cursor:
                                "pointer",
                              fontWeight:
                                600,
                            }}
                          >
                            {item.active
                              ? "Désactiver"
                              : "Activer"}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              void deleteMedia(
                                item,
                              )
                            }
                            style={{
                              flex:
                                1,
                              minWidth:
                                "110px",
                              padding:
                                "10px",
                              border:
                                "none",
                              borderRadius:
                                "7px",
                              background:
                                "#e00000",
                              color:
                                "#fff",
                              cursor:
                                "pointer",
                              fontWeight:
                                600,
                            }}
                          >
                            🗑️ Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                },
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminMedia