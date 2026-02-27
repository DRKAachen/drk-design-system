'use client'

import { useState } from 'react'
import type { PortableTextBlock } from '@portabletext/react'
import Alert from '../../components/Alert/Alert'
import BlockRenderer from '../../components/BlockRenderer/BlockRenderer'
import Button from '../../components/Button/Button'
import Checkbox from '../../components/Checkbox/Checkbox'
import CookieBanner from '../../components/CookieBanner/CookieBanner'
import CookieSettingsLink from '../../components/CookieBanner/CookieSettingsLink'
import Footer from '../../components/Footer/Footer'
import Header from '../../components/Header/Header'
import Input from '../../components/Input/Input'
import Label from '../../components/Label/Label'
import LegalPage from '../../components/LegalPage/LegalPage'
import Modal from '../../components/Modal/Modal'
import Navigation from '../../components/Navigation/Navigation'
import Radio from '../../components/Radio/Radio'
import Select from '../../components/Select/Select'
import Spinner from '../../components/Spinner/Spinner'
import Textarea from '../../components/Textarea/Textarea'
import type { SiteConfig } from '../../lib/site'
import styles from './showcase.module.scss'

const demoSite: SiteConfig = {
  _id: 'showcase-site',
  name: 'DRK Showcase',
  hostname: 'showcase.local',
  defaultLocale: 'de',
  navigation: [
    { label: 'Start', href: '/' },
    {
      label: 'Leistungen',
      href: '/leistungen',
      children: [
        { label: 'Rettungsdienst', href: '/leistungen/rettungsdienst' },
        { label: 'Blutspende', href: '/leistungen/blutspende' },
      ],
    },
    { label: 'Kontakt', href: '/kontakt' },
  ],
  footerLinks: [
    { label: 'Presse', href: '/presse' },
    { label: 'Spenden', href: '/spenden' },
  ],
}

const legalContent: PortableTextBlock[] = [
  {
    _type: 'block',
    style: 'normal',
    _key: 'a1',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'a1-1',
        text: 'Dies ist ein Beispieltext fuer die Darstellung von Rechtsseiten mit Portable Text.',
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    style: 'h2',
    _key: 'a2',
    markDefs: [],
    children: [{ _type: 'span', _key: 'a2-1', text: 'Verantwortlichkeit', marks: [] }],
  },
  {
    _type: 'block',
    style: 'normal',
    _key: 'a3',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'a3-1',
        text: 'Diese Komponente rendert strukturierte Rechtsinhalte aus Sanity.',
        marks: [],
      },
    ],
  },
]

export default function ShowcaseClient() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [radioValue, setRadioValue] = useState('email')

  return (
    <>
      <a href="#showcase-main" className="skip-link">
        Zum Inhalt springen
      </a>

      <Header site={demoSite} />

      <main id="showcase-main" className={`main ${styles.main}`}>
        <div className="container">
          <section className={styles.hero}>
            <h1>DRK Design System Showcase</h1>
            <p>
              Diese Seite demonstriert alle zentralen Komponenten aus{' '}
              <code>@drkaachen/design-system</code> inkl. kurzer Beschreibung und Live-Rendering.
            </p>
          </section>

          <Section title="Navigation" description="Hauptnavigation fuer Desktop und Mobile Menues.">
            <Navigation site={demoSite} />
          </Section>

          <Section
            title="Button"
            description="Primäre, sekundäre und Outline-Varianten inkl. Link-Rendering."
          >
            <div className={styles.row}>
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
            </div>
          </Section>

          <Section
            title="Form: Label, Input, Textarea, Select, Checkbox, Radio"
            description="Zugaengliche Form-Bausteine mit Fehler- und Hinweisdarstellung."
          >
            <div className={styles.formGrid}>
              <div>
                <Label htmlFor="name" required hint="Bitte Vor- und Nachnamen eingeben.">
                  Name
                </Label>
                <Input id="name" placeholder="Max Mustermann" />
              </div>
              <div>
                <Label htmlFor="email">E-Mail</Label>
                <Input id="email" type="email" placeholder="max@example.org" />
              </div>
              <div className={styles.fullWidth}>
                <Label htmlFor="message">Nachricht</Label>
                <Textarea id="message" placeholder="Ihre Nachricht..." />
              </div>
              <div>
                <Label htmlFor="topic">Thema</Label>
                <Select
                  id="topic"
                  placeholder="Bitte waehlen"
                  options={[
                    { value: 'hilfe', label: 'Hilfeleistung' },
                    { value: 'kurs', label: 'Kursangebot' },
                    { value: 'sonstiges', label: 'Sonstiges' },
                  ]}
                  defaultValue=""
                />
              </div>
              <div className={styles.fullWidth}>
                <Checkbox id="consent" label="Ich akzeptiere die Datenschutzbedingungen." />
              </div>
              <div className={styles.fullWidth}>
                <Radio
                  name="contact"
                  value={radioValue}
                  onChange={(event) => setRadioValue(event.target.value)}
                  options={[
                    { value: 'email', label: 'Kontakt per E-Mail' },
                    { value: 'phone', label: 'Kontakt per Telefon' },
                  ]}
                />
              </div>
            </div>
          </Section>

          <Section
            title="Feedback: Alert und Spinner"
            description="Status- und Fehlermeldungen sowie Ladeindikator."
          >
            <div className={styles.stack}>
              <Alert variant="success" title="Erfolg">
                Ihre Anfrage wurde erfolgreich gespeichert.
              </Alert>
              <Alert variant="error" title="Fehler">
                Bitte pruefen Sie Ihre Eingaben.
              </Alert>
              <div className={styles.row}>
                <Spinner size="sm" aria-label="Laden klein" />
                <Spinner size="md" aria-label="Laden mittel" />
                <Spinner size="lg" aria-label="Laden gross" />
              </div>
            </div>
          </Section>

          <Section title="Modal" description="Dialog fuer fokussierte Interaktionen mit Escape/Backdrop-Close.">
            <Button onClick={() => setIsModalOpen(true)}>Modal oeffnen</Button>
            <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title="Beispiel-Modal">
              <p>Dies ist ein Beispielinhalt im Modal.</p>
              <div className={styles.row}>
                <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                  Schliessen
                </Button>
              </div>
            </Modal>
          </Section>

          <Section
            title="BlockRenderer"
            description="Rendert CMS-Bloecke (Hero, Text+Bild, CTA, FAQ) mit den Standard-Styles."
          >
            <div className={styles.stack}>
              <BlockRenderer
                block={{
                  _type: 'heroBlock',
                  heading: 'Willkommen beim DRK Showcase',
                  subheading: 'Komponenten koennen aus Sanity-Inhalten gespeist werden.',
                  ctaText: 'Mehr erfahren',
                  ctaLink: '/leistungen',
                }}
              />
              <BlockRenderer
                block={{
                  _type: 'textImageBlock',
                  heading: 'Text und Bild',
                  text: '<p>Dieser Bereich zeigt, wie Rich-Text sicher dargestellt wird.</p>',
                  imagePosition: 'right',
                }}
              />
              <BlockRenderer
                block={{
                  _type: 'ctaSection',
                  heading: 'Jetzt mitmachen',
                  text: 'Unterstuetzen Sie unsere lokale Arbeit mit einer Spende.',
                  ctaText: 'Jetzt spenden',
                  ctaLink: 'https://www.drk.de',
                }}
              />
              <BlockRenderer
                block={{
                  _type: 'faqBlock',
                  heading: 'Haeufige Fragen',
                  items: [
                    {
                      question: 'Wie schnell kann ich starten?',
                      answer: '<p>Direkt nach Installation und Konfiguration.</p>',
                    },
                    {
                      question: 'Ist das DSGVO-konform nutzbar?',
                      answer:
                        '<p>Ja, mit lokaler Font-Einbindung, Consent-Steuerung und sauberer Dokumentation.</p>',
                    },
                  ],
                }}
              />
            </div>
          </Section>

          <Section
            title="LegalPage"
            description="Strukturierte Rechtsinhalte (Impressum, Datenschutz, AGB) aus Portable Text."
          >
            <LegalPage
              title="Datenschutz (Beispiel)"
              content={legalContent}
              lastUpdated={new Date().toISOString()}
            />
          </Section>

          <Section
            title="CookieBanner und CookieSettingsLink"
            description="Consent-Banner mit Auswahlmoeglichkeiten und spaeterem Opt-in/Opt-out."
          >
            <div className={styles.row}>
              <CookieSettingsLink />
            </div>
            <CookieBanner />
          </Section>
        </div>
      </main>

      <Footer site={demoSite} />
    </>
  )
}

function Section({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section className={styles.section}>
      <header className={styles.sectionHeader}>
        <h2>{title}</h2>
        <p>{description}</p>
      </header>
      <div className={styles.sectionBody}>{children}</div>
    </section>
  )
}
