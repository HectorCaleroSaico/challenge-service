interface Config {
    aws: {
        region: string;
        dynamoDB: {
            dbTableName: string,
            cacheTableName: string
        }
    }
}

export const config: Config = {
    aws: {
        region: process.env.AWS_REGION || 'us-east-1',
        dynamoDB: {
            dbTableName: process.env.DB_TABLE_NAME || 'EpisodesMerged',
            cacheTableName: ''
        }
    }
}