import { Rating } from './Rating';

export class EpisodeMerged {

    constructor(
        public episodeId: number,
        public title: string,
        public releaseDate: string,
        public producer: string,
        public runtime?: string,
        public gender?: string,
        public actors?: string,
        public overview?: string,
        public poster?: string,
        public metaScore?: number,
        public imdbRating?: number,
        public imdbVotes?: number,
        public ratings?: Rating[]
    ) {}
}

