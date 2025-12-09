import { KwikEmbed } from './embed';

// Register custom element
if (typeof window !== 'undefined' && !customElements.get('kwik-embed')) {
  customElements.define('kwik-embed', KwikEmbed);
}

export { KwikEmbed };
export type { KwikEmbedConfig, UploadProgress, UploadResult, KwikEmbedElement } from './types';
