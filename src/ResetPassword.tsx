import {
  useEffect,
  useState,
  type FormEvent,
} from "react"

import { supabase } from "./lib/supabase"

export default function ResetPassword() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] =
    useState("")

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [ready, setReady] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    const prepareReset = async () => {
      if (!supabase) {
        setMessage(
          "Connexion Supabase indisponible.",
        )
        setLoading(false)
        return
      }

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        setMessage(
          "Le lien de récupération est invalide ou a expiré.",
        )
        setLoading(false)
        return
      }

      setReady(true)
      setLoading(false)
    }

    void prepareReset()
  }, [])

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    setMessage("")

    if (!supabase) {
      setMessage(
        "Connexion Supabase indisponible.",
      )
      return
    }

    if (password.length < 8) {
      setMessage(
        "Le mot de passe doit contenir au moins 8 caractères.",
      )
      return
    }

    if (password !== confirmPassword) {
      setMessage(
        "Les deux mots de passe ne correspondent pas.",
      )
      return
    }

    setSaving(true)

    try {
      const { error } =
        await supabase.auth.updateUser({
          password,
        })

      if (error) {
        console.error(error)

        setMessage(
          "Impossible de modifier le mot de passe.",
        )

        return
      }

      setMessage(
        "Votre mot de passe a été modifié avec succès.",
      )

      setPassword("")
      setConfirmPassword("")

      setTimeout(() => {
        window.location.href = "/admin"
      }, 1500)
    } catch (error) {
      console.error(error)

      setMessage(
        "Une erreur est survenue.",
      )
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          Vérification du lien...
        </div>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        <div style={styles.icon}>
          🔐
        </div>

        <h1 style={styles.title}>
          Nouveau mot de passe
        </h1>

        {!ready ? (
          <>
            <p style={styles.error}>
              {message}
            </p>

            <button
              type="button"
              onClick={() => {
                window.location.href =
                  "/admin/forgot-password"
              }}
              style={styles.button}
            >
              Demander un nouveau lien
            </button>
          </>
        ) : (
          <>
            <p style={styles.text}>
              Choisissez un nouveau mot de passe
              pour votre compte administrateur.
            </p>

            {message && (
              <div style={styles.success}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              <input
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value,
                  )
                }
                placeholder="Nouveau mot de passe"
                autoComplete="new-password"
                style={styles.input}
                disabled={saving}
              />

              <input
                type="password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(
                    event.target.value,
                  )
                }
                placeholder="Confirmer le mot de passe"
                autoComplete="new-password"
                style={styles.input}
                disabled={saving}
              />

              <button
                type="submit"
                disabled={saving}
                style={{
                  ...styles.button,
                  opacity: saving ? 0.6 : 1,
                }}
              >
                {saving
                  ? "Modification..."
                  : "Modifier le mot de passe"}
              </button>

            </form>
          </>
        )}

      </div>
    </div>
  )
}

const styles: Record<
  string,
  React.CSSProperties
> = {
  page: {
    minHeight: "100vh",
    background: "#111111",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "25px",
    fontFamily:
      "Arial, Helvetica, sans-serif",
  },

  card: {
    width: "min(430px, 100%)",
    background: "#ffffff",
    borderRadius: "17px",
    padding: "38px 30px",
    boxSizing: "border-box",
    textAlign: "center",
  },

  icon: {
    fontSize: "48px",
    marginBottom: "12px",
  },

  title: {
    margin: 0,
    fontSize: "27px",
    fontWeight: 900,
    color: "#111111",
  },

  text: {
    color: "#666666",
    lineHeight: 1.6,
    fontSize: "14px",
    margin: "12px 0 24px",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px",
    border: "1px solid #dddddd",
    borderRadius: "9px",
    outline: "none",
    fontSize: "14px",
    marginBottom: "12px",
  },

  button: {
    width: "100%",
    padding: "14px",
    border: "none",
    borderRadius: "9px",
    background: "#c9151e",
    color: "#ffffff",
    fontWeight: 900,
    cursor: "pointer",
  },

  error: {
    background: "#fff0f0",
    color: "#a30000",
    padding: "13px",
    borderRadius: "7px",
    margin: "20px 0",
    fontSize: "13px",
    lineHeight: 1.5,
  },

  success: {
    background: "#eefaf0",
    color: "#176b27",
    padding: "13px",
    borderRadius: "7px",
    marginBottom: "18px",
    fontSize: "13px",
  },
}