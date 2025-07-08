import { Request } from "express";
import en from "../locales/en.json";
import sk from "../locales/sk.json";

const locales: Record<string, any> = {
    en,
    sk,
};
export const getLocalizedMessage = (req: Request, key: string) => {
    const lang = (req.headers["language"]?.toString().toLowerCase() || "en") as
        | "en"
        | "sk";

    return locales[lang]?.[key] || locales.en[key] || "";
};