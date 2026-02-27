'use client'

import { useState } from 'react'
import Alert from '../../components/Alert/Alert'
import Button from '../../components/Button/Button'
import Checkbox from '../../components/Checkbox/Checkbox'
import CookieBanner from '../../components/CookieBanner/CookieBanner'
import CookieSettingsLink from '../../components/CookieBanner/CookieSettingsLink'
import Footer from '../../components/Footer/Footer'
import Header from '../../components/Header/Header'
import Input from '../../components/Input/Input'
import Label from '../../components/Label/Label'
import Modal from '../../components/Modal/Modal'
import Navigation from '../../components/Navigation/Navigation'
import Radio from '../../components/Radio/Radio'
import Select from '../../components/Select/Select'
import Spinner from '../../components/Spinner/Spinner'
import Textarea from '../../components/Textarea/Textarea'
import type { SiteConfig } from '../../lib/site-config'
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
              <code>@drkaachen/design-system-ui</code> inkl. kurzer Beschreibung und Live-Rendering.
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
