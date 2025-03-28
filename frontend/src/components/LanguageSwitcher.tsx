import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
	const { i18n, t } = useTranslation();

	return (
		<div className="flex gap-2 text-sm">
			{["vi", "en", "fr"].map((lng) => (
				<button
					key={lng}
					onClick={() => i18n.changeLanguage(lng)}
					className={`px-2 py-1 rounded transition font-medium ${
						i18n.language === lng
							? "bg-white text-blue-600"
							: "bg-blue-300 text-white hover:bg-blue-400"
					}`}
				>
					{t(`language.${lng}`)}
				</button>
			))}
		</div>
	);
};

export default LanguageSwitcher;
