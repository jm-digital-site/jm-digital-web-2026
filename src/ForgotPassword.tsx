import {
  useState,
  type FormEvent,
} from "react"

import { supabase } from "./lib/supabase"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    setMessage("")
    setSuccess(false)

    if (!supabase) {
      setMessage(
        "Connexion Supabase indisponible. Vérifiez votre configuration.",
      )
      return
    }

    if (!email.trim()) {
      setMessage(
        "Veuillez saisir votre adresse email.",
      )
      return
    }

    setLoading(true)

    try {
      const redirectTo =
        `${window.location.origin}/admin/reset-password`

      console.log(
        "Tentative de récupération Supabase",
        {
          email: email.trim(),
          redirectTo,
        },
      )

      const { error } =
        await supabase.auth.resetPasswordForEmail(
          email.trim(),
          {
            redirectTo,
          },
        )

      if (error) {
        console.error(
          "Erreur Supabase récupération mot de passe :",
          error,
        )

        setSuccess(false)

        setMessage(
          `Erreur Supabase : ${error.message}`,
        )

        return
      }

      setSuccess(true)

      setMessage(
        "Le lien de récupération a été envoyé. Vérifiez votre boîte e-mail ainsi que le dossier spam.",
      )
    } catch (error) {
      console.error(
        "Erreur inattendue récupération mot de passe :",
        error,
      )

      setSuccess(false)

      if (error instanceof Error) {
        setMessage(
          `Erreur : ${error.message}`,
        )
      } else {
        setMessage(
          "Une erreur inattendue est survenue.",
        )
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        <div style={styles.icon}>
          🔑
        </div>

        <h1 style={styles.title}>
          Mot de passe oublié
        </h1>

        <p style={styles.text}>
          Saisissez l'adresse email utilisée
          pour votre compte administrateur.
        </p>

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

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            placeholder="Votre adresse email"
            autoComplete="email"
            style={styles.input}
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading
              ? "Envoi..."
              : "Envoyer le lien"}
          </button>

        </form>

        <button
          type="button"
          onClick={() => {
            window.location.href = "/admin"
          }}
          style={styles.back}
        >
          ← Retour à la connexion
        </button>

        <p style={styles.help}>
          Vous avez oublié l'adresse email
          administrateur ? Contactez le
          responsable de JM DIGITAL.
        </p>

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
    fontSize: "28px",
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

  back: {
    marginTop: "18px",
    border: "none",
    background: "transparent",
    color: "#555555",
    cursor: "pointer",
    fontWeight: 700,
  },

  error: {
    background: "#fff0f0",
    color: "#a30000",
    padding: "12px",
    borderRadius: "7px",
    marginBottom: "16px",
    fontSize: "13px",
    textAlign: "left",
    lineHeight: 1.5,
  },

  success: {
    background: "#eefaf0",
    color: "#176b27",
    padding: "12px",
    borderRadius: "7px",
    marginBottom: "16px",
    fontSize: "13px",
    textAlign: "left",
    lineHeight: 1.5,
  },

  help: {
    marginTop: "25px",
    paddingTop: "18px",
    borderTop: "1px solid #eeeeee",
    color: "#888888",
    fontSize: "11px",
    lineHeight: 1.5,
  },
}