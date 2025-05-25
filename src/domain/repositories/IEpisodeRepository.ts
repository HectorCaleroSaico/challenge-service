import { Episode } from '../entities/Episode';

export interface IEpisodeRepository {

    episodes(): Promise<Episode[]>;

}