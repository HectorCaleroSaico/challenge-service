import { DynamoDBClient, PutItemCommand, PutItemCommandOutput, QueryCommand, QueryCommandOutput, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { config } from '../../config/config';
import { IEpisodeMergedRespository } from '../../domain/repositories/IEpisodeMergedRespository';
import { EpisodeMerged } from '../../domain/entities/EpisodeMerged';
import { Rating } from '../../domain/entities/Rating';

export class DynamoDBRepository implements IEpisodeMergedRespository {

    private dynamoDBClient: DynamoDBClient = new DynamoDBClient({
        region: config.aws.region
    });

    private tableName = config.aws.dynamoDB.dbTableName || 'EpisodesMerged';

    async getEpisodeById(episodeId: number): Promise<EpisodeMerged | null> {

        if (!episodeId) return null;

        const command: QueryCommand = new QueryCommand({
            TableName: this.tableName,
            KeyConditionExpression: 'episodeId = :id',
            ExpressionAttributeValues: {
                ':id': { S: episodeId.toString() }
            }
        });

        const result: QueryCommandOutput = await this.dynamoDBClient.send(command);

        if (!result.Items || result.Items.length == 0) return null; 

        const item = result.Items[0];
        
        console.log('item: ', item);
        console.log('Array: ', JSON.stringify(item?.ratings?.L));

        const ratings: Rating[] | undefined = item?.ratings?.L?.reduce<Rating[]>((accumulator, item) => {

            const source = item?.M?.source?.S;
            const score = item?.M?.score?.S;

            if (source && score) {

                const rating: Rating = new Rating(
                    item?.M?.source?.S || '',
                    item?.M?.score?.S || '',
                );

                accumulator.push(rating);

            }

            return accumulator;

        }, []);

        const episodeMerged: EpisodeMerged = new EpisodeMerged(
            Number(item.episodeId.S),
            item?.title?.S || '',
            item?.releaseDate?.S || '',
            item?.producer?.S || '',
            item?.runtime?.S,
            item?.gender?.S,
            item?.actors?.S,
            item?.overview?.S,
            item?.poster?.S,
            Number(item?.metaScore?.N),
            Number(item?.imdbRating?.N),
            Number(item?.imdbVotes?.N),
            ratings,
            new Date(item?.createdAt?.S || ''),
            new Date(item?.updatedAt?.S || ''),
        );

        return episodeMerged;

    }

    async saveEpisode(episodeMerged: EpisodeMerged): Promise<void> {

        const itemEpisodeMerged = {
            episodeId: episodeMerged.episodeId.toString(),
            title: episodeMerged.title,
            releaseDate: episodeMerged.releaseDate,
            producer: episodeMerged.producer,
            runtime: episodeMerged.runtime ?? undefined,
            gender: episodeMerged.gender ?? undefined,
            actors: episodeMerged.actors ?? undefined,
            overview: episodeMerged.overview ?? undefined,
            poster: episodeMerged.poster ?? undefined,
            metaScore: episodeMerged.metaScore ?? undefined,
            imdbRating: episodeMerged.imdbRating ?? undefined,
            imdbVotes: episodeMerged.imdbVotes ?? undefined,
            ratings: episodeMerged.ratings ?? undefined,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        const command: PutItemCommand = new PutItemCommand({
            TableName: this.tableName,
            /*Item: {
                insuredId: { S: episodeMerged.episodeId.toString() },
                title: { S: episodeMerged.title },
                releaseDate: { S: episodeMerged.releaseDate },
                producer: { S: episodeMerged.producer },
                runtime: { S: episodeMerged.runtime },
                gender: { S: episodeMerged.gender },
                actors: { S: episodeMerged.actors },
                overview: { S: episodeMerged.overview },
                poster: { S: episodeMerged.poster },
                metaScore: { N: episodeMerged.metaScore },
                imdbRating: { N: episodeMerged.imdbRating },
                imdbVotes: { N: episodeMerged.imdbVotes },
                ratings: episodeMerged.ratings,
                createdAt: { S: new Date().toISOString() },
                updatedAt: { S: new Date().toISOString() }
            }*/
           Item: marshall(itemEpisodeMerged, {
            removeUndefinedValues: true,
            convertClassInstanceToMap: true
           })
        });
        
        await this.dynamoDBClient.send(command);

    }

    /*async findByInsuredId(insuredId: string): Promise<Appointment[]> {


        if (!insuredId || insuredId === '') return [];

        const command: QueryCommand = new QueryCommand({
            TableName: this.tableName,
            KeyConditionExpression: 'insuredId = :id',
            ExpressionAttributeValues: {
                ':id': { S: insuredId }
            }
        });

        const result: QueryCommandOutput = await this.dynamoDBClient.send(command);

        if (!result.Items || result.Items.length == 0) return [];
        
        const appointments: Appointment[] = result.Items.reduce<Appointment[]>((accumulator, item) => {

            const insuredId = item.insuredId?.S;
            const scheduleId = item.scheduleId?.N;
            const status = item.status?.S;
            const countryISO = item.countryISO?.S;
            const createdAt = item.createdAt?.S;
            const updatedAt = item.updatedAt?.S;

            if (insuredId && scheduleId && status && countryISO && createdAt && updatedAt) accumulator.push(
                new Appointment(
                    insuredId,
                    Number(scheduleId),
                    status,
                    countryISO,
                    new Date(createdAt),
                    new Date(updatedAt)
                )
            );

            return accumulator;

        }, []);

        return appointments;

    }

    async updateStatus(insuredId: string, scheduleId: number, status: string): Promise<void> {

        const command = new UpdateItemCommand({
            TableName: this.tableName,
            Key: {
                insuredId: { S: insuredId },
                scheduleId: { N: scheduleId.toString() }
            },
            UpdateExpression: 'SET #status = :status, #updatedAt = :updatedAt',
            ExpressionAttributeNames: {
                '#status': 'status',
                '#updatedAt': 'updatedAt',
            },
            ExpressionAttributeValues: {
                ':status': { S: status },
                ':updatedAt': { S: new Date().toISOString() }
            }
        });

        await this.dynamoDBClient.send(command);

    }*/

}