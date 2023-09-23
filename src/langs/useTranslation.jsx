import { useCallback, useContext } from 'react';
import { LanguageContext } from './LanguageContext';

export const useTranslation = (f) => {
    const { dictionary } = useContext(LanguageContext);

    const t = useCallback(
        (text) => {
            return dictionary && dictionary[f]
                ? text?.split('.')?.reduce((o, i) => o && o[i], dictionary[f]) || text
                : text;
        },
        [dictionary, f]
    );

    return { t };
};
