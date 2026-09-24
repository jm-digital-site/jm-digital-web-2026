import {
  useEffect,
  useState,
  type FormEvent,
} from "react"

import { supabase } from "./lib/supabase"

type Mode = "register" | "login"

export default function AdminLogin() {
  const [mode, setMode] = useState<Mode>("register")

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false)

  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)

  const [message, setMessage] = useState("")
  const [success, setSuccess] = useState(false)

  /*
   * ============================================================
   * VÉRIFICATION D'UNE SESSION EXISTANTE
   * ============================================================
   */
  useEffect(() => {
    const checkExistingSession = async () => {
      /*
       * Vérification importante :
       * le client Supabase peut être null selon le fichier
       * src/lib/supabase.ts.
       */
      if (!supabase) {
        setMessage(
          "La connexion à Supabase n'est pas disponible. Vérifiez la configuration du projet.",
        )
        setChecking(false)
        return
      }

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          const { data: admin, error: adminError } =
            await supabase
              .from("site_admins")
              .select("id, actif")
              .eq("user_id", session.user.id)
              .eq("actif", true)
              .maybeSingle()

          if (adminError) {
            console.error(
              "Erreur vérification administrateur :",
              adminError,
            )
          }

          if (admin) {
            window.location.href = "/admin-media"
            return
          }
        }
      } catch (error) {
        console.error(
          "Erreur vérification session :",
          error,
        )
      } finally {
        setChecking(false)
      }
    }

    void checkExistingSession()
  }, [])

  /*
   * ============================================================
   * CRÉATION DU COMPTE ADMINISTRATEUR
   * ============================================================
   */
  const handleRegister = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    setMessage("")
    setSuccess(false)

    /*
     * Vérification du client Supabase
     */
    if (!supabase) {
      setMessage(
        "La connexion à Supabase n'est pas disponible. Vérifiez la configuration du projet.",
      )
      return
    }

    const cleanEmail = email.trim().toLowerCase()

    /*
     * Vérification des champs
     */
    if (!cleanEmail || !password || !confirmPassword) {
      setMessage(
        "Veuillez remplir tous les champs.",
      )
      return
    }

    /*
     * Vérification de l'email
     */
    if (!cleanEmail.includes("@")) {
      setMessage(
        "Veuillez saisir une adresse email valide.",
      )
      return
    }

    /*
     * Vérification du mot de passe
     */
    if (password.length < 6) {
      setMessage(
        "Le mot de passe doit contenir au moins 6 caractères.",
      )
      return
    }

    /*
     * Confirmation du mot de passe
     */
    if (password !== confirmPassword) {
      setMessage(
        "Les deux mots de passe ne correspondent pas.",
      )
      return
    }

    setLoading(true)

    try {
      /*
       * ========================================================
       * VÉRIFICATION :
       * EXISTE-T-IL DÉJÀ UN ADMINISTRATEUR ?
       * ========================================================
       */
      const {
        data: existingAdmins,
        error: existingAdminError,
      } = await supabase
        .from("site_admins")
        .select("id")
        .limit(1)

      if (existingAdminError) {
        console.error(
          "Erreur vérification administrateur :",
          existingAdminError,
        )

        setMessage(
          "Impossible de vérifier l'existence d'un administrateur.",
        )

        return
      }

      /*
       * S'il existe déjà un administrateur,
       * on empêche la création d'un deuxième compte
       * depuis cette page.
       */
      if (
        existingAdmins &&
        existingAdmins.length > 0
      ) {
        setMode("login")

        setMessage(
          "Un compte administrateur existe déjà. Utilisez la connexion.",
        )

        return
      }

      /*
       * ========================================================
       * CRÉATION DU COMPTE SUPABASE AUTH
       * ========================================================
       */
      const {
        data,
        error,
      } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
      })

      if (error) {
        console.error(
          "Erreur création compte :",
          error,
        )

        const errorMessage =
          error.message.toLowerCase()

        if (
          errorMessage.includes(
            "already registered",
          ) ||
          errorMessage.includes(
            "already exists",
          )
        ) {
          setMessage(
            "Cette adresse email possède déjà un compte Supabase.",
          )
        } else if (
          errorMessage.includes(
            "password",
          )
        ) {
          setMessage(
            "Le mot de passe n'est pas accepté par Supabase.",
          )
        } else {
          setMessage(error.message)
        }

        return
      }

      /*
       * Vérification du compte créé
       */
      if (!data.user) {
        setMessage(
          "Le compte n'a pas pu être créé.",
        )

        return
      }

      /*
       * ========================================================
       * CRÉATION DU PROFIL DANS site_admins
       * ========================================================
       */
      const {
        error: adminInsertError,
      } = await supabase
        .from("site_admins")
        .insert({
          user_id: data.user.id,
          actif: true,
        })

      if (adminInsertError) {
        console.error(
          "Erreur création administrateur :",
          adminInsertError,
        )

        /*
         * Si le profil admin n'a pas pu être créé,
         * on déconnecte le compte.
         */
        await supabase.auth.signOut()

        setMessage(
          "Le compte utilisateur a été créé, mais le profil administrateur n'a pas pu être créé. Vérifiez les permissions de la table site_admins.",
        )

        return
      }

      /*
       * ========================================================
       * SUCCÈS
       * ========================================================
       *
       * Si Confirm email est activé dans Supabase,
       * l'utilisateur doit confirmer son adresse email
       * avant de pouvoir se connecter.
       */
      setSuccess(true)

      setMessage(
        "Compte administrateur créé avec succès. Consultez votre boîte email et confirmez votre adresse avant de vous connecter.",
      )

      setPassword("")
      setConfirmPassword("")

      /*
       * On passe automatiquement à la connexion
       * après quelques secondes.
       */
      setTimeout(() => {
        setMode("login")
        setMessage(
          "Votre compte est créé. Après confirmation de votre email, vous pourrez vous connecter.",
        )
        setSuccess(true)
      }, 1500)
    } catch (error) {
      console.error(
        "Erreur création administrateur :",
        error,
      )

      setMessage(
        "Une erreur est survenue pendant la création du compte.",
      )
    } finally {
      setLoading(false)
    }
  }

  /*
   * ============================================================
   * CONNEXION ADMINISTRATEUR
   * ============================================================
   */
  const handleLogin = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    setMessage("")
    setSuccess(false)

    /*
     * Vérification du client Supabase
     */
    if (!supabase) {
      setMessage(
        "La connexion à Supabase n'est pas disponible. Vérifiez la configuration du projet.",
      )
      return
    }

    const cleanEmail = email.trim().toLowerCase()

    /*
     * Vérification des champs
     */
    if (!cleanEmail || !password) {
      setMessage(
        "Veuillez saisir votre adresse email et votre mot de passe.",
      )
      return
    }

    setLoading(true)

    try {
      /*
       * ========================================================
       * AUTHENTIFICATION SUPABASE
       * ========================================================
       */
      const {
        data,
        error,
      } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      })

      if (error) {
        console.error(
          "Erreur connexion :",
          error,
        )

        const errorMessage =
          error.message.toLowerCase()

        if (
          errorMessage.includes(
            "email not confirmed",
          )
        ) {
          setMessage(
            "Votre adresse email n'est pas encore confirmée. Consultez votre boîte email.",
          )
        } else {
          setMessage(
            "Adresse email ou mot de passe incorrect.",
          )
        }

        return
      }

      /*
       * Vérification de l'utilisateur
       */
      if (!data.user) {
        setMessage(
          "Impossible de récupérer votre compte.",
        )
        return
      }

      /*
       * ========================================================
       * VÉRIFICATION DES DROITS ADMINISTRATEUR
       * ========================================================
       */
      const {
        data: admin,
        error: adminError,
      } = await supabase
        .from("site_admins")
        .select("id, actif")
        .eq("user_id", data.user.id)
        .eq("actif", true)
        .maybeSingle()

      if (adminError) {
        console.error(
          "Erreur vérification administrateur :",
          adminError,
        )

        await supabase.auth.signOut()

        setMessage(
          "Impossible de vérifier vos droits administrateur.",
        )

        return
      }

      /*
       * Le compte Supabase existe,
       * mais n'est pas enregistré comme administrateur.
       */
      if (!admin) {
        await supabase.auth.signOut()

        setMessage(
          "Votre compte existe, mais il ne possède pas les droits administrateur.",
        )

        return
      }

      /*
       * ========================================================
       * CONNEXION RÉUSSIE
       * ========================================================
       */
      setSuccess(true)

      setMessage(
        "Connexion réussie. Redirection...",
      )

      setTimeout(() => {
        window.location.href = "/admin-media"
      }, 700)
    } catch (error) {
      console.error(
        "Erreur connexion administrateur :",
        error,
      )

      setMessage(
        "Une erreur est survenue pendant la connexion.",
      )
    } finally {
      setLoading(false)
    }
  }

  /*
   * ============================================================
   * ÉCRAN DE VÉRIFICATION
   * ============================================================
   */
  if (checking) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>

          <div style={styles.logo}>
            JM
          </div>

          <div style={styles.brand}>
            JM DIGITAL
          </div>

          <div style={styles.loader}>
            Vérification de la session...
          </div>

        </div>
      </div>
    )
  }

  /*
   * ============================================================
   * INTERFACE
   * ============================================================
   */
  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* LOGO */}
        <div style={styles.logo}>
          JM
        </div>

        {/* MARQUE */}
        <div style={styles.brand}>
          JM DIGITAL
        </div>

        {/* BADGE */}
        <div style={styles.badge}>
          🔐 ESPACE ADMINISTRATEUR
        </div>

        {/* TITRE */}
        <h1 style={styles.title}>
          {mode === "register"
            ? "Créer mon compte"
            : "Connexion"}
        </h1>

        {/* SOUS-TITRE */}
        <p style={styles.subtitle}>
          {mode === "register"
            ? "Créez le premier compte administrateur de votre espace JM DIGITAL."
            : "Connectez-vous pour gérer les images et les contenus médias du site JM DIGITAL."}
        </p>

        {/* MESSAGE */}
        {message && (
          <div
            style={
              success
                ? styles.success
                : styles.error
            }
          >
            {message}
          </div>
        )}

        {/* FORMULAIRE */}
        <form
          onSubmit={
            mode === "register"
              ? handleRegister
              : handleLogin
          }
          style={styles.form}
        >

          {/* EMAIL */}
          <div style={styles.group}>

            <label style={styles.label}>
              Adresse email
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="admin@exemple.com"
              autoComplete="email"
              style={styles.input}
              disabled={loading}
            />

          </div>

          {/* MOT DE PASSE */}
          <div style={styles.group}>

            <label style={styles.label}>
              Mot de passe
            </label>

            <div style={styles.passwordWrapper}>

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Votre mot de passe"
                autoComplete={
                  mode === "register"
                    ? "new-password"
                    : "current-password"
                }
                style={styles.passwordInput}
                disabled={loading}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword,
                  )
                }
                style={styles.showButton}
                disabled={loading}
              >
                {showPassword
                  ? "Masquer"
                  : "Afficher"}
              </button>

            </div>

          </div>

          {/* CONFIRMATION MOT DE PASSE */}
          {mode === "register" && (
            <div style={styles.group}>

              <label style={styles.label}>
                Confirmer le mot de passe
              </label>

              <div style={styles.passwordWrapper}>

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value,
                    )
                  }
                  placeholder="Confirmez votre mot de passe"
                  autoComplete="new-password"
                  style={styles.passwordInput}
                  disabled={loading}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword,
                    )
                  }
                  style={styles.showButton}
                  disabled={loading}
                >
                  {showConfirmPassword
                    ? "Masquer"
                    : "Afficher"}
                </button>

              </div>

            </div>
          )}

          {/* BOUTON PRINCIPAL */}
          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.loginButton,
              opacity: loading ? 0.65 : 1,
            }}
          >
            {loading
              ? mode === "register"
                ? "Création..."
                : "Connexion..."
              : mode === "register"
                ? "Créer mon compte administrateur"
                : "Se connecter"}
          </button>

        </form>

        {/* ====================================================
            CHANGEMENT DE MODE
            ==================================================== */}

        {mode === "register" ? (
          <button
            type="button"
            onClick={() => {
              setMode("login")
              setMessage("")
              setSuccess(false)
            }}
            style={styles.secondaryButton}
            disabled={loading}
          >
            J'ai déjà un compte → Se connecter
          </button>
        ) : (
          <>
            {/* MOT DE PASSE OUBLIÉ */}
            <button
              type="button"
              onClick={() => {
                window.location.href =
                  "/admin/forgot-password"
              }}
              style={styles.forgotButton}
              disabled={loading}
            >
              Mot de passe oublié ?
            </button>

            {/* CRÉATION COMPTE */}
            <button
              type="button"
              onClick={() => {
                setMode("register")
                setMessage("")
                setSuccess(false)
                setPassword("")
                setConfirmPassword("")
              }}
              style={styles.secondaryButton}
              disabled={loading}
            >
              Créer le premier compte administrateur
            </button>
          </>
        )}

        {/* RETOUR SITE */}
        <button
          type="button"
          onClick={() => {
            window.location.href = "/"
          }}
          style={styles.backButton}
          disabled={loading}
        >
          ← Retour au site
        </button>

        {/* SÉCURITÉ */}
        <div style={styles.security}>
          🔒 Accès protégé par Supabase
        </div>

      </div>
    </div>
  )
}

/*
 * ============================================================
 * STYLES
 * ============================================================
 */

const styles: Record<
  string,
  React.CSSProperties
> = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #111111 0%, #1d1d1d 55%, #c9151e 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "30px 20px",
    boxSizing: "border-box",
    fontFamily:
      "Arial, Helvetica, sans-serif",
  },

  card: {
    width: "min(450px, 100%)",
    background: "#ffffff",
    borderRadius: "18px",
    padding: "40px 32px",
    boxSizing: "border-box",
    boxShadow:
      "0 25px 70px rgba(0,0,0,0.3)",
    textAlign: "center",
  },

  logo: {
    width: "62px",
    height: "62px",
    margin: "0 auto 12px",
    borderRadius: "14px",
    background: "#c9151e",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "23px",
    fontWeight: 900,
  },

  brand: {
    fontSize: "15px",
    fontWeight: 900,
    letterSpacing: "1.5px",
    color: "#111111",
    marginBottom: "18px",
  },

  badge: {
    display: "inline-block",
    background: "#111111",
    color: "#ffffff",
    padding: "7px 12px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: 800,
    marginBottom: "18px",
  },

  title: {
    margin: 0,
    fontSize: "30px",
    fontWeight: 900,
    color: "#111111",
  },

  subtitle: {
    margin: "12px auto 25px",
    color: "#666666",
    lineHeight: 1.6,
    fontSize: "14px",
    maxWidth: "350px",
  },

  form: {
    textAlign: "left",
  },

  group: {
    marginBottom: "18px",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    fontSize: "13px",
    fontWeight: 800,
    color: "#222222",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #dddddd",
    borderRadius: "9px",
    padding: "13px",
    fontSize: "14px",
    outline: "none",
    background: "#ffffff",
    color: "#111111",
  },

  passwordWrapper: {
    display: "flex",
    border: "1px solid #dddddd",
    borderRadius: "9px",
    overflow: "hidden",
    background: "#ffffff",
  },

  passwordInput: {
    flex: 1,
    minWidth: 0,
    border: "none",
    padding: "13px",
    fontSize: "14px",
    outline: "none",
    color: "#111111",
    background: "#ffffff",
  },

  showButton: {
    border: "none",
    borderLeft: "1px solid #dddddd",
    background: "#f5f5f5",
    padding: "0 11px",
    cursor: "pointer",
    fontSize: "11px",
    fontWeight: 700,
  },

  loginButton: {
    width: "100%",
    border: "none",
    borderRadius: "9px",
    padding: "14px",
    background: "#c9151e",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: 900,
    cursor: "pointer",
    marginTop: "5px",
  },

  forgotButton: {
    border: "none",
    background: "transparent",
    color: "#c9151e",
    fontWeight: 700,
    cursor: "pointer",
    marginTop: "20px",
    fontSize: "13px",
  },

  secondaryButton: {
    display: "block",
    margin: "18px auto 0",
    border: "none",
    background: "transparent",
    color: "#c9151e",
    cursor: "pointer",
    fontWeight: 800,
    fontSize: "13px",
  },

  backButton: {
    display: "block",
    margin: "15px auto 0",
    border: "none",
    background: "transparent",
    color: "#555555",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "13px",
  },

  error: {
    background: "#fff0f0",
    color: "#a30000",
    borderLeft: "4px solid #c9151e",
    padding: "12px",
    borderRadius: "7px",
    textAlign: "left",
    fontSize: "13px",
    marginBottom: "18px",
    lineHeight: 1.5,
  },

  success: {
    background: "#eefaf0",
    color: "#176b27",
    borderLeft: "4px solid #2e8b3c",
    padding: "12px",
    borderRadius: "7px",
    textAlign: "left",
    fontSize: "13px",
    marginBottom: "18px",
    lineHeight: 1.5,
  },

  loader: {
    color: "#666666",
    fontSize: "14px",
    padding: "20px 0",
  },

  security: {
    marginTop: "25px",
    paddingTop: "18px",
    borderTop: "1px solid #eeeeee",
    color: "#888888",
    fontSize: "11px",
  },
}