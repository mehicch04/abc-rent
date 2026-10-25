"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Send, MessageCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useCompany } from "@/components/company/CompanyProvider";
import { Link } from "@/i18n/navigation";
import { track } from "@/lib/track";

type FormType = "contact" | "business";

const EMPTY = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
  message: "",
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
type Req = "firstName" | "lastName" | "email" | "phone";
const REQ: Req[] = ["firstName", "lastName", "email", "phone"];

export function InquiryForm({ type = "contact" }: { type?: FormType }) {
  const t = useTranslations("Form");
  const tb = useTranslations("Booking");
  const [errors, setErrors] = useState<Partial<Record<Req, string>>>({});
  const company = useCompany();
  const locale = useLocale();
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );
  const [reference, setReference] = useState<string | null>(null);

  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (k in errors) setErrors((x) => ({ ...x, [k]: undefined }));
  };

  const check = (k: Req, v: string) => {
    const x = v.trim();
    if (k === "email") return EMAIL.test(x) ? undefined : tb("errEmail");
    if (k === "phone") return x.replace(/[^\d+]/g, "").length >= 6 ? undefined : tb("errPhone");
    return x.length >= 2 ? undefined : tb("errRequired");
  };

  const waText = encodeURIComponent(
    `${t("waIntro")}\n` +
      `${t("name")}: ${form.firstName} ${form.lastName}\n` +
      `${t("email")}: ${form.email}\n` +
      `${t("phone")}: ${form.phone}` +
      (form.company ? `\n${t("company")}: ${form.company}` : "") +
      (form.message ? `\n\n${form.message}` : ""),
  );
  const waUrl = `https://wa.me/${company.whatsapp}?text=${waText}`;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: Partial<Record<Req, string>> = {};
    for (const k of REQ) next[k] = check(k, form[k]);
    setErrors(next);
    const bad = REQ.find((k) => next[k]);
    if (bad) {
      document.getElementById(bad)?.focus();
      return;
    }
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, type, locale }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        track("generate_lead", { lead_source: "contact_form" });
        setReference(data.reference ?? null);
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center rounded-2xl bg-surface-muted p-8 text-center">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand/10 text-brand">
          <CheckCircle2 className="h-7 w-7" />
        </span>
        <h3 className="mt-4 font-display text-xl font-bold text-foreground">
          {t("successTitle")}
        </h3>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">{t("successText")}</p>
        {reference && (
          <p className="mt-3 text-xs text-muted-foreground">
            {t("reference")}:{" "}
            <span className="font-mono font-medium text-foreground">
              {reference}
            </span>
          </p>
        )}
        <button
          type="button"
          onClick={() => {
            setForm(EMPTY);
            setStatus("idle");
            setReference(null);
          }}
          className="mt-5 text-sm font-medium text-brand transition-colors hover:text-brand-700"
        >
          {t("sendAnother")}
        </button>
      </div>
    );
  }

  const inputCls =
    "w-full min-w-0 rounded-xl border border-border bg-surface aria-[invalid=true]:border-rose-400 aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-rose-500/15 px-4 py-3 text-base text-foreground placeholder:text-muted-foreground/70 outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/30 sm:text-sm";
  const labelCls = "mb-1.5 block text-sm font-medium text-foreground";
  const req = <span className="text-brand">*</span>;

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-2xl bg-surface-muted p-6 sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor="firstName">
            {t("firstName")} {req}
          </label>
          <input
            id="firstName"
            aria-invalid={errors.firstName ? true : undefined}
            aria-describedby={errors.firstName ? "firstName-err" : undefined}
            onBlur={() => form.firstName && setErrors((x) => ({ ...x, firstName: check("firstName", form.firstName) }))}
            required
            value={form.firstName}
            onChange={set("firstName")}
            className={inputCls}
            placeholder={t("firstNamePh")}
          />
          {errors.firstName && (
            <p id="firstName-err" className="mt-1.5 text-xs font-medium text-rose-600">
              {errors.firstName}
            </p>
          )}
        </div>
        <div>
          <label className={labelCls} htmlFor="lastName">
            {t("lastName")} {req}
          </label>
          <input
            id="lastName"
            aria-invalid={errors.lastName ? true : undefined}
            aria-describedby={errors.lastName ? "lastName-err" : undefined}
            onBlur={() => form.lastName && setErrors((x) => ({ ...x, lastName: check("lastName", form.lastName) }))}
            required
            value={form.lastName}
            onChange={set("lastName")}
            className={inputCls}
            placeholder={t("lastNamePh")}
          />
          {errors.lastName && (
            <p id="lastName-err" className="mt-1.5 text-xs font-medium text-rose-600">
              {errors.lastName}
            </p>
          )}
        </div>
        <div>
          <label className={labelCls} htmlFor="email">
            {t("email")} {req}
          </label>
          <input
            id="email"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "email-err" : undefined}
            onBlur={() => form.email && setErrors((x) => ({ ...x, email: check("email", form.email) }))}
            type="email"
            required
            value={form.email}
            onChange={set("email")}
            className={inputCls}
            placeholder={t("emailPh")}
          />
          {errors.email && (
            <p id="email-err" className="mt-1.5 text-xs font-medium text-rose-600">
              {errors.email}
            </p>
          )}
        </div>
        <div>
          <label className={labelCls} htmlFor="phone">
            {t("phone")} {req}
          </label>
          <input
            id="phone"
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={errors.phone ? "phone-err" : undefined}
            onBlur={() => form.phone && setErrors((x) => ({ ...x, phone: check("phone", form.phone) }))}
            type="tel"
            required
            value={form.phone}
            onChange={set("phone")}
            className={inputCls}
            placeholder={t("phonePh")}
          />
          {errors.phone && (
            <p id="phone-err" className="mt-1.5 text-xs font-medium text-rose-600">
              {errors.phone}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4">
        <label className={labelCls} htmlFor="company">
          {t("company")}{" "}
          <span className="font-normal text-muted-foreground">({t("optional")})</span>
        </label>
        <input
          id="company"
          value={form.company}
          onChange={set("company")}
          className={inputCls}
          placeholder={t("companyPh")}
        />
      </div>

      <div className="mt-4">
        <label className={labelCls} htmlFor="message">
          {t("message")}{" "}
          <span className="font-normal text-muted-foreground">({t("optional")})</span>
        </label>
        <textarea
          id="message"
          rows={4}
          value={form.message}
          onChange={set("message")}
          className={`${inputCls} resize-y`}
          placeholder={t("messagePh")}
        />
      </div>

      {status === "error" && (
        <p className="mt-4 rounded-xl bg-brand/10 px-4 py-3 text-sm text-brand">
          {t("errorText")}
        </p>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === "submitting" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          {status === "submitting" ? t("sending") : t("submit")}
        </button>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-surface px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:border-brand hover:text-brand"
        >
          <MessageCircle className="h-4 w-4" />
          {t("whatsapp")}
        </a>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        {t.rich("privacy", {
          link: (c) => (
            <Link href="/privatnost" className="font-medium text-foreground underline underline-offset-2">
              {c}
            </Link>
          ),
        })}
      </p>
    </form>
  );
}
