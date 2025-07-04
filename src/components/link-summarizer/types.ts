
export interface SummarizerState {
  url: string;
  summary: string;
  loading: boolean;
  isPlaying: boolean;
}

export interface SummarizerActions {
  setUrl: (url: string) => void;
  setSummary: (summary: string) => void;
  setLoading: (loading: boolean) => void;
  setIsPlaying: (isPlaying: boolean) => void;
}
