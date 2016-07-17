#!/usr/bin/env bash

mkdir images-temp 2>/dev/null
cd images
for i in *
do
	if [[ $i =~ .*\.jpg  && `identify  "$i"  | cut -d' ' -f3 | cut -dx -f1` -gt 2560 ]]
	then
		 convert $i -resize 2560 "../images-temp/$i"
	else
		cp $i "../images-temp/$i" 2>/dev/null
	fi

done