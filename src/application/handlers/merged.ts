import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { EpisodesService } from '../services/EpisodeService';
import { IEpisodeRepository } from '../../domain/repositories/IEpisodeRepository';
import { SwapiRepository } from '../../infraestructure/SwapiRepository';
import { IMovieRepository } from '../../domain/repositories/IMovieRepostitory';
import { OmdbapiRepository } from '../../infraestructure/OmdbapiRepository';

const episodesRepository: IEpisodeRepository = new SwapiRepository();
const movieRepository: IMovieRepository = new OmdbapiRepository();

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {

    const episodesService: EpisodesService = new EpisodesService(
        episodesRepository,
        movieRepository
    );

    const episodesMerged = await episodesService.getMergedEpisodes();

    console.log('Handler: ', episodesMerged);

    return {
        statusCode: 200,
        body: JSON.stringify(episodesMerged)
    };

};