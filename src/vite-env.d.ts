/// <reference types="vite/client" />

import {EthereumProvider} from "ganache";

interface Window {
  // pick one
  ethereum: EthereumProvider;
  // ethereum: ExternalProvider
  // ethereum: AbstractProvider
}

interface ImportMetaEnv {
  // ─── Logo / Branding ───────────────────────────────────────
  readonly VITE_LOGO_DEV_PUBLIC_KEY?: string;
  readonly VITE_LOGO_DEV_BASE_URL?: string;

  // ─── API Endpoints ─────────────────────────────────────────
  readonly VITE_SERVER_URL_TESTNET?: string;
  readonly VITE_SERVER_URL_MAINNET?: string;

  // ─── Feature Flags ─────────────────────────────────────────
  /** '1' = test/dev mode (enables debug logging); '0' = production */
  readonly VITE_TEST_MODE?: string;
  /** '1' = show ads; '0' = hide ads */
  readonly VITE_DISPLAY_ADS?: string;

  // ─── Support ───────────────────────────────────────────────
  /** E.164 phone number for WhatsApp support, e.g. +447494000000 */
  readonly VITE_PHONE_SUPPORT?: string;

  // ─── Google OAuth ──────────────────────────────────────────
  readonly VITE_GOOGLE_CLIENT_ID?: string;

  // ─── Zoho CRM — Web-to-Contact form tokens ─────────────────
  /** xnQsjsdp form auth token (from Zoho CRM → Web Forms) */
  readonly VITE_ZOHO_FORM_TOKEN_1?: string;
  /** xmIwtLD form auth token (from Zoho CRM → Web Forms) */
  readonly VITE_ZOHO_FORM_TOKEN_2?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
