import { useTranslation } from 'react-i18next';

export const NotFoundPage = () => {
    const { t } = useTranslation();
    return (
        <div className="text-center">
          <img alt={t('notFound.alt')} src="/assets/i.svg"/>
          <h1 className="h4 text-muted">{t('notFound.alt')}</h1>
          <p className="text-muted">{t('notFound.descriptionLink')} <a href="/">{t('notFound.descriptionLink1')}</a></p>
        </div>
    )
}
