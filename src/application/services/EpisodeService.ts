import { IEpisodeRepository } from '../../domain/repositories/IEpisodeRepository';
import { IMovieRepository } from '../../domain/repositories/IMovieRepostitory';
import { Episode } from '../../domain/entities/Episode';
import { EpisodeMerged } from '../../domain/entities/EpisodeMerged';
import { Movie } from '../../domain/entities/Movie';
import { IEpisodeMergedRespository } from '../../domain/repositories/IEpisodeMergedRespository';

export class EpisodesService {

    constructor(
        private episodesRepository: IEpisodeRepository,
        private movieRepository: IMovieRepository,
        private episodeMergedRespository: IEpisodeMergedRespository
    ) {}

    async getMergedEpisodes() {

        const episodes: Episode[] = await this.episodesRepository.getAllEpisodes();

        if (episodes.length === 0)  return [];

        const episodesMerged: EpisodeMerged[] = await Promise.all(
            episodes.map(async (episode: Episode): Promise<EpisodeMerged> => {

                const titleMovieComplete = getCompleteTitle(episode.title, episode.episodeId);

                const movie: Movie | null = await this.movieRepository.getMovieDetail(titleMovieComplete);

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

    async getMergedEpisodeById(episodeId: number) {

        const episodeAlt: EpisodeMerged | null = await this.episodeMergedRespository.getEpisodeById(episodeId);

        console.log('Episode Alt: ', episodeAlt);

        const episode: Episode | null = await this.episodesRepository.getEpisodeById(episodeId);

        if (!episode) return null;

        const titleMovieComplete = getCompleteTitle(episode.title, episode.episodeId);

        const movie: Movie | null = await this.movieRepository.getMovieDetail(titleMovieComplete);

        let episodeMerged: EpisodeMerged;

        if (!movie) {
            
            episodeMerged = new EpisodeMerged(
                episode.episodeId,
                episode.title,
                episode.releaseDate,
                episode.producer
            );

        } else {
            
            episodeMerged = new EpisodeMerged(
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

        }

        await this.episodeMergedRespository.saveEpisode(episodeMerged);

        return episodeMerged;

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

const getCompleteTitle = (titleEpisode: string, episodeId: number): string => {

    const titleValidate = titleEpisode.toLowerCase().includes('star wars') ? titleEpisode.replaceAll('star wars', '').toLowerCase().trim() : titleEpisode.toLowerCase().trim();

    return `star wars: episode ${toRomanNumber(episodeId)} ${titleValidate}`;

}