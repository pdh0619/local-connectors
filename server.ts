import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;
const PROPOSALS_FILE = path.join(process.cwd(), 'proposals.json');
const COURSES_FILE = path.join(process.cwd(), 'courses.json');
const SETTINGS_FILE = path.join(process.cwd(), 'settings.json');

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Ensure proposals file exists
if (!fs.existsSync(PROPOSALS_FILE)) {
  fs.writeFileSync(PROPOSALS_FILE, JSON.stringify([], null, 2), 'utf-8');
}

// Ensure courses file exists. If it doesn't exist, we will copy it or write an empty array.
// But we created a courses.json at root, so we can check both places.
if (!fs.existsSync(COURSES_FILE)) {
  fs.writeFileSync(COURSES_FILE, JSON.stringify([], null, 2), 'utf-8');
}

// Ensure settings file exists
if (!fs.existsSync(SETTINGS_FILE)) {
  const defaultSettings = {
    themeColor: 'navy',
    fontStyle: 'serif',
    logoText: 'LOCAL CONNECTORS',
    heroTitle: '경험해보지 못한, 한국 로컬여행',
    heroSubtitle: '우리는 평범한 관광지가 아닌,\n지역의 예술성이 깃든 숨겨진 공간들을 연결하여 고유한 흐름을 제안합니다.',
    heroBanner: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1920&q=80',
    aboutCircleImage: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=800&q=80',
    approachImage1: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80',
    approachImage2: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    approachImage3: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80'
  };
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(defaultSettings, null, 2), 'utf-8');
}

// Helpers
function getProposals() {
  try {
    const data = fs.readFileSync(PROPOSALS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

function saveProposals(proposals: any[]) {
  fs.writeFileSync(PROPOSALS_FILE, JSON.stringify(proposals, null, 2), 'utf-8');
}

function getCourses() {
  try {
    const data = fs.readFileSync(COURSES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

function saveCourses(courses: any[]) {
  fs.writeFileSync(COURSES_FILE, JSON.stringify(courses, null, 2), 'utf-8');
  const publicPath = path.join(process.cwd(), 'public', 'courses.json');
  try {
    if (!fs.existsSync(path.join(process.cwd(), 'public'))) {
      fs.mkdirSync(path.join(process.cwd(), 'public'), { recursive: true });
    }
    fs.writeFileSync(publicPath, JSON.stringify(courses, null, 2), 'utf-8');
  } catch (e) {
    // Ignore error if public dir write fails
  }
}

function getSettings() {
  try {
    const data = fs.readFileSync(SETTINGS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    return {};
  }
}

function saveSettings(settings: any) {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf-8');
  const publicPath = path.join(process.cwd(), 'public', 'settings.json');
  try {
    if (!fs.existsSync(path.join(process.cwd(), 'public'))) {
      fs.mkdirSync(path.join(process.cwd(), 'public'), { recursive: true });
    }
    fs.writeFileSync(publicPath, JSON.stringify(settings, null, 2), 'utf-8');
  } catch (e) {
    // Ignore error if public dir write fails
  }
}

// API Routes
app.get('/api/settings', (req, res) => {
  const settings = getSettings();
  res.json(settings);
});

app.put('/api/settings', (req, res) => {
  const newSettings = req.body;
  saveSettings(newSettings);
  res.json(newSettings);
});

app.get('/api/courses', (req, res) => {
  const courses = getCourses();
  res.json(courses);
});

app.put('/api/courses', (req, res) => {
  const newCourses = req.body;
  if (Array.isArray(newCourses)) {
    saveCourses(newCourses);
    return res.json(newCourses);
  }
  res.status(400).json({ error: 'Expected an array of courses' });
});

app.post('/api/courses/:id/view', (req, res) => {
  const { id } = req.params;
  const courses = getCourses();
  const index = courses.findIndex((c: any) => c.id === id);
  if (index !== -1) {
    courses[index].views = (courses[index].views || 0) + 1;
    saveCourses(courses);
    return res.json(courses[index]);
  }
  res.status(404).json({ error: 'Course not found' });
});

app.post('/api/courses/:id/like', (req, res) => {
  const { id } = req.params;
  const courses = getCourses();
  const index = courses.findIndex((c: any) => c.id === id);
  if (index !== -1) {
    courses[index].likes = (courses[index].likes || 0) + 1;
    saveCourses(courses);
    return res.json(courses[index]);
  }
  res.status(404).json({ error: 'Course not found' });
});

app.get('/api/proposals', (req, res) => {
  const proposals = getProposals();
  res.json(proposals);
});

app.post('/api/proposals', (req, res) => {
  const proposals = getProposals();
  const newProposal = {
    ...req.body,
    id: `proposal-${Date.now()}`,
    createdAt: new Date().toISOString().split('T')[0],
    status: req.body.status || 'pending',
  };
  proposals.push(newProposal);
  saveProposals(proposals);
  res.status(201).json(newProposal);
});

app.put('/api/proposals/:id', (req, res) => {
  const { id } = req.params;
  const proposals = getProposals();
  const index = proposals.findIndex((p: any) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Proposal not found' });
  }
  proposals[index] = { ...proposals[index], ...req.body };
  saveProposals(proposals);
  res.json(proposals[index]);
});

app.delete('/api/proposals/:id', (req, res) => {
  const { id } = req.params;
  let proposals = getProposals();
  proposals = proposals.filter((p: any) => p.id !== id);
  saveProposals(proposals);
  res.json({ success: true });
});

// Vite middleware for dev mode, static files for prod mode
async function initServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

initServer();
