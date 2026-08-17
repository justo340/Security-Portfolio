const GITHUB_USERNAME = 'justo340';
const PROJECT_LIMIT = 6;
const projectGrid = document.getElementById('project-grid');
const projectStatus = document.getElementById('projects-status');

const languageColors = {
  JavaScript: '#f0b93a',
  TypeScript: '#3077c6',
  Python: '#3776ab',
  HTML: '#e34c26',
  CSS: '#663399',
  Shell: '#6e8b3d',
  PowerShell: '#5391fe',
  Java: '#bd5a32',
  PHP: '#777bb4',
  Ruby: '#cc342d',
  Go: '#00add8',
  'C#': '#6b4294',
  C: '#555555',
  'C++': '#f34b7d',
  Jupyter: '#da5b0b',
};

function makeElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}

function formatDate(dateString) {
  const formatter = new Intl.DateTimeFormat('en', {
    month: 'short',
    year: 'numeric',
  });

  return formatter.format(new Date(dateString));
}

function makeProjectCard(repo, index) {
  const article = makeElement('article', 'project-card github-project');
  const meta = makeElement('div', 'project-meta');
  const projectNumber = String(index + 1).padStart(2, '0');

  meta.append(makeElement('span', `${projectNumber} / GITHUB PROJECT`));
  meta.append(makeElement('span', repo.private ? 'PRIVATE' : 'PUBLIC'));
  article.append(meta);

  const visual = makeElement('div', 'repo-visual');
  const mark = makeElement(
    'span',
    'repo-mark',
    repo.name.slice(0, 2).toUpperCase(),
  );
  const language = makeElement(
    'span',
    'repo-language',
    repo.language || 'PROJECT',
  );

  if (repo.language && languageColors[repo.language]) {
    language.style.setProperty(
      '--language-color',
      languageColors[repo.language],
    );
  }
  visual.append(mark, language);
  article.append(visual);

  const content = makeElement('div', 'project-content');
  content.append(makeElement('h3', '', repo.name.replace(/[-_]/g, ' ')));
  const defaultDescription = [
    'A GitHub project in my active portfolio.',
    'Open the repository to explore the implementation and documentation.',
  ].join(' ');

  content.append(
    makeElement(
      'p',
      '',
      repo.description || defaultDescription,
    ),
  );
  const tags = makeElement('ul', 'tag-list');
  if (repo.language) tags.append(makeElement('li', '', repo.language));
  tags.append(makeElement('li', '', `Updated ${formatDate(repo.updated_at)}`));
  if (repo.stargazers_count) {
    const stars = `${repo.stargazers_count} star${
      repo.stargazers_count === 1 ? '' : 's'
    }`;

    tags.append(makeElement('li', '', stars));
  }
  content.append(tags);
  const link = makeElement('a', 'text-link', 'Open repository ↗');
  link.href = repo.html_url;
  link.target = '_blank';
  link.rel = 'noreferrer';
  content.append(link);
  article.append(content);
  return article;
}

function renderEmptyState(message) {
  projectGrid.replaceChildren();
  const card = makeElement('article', 'project-card empty-project');
  card.append(makeElement('p', 'overline', 'GITHUB WORK STREAM'));
  card.append(makeElement('h3', '', 'Projects will appear here as you publish them.'));
  card.append(makeElement('p', '', message));
  const link = makeElement('a', 'text-link', 'Visit my GitHub profile ↗');
  link.href = `https://github.com/${GITHUB_USERNAME}`;
  link.target = '_blank';
  link.rel = 'noreferrer';
  card.append(link);
  projectGrid.append(card);
}

async function loadProjects() {
  try {
    const search = new URLSearchParams({
      sort: 'updated',
      direction: 'desc',
      per_page: '100',
    });
    const url = `https://api.github.com/users/${GITHUB_USERNAME}/repos?${search}`;
    const response = await fetch(url, {
      headers: { Accept: 'application/vnd.github+json' },
    });
    if (!response.ok) throw new Error(`GitHub responded with ${response.status}`);
    const repositories = await response.json();
    const projects = repositories
      .filter(
        (repo) => !repo.fork
          && !repo.archived
          && repo.name.toLowerCase() !== 'security-portfolio',
      )
      .slice(0, PROJECT_LIMIT);
    if (!projects.length) {
      projectStatus.textContent = 'No public projects are available yet.';
      const message = [
        'Create or make a repository public and add a description.',
        'Refresh this page and it will appear here automatically.',
      ].join(' ');

      renderEmptyState(message);
      return;
    }
    projectGrid.replaceChildren(...projects.map(makeProjectCard));
    const label = projects.length === 1 ? 'project' : 'projects';

    projectStatus.textContent = `${projects.length} recent public GitHub ${label} loaded.`;
  } catch (error) {
    projectStatus.textContent = 'GitHub projects are temporarily unavailable.';
    const message = [
      'This page could not reach GitHub right now.',
      'Refresh to try again, or visit my GitHub profile directly.',
    ].join(' ');

    renderEmptyState(message);
    console.error('Unable to load GitHub projects:', error);
  }
}

document.addEventListener('partialsloaded', loadProjects, { once: true });
