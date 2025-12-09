export const embedStyles = `
  .kwik-embed-container {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    width: 100%;
    max-width: 480px;
  }

  .kwik-dropzone {
    position: relative;
    border: 2px dashed #d1d5db;
    border-radius: 12px;
    padding: 48px 24px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease;
    background: #fafafa;
  }

  .kwik-dropzone:hover {
    border-color: #3b82f6;
    background: #f0f9ff;
  }

  .kwik-dropzone.kwik-dragging {
    border-color: #3b82f6;
    background: #dbeafe;
  }

  .kwik-dropzone.kwik-uploading {
    cursor: not-allowed;
    opacity: 0.7;
  }

  .kwik-icon {
    width: 48px;
    height: 48px;
    margin: 0 auto 16px;
    color: #3b82f6;
  }

  .kwik-label {
    font-size: 16px;
    font-weight: 600;
    color: #111827;
    margin-bottom: 8px;
  }

  .kwik-hint {
    font-size: 14px;
    color: #6b7280;
  }

  .kwik-progress {
    margin-top: 24px;
  }

  .kwik-progress-bar {
    height: 8px;
    background: #e5e7eb;
    border-radius: 4px;
    overflow: hidden;
  }

  .kwik-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #3b82f6, #2563eb);
    border-radius: 4px;
    transition: width 0.3s ease;
  }

  .kwik-progress-text {
    margin-top: 8px;
    font-size: 14px;
    color: #6b7280;
    display: flex;
    justify-content: space-between;
  }

  .kwik-result {
    margin-top: 24px;
    padding: 16px;
    background: #f0fdf4;
    border: 1px solid #86efac;
    border-radius: 8px;
  }

  .kwik-result-title {
    font-size: 14px;
    font-weight: 600;
    color: #166534;
    margin-bottom: 8px;
  }

  .kwik-result-link {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: white;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 13px;
    word-break: break-all;
  }

  .kwik-result-link input {
    flex: 1;
    border: none;
    outline: none;
    font-family: monospace;
    font-size: 12px;
    color: #374151;
  }

  .kwik-copy-btn {
    padding: 6px 12px;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    white-space: nowrap;
    transition: background 0.2s;
  }

  .kwik-copy-btn:hover {
    background: #2563eb;
  }

  .kwik-copy-btn.copied {
    background: #10b981;
  }

  .kwik-error {
    margin-top: 16px;
    padding: 12px;
    background: #fef2f2;
    border: 1px solid #fca5a5;
    border-radius: 8px;
    color: #991b1b;
    font-size: 14px;
  }

  .kwik-cancel-btn {
    margin-top: 12px;
    padding: 8px 16px;
    background: #ef4444;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
  }

  .kwik-cancel-btn:hover {
    background: #dc2626;
  }

  /* Dark mode */
  @media (prefers-color-scheme: dark) {
    .kwik-dropzone {
      background: #1f2937;
      border-color: #4b5563;
    }

    .kwik-dropzone:hover {
      background: #374151;
      border-color: #3b82f6;
    }

    .kwik-label {
      color: #f9fafb;
    }

    .kwik-hint {
      color: #9ca3af;
    }

    .kwik-result {
      background: #064e3b;
      border-color: #059669;
    }

    .kwik-result-title {
      color: #6ee7b7;
    }

    .kwik-result-link {
      background: #1f2937;
      border-color: #4b5563;
    }

    .kwik-result-link input {
      color: #e5e7eb;
    }
  }
`;
