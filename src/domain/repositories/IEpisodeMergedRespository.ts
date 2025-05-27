import { EpisodeMerged } from '../entities/EpisodeMerged';

export interface IEpisodeMergedRespository {

    saveEpisode(episodeMerged: EpisodeMerged): Promise<void>;

    getEpisodeById(episodeId: number): Promise<EpisodeMerged | null>;

}