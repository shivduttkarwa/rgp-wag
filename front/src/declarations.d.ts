// Swiper CSS module declarations
declare module "swiper/css";
declare module "swiper/css/*";

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
