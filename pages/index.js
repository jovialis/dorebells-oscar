/**
 * Created on 12/18/20 by jovialis (Dylan Hanson)
 **/

import {useQuery, gql} from '@apollo/client';
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import NavigationBar from "../components/NavigationBar";
import {Avatar, Chip, Divider, Link, Typography} from "@material-ui/core";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

export default function HomePage() {
    const [load, setLoad] = useState(false);

    const { loading, error, data } = useQuery(gql`
        query GetTrending {
            trendingPetitions {
                name
                uid
                createdOn
                creator {
                    name
                    thumbnail
                }
            }
        }
    `, {
        skip: !load
    });

    useEffect(() => {
        setLoad(true);
    }, []);

    return (
        <div className={"page-index"}>
            <NavigationBar/>
            {data && (
                <div>
                    <Typography variant={"h2"}>
                        Trending Petitions
                    </Typography>
                    {data.trendingPetitions.map(p => (
                        <div>
                            <Link href={`/petition/${p.uid}`}>
                                <Typography variant={"h5"}>
                                    {p.name}
                                </Typography>
                            </Link>
                            <Typography variant={"body2"}>
                                {dayjs(p.createdOn).fromNow()}
                            </Typography>
                            <Chip
                                size={"medium"}
                                avatar={<Avatar src={p.creator.thumbnail} alt={p.creator.name[0]}/>}
                                label={p.creator.name}
                            />
                            <Divider/>
                        </div>
                    ))}
                </div>
            )}

        </div>
    )
}