import { AnimatePresence, motion } from "framer-motion";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  BarChartIcon,
  BookIcon,
  CalendarIcon,
  FileTextIcon,
  HomeIcon,
  LayersIcon,
  SettingsIcon,
} from "../components/Icons";
import { useStudyStore } from "../store/useStudyStore";
import { useLang } from "../lib/useLang";
import type { Language } from "../types";
import styles from "./AppLayout.module.css";

const LANGUAGES: { value: Language; label: string }[] = [
  { value: "zh", label: "中文" },
  { value: "es", label: "Español" },
];

const TAB_DEFS: {
  path: string;
  label: string;
  Icon: (props: { size?: number }) => JSX.Element;
  exact?: boolean;
  matchPrefix?: string;
  zhOnly?: boolean;
}[] = [
  { path: "", label: "Home", exact: true, Icon: HomeIcon },
  { path: "words/1", label: "Words", matchPrefix: "words", Icon: BookIcon },
  { path: "study", label: "Study", matchPrefix: "study", Icon: LayersIcon },
  { path: "plan", label: "Plan", matchPrefix: "plan", Icon: CalendarIcon },
  { path: "reading", label: "Reading", matchPrefix: "reading", Icon: FileTextIcon },
  { path: "stats", label: "Stats", matchPrefix: "stats", Icon: BarChartIcon },
];

export function AppLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const lang = useLang();
  const { updateSettings } = useStudyStore();

  const homePath = `/${lang}`;
  const tabs = TAB_DEFS.filter((tab) => !tab.zhOnly || lang === "zh").map((tab) => ({
    ...tab,
    to: tab.path ? `${homePath}/${tab.path}` : homePath,
    matchPath: tab.matchPrefix ? `${homePath}/${tab.matchPrefix}` : homePath,
  }));

  const isTabActive = (tab: (typeof tabs)[number]) =>
    tab.exact ? pathname === homePath : pathname.startsWith(tab.matchPath);

  const switchLanguage = (next: Language) => {
    if (next === lang) return;
    updateSettings({ language: next });
    navigate(`/${next}`);
  };

  const languageSwitcher = (
    <div className={styles.langSwitch} role="group" aria-label="Language">
      {LANGUAGES.map((l) => (
        <button
          key={l.value}
          type="button"
          className={`${styles.langOption} ${
            l.value === lang ? styles.langOptionActive : ""
          }`}
          aria-pressed={l.value === lang}
          onClick={() => switchLanguage(l.value)}
        >
          {l.label}
        </button>
      ))}
    </div>
  );

  return (
    <div className={styles.shell} data-lang={lang}>
      {/* Mobile-only top bar: title + settings icon. Hidden on desktop, where
          the sidebar carries both. */}
      <header className={styles.header}>
        <Link to={homePath} className={styles.title}>
          Language School
        </Link>
        <div className={styles.headerRight}>
          {languageSwitcher}
          <Link to={`${homePath}/settings`} className={styles.settingsLink} aria-label="Settings">
            <SettingsIcon />
          </Link>
        </div>
      </header>

      <div className={styles.body}>
        {/* Desktop-only left sidebar. Hidden on mobile, which uses the bottom
            tab bar instead. */}
        <nav className={styles.sidebar} aria-label="Primary">
          <Link to={homePath} className={styles.sidebarTitle}>
            Language School
          </Link>
          {languageSwitcher}
          <div className={styles.sidebarLinks}>
            {tabs.map((tab) => (
              <Link
                key={tab.to}
                to={tab.to}
                className={`${styles.sidebarLink} ${
                  isTabActive(tab) ? styles.sidebarLinkActive : ""
                }`}
              >
                <tab.Icon size={22} />
                {tab.label}
              </Link>
            ))}
          </div>
          <Link
            to={`${homePath}/settings`}
            className={`${styles.sidebarLink} ${styles.sidebarSettings} ${
              pathname.startsWith(`${homePath}/settings`) ? styles.sidebarLinkActive : ""
            }`}
          >
            <SettingsIcon size={22} />
            Settings
          </Link>
        </nav>

        <main className={styles.main}>
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile-only bottom tab bar. Hidden on desktop. */}
      <nav className={styles.tabBar} aria-label="Primary">
        {tabs.map((tab) => (
          <Link
            key={tab.to}
            to={tab.to}
            className={`${styles.tab} ${isTabActive(tab) ? styles.active : ""}`}
          >
            <tab.Icon size={20} />
            <span>{tab.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
