import { cookies } from "next/headers";
import { getTranslation, Language } from "./translations";

export async function getI18n() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("NEXT_LOCALE")?.value as Language) || "th";
  return {
    t: getTranslation(lang),
    lang
  };
}
