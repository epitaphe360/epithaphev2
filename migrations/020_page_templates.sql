-- Create page_templates table for reusable design templates
CREATE TABLE IF NOT EXISTS page_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  category VARCHAR(100) DEFAULT 'general',
  thumbnail_url TEXT,
  sections JSONB NOT NULL DEFAULT '[]',
  preview_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster lookups
CREATE INDEX idx_page_templates_slug ON page_templates(slug);
CREATE INDEX idx_page_templates_category ON page_templates(category);
CREATE INDEX idx_page_templates_active ON page_templates(is_active);

-- Insert demo templates inspired by Leedo theme
INSERT INTO page_templates (name, slug, description, category, sections, is_active)
VALUES
  (
    'Portfolio Landing',
    'portfolio-landing',
    'Modern portfolio landing page with hero, portfolio grid, and testimonials',
    'leedo',
    '[
      {
        "id": "hero-1",
        "type": "hero",
        "enabled": true,
        "order": 0,
        "props": {
          "title": "Creative Portfolio",
          "subtitle": "Showcasing our best work and creative excellence",
          "image": "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&h=600",
          "cta": "View Portfolio",
          "ctaHref": "#portfolio"
        }
      },
      {
        "id": "intro-1",
        "type": "intro",
        "enabled": true,
        "order": 1,
        "props": {
          "pretitle": "Who We Are",
          "title": "Creative Studio & Design Excellence",
          "text": "We are a team of passionate creatives dedicated to delivering exceptional design and digital solutions. Our portfolio speaks for itself."
        }
      },
      {
        "id": "hub-cards-1",
        "type": "hub-cards",
        "enabled": true,
        "order": 2,
        "props": {
          "title": "Our Services",
          "cards": [
            {
              "id": "card-1",
              "title": "Web Design",
              "description": "Beautiful, responsive websites tailored to your needs",
              "icon": "🎨"
            },
            {
              "id": "card-2",
              "title": "Branding",
              "description": "Strategic brand identity and visual guidelines",
              "icon": "📱"
            },
            {
              "id": "card-3",
              "title": "Digital Strategy",
              "description": "Data-driven insights and growth strategies",
              "icon": "📊"
            }
          ]
        }
      },
      {
        "id": "testimonial-1",
        "type": "testimonial",
        "enabled": true,
        "order": 3,
        "props": {
          "title": "What Our Clients Say",
          "testimonials": [
            {
              "quote": "Exceptional work and amazing customer service throughout the project.",
              "author": "Sarah Johnson",
              "role": "CEO, Tech Startup"
            },
            {
              "quote": "The team delivered beyond our expectations. Highly recommended!",
              "author": "Mike Chen",
              "role": "Founder, Creative Agency"
            }
          ]
        }
      },
      {
        "id": "cta-1",
        "type": "cta",
        "enabled": true,
        "order": 4,
        "props": {
          "title": "Ready to Start Your Project?",
          "subtitle": "Let us help you bring your vision to life",
          "ctaLabel": "Get In Touch",
          "ctaHref": "/contact"
        }
      }
    ]',
    true
  ),
  (
    'Service Showcase',
    'service-showcase',
    'Service page with pricing tables and features',
    'leedo',
    '[
      {
        "id": "service-hero-1",
        "type": "service-hero",
        "enabled": true,
        "order": 0,
        "props": {
          "title": "Our Professional Services",
          "subtitle": "Comprehensive solutions for modern businesses",
          "image": "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&h=600"
        }
      },
      {
        "id": "service-blocks-1",
        "type": "service-blocks",
        "enabled": true,
        "order": 1,
        "props": {
          "title": "What We Offer",
          "blocks": [
            {
              "id": "block-1",
              "title": "Strategy & Consulting",
              "description": "Expert guidance to shape your digital strategy"
            },
            {
              "id": "block-2",
              "title": "Design & Development",
              "description": "Beautiful and functional digital products"
            },
            {
              "id": "block-3",
              "title": "Support & Maintenance",
              "description": "Ongoing support and optimization"
            }
          ]
        }
      },
      {
        "id": "pricing-table-1",
        "type": "testimonial-card",
        "enabled": true,
        "order": 2,
        "props": {
          "title": "Pricing Plans",
          "pricing": [
            {
              "name": "Starter",
              "price": "$999",
              "features": ["Consultation", "Basic Design", "3 Revisions"]
            },
            {
              "name": "Professional",
              "price": "$2,499",
              "features": ["Full Strategy", "Advanced Design", "Unlimited Revisions"]
            },
            {
              "name": "Enterprise",
              "price": "Custom",
              "features": ["Everything", "Dedicated Team", "Priority Support"]
            }
          ]
        }
      },
      {
        "id": "cta-final-1",
        "type": "cta",
        "enabled": true,
        "order": 3,
        "props": {
          "title": "Choose Your Plan Today",
          "subtitle": "Start transforming your business",
          "ctaLabel": "Get Started",
          "ctaHref": "/contact"
        }
      }
    ]',
    true
  ),
  (
    'Agency About',
    'agency-about',
    'Company/agency about page with team and case studies',
    'leedo',
    '[
      {
        "id": "hero-about-1",
        "type": "hero",
        "enabled": true,
        "order": 0,
        "props": {
          "title": "About Our Agency",
          "subtitle": "We are passionate about creating exceptional digital experiences",
          "image": "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&h=600"
        }
      },
      {
        "id": "intro-about-1",
        "type": "intro",
        "enabled": true,
        "order": 1,
        "props": {
          "pretitle": "Our Story",
          "title": "Founded on Creativity and Innovation",
          "text": "Since 2010, we have been helping businesses transform their digital presence through strategic design and development."
        }
      },
      {
        "id": "team-1",
        "type": "team",
        "enabled": true,
        "order": 2,
        "props": {
          "title": "Meet the Team",
          "team": [
            {
              "id": "member-1",
              "name": "Alice Johnson",
              "role": "Creative Director",
              "image": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&h=500"
            },
            {
              "id": "member-2",
              "name": "Bob Smith",
              "role": "Lead Developer",
              "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&h=500"
            },
            {
              "id": "member-3",
              "name": "Carol Davis",
              "role": "UX/UI Designer",
              "image": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=500&h=500"
            }
          ]
        }
      },
      {
        "id": "stats-1",
        "type": "stats",
        "enabled": true,
        "order": 3,
        "props": {
          "stats": [
            {
              "id": "stat-1",
              "label": "Projects Completed",
              "value": "150+",
              "color": "#3b82f6"
            },
            {
              "id": "stat-2",
              "label": "Happy Clients",
              "value": "100+",
              "color": "#10b981"
            },
            {
              "id": "stat-3",
              "label": "Team Members",
              "value": "25+",
              "color": "#f59e0b"
            },
            {
              "id": "stat-4",
              "label": "Awards Won",
              "value": "15+",
              "color": "#ef4444"
            }
          ]
        }
      },
      {
        "id": "contact-1",
        "type": "contact-form",
        "enabled": true,
        "order": 4,
        "props": {
          "title": "Let''s Work Together",
          "subtitle": "Get in touch with our team"
        }
      }
    ]',
    true
  );
