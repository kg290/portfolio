import { useState } from "react";
import "./ContactForm.css";

const CONTACT_API_ENDPOINT = "/api/contact";

const INITIAL_FORM = {
  name: "",
  email: "",
  message: "",
  company: "",
};

export default function ContactForm() {
  const [formValues, setFormValues] = useState(INITIAL_FORM);
  const [status, setStatus] = useState({ type: "idle", text: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onFieldChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (formValues.company.trim()) {
      setStatus({ type: "success", text: "Message sent successfully." });
      return;
    }

    const name = formValues.name.trim();
    const email = formValues.email.trim();
    const message = formValues.message.trim();

    if (name.length < 2) {
      setStatus({ type: "error", text: "Please enter your full name." });
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setStatus({ type: "error", text: "Please enter a valid email address." });
      return;
    }

    if (message.length < 10) {
      setStatus({ type: "error", text: "Please add a bit more detail to your message." });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: "idle", text: "" });

    try {
      const response = await fetch(CONTACT_API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          message,
          source: "portfolio-contact-form",
          company: formValues.company,
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          payload?.message || "Message could not be stored right now.",
        );
      }

      setStatus({
        type: "success",
        text: "Message saved successfully in backend database.",
      });

      setFormValues(INITIAL_FORM);
    } catch (error) {
      setStatus({
        type: "error",
        text:
          error?.message ||
          "Message could not be stored right now. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-form-shell">
      <div className="contact-form-head">
        <h3 className="contact-form-title">Send A Message</h3>
        <p className="contact-form-subtitle">
          Share your details and context. This is stored securely in backend.
        </p>
      </div>

      <form className="contact-form" onSubmit={onSubmit} noValidate>
        <input
          type="text"
          name="company"
          value={formValues.company}
          onChange={onFieldChange}
          className="contact-form-honeypot"
          autoComplete="off"
          tabIndex={-1}
          aria-hidden="true"
        />

        <div className="contact-form-grid">
          <label className="contact-form-field" htmlFor="contact-name">
            Full Name
            <input
              id="contact-name"
              name="name"
              type="text"
              value={formValues.name}
              onChange={onFieldChange}
              placeholder="Your name"
              required
            />
          </label>

          <label className="contact-form-field" htmlFor="contact-email">
            Email Address
            <input
              id="contact-email"
              name="email"
              type="email"
              value={formValues.email}
              onChange={onFieldChange}
              placeholder="you@example.com"
              required
            />
          </label>
        </div>

        <label className="contact-form-field" htmlFor="contact-message">
          Your Message
          <textarea
            id="contact-message"
            name="message"
            value={formValues.message}
            onChange={onFieldChange}
            rows={5}
            placeholder="Tell me what you are building, role details, timeline, or collaboration idea."
            required
          />
        </label>

        <div className="contact-form-actions">
          <p className="contact-form-note">
            Your message is stored for follow-up communication.
          </p>

          <button
            type="submit"
            className="btn contact-form-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending…" : "Send Message"}
          </button>
        </div>

        {status.type !== "idle" && (
          <p className={`contact-form-status ${status.type}`}>{status.text}</p>
        )}
      </form>
    </div>
  );
}
