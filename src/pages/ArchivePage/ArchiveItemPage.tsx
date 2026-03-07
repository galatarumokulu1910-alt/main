import { useParams, Link } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext';
import { sampleArtifacts } from '../../data/sampleArtifacts';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import './ArchiveItemPage.css';

type Lang = 'tr' | 'en' | 'el';

const uiLabels = {
    tr: {
        back: '← Koleksiyona Dön',
        inquire: 'İnceleme Talebi',
        download: 'Raporu İndir',
        source: 'Kaynak',
        collectionNo: 'Koleksiyon No.',
        date: 'Tarih',
        notFound: 'Eser bulunamadı',
        backToArchive: 'Arşive Dön',
    },
    en: {
        back: '← Back to Collection',
        inquire: 'Inquire for Study',
        download: 'Download Report',
        source: 'Source',
        collectionNo: 'Collection No.',
        date: 'Date',
        notFound: 'Artifact not found',
        backToArchive: 'Back to Archive',
    },
    el: {
        back: '← Πίσω στη Συλλογή',
        inquire: 'Αίτημα Μελέτης',
        download: 'Λήψη Αναφοράς',
        source: 'Πηγή',
        collectionNo: 'Αρ. Συλλογής',
        date: 'Ημερομηνία',
        notFound: 'Δεν βρέθηκε τεκμήριο',
        backToArchive: 'Πίσω στο Αρχείο',
    },
};

export default function ArchiveItemPage() {
    const { id } = useParams<{ id: string }>();
    const { lang } = useI18n();
    const l = (lang as Lang) || 'en';
    const ui = uiLabels[l] || uiLabels.en;

    const artifact = sampleArtifacts.find(a => a.id === id);

    if (!artifact) {
        return (
            <div className="archive-item" style={{ position: 'relative' }}>
                <Breadcrumbs items={[
                    { label: { tr: 'Arşiv', en: 'Archive', el: 'Αρχείο' }, to: '/archive' },
                    { label: { tr: 'Bulunamadı', en: 'Not Found', el: 'Δεν Βρέθηκε' } },
                ]} />
                <div style={{ textAlign: 'center', padding: '200px 20px' }}>
                    <h1>{ui.notFound}</h1>
                    <Link to="/archive/collection" style={{ marginTop: '20px', display: 'inline-block' }}>{ui.backToArchive}</Link>
                </div>
            </div>
        );
    }

    const title = l === 'tr' ? (artifact.titleTr || artifact.title) : l === 'el' ? (artifact.titleEl || artifact.title) : artifact.title;
    const desc = l === 'tr' ? (artifact.descriptionTr || artifact.description) : l === 'el' ? (artifact.descriptionEl || artifact.description) : artifact.description;
    const provenance = (l === 'tr' ? (artifact.provenanceTr || artifact.provenance) : l === 'el' ? (artifact.provenanceEl || artifact.provenance) : artifact.provenance) || '';

    // Extract collection number from provenance
    const collectionMatch = provenance.match(/(?:No\.|Catalog|Κατάλογος|Αρ\.|Koleksiyon No\.)\s*([\w-]+)/i);
    const collectionNo = collectionMatch ? collectionMatch[1] : artifact.id.toUpperCase();

    return (
        <div className="archive-item" style={{ position: 'relative' }}>
            <Breadcrumbs items={[
                { label: { tr: 'Arşiv', en: 'Archive', el: 'Αρχείο' }, to: '/archive' },
                { label: { tr: 'Koleksiyon', en: 'Collection', el: 'Συλλογή' }, to: '/archive/collection' },
                { label: { tr: title, en: title, el: title } },
            ]} />

            {/* Back link */}
            <Link to="/archive/collection" className="archive-item__back">{ui.back}</Link>

            {/* Hero Image */}
            <section className="archive-item__hero">
                <div className="archive-item__hero-frame">
                    <img
                        className="archive-item__hero-img"
                        src={artifact.imageSrc}
                        alt={title}
                    />

                    {/* Controls */}
                    <div className="archive-item__controls">
                        <button className="archive-item__control-btn" title="Zoom">🔍</button>
                        <button className="archive-item__control-btn" title="Rotate">🔄</button>
                        <button className="archive-item__control-btn" title="Fullscreen">⛶</button>
                    </div>

                    {/* Navigation */}
                    <button className="archive-item__nav-arrow archive-item__nav-arrow--left">◀</button>
                    <button className="archive-item__nav-arrow archive-item__nav-arrow--right">▶</button>
                </div>
            </section>

            {/* Content */}
            <section className="archive-item__content">
                <span className="archive-item__category-tag">{artifact.category} • {collectionNo}</span>
                <h1 className="archive-item__title">{title}</h1>
                <div className="archive-item__description">
                    <p>{desc}</p>
                </div>
                <div className="archive-item__actions">
                    <button className="archive-item__btn archive-item__btn--primary">{ui.inquire}</button>
                    <button className="archive-item__btn archive-item__btn--secondary">{ui.download}</button>
                </div>
            </section>

            {/* KÜNYE Metadata Footer */}
            <footer className="archive-item__kunye">
                <div className="archive-item__kunye-inner">
                    <div className="archive-item__kunye-field">
                        <span className="archive-item__kunye-label">{ui.source}</span>
                        <p className="archive-item__kunye-value">{provenance.split(',')[0]}</p>
                    </div>
                    <div className="archive-item__kunye-field">
                        <span className="archive-item__kunye-label">{ui.collectionNo}</span>
                        <p className="archive-item__kunye-value">{collectionNo}</p>
                    </div>
                    <div className="archive-item__kunye-field">
                        <span className="archive-item__kunye-label">{ui.date}</span>
                        <p className="archive-item__kunye-value">{artifact.date}</p>
                    </div>
                    <div className="archive-item__kunye-brand">
                        <span className="archive-item__kunye-logo">KÜNYE</span>
                        <div className="archive-item__kunye-dots">
                            <span className="archive-item__kunye-dot" />
                            <span className="archive-item__kunye-dot archive-item__kunye-dot--dim" />
                            <span className="archive-item__kunye-dot archive-item__kunye-dot--dim" />
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
