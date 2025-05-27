import axios, { Axios, AxiosResponse } from 'axios';
import { IEpisodeRepository } from '../../domain/repositories/IEpisodeRepository';
import { Episode } from '../../domain/entities/Episode';
import { Properties, Result, SwapiAllEpisodesResponse, SwapiEpisodeResponse } from './interfaces/Swapi';

export class SwapiRepository implements IEpisodeRepository {

    private apiClient: Axios = axios.create({
        baseURL: 'https://www.swapi.tech/api'
    });

    async getAllEpisodes(): Promise<Episode[]> {
        
        try {
            
            const { data }: AxiosResponse<SwapiAllEpisodesResponse> = await this.apiClient.get('/films')

            if (!data) return [];

            const episodes: Episode[] = data?.result?.map(({ properties }: Result) => new Episode(
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

    async getEpisodeById(episodeId: number): Promise<Episode | null> {
        
        try {
            
            const { data }: AxiosResponse<SwapiAllEpisodesResponse> = await this.apiClient.get(`/films`)

            if (!data) return null;

            const episodes: Result[] = data?.result;

            const episodeApi: Result = episodes.filter(({ properties }: Result) => properties.episode_id == episodeId)[0];

            const episode: Episode = new Episode(
                episodeApi.properties?.episode_id,
                episodeApi.properties?.title,
                episodeApi.properties?.release_date,
                episodeApi.properties?.producer
            );
            
            return episode;

        } catch (error) {

            return null;
            
        }

    }

}