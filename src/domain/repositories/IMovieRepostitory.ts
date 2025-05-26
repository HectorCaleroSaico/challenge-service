import { Movie } from '../entities/Movie';

export interface IMovieRepository {

    getMovieDetail(title: string): Promise<Movie | null>;

}