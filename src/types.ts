export interface KwikEmbedConfig {
  label?: string;
  expires?: string; // e.g., "24h", "7d", "30d"
  maxDownloads?: number;
  allowMultiple?: boolean;
  apiUrl?: string;
  theme?: 'light' | 'dark' | 'auto';
  maxFileSize?: number; // bytes
  accept?: string; // MIME types
  className?: string;
}

export interface UploadProgress {
  stage: 'encrypting' | 'uploading' | 'complete' | 'error';
  percentage: number;
  bytesProcessed: number;
  totalBytes: number;
  speed?: number;
  eta?: number;
}

export interface UploadResult {
  fileId: string;
  url: string;
  expiresAt: string;
}

export interface KwikEmbedElement extends HTMLElement {
  config: KwikEmbedConfig;
  upload: (file: File) => Promise<UploadResult>;
  reset: () => void;
}

declare global {
  interface HTMLElementTagNameMap {
    'kwik-embed': KwikEmbedElement;
  }

  interface WindowEventMap {
    'kwik:upload-start': CustomEvent<{ file: File }>;
    'kwik:upload-progress': CustomEvent<UploadProgress>;
    'kwik:upload-complete': CustomEvent<UploadResult>;
    'kwik:upload-error': CustomEvent<{ error: Error }>;
  }
}
