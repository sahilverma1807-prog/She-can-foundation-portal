const express = require('express');
const { createSubmission, getHomeContent } = require('../db');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'she-can-foundation-api',
  });
});

router.get('/home', (req, res) => {
  res.json(getHomeContent());
});

function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function readString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

router.post('/contact', (req, res, next) => {
  try {
    const name = readString(req.body.name);
    const email = readString(req.body.email);
    const subject = readString(req.body.subject);
    const message = readString(req.body.message);

    if (!name || !isValidEmail(email) || !message) {
      return res.status(400).json({
        error: 'Name, a valid email, and a message are required.',
      });
    }

    const submission = createSubmission('contact', {
      name,
      email,
      subject,
      message,
      details: {
        source: 'contact-form',
      },
    });

    return res.status(201).json({
      message: 'Thank you. We will get back to you soon.',
      submission,
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/volunteer', (req, res, next) => {
  try {
    const name = readString(req.body.name);
    const email = readString(req.body.email);
    const skills = readString(req.body.skills);
    const availability = readString(req.body.availability);

    if (!name || !isValidEmail(email) || !skills) {
      return res.status(400).json({
        error: 'Name, a valid email, and skills or experience are required.',
      });
    }

    const submission = createSubmission('volunteer', {
      name,
      email,
      subject: 'Volunteer interest',
      message: skills,
      details: {
        availability,
        source: 'volunteer-form',
      },
    });

    return res.status(201).json({
      message: 'Thank you for volunteering. We will contact you with next steps.',
      submission,
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
