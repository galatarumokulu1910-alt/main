import { useI18n } from '../../i18n/I18nContext';
import ArtifactCard from '../../components/ArtifactCard/ArtifactCard';
import { sampleArtifacts } from '../../data/sampleArtifacts';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import SEO from '../../components/SEO/SEO';
import './ArchivePage.css';

export default function ArchivePage() {
    const { t } = useI18n();

    return (
        <div className="archive-page" style={{ position: 'relative' }}>
            <SEO 
                titleKey="archive.title"
                descriptionKey="archive.subtitle"
                aiSchema={{
                    "@context": "https://schema.org",
                    "@type": "CollectionPage",
                    "name": t('archive.title'),
                    "description": t('archive.subtitle'),
                    "about": "Galata Greek School historical archive, artifacts, and documents.",
                    "inLanguage": ["tr", "en", "el"]
                }}
            />
            <Breadcrumbs items={[{ label: { tr: 'Arşiv', en: 'Archive', el: 'Αρχείο' } }]} />
            {/* ── Hero ── */}
            <header className="archive-hero">
                <div className="archive-hero__badge">{t('hero.badge')}</div>
                <h1 className="archive-hero__title">{t('archive.title')}</h1>
                <p className="archive-hero__subtitle">{t('archive.subtitle')}</p>
                <hr className="gold-divider" style={{ margin: '0 auto' }} />
            </header>

            {/* ── Artifact Masonry Grid ── */}
            <main className="artifact-grid-section">
                <div className="artifact-grid-header">
                    <h2>{t('archive.collection')}</h2>
                </div>
                <div className="artifact-grid">
                    {sampleArtifacts.map(artifact => (
                        <ArtifactCard
                            key={artifact.id}
                            artifact={artifact}
                            allArtifacts={sampleArtifacts}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
}
