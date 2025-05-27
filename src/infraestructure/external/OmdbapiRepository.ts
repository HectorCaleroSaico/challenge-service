import axios, { Axios, AxiosResponse } from 'axios';
import { IMovieRepository } from '../../domain/repositories/IMovieRepostitory';
import { Movie } from '../../domain/entities/Movie';
import { Rating } from '../../domain/entities/Rating';
import { OmbdapiMovieResponse, RatingMovie } from './interfaces/Ombdapi';

export class OmdbapiRepository implements IMovieRepository {

    private apiClient: Axios = axios.create({
        baseURL: 'http://www.omdbapi.com/'
    });

    private apikey: string = '8a1c1411';

    async getMovieDetail(title: string): Promise<Movie | null> {

        const params: URLSearchParams = new URLSearchParams({
            t: title,
            apikey: this.apikey
        });
        
        try {
            
            const { data }: AxiosResponse<OmbdapiMovieResponse> = await this.apiClient.get(`?${params.toString()}`);

            if (!data) return null;

            const ratings: Rating[] = data?.Ratings.map((rating: RatingMovie) => new Rating(
                rating?.Source,
                rating?.Value
            ));

            const movie: Movie = new Movie(
                data?.Title,
                data?.Runtime,
                data?.Genre,
                data?.Actors,
                data?.Plot,
                data?.Poster,
                data?.Metascore !== 'N/A' ? parseInt(data.Metascore) : 0,
                data?.imdbRating !== 'N/A' ? parseFloat(data.imdbRating) : 0,
                data?.imdbVotes !== 'N/A' ? parseInt(data?.imdbVotes) : 0,
                ratings
            );

            return movie;


        } catch (error) {

            return null;
            
        }

    }

}