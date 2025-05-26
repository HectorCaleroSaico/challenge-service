import axios, { Axios, AxiosResponse } from 'axios';
import { IEpisodeRepository } from '../domain/repositories/IEpisodeRepository';
import { Episode } from '../domain/entities/Episode';

export class SwapiRepository implements IEpisodeRepository {

    private apiClient: Axios = axios.create({
        baseURL: 'https://www.swapi.tech/api'
    });

    async getAllEpisodes(): Promise<Episode[]> {
        
        try {
            
            const response: AxiosResponse = await this.apiClient.get('/films')

            const { data } = response;

            const episodes: Episode[] = data?.result?.map(({ properties }: any) => new Episode(
                properties.episode_id, 
                properties.title, 
                properties.release_date, 
                properties.producer
            ));

            return episodes;


        } catch (error) {
            
            return [];
            
        }

    }

}