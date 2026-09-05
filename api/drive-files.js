const DRIVE_FOLDERS = Object.freeze({
  certificates: '1z4GMGPH1VmVRq5ALiSvwMhikQ0nLrlaf',
  certifications: '1aa2EPuI-4gl2M6el1TxR9fautgiMvEo5'
});

const GOOGLE_DRIVE_FILES_URL = 'https://www.googleapis.com/drive/v3/files';

const toPublicFile = (file) => {
  const resourceKey = file.resourceKey ? `?resourcekey=${encodeURIComponent(file.resourceKey)}` : '';
  return {
    id: file.id,
    name: String(file.name || 'Documento PDF').slice(0, 180),
    modifiedTime: file.modifiedTime || file.createdTime,
    previewUrl: `https://drive.google.com/file/d/${encodeURIComponent(file.id)}/preview${resourceKey}`,
    viewUrl: `https://drive.google.com/file/d/${encodeURIComponent(file.id)}/view${resourceKey}`
  };
};

async function listPublicPdfs(folderId, apiKey) {
  const files = [];
  let pageToken = '';

  do {
    const query = new URLSearchParams({
      key: apiKey,
      q: `'${folderId}' in parents and trashed = false and mimeType = 'application/pdf'`,
      fields: 'nextPageToken,files(id,name,mimeType,createdTime,modifiedTime,resourceKey)',
      orderBy: 'modifiedTime desc,name',
      pageSize: '1000',
      spaces: 'drive',
      supportsAllDrives: 'true',
      includeItemsFromAllDrives: 'true'
    });
    if (pageToken) query.set('pageToken', pageToken);

    const response = await fetch(`${GOOGLE_DRIVE_FILES_URL}?${query}`, {
      headers: { Accept: 'application/json' }
    });
    if (!response.ok) throw new Error(`Google Drive request failed with status ${response.status}`);

    const data = await response.json();
    files.push(...(Array.isArray(data.files) ? data.files.map(toPublicFile) : []));
    pageToken = typeof data.nextPageToken === 'string' ? data.nextPageToken : '';
  } while (pageToken && files.length < 5000);

  return files;
}

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GOOGLE_DRIVE_API_KEY;
  if (!apiKey) {
    response.setHeader('Cache-Control', 'private, no-store');
    return response.status(503).json({ error: 'Google Drive integration is not configured' });
  }

  try {
    const [certificates, certifications] = await Promise.all([
      listPublicPdfs(DRIVE_FOLDERS.certificates, apiKey),
      listPublicPdfs(DRIVE_FOLDERS.certifications, apiKey)
    ]);

    response.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600');
    return response.status(200).json({ certificates, certifications });
  } catch (error) {
    console.error('Unable to synchronize public Google Drive documents:', error.message);
    response.setHeader('Cache-Control', 'private, no-store');
    return response.status(502).json({ error: 'Unable to load Google Drive documents' });
  }
}
