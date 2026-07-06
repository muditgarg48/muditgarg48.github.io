const PORTFOLIO_DATA_BRANCH_URL =
  'https://api.github.com/repos/muditgarg48/portfolio_data/branches/master';

/**
 * Fetches the latest commit date on portfolio_data/master at build time.
 */
export async function fetchPortfolioDataLastUpdated() {
  try {
    const res = await fetch(PORTFOLIO_DATA_BRANCH_URL, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
    const data = await res.json();
    return data.commit.commit.committer.date;
  } catch (error) {
    console.error('Error fetching portfolio_data last updated:', error);
    return new Date().toISOString();
  }
}

function formatProjectLastUpdated(dateString) {
  const options = { year: 'numeric', month: 'short', day: '2-digit' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

async function fetchRepoLastUpdated(github) {
  if (!github?.repo_owner || !github?.repo_name || !github?.repo_branch) {
    return { lastUpdated: null, lastUpdatedAt: null, error: null };
  }

  const endpoint = `https://api.github.com/repos/${github.repo_owner}/${github.repo_name}/branches/${github.repo_branch}`;

  try {
    const res = await fetch(endpoint, { next: { revalidate: 3600 } });
    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    const commitDate = data.commit.commit.committer.date;
    return {
      lastUpdated: formatProjectLastUpdated(commitDate),
      lastUpdatedAt: commitDate,
      error: null,
    };
  } catch (error) {
    console.error(
      `Error fetching last updated for ${github.repo_owner}/${github.repo_name}:`,
      error
    );
    return {
      lastUpdated: null,
      lastUpdatedAt: null,
      error: error.message || String(error),
    };
  }
}

/**
 * Resolves each project's repo last-updated date once at build time.
 */
export async function enrichProjectsWithRepoLastUpdated(projects) {
  return Promise.all(
    projects.map(async (project) => {
      if (!project.github) return project;

      const { lastUpdated, lastUpdatedAt, error } = await fetchRepoLastUpdated(project.github);
      return {
        ...project,
        repoLastUpdated: lastUpdated,
        repoLastUpdatedAt: lastUpdatedAt,
        repoLastUpdatedError: error,
      };
    })
  );
}