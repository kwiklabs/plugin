# Kwik Embed

Secure encrypted file upload widget for any website. Drop-in `<kwik-embed>` custom element with zero dependencies.

## Installation

### CDN (Recommended)

```html
<script src="https://cdn.jsdelivr.net/npm/@kwiklabs/plugin@latest/dist/kwik-embed.min.js"></script>

<!-- Use the custom element -->
<kwik-embed 
  label="Share files securely"
  expires="7d"
  max-downloads="10"
></kwik-embed>
```

### NPM

```bash
npm install @kwiklabs/plugin
```

```javascript
import '@kwiklabs/plugin';

// Custom element is now registered
```

## Usage

### Basic Example

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.jsdelivr.net/npm/@kwiklabs/plugin@latest/dist/kwik-embed.min.js"></script>
</head>
<body>
  <kwik-embed></kwik-embed>
</body>
</html>
```

### Configuration

All attributes are optional:

```html
<kwik-embed
  label="Drop file or click to upload"
  expires="24h"
  max-downloads="10"
  allow-multiple="false"
  api-url="https://kwik.gg/api"
  theme="auto"
  max-file-size="5368709120"
  accept="*/*"
  class="my-custom-class"
></kwik-embed>
```

#### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `label` | string | "Drop file or click to upload" | Upload prompt text |
| `expires` | string | "24h" | Link expiration (e.g., "1h", "7d", "30d") |
| `max-downloads` | number | 10 | Maximum number of downloads |
| `allow-multiple` | boolean | false | Allow multiple file selection |
| `api-url` | string | "https://kwik.gg/api" | API endpoint URL |
| `theme` | "light" \| "dark" \| "auto" | "auto" | Color theme |
| `max-file-size` | number | 5368709120 | Max file size in bytes (5GB default) |
| `accept` | string | "*/*" | Accepted MIME types |
| `class` | string | "" | Additional CSS class |

### Events

Listen to upload lifecycle events:

```javascript
const embed = document.querySelector('kwik-embed');

embed.addEventListener('kwik:upload-start', (e) => {
  console.log('Upload started:', e.detail.file);
});

embed.addEventListener('kwik:upload-progress', (e) => {
  const { stage, percentage, speed, eta } = e.detail;
  console.log(`${stage}: ${percentage}% (${speed} bytes/s, ETA: ${eta}s)`);
});

embed.addEventListener('kwik:upload-complete', (e) => {
  const { url, fileId, expiresAt } = e.detail;
  console.log('Upload complete:', url);
});

embed.addEventListener('kwik:upload-error', (e) => {
  console.error('Upload failed:', e.detail.error);
});
```

### Programmatic API

```javascript
const embed = document.querySelector('kwik-embed');

// Upload a file programmatically
const file = new File(['content'], 'test.txt');
const result = await embed.upload(file);
console.log(result.url); // https://kwik.gg/d/abc123

// Reset the widget
embed.reset();

// Update configuration
embed.config.expires = '7d';
embed.config.maxDownloads = 5;
```

### Styling

The widget uses CSS custom properties for theming:

```css
kwik-embed {
  --kwik-primary: #3b82f6;
  --kwik-border-radius: 12px;
  --kwik-font-family: 'Inter', sans-serif;
}
```

Or add your own wrapper:

```html
<div class="my-upload-section">
  <h2>Share Your Files</h2>
  <kwik-embed class="my-embed"></kwik-embed>
</div>

<style>
.my-upload-section {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
}
</style>
```

## Features

- **Zero-knowledge encryption**: Files encrypted client-side with AES-256-GCM
- **Chunked uploads**: Handles large files up to 5GB
- **Progress tracking**: Real-time encryption & upload progress
- **Auto-copy**: One-click copy share link
- **Responsive**: Works on mobile and desktop
- **Dark mode**: Automatic theme detection
- **Accessible**: ARIA labels and keyboard navigation
- **Lightweight**: <10kB gzipped

## Browser Support

- Chrome/Edge 88+
- Firefox 75+
- Safari 14+
- Opera 74+

Requires ES2020 support (custom elements, async/await, fetch).

## Development

```bash
# Install dependencies
pnpm install

# Build
pnpm build

# Watch mode
pnpm dev

# Test locally
pnpm serve
```

## License

MIT © Kwik Labs

## Links

- [Website](https://kwik.gg)
- [Documentation](https://kwik.gg/docs/embed)
- [GitHub](https://github.com/kwiklabs/plugin)
- [Report Issues](https://github.com/kwiklabs/plugin/issues)
