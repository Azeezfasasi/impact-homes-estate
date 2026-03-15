"use client";
import { useState } from "react";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Clock } from "lucide-react";

export default function ContactUsMain() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMessage("Thank you! Your message has been submitted.");
        setFormData({ name: "", email: "", subject: "", message: "" });
        // Clear success message after 5 seconds
        setTimeout(() => setSuccessMessage(""), 5000);
      } else {
        alert(data.message || "Failed to submit message.");
      }
    } catch (error) {
      alert("Failed to submit message.");
      console.error("Contact form error:", error);
    }
  };

  return (
    <section className="bg-gray-50 py-16" id="contact">
      <div className="container mx-auto px-6 lg:px-20">

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-md">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Send Us a Message</h2>
              {successMessage && (
                <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg animate-pulse">
                  ✓ {successMessage}
                </div>
              )}
              <div className="grid gap-6">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  required
                  className="w-full border border-impact-gold/70 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-impact-gold"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  required
                  className="w-full border border-impact-gold/70 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-impact-gold"
                />
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Subject"
                  className="w-full border border-impact-gold/70 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-impact-gold"
                />
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Your Message"
                  className="w-full border border-impact-gold/70 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-impact-gold"
                  required
                ></textarea>
                <button
                  type="submit"
                  className="bg-impact-gold text-white font-semibold px-8 py-3 rounded-lg shadow hover:bg-impact-gold/90 transition cursor-pointer"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            {/* Location / Map */}
            <div className="rounded-xl overflow-hidden shadow-md h-64 relative">
              <iframe
                title="Impact Homes Real Estate Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126082.48526558305!2d7.381730600139293!3d9.056680570472743!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104e0bdfc429d4fd%3A0x52acabc43f1ea57d!2sFederal%20Housing%20Authourity!5e0!3m2!1sen!2sie!4v1773322658259!5m2!1sen!2sie"
                className="w-full h-full border-0"
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>

            {/* Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="text-impact-gold w-[60px] md:w-[40px]" />
                <p>
                  Flat I, House 8, Wing 2 Federal housing Authority Guzape, Abuja.</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-impact-gold" />
                <a href="tel:+2347040999508" className="hover:text-impact-gold transition">
                  (+234) 0704 099 9508,
                </a>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M6.014 8.00613C6.12827 7.1024 7.30277 5.87414 8.23488 6.01043L8.23339 6.00894C9.14051 6.18132 9.85859 7.74261 10.2635 8.44465C10.5504 8.95402 10.3641 9.4701 10.0965 9.68787C9.7355 9.97883 9.17099 10.3803 9.28943 10.7834C9.5 11.5 12 14 13.2296 14.7107C13.695 14.9797 14.0325 14.2702 14.3207 13.9067C14.5301 13.6271 15.0466 13.46 15.5548 13.736C16.3138 14.178 17.0288 14.6917 17.69 15.27C18.0202 15.546 18.0977 15.9539 17.8689 16.385C17.4659 17.1443 16.3003 18.1456 15.4542 17.9421C13.9764 17.5868 8 15.27 6.08033 8.55801C5.97237 8.24048 5.99955 8.12044 6.014 8.00613Z" fill="#B59C5B"></path> <path fillRule="evenodd" clipRule="evenodd" d="M12 23C10.7764 23 10.0994 22.8687 9 22.5L6.89443 23.5528C5.56462 24.2177 4 23.2507 4 21.7639V19.5C1.84655 17.492 1 15.1767 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23ZM6 18.6303L5.36395 18.0372C3.69087 16.4772 3 14.7331 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C11.0143 21 10.552 20.911 9.63595 20.6038L8.84847 20.3397L6 21.7639V18.6303Z" fill="#B59C5B"></path> </g></svg>
                <a href="https://wa.me/07040999508" className="hover:text-impact-gold transition">
                  (+234) 0704 099 9508
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="text-impact-gold" />
                <a href="mailto:info@impacthome.ng" className="hover:text-impact-gold transition">
                  info@impacthome.ng
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="text-impact-gold" />
                <p>Mon - Fri: 9:00 AM - 5:00 PM</p>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 mt-4">
              <a href="https://facebook.com" target="_blank" className="hover:text-impact-gold transition">
                <Facebook size={24} />
              </a>
              <a href="https://linkedin.com" target="_blank" className="hover:text-impact-gold transition">
                <Linkedin size={24} />
              </a>
              <a href="https://instagram.com" target="_blank" className="hover:text-impact-gold transition">
                <Instagram size={24} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
