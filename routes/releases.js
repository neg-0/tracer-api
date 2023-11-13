const router = require('express').Router();
const https = require('https');

// Combine the frontend and backend repos into one object with more details
const repos = {
  "React (Vite)": {
    type: "frontend",
    repo: "vitejs/vite",
    framework: "react",
    template: "vite",
  },
  "React (Create React App)": {
    type: "frontend",
    repo: "facebook/create-react-app",
    framework: "react",
    template: "create-react-app",
  },
  "React (Next.js)": {
    type: "frontend",
    repo: "vercel/next.js",
    framework: "react",
    template: "next",
  },
  "Vue (Vite)": {
    type: "frontend",
    repo: "vitejs/vite",
    framework: "vue",
    template: "vite",
  },
  "Vue (Vue CLI)": {
    type: "frontend",
    repo: "vuejs/vue-cli",
    framework: "vue",
    template: "vue-cli",
  },
  "Angular": {
    type: "frontend",
    repo: "angular/angular",
    framework: "angular",
    template: "angular",
  },
  "Svelte": {
    type: "frontend",
    repo: "sveltejs/svelte",
    framework: "svelte",
    template: "svelte",
  },
  "Ember": {
    type: "frontend",
    repo: "emberjs/ember.js",
    framework: "ember",
    template: "ember",
  },
  "Preact": {
    type: "frontend",
    repo: "preactjs/preact",
    framework: "preact",
    template: "preact",
  },
  "Node.js (Express)": {
    type: "backend",
    repo: "expressjs/express",
    framework: "express",
    template: "express",
  },
  "Node.js (Fastify)": {
    type: "backend",
    repo: "fastify/fastify",
    framework: "fastify",
    template: "fastify",
  },
  "Node.js (Koa)": {
    type: "backend",
    repo: "koajs/koa",
    framework: "koa",
    template: "koa",
  },
  "Node.js (Nest)": {
    type: "backend",
    repo: "nestjs/nest",
    framework: "nest",
    template: "nest",
  },
  "PostgreSQL": {
    type: "database",
    repo: "postgres/postgres",
    framework: "postgres",
    template: "postgres",
  },
  "MongoDB": {
    type: "database",
    repo: "mongodb/mongo",
    framework: "mongo",
    template: "mongo",
  },
  "Redis": {
    type: "database",
    repo: "redis/redis",
    framework: "redis",
    template: "redis",
  },
  "MySQL": {
    type: "database",
    repo: "mysql/mysql-server",
    framework: "mysql",
    template: "mysql",
  },
  "SQLite": {
    type: "database",
    repo: "sqlite/sqlite",
    framework: "sqlite",
    template: "sqlite",
  },
  "MariaDB": {
    type: "database",
    repo: "mariadb/server",
    framework: "mariadb",
    template: "mariadb",
  },
}

const releases = {};

// Use a single GraphQL query to get all the releases for all the repos
const query = `
  query {
    ${Object.values(repos).map(repo => `
      ${repo.repo.replace('/', '_')}: repository(owner: "${repo.repo.split('/')[0]}", name: "${repo.repo.split('/')[1]}") {
        releases(first: 100, orderBy: {field: CREATED_AT, direction: DESC}) {
          nodes {
            name
            tagName
            url
            publishedAt
            isPrerelease
          }
        }
      }
    `).join('\n')}
  }
`;

// Make the GraphQL request to GitHub
const options = {
  hostname: 'api.github.com',
  path: '/graphql',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'create-fullstack-app'
  }
};

// const req = https.request(options, res => {
//   let data = '';

//   res.on('data', chunk => {
//     data += chunk;
//   });

//   res.on('end', () => {
//     const json = JSON.parse(data);
//     Object.keys(json.data).forEach(repo => {
//       const releases = json.data[repo].releases.nodes;
//       const releasesWithoutPrereleases = releases.filter(release => !release.isPrerelease);
//       const latestRelease = releasesWithoutPrereleases[0];
//       repos[repo.replace('_', '/')].latestRelease = latestRelease;
//     });
//   });
// }
// );

router.get('/', (req, res) => {
  res.json(releases);
});

// GET based on the repo name
router.get('/:repo', (req, res) => {
  const repo = req.params.repo;
  res.json(releases[repo]);
});

module.exports = router;