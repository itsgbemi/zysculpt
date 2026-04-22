import express from 'express';
import { createServer as createViteServer } from 'vite';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';
import cors from 'cors';
import path from 'path';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Email Transporter (lazy initialization to avoid crash if keys missing)
  let transporter: nodemailer.Transporter | null = null;
  
  const getTransporter = () => {
    if (!transporter) {
      if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
        throw new Error("Missing GMAIL_USER or GMAIL_APP_PASSWORD");
      }
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });
    }
    return transporter;
  };

  const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
  const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

  // Track Action API
  app.post('/api/track', async (req, res) => {
    try {
      const { userId, userEmail, action } = req.body;
      
      if (!supabase) {
        return res.status(400).json({ error: "Supabase not configured" });
      }

      // Check if this action was already tracked
      const { data: existing } = await supabase
        .from('user_actions')
        .select('*')
        .eq('user_id', userId)
        .eq('action', action)
        .single();
      
      if (!existing) {
        // Log action in database
        await supabase.from('user_actions').insert({
          user_id: userId,
          action: action
        });

        // Send achievement email
        const mailer = getTransporter();
        let subject = "";
        let text = "";
        
        if (action === 'first_job') {
          subject = "🎉 You've tracked your first job!";
          text = "Congratulations! Taking the first step in tracking your applications is the best way to get hired faster. Keep up the great work with Zysculpt!";
        } else if (action === 'first_task') {
          subject = "✅ First task completed!";
          text = "Awesome job! You just checked off your first task. Staying organized is key to landing your dream role.";
        }

        if (subject) {
          await mailer.sendMail({
            from: `"Zysculpt" <${process.env.GMAIL_USER}>`,
            to: userEmail,
            subject,
            text,
          });
        }
      }
      
      res.json({ success: true });
    } catch (err: any) {
      console.error("Tracking Error:", err.message);
      res.status(500).json({ error: err.message });
    }
  });

  // Welcome Email API
  app.post('/api/welcome', async (req, res) => {
    try {
      const { email } = req.body;
      const mailer = getTransporter();
      await mailer.sendMail({
        from: `"Zysculpt" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: "Welcome to Zysculpt! 🚀",
        text: "We are thrilled to have you! Zysculpt is designed to help you get hired faster. Explore the AI tools, templates, and tracking features. Let's build your career together!",
      });
      res.json({ success: true });
    } catch (err: any) {
      console.error("Welcome Email Error:", err.message);
      res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
