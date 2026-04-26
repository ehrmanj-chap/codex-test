async function boot() {
  const res = await fetch('./chapters.json');
  const data = await res.json();
  const root = document.querySelector('#chapters');
  const stats = document.querySelector('#stats');
  const tpl = document.querySelector('#chapter-template');

  stats.textContent = `Detected ${data.chapters.length} chapters across ${data.songs.length} songs. Boundary rule: 6–15 songs per chapter.`;

  data.chapters.forEach((chapter) => {
    const node = tpl.content.cloneNode(true);
    const card = node.querySelector('.chapter-card');
    const title = node.querySelector('.chapter-title');
    const meta = node.querySelector('.chapter-meta');
    const note = node.querySelector('.chapter-note');
    const list = node.querySelector('.track-list');
    const embedWrap = node.querySelector('.embed-wrap');

    const tracks = data.songs.slice(chapter.start - 1, chapter.end);
    const trackIds = tracks
      .map((t) => t.uri.split(':').pop())
      .filter(Boolean)
      .slice(0, 80);

    title.textContent = chapter.title;
    meta.textContent = `${chapter.start}-${chapter.end} · ${tracks.length} tracks · ${chapter.mood}`;
    note.textContent = `Transition glyph: ${chapter.note}`;

    if (trackIds.length) {
      const iframe = document.createElement('iframe');
      iframe.loading = 'lazy';
      iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
      iframe.src = `https://open.spotify.com/embed/trackset/Chapter%20${chapter.id}/${trackIds.join(',')}`;
      embedWrap.appendChild(iframe);
    }

    tracks.forEach((song) => {
      const li = document.createElement('li');
      li.textContent = `${song.index}. ${song.track} — ${song.artist}`;
      list.appendChild(li);
    });

    root.appendChild(node);
    if (chapter.id === 1) card.open = true;
  });
}

boot();
