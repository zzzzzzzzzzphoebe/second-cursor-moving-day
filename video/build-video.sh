#!/bin/zsh
set -euo pipefail

project_dir="${0:A:h:h}"
ffmpeg_bin="/opt/homebrew/bin/ffmpeg"
magick_bin="/opt/homebrew/bin/magick"
build_dir="$project_dir/video/build"
caption_dir="$build_dir/captions"

mkdir -p "$caption_dir"

while IFS='|' read -r index start end caption; do
  caption="$(printf '%b' "$caption")"
  "$magick_bin" -size 1920x1080 xc:none \
    \( -background '#151515C4' -fill white -font '/System/Library/Fonts/Supplemental/Arial Bold.ttf' -pointsize 42 \
       -gravity center -size 1680x118 caption:"$caption" \
       -bordercolor '#151515C4' -border 28x10 \) \
    -gravity south -geometry +0+48 -composite "$caption_dir/$index.png"
done < "$project_dir/video/subtitle-captions.tsv"

"$ffmpeg_bin" -y \
  -loop 1 -t 3.5 -i "$project_dir/public/og.png" \
  -i "$project_dir/video/raw/second-cursor-master.webm" \
  -loop 1 -t 10 -i "$project_dir/public/og.png" \
  -i "$project_dir/video/audio/narration.wav" \
  -filter_complex "[0:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,zoompan=z='min(zoom+0.00045,1.035)':d=105:s=1920x1080:fps=30,trim=duration=3.5,setpts=PTS-STARTPTS[intro];[1:v]setpts=1.25*PTS,fps=30,scale=1920:1080[demo];[2:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,zoompan=z='min(zoom+0.00018,1.025)':d=300:s=1920x1080:fps=30,trim=duration=10,setpts=PTS-STARTPTS[outro];[intro][demo][outro]concat=n=3:v=1:a=0[v];[3:a]loudnorm=I=-16:LRA=7:TP=-1.5,aresample=48000[a]" \
  -map '[v]' -map '[a]' -shortest -c:v libx264 -preset slow -crf 18 \
  -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 192k "$build_dir/clean.mp4"

inputs=()
filter=""
previous="0:v"
input_index=1
while IFS='|' read -r index start end caption; do
  inputs+=( -i "$caption_dir/$index.png" )
  next="v$input_index"
  filter+="[$previous][$input_index:v]overlay=0:0:enable='between(t,$start,$end)'[$next];"
  previous="$next"
  input_index=$((input_index + 1))
done < "$project_dir/video/subtitle-captions.tsv"
filter="${filter%;}"

"$ffmpeg_bin" -y -i "$build_dir/clean.mp4" "${inputs[@]}" \
  -filter_complex "$filter" -map "[$previous]" -map 0:a \
  -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -movflags +faststart \
  -c:a copy -shortest "$project_dir/video/second-cursor-moving-day-demo.mp4"
