import axios, { Axios } from 'axios';
import { IEpisodeRepository } from '../domain/repositories/IEpisodeRepository';
import { Episode } from '../domain/entities/Episode';

export const apiClient: Axios = axios.create({
    baseURL: 'https://www.swapi.tech/api'
});


export class SwapiRepository implements IEpisodeRepository {

    async episodes(): Promise<Episode[]> {
        
        try {
            
            const response = await apiClient.get('/films')

            const { data } = response;

            const episodes: Episode[] = data.map((episode: any) => new Episode(
                episode.episode_id, 
                episode.title, 
                episode.release_date, 
                episode.producer
            ));

            console.log(response);

            return episodes;


        } catch (error) {
            
            return [];
            
        }

    }

}