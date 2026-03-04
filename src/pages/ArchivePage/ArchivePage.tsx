import { useI18n } from '../../i18n/I18nContext';
import ArtifactCard from '../../components/ArtifactCard/ArtifactCard';
import { sampleArtifacts } from '../../data/sampleArtifacts';
import './ArchivePage.css';

export default function ArchivePage() {
    const { t } = useI18n();

    return (
        <div className="archive-page">
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
