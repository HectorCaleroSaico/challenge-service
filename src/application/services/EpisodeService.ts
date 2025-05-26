import { IEpisodeRepository } from '../../domain/repositories/IEpisodeRepository';
import { IMovieRepository } from '../../domain/repositories/IMovieRepostitory';
import { Episode } from '../../domain/entities/Episode';
import { EpisodeMerged } from '../../domain/entities/EpisodeMerged';
import { Movie } from '../../domain/entities/Movie';

export class EpisodesService {

    constructor(
        private episodesRepository: IEpisodeRepository,
        private movieRepository: IMovieRepository
    ) {}

    async getMergedEpisodes() {

        const episodes: Episode[] = await this.episodesRepository.getAllEpisodes();

        console.log('Service - episodes: ', episodes);

        if (episodes.length === 0)  return [];

        const episodesMerged: EpisodeMerged[] = await Promise.all(
            episodes.map(async (episode: Episode): Promise<EpisodeMerged> => {

                const titleValidate = episode.title.toLowerCase().includes('star wars') ? episode.title.replaceAll('star wars').toLowerCase().trim() : episode.title.toLowerCase().trim();

                const movie: Movie | null = await this.movieRepository.getMovieDetail(`star wars: episode ${toRomanNumber(episode.episodeId)} ${titleValidate}`);

                console.log('Service - Movie: ', movie);

                if (!movie) return new EpisodeMerged(
                    episode.episodeId,
                    episode.title,
                    episode.releaseDate,
                    episode.producer
                );

                return new EpisodeMerged(
                    episode.episodeId,
                    movie.title,
                    episode.releaseDate,
                    episode.producer,
                    movie.runtime,
                    movie.gender,
                    movie.actors,
                    movie.overview,
                    movie.poster,
                    movie.metaScore,
                    movie.imdbRating,
                    movie.imdbVotes,
                    movie.ratings
                );

            })
        );

        return episodesMerged;

    }

}

const toRomanNumber = (num: number): string => {

    const lookup: [symbol: string, value: number][] = [
        ['M', 1000],
        ['CM', 900],
        ['D', 500],
        ['CD', 400],
        ['C', 100],
        ['XC', 90],
        ['L', 50],
        ['XL', 40],
        ['X', 10],
        ['IX', 9],
        ['V', 5],
        ['IV', 4],
        ['I', 1]
    ];

    return lookup.reduce((acc, [k, v]) => {
        acc += k.repeat(Math.floor(num/v));
        num = num % v;

        return acc;
    }, '')

}