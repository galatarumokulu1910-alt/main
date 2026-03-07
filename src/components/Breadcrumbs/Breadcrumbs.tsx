import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext';
import './Breadcrumbs.css';

type Lang = 'tr' | 'en' | 'el';

interface BreadcrumbItem {
    label: Record<string, string>;
    to?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

const homeLabel: Record<string, string> = {
    tr: 'Ana Sayfa',
    en: 'Home',
    el: 'Αρχική'
};

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
    const { lang } = useI18n();
    const l = lang as Lang;

    return (
        <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link to="/" className="breadcrumbs__link">{homeLabel[l]}</Link>
            {items.map((item, i) => {
                const isLast = i === items.length - 1;
                return (
                    <span key={i}>
                        <span className="breadcrumbs__sep">/</span>
                        {isLast || !item.to ? (
                            <span className="breadcrumbs__current">{item.label[l]}</span>
                        ) : (
                            <Link to={item.to} className="breadcrumbs__link">{item.label[l]}</Link>
                        )}
                    </span>
                );
            })}
        </nav>
    );
}
