import { getCardByName } from "@/api/knowledge"
import { CardDetail } from "@/types/knowledge"
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"
import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useParams, useNavigate } from "react-router-dom"

const Collapsible = CollapsiblePrimitive.Root

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger

const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
const CardDetailPage: React.FC = () => {
    const { i18n } = useTranslation();
    const { card_name } = useParams<{ card_name: string; }>();
    const navigate = useNavigate();
    const [card, setCard] = useState<CardDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    type Lang = 'ru' | 'ky';
    const getValidLanguage = (lng: string): Lang => lng === 'ru' || lng === 'ky' ? lng : 'ru';

    const lang: Lang = getValidLanguage(i18n.language);

    // Полные метки для перевода всех полей
    const labels = {
        ru: {
            currency: 'Валюта',
            validity: 'Срок действия',
            issuance: 'Выдача',
            annualFee: 'Годовая плата',
            annualFeePayrollFirstYear: 'Годовая плата (1-й год зарплатный)',
            annualFeePayrollNextYears: 'Годовая плата (следующие годы)',
            payrollLimit: 'Лимит по зарплате',
            collateral: 'Залог',
            interestRateAtmCash: 'Ставка ATM/Cash',
            interestRatePos: 'Ставка POS',
            gracePeriod: 'Льготный период',
            additionalCard: 'Дополнительная карта',
            description: 'Описание',
            loading: 'Загрузка карты...',
            error: 'Ошибка при загрузке карты',
            backToList: 'Назад к списку',
            cardNotFound: 'Карта не найдена'
        },
        ky: {
            currency: 'Валюта',
            validity: 'Жарактуулук мөөнөтү',
            issuance: 'Чыгаруу',
            annualFee: 'Жылдык төлөм',
            annualFeePayrollFirstYear: 'Жылдык төлөм (1-чи жыл айлык)',
            annualFeePayrollNextYears: 'Жылдык төлөм (кийинки жылдар)',
            payrollLimit: 'Айлык лимити',
            collateral: 'Күрөө',
            interestRateAtmCash: 'ATM/Cash ставкасы',
            interestRatePos: 'POS ставкасы',
            gracePeriod: 'Арзандатылган мөөнөт',
            additionalCard: 'Кошумча карта',
            description: 'Сүрөттөмө',
            loading: 'Карта жүктөлүүдө...',
            error: 'Картаны жүктөөдө ката кетти',
            backToList: 'Тизмеге кайтуу',
            cardNotFound: 'Карта табылган жок'
        },
    };

    useEffect(() => {
        const fetchCard = async () => {
            if (!card_name) {
                setError(labels[lang].cardNotFound);
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const decodedName = decodeURIComponent(card_name);
                const data = await getCardByName(lang, decodedName);
                if (data) {
                    setCard(data);
                } else {
                    setError(labels[lang].cardNotFound);
                }
            } catch (err) {
                console.error('Error fetching card:', err);
                setError(labels[lang].error);
            } finally {
                setLoading(false);
            }
        };

        fetchCard();
    }, [card_name, lang]);

    const l = labels[lang];

    if (loading) {
        return (
            <div className="p-6 max-w-4xl mx-auto">
                <p className="text-center text-gray-600">{l.loading}</p>
            </div>
        );
    }

    if (error || !card) {
        return (
            <div className="p-6 max-w-4xl mx-auto">
                <button
                    onClick={() => navigate('/cards')}
                    className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                    ← {l.backToList}
                </button>
                <p className="text-center text-red-500">{error || l.error}</p>
            </div>
        );
    }

    // Данные для отображения в организованном порядке
    // Функция для определения градиента карты
    const getCardGradient = (cardName: string, cardKey: string) => {
        const searchText = `${cardName} ${cardKey}`.toLowerCase();
        if (searchText.includes('visa')) return 'bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500';
        if (searchText.includes('mastercard')) return 'bg-gradient-to-br from-red-900 via-orange-700 to-yellow-600';
        if (searchText.includes('virtual')) return 'bg-gradient-to-br from-gray-800 via-gray-600 to-gray-500';
        if (searchText.includes('elkart')) return 'bg-gradient-to-br from-green-900 via-green-700 to-green-500';
        return 'bg-gradient-to-br from-purple-900 via-pink-700 to-indigo-600';
    };

    const cardFields = [
        { label: l.currency, value: card.currency.join(', ') },
        { label: l.validity, value: card.validity },
        { label: l.issuance, value: card.issuance },
        { label: l.annualFee, value: card.annual_fee },
        { label: l.annualFeePayrollFirstYear, value: card.annual_fee_payroll_first_year },
        { label: l.annualFeePayrollNextYears, value: card.annual_fee_payroll_next_years },
        { label: l.payrollLimit, value: card.payroll_limit },
        { label: l.collateral, value: card.collateral },
        { label: l.interestRateAtmCash, value: card.interest_rate_atm_cash },
        { label: l.interestRatePos, value: card.interest_rate_pos },
        { label: l.gracePeriod, value: card.grace_period },
        { label: l.additionalCard, value: card.additional_card },
    ];

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            {/* Кнопка назад */}
            <button
                onClick={() => navigate('/cards')}
                className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >
                ← {l.backToList}
            </button>

            {/* Карта с градиентом */}
            <div className={`${getCardGradient(card.name, card_name || '')} rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden`}>
                {/* Декоративные элементы */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-white bg-opacity-5 rounded-full translate-y-10 -translate-x-10"></div>

                <div className="relative z-10">
                    <h1 className="text-4xl font-bold mb-2">{card.name}</h1>
                    <p className="text-xl opacity-90">{card_name}</p>
                    <div className="mt-4 flex items-center space-x-4">
                        {card.currency.map((curr, index) => (
                            <span key={index} className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-medium">
                                {curr}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Основная информация */}
            <div className="bg-white shadow-xl rounded-2xl p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cardFields.map((field, index) => field.value && (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                            <dt className="font-semibold text-gray-600 text-sm uppercase tracking-wide">
                                {field.label}
                            </dt>
                            <dd className="mt-1 text-gray-900 font-medium">{field.value}</dd>
                        </div>
                    )
                    )}
                </div>
            </div>

            {/* Описание */}
            {card.descr && (
                <div className="bg-white shadow-xl rounded-2xl p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">{l.description}</h2>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-l-4 border-blue-500">
                        <p className="text-gray-700 leading-relaxed">{card.descr}</p>
                    </div>
                </div>
            )}
        </div>
    );
};
export default CardDetailPage;
