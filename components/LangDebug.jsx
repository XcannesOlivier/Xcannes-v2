import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";

export default function LangDebug() {
  const { t, i18n } = useTranslation("common");
  const router = useRouter();

  return (
    <div className="bg-black text-white p-4 rounded shadow-lg my-8 max-w-xl mx-auto">
      <h2 className="text-lg font-bold text-xrdoge-green mb-2">LangDebug</h2>
      <p>🌐 Langue active (router) : {router.locale}</p>
      <p>🌍 Langue active (i18n) : {i18n.language}</p>
      <p>🔤 Traduction : {t("home_title")}</p>
    </div>
  );
}
