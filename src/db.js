const fs = require('node:fs');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const dataDir = path.join(__dirname, '..', 'data');
const dbPath = path.join(dataDir, 'she-can-foundation.db');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new DatabaseSync(dbPath);

db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS site_stats (
    id INTEGER PRIMARY KEY,
    label TEXT NOT NULL,
    value TEXT NOT NULL,
    detail TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS programs (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    outcome TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS testimonials (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    quote TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    details_json TEXT NOT NULL DEFAULT '{}',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);

function seedTable(tableName, rows, columns) {
  const placeholders = columns.map(() => '?').join(', ');
  const statement = db.prepare(
    `INSERT OR IGNORE INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`
  );

  for (const row of rows) {
    statement.run(...columns.map((column) => row[column]));
  }
}

function seedDatabase() {
  seedTable(
    'site_stats',
    [
      {
        id: 1,
        label: 'Women supported',
        value: '2,400+',
        detail: 'Women and girls reached through programs and community events.',
      },
      {
        id: 2,
        label: 'Mentors and coaches',
        value: '180+',
        detail: 'Volunteer mentors helping participants stay focused and connected.',
      },
      {
        id: 3,
        label: 'Communities served',
        value: '12',
        detail: 'Neighborhoods and partner communities included in the foundation network.',
      },
      {
        id: 4,
        label: 'Program completion',
        value: '94%',
        detail: 'Participants who finish a full support cycle and next-step plan.',
      },
    ],
    ['id', 'label', 'value', 'detail']
  );

  seedTable(
    'programs',
    [
      {
        id: 1,
        title: 'Leadership Circles',
        summary:
          'Small-group mentoring that builds confidence, goal setting, communication, and peer support.',
        outcome: 'Participants leave with a personal growth plan and a trusted support network.',
      },
      {
        id: 2,
        title: 'Skills for Growth',
        summary:
          'Career readiness, digital literacy, financial confidence, and practical learning workshops.',
        outcome: 'Women gain tools that improve employability and small-business readiness.',
      },
      {
        id: 3,
        title: 'Wellness and Resilience',
        summary:
          'A holistic program focused on emotional wellbeing, community care, and self-advocacy.',
        outcome: 'Participants gain habits and resources that support long-term stability.',
      },
    ],
    ['id', 'title', 'summary', 'outcome']
  );

  seedTable(
    'testimonials',
    [
      {
        id: 1,
        name: 'Amina',
        role: 'Program Graduate',
        quote:
          'She Can Foundation helped me see myself as a leader. I left with clarity, courage, and a plan.',
      },
      {
        id: 2,
        name: 'Grace',
        role: 'Volunteer Mentor',
        quote:
          'The support is personal and practical. You can feel the impact in every session and every story.',
      },
      {
        id: 3,
        name: 'Maya',
        role: 'Community Partner',
        quote:
          'This foundation shows what happens when women are given space, guidance, and real opportunity.',
      },
    ],
    ['id', 'name', 'role', 'quote']
  );
}

function getHomeContent() {
  return {
    organization: {
      name: 'She Can Foundation',
      tagline: 'Building confidence, skills, and opportunity for women and girls.',
      mission:
        'We create supportive programs that help women and girls grow in leadership, wellbeing, and economic independence.',
      email: 'hello@shecanfoundation.org',
      location: 'Community-led programs with local and regional partners',
    },
    stats: db.prepare('SELECT id, label, value, detail FROM site_stats ORDER BY id').all(),
    programs: db.prepare('SELECT id, title, summary, outcome FROM programs ORDER BY id').all(),
    testimonials: db.prepare('SELECT id, name, role, quote FROM testimonials ORDER BY id').all(),
  };
}

function createSubmission(type, payload) {
  const statement = db.prepare(`
    INSERT INTO submissions (type, name, email, subject, message, details_json)
    VALUES (@type, @name, @email, @subject, @message, @detailsJson)
  `);

  const result = statement.run({
    type,
    name: payload.name,
    email: payload.email,
    subject: payload.subject || null,
    message: payload.message,
    detailsJson: JSON.stringify(payload.details || {}),
  });

  return {
    id: Number(result.lastInsertRowid),
    type,
    name: payload.name,
    email: payload.email,
    subject: payload.subject || '',
    message: payload.message,
    details: payload.details || {},
  };
}

module.exports = {
  createSubmission,
  getHomeContent,
  seedDatabase,
};
