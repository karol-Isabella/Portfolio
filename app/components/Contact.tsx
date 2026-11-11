"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { copy, socialLinks } from "../data";
import type { Language } from "../types";
import Icon from "./Icon";
import { Badge } from "./ui";

export default function Contact({ lang }: { lang: Language }) {
  const t = copy[lang];
  const [messageLength, setMessageLength] = useState(0);
  const [sendState, setSendState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [emailFallback, setEmailFallback] = useState("");
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setSendState("sending");
    try {
      const response = await fetch(`https://formsubmit.co/ajax/${socialLinks.email}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form).entries())),
      });
      const result = await response.json() as { success?: boolean | string };
      if (!response.ok || (result.success !== true && result.success !== "true")) throw new Error("Contact form submission failed");
      setSendState("sent");
      setEmailFallback("");
      form.reset();
      setMessageLength(0);
    } catch {
      const fields = new FormData(form);
      const name = String(fields.get("name") ?? "");
      const subject = String(fields.get("subject") ?? "");
      const message = String(fields.get("message") ?? "");
      const body = `${lang === "es" ? "Nombre" : "Name"}: ${name}\n\n${message}`;
      setEmailFallback(`mailto:${socialLinks.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
      setSendState("error");
    }
  };
  return <section className="contact-section section-wrap contact-layout" id="contacto" data-reveal>
    <div className="contact-intro"><Badge tone="dark"><Icon name="mail"/> ✦ {t.contactBadge}</Badge><h2>{t.contactTitle.split("\n").map((line) => <span key={line}>{line}</span>)}</h2><p>{t.contactText}</p>
      <div className="contact-socials" data-reveal-stagger><a data-reveal href={socialLinks.linkedin} target="_blank" rel="noreferrer"><Icon name="linkedin"/><small>LINKEDIN</small><b>Isabella Cabrera</b></a><a data-reveal href={socialLinks.github} target="_blank" rel="noreferrer"><Icon name="github"/><small>GITHUB</small><b>karol-isabella</b></a></div>
    </div>
    <form className="contact-form" onSubmit={handleSubmit}>
      <input type="hidden" name="_subject" value="Nuevo mensaje desde el portafolio de Karol"/><input type="hidden" name="_template" value="table"/>
      <label className="contact-honey" aria-hidden="true">No completar<input type="text" name="_honey" tabIndex={-1} autoComplete="off"/></label>
      <h3>{t.contactFormTitle}</h3>
      <label htmlFor="contact-name"><span><Icon name="user"/>{t.contactName}</span><input id="contact-name" name="name" type="text" autoComplete="name" placeholder={t.contactNamePlaceholder} required maxLength={120}/></label>
      <label htmlFor="contact-subject"><span><Icon name="edit"/>{t.contactSubject}</span><input id="contact-subject" name="subject" type="text" placeholder={t.contactSubjectPlaceholder} required maxLength={160}/></label>
      <label htmlFor="contact-message"><span><Icon name="message"/>{t.contactMessage}<small>{messageLength} / 1000</small></span><textarea id="contact-message" name="message" placeholder={t.contactMessagePlaceholder} required maxLength={1000} onChange={(event) => setMessageLength(event.target.value.length)}/></label>
      <button className="button primary contact-submit" type="submit" disabled={sendState === "sending"}><Icon name="send"/>{sendState === "sending" ? t.contactSending : t.contactSend}</button>
      {sendState !== "idle" && <p className={`contact-form-status ${sendState}`} role="status">{sendState === "sent" ? t.contactSent : sendState === "error" ? <>{t.contactError} <a href={emailFallback}>{t.contactTryEmail}</a></> : t.contactSending}</p>}
    </form>
  </section>;
}
