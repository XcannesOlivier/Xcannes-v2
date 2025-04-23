import { useRouter } from "next/router";

export default function LangueActive() {
  const router = useRouter();

  const labels = {
    fr: "🇫🇷 Français",
    en: "🇬🇧 English",
    es: "🇪🇸 Español",
    ja: "🇯🇵 日本語"
  };

  return (
    <div className="text-center text-sm text-gray-400 mt-8">
      🌍 Langue actuelle : <span className="font-semibold text-xcannes-green">
        {labels[router.locale] || router.locale}
      </span>
    </div>
  );
}
