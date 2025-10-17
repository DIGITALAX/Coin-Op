export function isValidBase64Image(base64String: string): boolean {
  if (!base64String || typeof base64String !== 'string') {
    return false;
  }
  
  const base64Regex = /^data:image\/(jpeg|jpg|png|gif|webp);base64,/;
  const isValid = base64Regex.test(base64String);
  return isValid;
}

export function getImageDimensions(base64String: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    if (!isValidBase64Image(base64String)) {
      reject(new Error('Invalid base64 image string'));
      return;
    }

    const img = new Image();
    
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = base64String;
  });
}

export function base64ToBlob(base64String: string): Blob | null {
  try {
    if (!isValidBase64Image(base64String)) {
      return null;
    }

    const [header, data] = base64String.split(',');
    const mimeType = header.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,/)?.[1];
    
    if (!mimeType) {
      return null;
    }

    const byteCharacters = atob(data);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  } catch (error) {
    console.error('Error converting base64 to blob:', error);
    return null;
  }
}

export function createImageUrl(base64String: string): string | null {
  const blob = base64ToBlob(base64String);
  if (!blob) {
    return null;
  }
  
  return URL.createObjectURL(blob);
}

export function revokeImageUrl(url: string): void {
  URL.revokeObjectURL(url);
}