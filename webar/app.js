// Cambia esto si ya tienes tu API pública:
const API_BASE = 'http://localhost:5028';

const statusEl = document.getElementById('status');

function getIdFromPath(){
  try {
    const url = new URL(window.location.href);

    // 1) /experience/<id>  (lo normal)
    const parts = url.pathname.replace(/\/+$/,'').split('/').filter(Boolean);
    if (parts.length >= 2 && parts[0].toLowerCase() === 'experience') {
      return parts[1];
    }

    // 2) ?id=<id>
    const q = url.searchParams.get('id');
    if (q) return q;

    // 3) #<id>
    if (url.hash && url.hash.length > 1) {
      return url.hash.slice(1);
    }

    // Debug visible
    console.warn('[getIdFromPath] No id found. href=', url.href, 'pathname=', url.pathname, 'search=', url.search, 'hash=', url.hash);
    return null;
  } catch (e) {
    console.error('[getIdFromPath] error', e);
    return null;
  }
}


async function fetchExperience(id){
  const url = apiUrlFor(id);
  console.log('[fetchExperience] API_BASE=', API_BASE, 'URL=', url);

  const res = await fetch(url, {
    cache: 'no-store',
    headers: { 'Accept': 'application/json' }
  });

  // Si la API devuelve 404/500, mostramos el cuerpo (suele ser HTML)
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status} desde ${url} → ${text.slice(0,120)}`);
  }

  const ct = res.headers.get('content-type') || '';
  if (!ct.includes('application/json')) {
    const text = await res.text();
    throw new Error(`Respuesta no-JSON desde ${url} → ${text.slice(0,120)}`);
  }

  return res.json();
}


function addVideoOnMarker(url){
  const root = document.querySelector('#markerRoot');
  const video = document.createElement('a-video');
  video.setAttribute('src', url);
  video.setAttribute('width', 1.2);
  video.setAttribute('height', 0.675);
  video.setAttribute('position', '0 0 0');
  video.setAttribute('rotation', '-90 0 0'); // sobre el plano del marcador
  root.appendChild(video);
  return video;
}

function addModelOnMarker(url){
  const root = document.querySelector('#markerRoot');
  const model = document.createElement('a-entity');
  model.setAttribute('gltf-model', url);
  model.setAttribute('position', '0 0 0');
  model.setAttribute('rotation', '0 0 0');
  model.setAttribute('scale', '0.5 0.5 0.5');
  root.appendChild(model);
  return model;
}

function addImageOnMarker(url) {
  const root = document.querySelector('#markerRoot');
  const img = document.createElement('a-image');
  img.setAttribute('src', url);
  img.setAttribute('width', 1);
  img.setAttribute('height', 1);
  img.setAttribute('position', '0 0 0');
  img.setAttribute('rotation', '-90 0 0');
  root.appendChild(img);
  return img;
}

function apiUrlFor(id) {
  return `${API_BASE}/api/experiences/${encodeURIComponent(id)}`;
}

function addTestCube() {
  const root = document.querySelector('#markerRoot');
  const box = document.createElement('a-box');
  box.setAttribute('position', '0 0.5 0'); // 0.5m encima del marcador
  box.setAttribute('rotation', '0 45 0');
  box.setAttribute('depth', '0.5');
  box.setAttribute('height', '0.5');
  box.setAttribute('width', '0.5');
  box.setAttribute('material', 'color: #4ade80; metalness:0.1; roughness:0.9;');
  root.appendChild(box);
}


async function main(){
  try{

    console.log('DEBUG href=', location.href, 'pathname=', location.pathname);


    const id = getIdFromPath();
    if(!id) throw new Error('ExperienceId inválido');
    statusEl.textContent = `Cargando ${id}…`;

    const exp = await fetchExperience(id);

 
   

    if(!exp.isActive) throw new Error('Experiencia inactiva');

    // Analítica MVP
    fetch(`${API_BASE}/api/analytics/view-started/${encodeURIComponent(id)}`, { method:'POST' });

    if (exp.type === 'Video') {
      addVideoOnMarker(exp.mediaUrl);
      statusEl.textContent = 'Video listo — apunta al marcador "hiro"';
    } else if (exp.type === 'Model3D') {
      addModelOnMarker(exp.mediaUrl);
      statusEl.textContent = 'Modelo listo — apunta al marcador "hiro"';
    } else if (exp.type === 'Image') {
      addImageOnMarker(exp.mediaUrl);
      statusEl.textContent = 'Imagen lista — apunta al marcador "hiro"';
    } else {
      const root = document.querySelector('#markerRoot');
      const t = document.createElement('a-text');
      t.setAttribute('value', exp.title || 'Mensaje');
      t.setAttribute('align', 'center');
      t.setAttribute('position', '0 0 0');
      t.setAttribute('rotation', '-90 0 0');
      root.appendChild(t);
      statusEl.textContent = 'Mensaje listo — apunta al marcador "hiro"';
    }

    setTimeout(() => {
      fetch(`${API_BASE}/api/analytics/view-completed/${encodeURIComponent(id)}`, { method:'POST' });
    }, 8000);
  } catch (err) {
    statusEl.textContent = `Error: ${err.message || err}`;
    statusEl.classList.add('error');
  }
}

window.addEventListener('DOMContentLoaded', main);
