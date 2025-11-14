import React from "react";

export default function FAQ() {
  const faqs = [
    {
      question: "Can I change plans later?",
      answer:
        "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards, PayPal, and various local payment methods.",
    },
    {
      question: "Is there a free trial for paid plans?",
      answer:
        "Yes! All paid plans come with a 14-day free trial. No credit card required.",
    },
    {
      question: "Can I cancel anytime?",
      answer:
        "Absolutely. You can cancel your subscription at any time with no penalties or fees.",
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-start py-16 px-4">
      <h1 className="text-3xl font-semibold mb-10">
        Frequently Asked Questions
      </h1>
      <div className="w-full max-w-2xl space-y-6">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="bg-white border rounded-xl px-6 py-5 shadow-sm"
          >
            <div className="text-lg font-medium mb-1">{faq.question}</div>
            <div className="text-gray-600">{faq.answer}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
