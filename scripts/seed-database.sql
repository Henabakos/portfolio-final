-- Create initial data for the portfolio

-- Insert About information
INSERT INTO about (id, name, title, bio, profile_image, resume_link, skills, experience, projects_count, available, created_at, updated_at)
VALUES (
  'about_1',
  'Alex Hales',
  'Product Designer',
  'As a product designer, I specialize in creating magical visual identities for digital products.',
  '/user.jpg',
  '#',
  ARRAY['Product Strategy', 'UX Design', 'Graphics', 'Backend Development', 'System Architecture'],
  '12',
  '1.5k',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  bio = EXCLUDED.bio,
  profile_image = EXCLUDED.profile_image,
  resume_link = EXCLUDED.resume_link,
  skills = EXCLUDED.skills,
  experience = EXCLUDED.experience,
  projects_count = EXCLUDED.projects_count,
  available = EXCLUDED.available,
  updated_at = NOW();

-- Insert Contact information
INSERT INTO contact (id, email, phone, location, socials, created_at, updated_at)
VALUES (
  'contact_1',
  'alex@example.com',
  '+1 (555) 123-4567',
  'San Francisco, CA',
  '{"website": "#", "linkedin": "#", "github": "#"}',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  location = EXCLUDED.location,
  socials = EXCLUDED.socials,
  updated_at = NOW();

-- Insert Social media data
INSERT INTO socials (id, platform, username, followers, url, icon, "order", created_at, updated_at)
VALUES 
  ('social_1', 'Instagram', '@hales', '50.8k followers', '#', 'Instagram', 1, NOW(), NOW()),
  ('social_2', 'Youtube', 'Alex Hales', '25k subscribers', '#', 'Youtube', 2, NOW(), NOW()),
  ('social_3', 'Twitter', '@alexhales', '3.5k followers', '#', 'Twitter', 3, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  platform = EXCLUDED.platform,
  username = EXCLUDED.username,
  followers = EXCLUDED.followers,
  url = EXCLUDED.url,
  icon = EXCLUDED.icon,
  "order" = EXCLUDED."order",
  updated_at = NOW();

-- Insert Tools data
INSERT INTO tools (id, name, icon, category, "order", created_at, updated_at)
VALUES 
  ('tool_1', 'Figma', 'Figma', 'Design', 1, NOW(), NOW()),
  ('tool_2', 'Webflow', 'Globe', 'Development', 2, NOW(), NOW()),
  ('tool_3', 'Framer', 'Frame', 'Design', 3, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  icon = EXCLUDED.icon,
  category = EXCLUDED.category,
  "order" = EXCLUDED."order",
  updated_at = NOW();

-- Insert Services data
INSERT INTO services (id, name, description, icon, "order", created_at, updated_at)
VALUES 
  ('service_1', 'Product Design', 'Creating beautiful and functional product designs', 'CurlyBraces', 1, NOW(), NOW()),
  ('service_2', 'Product Strategy', 'Strategic planning for product development', 'Rocket', 2, NOW(), NOW()),
  ('service_3', 'System Architecture', 'Building scalable system architectures', 'Atom', 3, NOW(), NOW()),
  ('service_4', 'Development', 'Full-stack development services', 'Code', 4, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  "order" = EXCLUDED."order",
  updated_at = NOW();

-- Insert sample Projects
INSERT INTO projects (id, title, description, image, category, link, tags, featured, "order", created_at, updated_at)
VALUES 
  ('project_1', 'Brand Identity Design', 'The easiest way to build marketplaces from Airtable in minutes. No code required.', '/project2.jpeg', 'Brand Identity', '#', ARRAY['Branding', 'Identity', 'Design'], true, 1, NOW(), NOW()),
  ('project_2', 'Standard Design System', 'Turn data into beautiful, powerful mobile apps.', '/project1.jpeg', 'Design System', '#', ARRAY['Design System', 'UI/UX', 'Components'], true, 2, NOW(), NOW()),
  ('project_3', 'Natural Perfume', 'Beautiful product branding for natural perfume line.', '/project2.jpeg', 'Product Branding', '#', ARRAY['Branding', 'Product', 'Packaging'], false, 3, NOW(), NOW()),
  ('project_4', 'SaaS Design for Unlash', 'Complete brand design for SaaS platform.', '/project1.jpeg', 'Brand Design', '#', ARRAY['SaaS', 'Branding', 'Web Design'], false, 4, NOW(), NOW()),
  ('project_5', 'Web Development', 'Full-stack web development project.', '/project2.jpeg', 'Web Development', '#', ARRAY['Development', 'Full-stack', 'React'], false, 5, NOW(), NOW()),
  ('project_6', 'AI Robot Design', 'Innovative AI robot interface design.', '/project1.jpeg', 'AI Robot Design', '#', ARRAY['AI', 'Robotics', 'Interface'], false, 6, NOW(), NOW()),
  ('project_7', 'Marketing Colonia', 'Product marketing campaign design.', '/project2.jpeg', 'Product Marketing', '#', ARRAY['Marketing', 'Campaign', 'Strategy'], false, 7, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  category = EXCLUDED.category,
  link = EXCLUDED.link,
  tags = EXCLUDED.tags,
  featured = EXCLUDED.featured,
  "order" = EXCLUDED."order",
  updated_at = NOW();

-- Insert sample Blog posts
INSERT INTO blog_posts (id, title, content, excerpt, cover_image, slug, published, tags, read_time, created_at, updated_at)
VALUES 
  ('blog_1', 'The Future of Design Systems', 'Design systems are evolving rapidly. In this post, we explore the latest trends and best practices for building scalable design systems that work across multiple platforms and teams.', 'Exploring the latest trends in design systems and how they are shaping the future of digital product design.', '/blog-img.svg', 'future-of-design-systems', true, ARRAY['Design Systems', 'UI/UX', 'Best Practices'], 8, NOW(), NOW()),
  ('blog_2', 'Building Better User Experiences', 'User experience is at the heart of every successful digital product. Learn how to create intuitive, accessible, and delightful experiences that users love.', 'A comprehensive guide to creating better user experiences through research, design, and testing.', '/blog-img.svg', 'building-better-user-experiences', true, ARRAY['UX Design', 'User Research', 'Accessibility'], 12, NOW(), NOW()),
  ('blog_3', 'The Art of Visual Storytelling', 'Visual storytelling is a powerful tool for designers. Discover how to use color, typography, and imagery to tell compelling stories through design.', 'Learn the principles of visual storytelling and how to apply them in your design work.', '/blog-img.svg', 'art-of-visual-storytelling', true, ARRAY['Visual Design', 'Storytelling', 'Branding'], 6, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  excerpt = EXCLUDED.excerpt,
  cover_image = EXCLUDED.cover_image,
  slug = EXCLUDED.slug,
  published = EXCLUDED.published,
  tags = EXCLUDED.tags,
  read_time = EXCLUDED.read_time,
  updated_at = NOW();
