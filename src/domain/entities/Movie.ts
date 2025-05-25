import { Rating } from './Rating';

export class Movie {

    constructor(
        public title: string,
        public runtime: string,
        public gender: string,
        public actors: string,
        public overview: string,
        public poster: string,
        public metaScore: number,
        public imdbRating: number,
        public imdbVotes: number,
        public ratings: Rating[]
    ) {}

}