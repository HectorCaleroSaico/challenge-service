import axios, { Axios, AxiosResponse } from 'axios';
import { IMovieRepository } from '../domain/repositories/IMovieRepostitory';
import { Movie } from '../domain/entities/Movie';
import { Rating } from '../domain/entities/Rating';

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
            
            const response: AxiosResponse = await this.apiClient.get(`?${params.toString()}`);

            const { data } = response;

            //console.log('Response: ', response);

            console.log('Data: ', data);

            if (!data) return null;

            const ratings: Rating[] = data?.Ratings.map((rating: any) => new Rating(
                rating?.Source,
                rating?.Value
            ));

            console.log('Ratings: ', ratings);

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

            console.log('Movie: ', movie);

            return movie;


        } catch (error) {

            console.log('OmdbapiRepository - Error: ', JSON.stringify(error));

            return null;
            
        }

    }

}