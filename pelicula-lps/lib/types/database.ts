export type UserProfile = {
  id: string;
  full_name: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Course = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  thumbnail_url: string | null;
  hero_image_url: string | null;
  instructor_name: string;
  instructor_avatar_url: string | null;
  total_lessons: number;
  total_duration_minutes: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type Module = {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  sort_order: number;
  created_at: string;
};

export type Lesson = {
  id: string;
  module_id: string;
  slug: string;
  title: string;
  description: string | null;
  panda_video_id: string | null;
  duration_minutes: number;
  sort_order: number;
  is_free_preview: boolean;
  created_at: string;
};

export type Plan = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price_cents: number;
  billing_period: "one_time" | "monthly" | "yearly";
  mp_plan_id: string | null;
  is_active: boolean;
  created_at: string;
};

export type Subscription = {
  id: string;
  user_id: string;
  plan_id: string;
  mp_subscription_id: string | null;
  status: "pending" | "authorized" | "paused" | "cancelled" | "expired";
  current_period_start: string | null;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
};

export type Payment = {
  id: string;
  user_id: string;
  plan_id: string;
  subscription_id: string | null;
  mp_payment_id: string | null;
  amount_cents: number;
  status: "pending" | "approved" | "rejected" | "refunded" | "cancelled";
  payment_method: string | null;
  mp_status_detail: string | null;
  created_at: string;
  updated_at: string;
};

export type UserCourseAccess = {
  id: string;
  user_id: string;
  course_id: string;
  granted_by: "payment" | "subscription" | "admin" | "promo";
  payment_id: string | null;
  subscription_id: string | null;
  expires_at: string | null;
  created_at: string;
};

export type LessonProgress = {
  id: string;
  user_id: string;
  lesson_id: string;
  watched_seconds: number;
  watched_percent: number;
  last_position_seconds: number;
  completed: boolean;
  completed_at: string | null;
  updated_at: string;
};

// Composite types for queries
export type ModuleWithLessons = Module & {
  lessons: (Lesson & { progress?: LessonProgress })[];
};

export type CourseWithModules = Course & {
  modules: ModuleWithLessons[];
};

export type CourseWithProgress = Course & {
  completed_lessons: number;
  total_course_lessons: number;
  last_lesson?: {
    slug: string;
    title: string;
    module_slug?: string;
    last_position_seconds: number;
  };
};
