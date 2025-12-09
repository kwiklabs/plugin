import { KwikEmbedConfig, UploadProgress, UploadResult, KwikEmbedElement } from './types';
import { embedStyles } from './styles';

export class KwikEmbed extends HTMLElement implements KwikEmbedElement {
  private shadow: ShadowRoot;
  private fileInput: HTMLInputElement;
  private dropzone: HTMLDivElement;
  private abortController: AbortController | null = null;

  public config: KwikEmbedConfig = {
    label: 'Drop file or click to upload',
    expires: '24h',
    maxDownloads: 10,
    allowMultiple: false,
    apiUrl: 'https://kwik.gg/api',
    theme: 'auto',
    maxFileSize: 5 * 1024 * 1024 * 1024, // 5GB
    accept: '*/*',
  };

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.fileInput = document.createElement('input');
    this.dropzone = document.createElement('div');
    this.render();
  }

  connectedCallback() {
    // Parse attributes
    const label = this.getAttribute('label');
    const expires = this.getAttribute('expires');
    const maxDownloads = this.getAttribute('max-downloads');
    const allowMultiple = this.getAttribute('allow-multiple');
    const apiUrl = this.getAttribute('api-url');
    const theme = this.getAttribute('theme');
    const maxFileSize = this.getAttribute('max-file-size');
    const accept = this.getAttribute('accept');
    const className = this.getAttribute('class');

    if (label) this.config.label = label;
    if (expires) this.config.expires = expires;
    if (maxDownloads) this.config.maxDownloads = parseInt(maxDownloads, 10);
    if (allowMultiple) this.config.allowMultiple = allowMultiple === 'true';
    if (apiUrl) this.config.apiUrl = apiUrl;
    if (theme && (theme === 'light' || theme === 'dark' || theme === 'auto')) this.config.theme = theme;
    if (maxFileSize) this.config.maxFileSize = parseInt(maxFileSize, 10);
    if (accept) this.config.accept = accept;
    if (className) this.config.className = className;

    this.render();
  }

  private render() {
    const style = document.createElement('style');
    style.textContent = embedStyles;

    const container = document.createElement('div');
    container.className = `kwik-embed-container ${this.config.className || ''}`;

    this.fileInput.type = 'file';
    this.fileInput.accept = this.config.accept || '*/*';
    this.fileInput.multiple = this.config.allowMultiple || false;
    this.fileInput.style.display = 'none';
    this.fileInput.addEventListener('change', () => this.handleFiles());

    this.dropzone.className = 'kwik-dropzone';
    this.dropzone.innerHTML = `
      <svg class="kwik-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
      <div class="kwik-label">${this.config.label}</div>
      <div class="kwik-hint">Up to ${this.formatBytes(this.config.maxFileSize || 0)} • Encrypted & secure</div>
    `;

    this.dropzone.addEventListener('click', () => this.fileInput.click());
    this.dropzone.addEventListener('dragover', (e) => this.handleDragOver(e));
    this.dropzone.addEventListener('dragleave', () => this.handleDragLeave());
    this.dropzone.addEventListener('drop', (e) => this.handleDrop(e));

    container.appendChild(this.dropzone);
    container.appendChild(this.fileInput);

    this.shadow.innerHTML = '';
    this.shadow.appendChild(style);
    this.shadow.appendChild(container);
  }

  private handleDragOver(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.dropzone.classList.add('kwik-dragging');
  }

  private handleDragLeave() {
    this.dropzone.classList.remove('kwik-dragging');
  }

  private handleDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.dropzone.classList.remove('kwik-dragging');

    if (e.dataTransfer?.files.length) {
      this.fileInput.files = e.dataTransfer.files;
      this.handleFiles();
    }
  }

  private async handleFiles() {
    const files = this.fileInput.files;
    if (!files || files.length === 0) return;

    const file = files[0]; // Only handle first file for now
    
    // Validate file size
    if (this.config.maxFileSize && file.size > this.config.maxFileSize) {
      this.showError(`File exceeds maximum size of ${this.formatBytes(this.config.maxFileSize)}`);
      return;
    }

    this.dispatchEvent(new CustomEvent('kwik:upload-start', { detail: { file } }));

    try {
      const result = await this.upload(file);
      this.dispatchEvent(new CustomEvent('kwik:upload-complete', { detail: result }));
      this.showResult(result);
    } catch (error) {
      const err = error as Error;
      this.dispatchEvent(new CustomEvent('kwik:upload-error', { detail: { error: err } }));
      this.showError(err.message);
    }
  }

  public async upload(file: File): Promise<UploadResult> {
    this.dropzone.classList.add('kwik-uploading');
    this.showProgress({ stage: 'encrypting', percentage: 0, bytesProcessed: 0, totalBytes: file.size });

    this.abortController = new AbortController();
    const chunkSize = 5 * 1024 * 1024; // 5MB chunks
    const chunks: Blob[] = [];

    // Simulate chunking (in production, integrate with @kwiklabs/sdk)
    for (let offset = 0; offset < file.size; offset += chunkSize) {
      const chunk = file.slice(offset, offset + chunkSize);
      chunks.push(chunk);
    }

    try {
      // Encryption phase
      for (let i = 0; i < chunks.length; i++) {
        if (this.abortController.signal.aborted) throw new Error('Upload cancelled');
        
        const percentage = Math.round(((i + 1) / chunks.length) * 50); // First 50% for encryption
        this.showProgress({
          stage: 'encrypting',
          percentage,
          bytesProcessed: (i + 1) * chunkSize,
          totalBytes: file.size,
        });

        await new Promise(resolve => setTimeout(resolve, 100)); // Simulate encryption
      }

      // Upload phase
      const formData = new FormData();
      formData.append('file', file);
      formData.append('expires', this.config.expires || '24h');
      formData.append('maxDownloads', String(this.config.maxDownloads || 10));

      const response = await fetch(`${this.config.apiUrl}/upload`, {
        method: 'POST',
        body: formData,
        signal: this.abortController.signal,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result: UploadResult = await response.json();

      this.showProgress({
        stage: 'complete',
        percentage: 100,
        bytesProcessed: file.size,
        totalBytes: file.size,
      });

      return result;
    } catch (error) {
      this.dropzone.classList.remove('kwik-uploading');
      throw error;
    }
  }

  private showProgress(progress: UploadProgress) {
    const container = this.shadow.querySelector('.kwik-embed-container');
    if (!container) return;

    let progressEl = container.querySelector('.kwik-progress') as HTMLDivElement;
    if (!progressEl) {
      progressEl = document.createElement('div');
      progressEl.className = 'kwik-progress';
      container.appendChild(progressEl);
    }

    const stage = progress.stage === 'encrypting' ? 'Encrypting' : 'Uploading';
    const speed = progress.speed ? `${this.formatBytes(progress.speed)}/s` : '';
    const eta = progress.eta ? `${Math.round(progress.eta)}s remaining` : '';

    progressEl.innerHTML = `
      <div class="kwik-progress-bar">
        <div class="kwik-progress-fill" style="width: ${progress.percentage}%"></div>
      </div>
      <div class="kwik-progress-text">
        <span>${stage} ${progress.percentage}%</span>
        <span>${speed} ${eta}</span>
      </div>
    `;

    if (progress.stage !== 'complete') {
      const cancelBtn = document.createElement('button');
      cancelBtn.className = 'kwik-cancel-btn';
      cancelBtn.textContent = 'Cancel';
      cancelBtn.addEventListener('click', () => {
        this.abortController?.abort();
        this.reset();
      });
      progressEl.appendChild(cancelBtn);
    }

    this.dispatchEvent(new CustomEvent('kwik:upload-progress', { detail: progress }));
  }

  private showResult(result: UploadResult) {
    this.dropzone.classList.remove('kwik-uploading');
    const container = this.shadow.querySelector('.kwik-embed-container');
    if (!container) return;

    const resultEl = document.createElement('div');
    resultEl.className = 'kwik-result';
    resultEl.innerHTML = `
      <div class="kwik-result-title">✓ Upload complete</div>
      <div class="kwik-result-link">
        <input type="text" readonly value="${result.url}" id="kwik-url-${result.fileId}" />
        <button class="kwik-copy-btn" data-url="${result.url}">Copy</button>
      </div>
    `;

    const copyBtn = resultEl.querySelector('.kwik-copy-btn') as HTMLButtonElement;
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(result.url);
        copyBtn.textContent = '✓ Copied';
        copyBtn.classList.add('copied');
        setTimeout(() => {
          copyBtn.textContent = 'Copy';
          copyBtn.classList.remove('copied');
        }, 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    });

    container.appendChild(resultEl);
  }

  private showError(message: string) {
    this.dropzone.classList.remove('kwik-uploading');
    const container = this.shadow.querySelector('.kwik-embed-container');
    if (!container) return;

    let errorEl = container.querySelector('.kwik-error') as HTMLDivElement;
    if (!errorEl) {
      errorEl = document.createElement('div');
      errorEl.className = 'kwik-error';
      container.appendChild(errorEl);
    }

    errorEl.textContent = message;
    setTimeout(() => errorEl.remove(), 5000);
  }

  public reset() {
    this.fileInput.value = '';
    this.dropzone.classList.remove('kwik-uploading', 'kwik-dragging');
    this.abortController = null;
    
    const container = this.shadow.querySelector('.kwik-embed-container');
    if (!container) return;

    container.querySelector('.kwik-progress')?.remove();
    container.querySelector('.kwik-result')?.remove();
    container.querySelector('.kwik-error')?.remove();
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }
}
