import { Episode } from '../entities/Episode';

export interface IEpisodeRepository {

    getAllEpisodes(): Promise<Episode[]>;

    getEpisodeById(episodeId: number): Promise<Episode | null>;

}