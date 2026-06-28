import { useRef, useState } from "react";
import { Button, Modal } from "react-bootstrap";

const Contact = () => {
  const form = useRef();
  const [formData, setFormData] = useState({
    from_name: "",
    from_email: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({
    show: false,
    title: "",
    message: "",
    type: "",
  });

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = () => {
    const { from_name, from_email, message } = formData;
    const errs = {};
    if (!from_name.trim()) errs.from_name = "Name is required.";
    if (!from_email.trim()) errs.from_email = "Email is required.";
    else if (!validateEmail(from_email))
      errs.from_email = "Please enter a valid email.";
    if (!message.trim()) errs.message = "Message is required.";
    return errs;
  };

  const sendEmail = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    setErrors({});
    setLoading(true);

    // Abort automatically after 10 seconds so the user never gets
    // stuck waiting forever on a slow or unreachable server.
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(`${BACKEND_URL}/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        setModal({
          show: true,
          title: "Message Sent",
          message: "Thank you — I'll be in touch shortly.",
          type: "success",
        });
        setFormData({ from_name: "", from_email: "", message: "" });
      } else {
        const errData = await response.json();
        setModal({
          show: true,
          title: "Error",
          message: `Could not send message: ${errData.error}`,
          type: "danger",
        });
      }
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === "AbortError") {
        setModal({
          show: true,
          title: "Error",
          message:
            "Request timed out. Please check your connection and try again.",
          type: "danger",
        });
      } else {
        setModal({
          show: true,
          title: "Error",
          message: "Server unreachable. Please try again later.",
          type: "danger",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () =>
    setModal({ show: false, title: "", message: "", type: "" });

  return (
    <>
      <form ref={form} onSubmit={sendEmail} className="form-head">
        <div>
          <input
            type="text"
            className="form-inputs"
            placeholder="Your name"
            name="from_name"
            value={formData.from_name}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.from_name && <p className="form-error">{errors.from_name}</p>}
        </div>
        <div>
          <input
            type="email"
            className="form-inputs"
            placeholder="Your email"
            name="from_email"
            value={formData.from_email}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.from_email && (
            <p className="form-error">{errors.from_email}</p>
          )}
        </div>
        <div>
          <textarea
            name="message"
            className="form-inputs"
            rows={4}
            placeholder="Your message"
            value={formData.message}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.message && <p className="form-error">{errors.message}</p>}
        </div>

        <button
          type="submit"
          className={`form-btn btn-loading${loading ? " is-loading" : ""}`}
          disabled={loading}
        >
          <span className="btn-loading-label">
            {loading ? "Sending..." : "Send Message"}
          </span>
          <span className="btn-spinner" aria-hidden="true" />
        </button>
      </form>

      <Modal show={modal.show} onHide={closeModal} centered>
        <Modal.Header closeButton className="contact-modal-header">
          <Modal.Title className="contact-modal-title">
            {modal.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="contact-modal-body">{modal.message}</Modal.Body>
        <Modal.Footer className="contact-modal-footer">
          <Button onClick={closeModal} className="contact-modal-close-btn">
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Contact;
