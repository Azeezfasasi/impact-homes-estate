export default function CallToAction() {
  return (
    <section className="relative bg-impact-gold text-white py-16 overflow-hidden">
      {/* Decorative Overlay */}
      <div className="absolute inset-0 bg-impact-gold/80"></div>

      <div className="relative container mx-auto px-6 lg:px-20 text-center">
        {/* Headline */}
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Ready to invest in a Project?
        </h2>

        {/* Description */}
        <p className="text-gray-100 max-w-2xl mx-auto mb-8">
          Let our investment advisors guide you on your journey to a profitable real estate investment.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="/schedule-inspection"
            className="bg-white text-impact-gold font-semibold px-8 py-3 rounded-lg shadow hover:bg-gray-100 transition"
          >
            Schedule an Inspection
          </a>
          <a
            href="/contact"
            className="border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white hover:text-impact-gold transition"
          >
            Contact Us
          </a>
        </div>
      </div>
    </section>
  );
}
