type Intra42Cursus = {
  id: string;
  name: string;
  grade: string;
  level: string;
  progress: string;
  coalition: string;
  coalitionURL: string;

  bhDate?: string;
  singularity?: number;

  rank: string;
  score: string;

  backgroundColor: string;
  backgroundImage: string;
  coalitionLogo: string;
};

type Intra42Profile = {
  login: string;
  fullName: string;
  avatarUrl: string;
  displayName: string;

  isAvailable: boolean;
  availableAt: string;

  currentCursus: Intra42Cursus | null;
  availableCursus: Intra42Cursus[];

  wallet: string;
  evaluationPoints: string;
};
