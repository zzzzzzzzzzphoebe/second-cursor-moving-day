# Demo video

The final English demo is [`second-cursor-moving-day-demo.mp4`](second-cursor-moving-day-demo.mp4): 68.3 seconds, 1920×1080, H.264 video, AAC audio, English voice-over, and burned-in English captions.

Supporting files:

- `narration.md` — final spoken script
- `subtitles.srt` — uploadable subtitle track
- `record-demo.js` — Playwright CLI recording script for the live public site
- `build-video.sh` — FFmpeg/ImageMagick edit and caption pipeline
- `youtube-thumbnail.png` — 1280×720 upload thumbnail

The build script expects the locally generated recording and narration assets under ignored `video/raw/` and `video/audio/` folders. The final MP4 is committed so reviewers do not need those intermediate files.
