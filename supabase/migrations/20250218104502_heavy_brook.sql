/*
  # Initial Schema Setup

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `employee_id` (text, unique)
      - `name` (text)
      - `email` (text, unique)
      - `school` (text)
      - Created by auth.users

    - `courses`
      - `id` (uuid, primary key)
      - `year` (integer)
      - `stream` (text)
      - `course_type` (text)
      - `course_code` (text)
      - `course_title` (text)
      - `lecture_hours` (integer)
      - `tutorial_hours` (integer)
      - `practical_hours` (integer)
      - `credits` (integer)
      - `prerequisites` (text)
      - `school` (text)
      - `forenoon_slots` (integer)
      - `afternoon_slots` (integer)
      - `total_slots` (integer)
      - `basket` (text)

    - `course_allocations`
      - `id` (uuid, primary key)
      - `course_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key)
      - `slot_type` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create users table that extends auth.users
CREATE TABLE users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  employee_id text UNIQUE NOT NULL,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  school text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create courses table
CREATE TABLE courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year integer NOT NULL,
  stream text NOT NULL,
  course_type text,
  course_code text NOT NULL,
  course_title text NOT NULL,
  lecture_hours integer DEFAULT 0,
  tutorial_hours integer DEFAULT 0,
  practical_hours integer DEFAULT 0,
  credits integer DEFAULT 0,
  prerequisites text,
  school text NOT NULL,
  forenoon_slots integer DEFAULT 0,
  afternoon_slots integer DEFAULT 0,
  total_slots integer DEFAULT 0,
  basket text,
  created_at timestamptz DEFAULT now()
);

-- Create course allocations table
CREATE TABLE course_allocations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  slot_type text CHECK (slot_type IN ('FN', 'AN')) NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(course_id, user_id, slot_type)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_allocations ENABLE ROW LEVEL SECURITY;

-- Policies for users table
CREATE POLICY "Users can view their own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Policies for courses table
CREATE POLICY "Anyone can view courses"
  ON courses
  FOR SELECT
  TO authenticated
  USING (true);

-- Policies for course allocations
CREATE POLICY "Users can view their allocations"
  ON course_allocations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their allocations"
  ON course_allocations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create function to handle course allocation
CREATE OR REPLACE FUNCTION allocate_course(
  p_course_id uuid,
  p_slot_type text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_allocation_id uuid;
  v_slots integer;
BEGIN
  -- Check if slots are available
  IF p_slot_type = 'FN' THEN
    SELECT forenoon_slots INTO v_slots FROM courses WHERE id = p_course_id;
  ELSE
    SELECT afternoon_slots INTO v_slots FROM courses WHERE id = p_course_id;
  END IF;

  IF v_slots <= 0 THEN
    RAISE EXCEPTION 'No slots available';
  END IF;

  -- Create allocation
  INSERT INTO course_allocations (course_id, user_id, slot_type)
  VALUES (p_course_id, auth.uid(), p_slot_type)
  RETURNING id INTO v_allocation_id;

  -- Update available slots
  IF p_slot_type = 'FN' THEN
    UPDATE courses
    SET forenoon_slots = forenoon_slots - 1
    WHERE id = p_course_id;
  ELSE
    UPDATE courses
    SET afternoon_slots = afternoon_slots - 1
    WHERE id = p_course_id;
  END IF;

  RETURN v_allocation_id;
END;
$$;