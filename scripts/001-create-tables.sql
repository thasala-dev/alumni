-- Create enum types
CREATE TYPE user_status AS ENUM ('PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'SUSPENDED');
CREATE TYPE privacy_level AS ENUM ('public', 'alumni-only', 'admin-only');
CREATE TYPE user_role AS ENUM ('admin', 'alumni');

-- Users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  role user_role DEFAULT 'alumni',
  status user_status DEFAULT 'PENDING_APPROVAL',
  national_id VARCHAR(13) UNIQUE,
  birth_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- OAuth providers table
CREATE TABLE user_providers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL,
  provider_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(provider, provider_id)
);

-- Alumni profiles table
CREATE TABLE alumni_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Profile section
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  nickname VARCHAR(50),
  profile_image_url TEXT,
  bio TEXT,
  graduation_year INTEGER,
  major VARCHAR(100),
  
  -- Personal section
  phone VARCHAR(20),
  line_id VARCHAR(50),
  facebook_url TEXT,
  linkedin_url TEXT,
  
  -- Privacy settings
  profile_privacy privacy_level DEFAULT 'alumni-only',
  personal_privacy privacy_level DEFAULT 'alumni-only',
  work_privacy privacy_level DEFAULT 'alumni-only',
  contact_privacy privacy_level DEFAULT 'alumni-only',
  other_privacy privacy_level DEFAULT 'alumni-only',
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Work history table
CREATE TABLE work_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  company_name VARCHAR(200) NOT NULL,
  position VARCHAR(100),
  province VARCHAR(100),
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN DEFAULT FALSE,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- News/Announcements table
CREATE TABLE news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES users(id),
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Comments table
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  news_id UUID REFERENCES news(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Discussion board categories
CREATE TABLE discussion_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Discussion topics
CREATE TABLE discussion_topics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES discussion_categories(id),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  pinned BOOLEAN DEFAULT FALSE,
  locked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Discussion replies
CREATE TABLE discussion_replies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID REFERENCES discussion_topics(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Notification settings
CREATE TABLE notification_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  email_notifications BOOLEAN DEFAULT TRUE,
  discussion_replies BOOLEAN DEFAULT TRUE,
  news_updates BOOLEAN DEFAULT TRUE,
  birthday_reminders BOOLEAN DEFAULT TRUE
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_work_history_user_id ON work_history(user_id);
CREATE INDEX idx_work_history_province ON work_history(province);
CREATE INDEX idx_news_published ON news(published);
CREATE INDEX idx_comments_news_id ON comments(news_id);
CREATE INDEX idx_discussion_topics_category ON discussion_topics(category_id);
CREATE INDEX idx_discussion_replies_topic ON discussion_replies(topic_id);
