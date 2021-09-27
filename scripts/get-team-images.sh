#!/usr/bin/bash
URL_PRE=https://www.mlbstatic.com/team-logos/
URL_POST=.svg
for i in {0..39}
do
    TEAMID=$((108+$i))
    TEAMURL="${URL_PRE}${TEAMID}${URL_POST}"
    TEAMFILENAME="logo-${TEAMID}.svg"
    curl $TEAMURL > testing/$TEAMFILENAME
done