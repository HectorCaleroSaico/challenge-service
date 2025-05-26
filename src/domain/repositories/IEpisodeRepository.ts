import { Episode } from '../entities/Episode';

export interface IEpisodeRepository {

    getAllEpisodes(): Promise<Episode[]>;

}