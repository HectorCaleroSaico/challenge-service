import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { EpisodesService } from '../services/EpisodeService';
import { IEpisodeRepository } from '../../domain/repositories/IEpisodeRepository';
import { SwapiRepository } from '../../infraestructure/external/SwapiRepository';
import { IMovieRepository } from '../../domain/repositories/IMovieRepostitory';
import { OmdbapiRepository } from '../../infraestructure/external/OmdbapiRepository';
import { IEpisodeMergedRespository } from '../../domain/repositories/IEpisodeMergedRespository';
import { DynamoDBRepository } from '../../infraestructure/aws/DynamoDBRepository';

const episodesRepository: IEpisodeRepository = new SwapiRepository();
const movieRepository: IMovieRepository = new OmdbapiRepository();
const episodeMergedRespository: IEpisodeMergedRespository = new DynamoDBRepository();

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {

    const episodeId = event.pathParameters?.episodeId ? parseInt(event.pathParameters.episodeId) : null;

    const episodesService: EpisodesService = new EpisodesService(
        episodesRepository,
        movieRepository,
        episodeMergedRespository
    );

    if (!episodeId) {
    
        const episodesMerged = await episodesService.getMergedEpisodes();

        return {
            statusCode: 200,
            body: JSON.stringify(episodesMerged)
        };

    }

    const episodeMerged = await episodesService.getMergedEpisodeById(episodeId);

    return {
        statusCode: episodeMerged ? 200 : 204,
        body: JSON.stringify(episodeMerged)
    };

};