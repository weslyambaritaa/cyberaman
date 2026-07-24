export type Profile = {
  id: string;
  username: string;
  points: number;
  created_at: string;
};

export type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  points_threshold: number | null;
};

export type UserBadge = {
  user_id: string;
  badge_id: string;
  earned_at: string;
};

export type LeaderboardRow = {
  user_id: string;
  username: string;
  points: number;
};

export type SecurityScore = {
  overall: number;
  components: {
    password: number | null;
    phishing: number | null;
    footprint: number | null;
  };
};
