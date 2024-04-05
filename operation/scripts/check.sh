#!/bin/bash

[ -z "$REGIONS"] && exit 1

echo "$REGIONS $GET_FORMER_DATA"

for region in $REGIONS
do
    echo $region
done