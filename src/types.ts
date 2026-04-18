export interface Landmark {
  ep: number;
  title: string;
  note?: string;
  rating: number;
}

export interface Arc {
  id: string;
  name: string;
  episodes: string;
  startEp: number;
  endEp: number;
  count: number;
  thumbnailEmoji: string;
  description: string;
  villain: string;
  highlight?: string;
  mustWatch?: boolean;
  rating: number;
  landmarks?: Landmark[];
}

export interface Saga {
  id: string;
  name: string;
  subtitle: string;
  episodes: string;
  totalEps: number;
  color: string;
  darkColor: string;
  icon: string;
  description: string;
  rating: number;
  arcs: Arc[];
}
