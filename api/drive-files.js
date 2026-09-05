const DRIVE_FOLDERS = Object.freeze({
  certificates: '1z4GMGPH1VmVRq5ALiSvwMhikQ0nLrlaf',
  certifications: '1aa2EPuI-4gl2M6el1TxR9fautgiMvEo5'
});

const GOOGLE_DRIVE_FILES_URL = 'https://www.googleapis.com/drive/v3/files';
const FOLDER_MIME_TYPE = 'application/vnd.google-apps.folder';
const SHORTCUT_MIME_TYPE = 'application/vnd.google-apps.shortcut';

const googlePreviewUrl = (mimeType, fileId) => {
  const encodedId = encodeURIComponent(fileId);
  const previewRoutes = {
    'application/vnd.google-apps.document': `https://docs.google.com/document/d/${encodedId}/preview`,
    'application/vnd.google-apps.spreadsheet': `https://docs.google.com/spreadsheets/d/${encodedId}/preview`,
    'application/vnd.google-apps.presentation': `https://docs.google.com/presentation/d/${encodedId}/preview`,
    'application/vnd.google-apps.drawing': `https://docs.google.com/drawings/d/${encodedId}/preview`,
    'application/vnd.google-apps.form': `https://docs.google.com/forms/d/${encodedId}/viewform?embedded=true`
  };
  return previewRoutes[mimeType];
};

const describeFileType = (file, mimeType) => {
  const knownTypes = {
    'application/pdf': 'PDF',
    'application/vnd.google-apps.document': 'GOOGLE DOCS',
    'application/vnd.google-apps.spreadsheet': 'GOOGLE SHEETS',
    'application/vnd.google-apps.presentation': 'GOOGLE SLIDES',
    'application/vnd.google-apps.drawing': 'GOOGLE DRAWING',
    'application/vnd.google-apps.form': 'GOOGLE FORMS',
    'application/zip': 'ZIP'
  };
  if (knownTypes[mimeType]) return knownTypes[mimeType];
  if (mimeType.startsWith('image/')) return 'IMAGE';
  if (mimeType.startsWith('video/')) return 'VIDEO';
  if (mimeType.startsWith('audio/')) return 'AUDIO';
  return file.fileExtension ? file.fileExtension.toUpperCase() : 'FILE';
};

const toPublicFile = (file) => {
  const isShortcut = file.mimeType === SHORTCUT_MIME_TYPE && file.shortcutDetails?.targetId;
  const fileId = isShortcut ? file.shortcutDetails.targetId : file.id;
  const mimeType = (isShortcut ? file.shortcutDetails.targetMimeType : file.mimeType) || 'application/octet-stream';
  const resolvedResourceKey = isShortcut ? file.shortcutDetails.targetResourceKey : file.resourceKey;
  const resourceKey = resolvedResourceKey ? `?resourcekey=${encodeURIComponent(resolvedResourceKey)}` : '';
  const nativePreview = googlePreviewUrl(mimeType, fileId);
  const nativeResourceKey = nativePreview && resolvedResourceKey
    ? `${nativePreview.includes('?') ? '&' : '?'}resourcekey=${encodeURIComponent(resolvedResourceKey)}`
    : '';
  return {
    id: `${file.id}:${fileId}`,
    name: String(file.name || 'Archivo de Google Drive').slice(0, 180),
    type: describeFileType(file, mimeType),
    mimeType,
    modifiedTime: file.modifiedTime || file.createdTime,
    previewUrl: nativePreview ? `${nativePreview}${nativeResourceKey}` : `https://drive.google.com/file/d/${encodeURIComponent(fileId)}/preview${resourceKey}`,
    viewUrl: `https://drive.google.com/open?id=${encodeURIComponent(fileId)}${resolvedResourceKey ? `&resourcekey=${encodeURIComponent(resolvedResourceKey)}` : ''}`
  };
};

async function listFolderChildren(folderId, apiKey) {
  const files = [];
  let pageToken = '';

  do {
    const query = new URLSearchParams({
      q: `'${folderId}' in parents and trashed = false`,
      fields: 'nextPageToken,files(id,name,mimeType,fileExtension,createdTime,modifiedTime,resourceKey,shortcutDetails(targetId,targetMimeType,targetResourceKey))',
      orderBy: 'modifiedTime desc,name',
      pageSize: '1000',
      spaces: 'drive',
      supportsAllDrives: 'true',
      includeItemsFromAllDrives: 'true'
    });
    if (pageToken) query.set('pageToken', pageToken);

    const response = await fetch(`${GOOGLE_DRIVE_FILES_URL}?${query}`, {
      headers: { Accept: 'application/json', 'X-Goog-Api-Key': apiKey }
    });
    if (!response.ok) throw new Error(`Google Drive request failed with status ${response.status}`);

    const data = await response.json();
    files.push(...(Array.isArray(data.files) ? data.files : []));
    pageToken = typeof data.nextPageToken === 'string' ? data.nextPageToken : '';
  } while (pageToken);

  return files;
}

async function listPublicFiles(rootFolderId, apiKey) {
  const files = [];
  const pendingFolders = [rootFolderId];
  const visitedFolders = new Set();

  while (pendingFolders.length) {
    const folderId = pendingFolders.shift();
    if (visitedFolders.has(folderId)) continue;
    visitedFolders.add(folderId);

    const children = await listFolderChildren(folderId, apiKey);
    children.forEach((file) => {
      const shortcutFolderId = file.mimeType === SHORTCUT_MIME_TYPE && file.shortcutDetails?.targetMimeType === FOLDER_MIME_TYPE
        ? file.shortcutDetails.targetId
        : '';
      if (file.mimeType === FOLDER_MIME_TYPE) pendingFolders.push(file.id);
      else if (shortcutFolderId) pendingFolders.push(shortcutFolderId);
      else files.push(toPublicFile(file));
    });
  }

  return files.sort((a, b) => new Date(b.modifiedTime) - new Date(a.modifiedTime) || a.name.localeCompare(b.name));
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
      listPublicFiles(DRIVE_FOLDERS.certificates, apiKey),
      listPublicFiles(DRIVE_FOLDERS.certifications, apiKey)
    ]);

    response.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600');
    return response.status(200).json({ certificates, certifications });
  } catch (error) {
    console.error('Unable to synchronize public Google Drive documents:', error.message);
    response.setHeader('Cache-Control', 'private, no-store');
    return response.status(502).json({ error: 'Unable to load Google Drive documents' });
  }
}
