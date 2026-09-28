# Deadpool Watch 3S

The threequel. A fan-made, fourth-wall-breaking smartwatch PWA for Nick's iPhone 15 Pro Max.
Everything from Deadpool Watch 2 is still here and works the same. 3S adds a lot on top.
Plain HTML/CSS/JS + WebGL + WebAudio. No build step, no libraries, fully offline after the first load.

**Live:** https://mandeerinfinity.github.io/deadpool-watch-3s/
v1: https://mandeerinfinity.github.io/deadpool-watch/ · v2: https://mandeerinfinity.github.io/deadpool-watch-2/

## Install on iPhone
1. Open the link in **Safari** → **Share** → **Add to Home Screen** → **Add**.
2. Launch **DP Watch 3S** (the mask with crossed katanas and the gold "3S" starburst).
3. It installs side by side with DP Watch and DP Watch 2 and shares nothing with them: its own manifest id/start_url,
   its own service-worker cache (`dpw3s-*`, and it only ever deletes its own old caches) and its own storage prefix (`dpw3s.`).
   On first run it copies (read-only) any v2 settings, high scores and achievements it can find in the same browser storage.

## New in 3S
- **11 new faces (24 total):** Snikt O'Clock (claws), Void Storm (lightning), Deadpool Corps (a grid of variants), Chimi-Clock,
  Good Girl O'Clock (the dog), 3D Mask (real-time WebGL), Liquid Chrome (metaballs), 16-Bit Merc (arcade), Comic Panel (redraws every minute),
  Merc With A Mouth (a talking mask that lip-syncs the time) and Synthwave.
- **Cinematic intro:** a flip-book opening title card for DEADPOOL WATCH 3S. Tap to skip. Plays every launch, once a day, or never.
- **Physics and particles:** tap splatter (cartoon blood), confetti and shell casings that fall the way you tilt, and a Physics Sandbox
  with pistol, boomstick, confetti and bouncing chimichangas.
- **5 WebGL background scenes:** Plasma (from v2), the Void, Neon City, Chimichanga Galaxy and the Time Office. Tilt parallax,
  plus Battery saver / Auto / Max performance modes with adaptive resolution.
- **5 new screen transitions:** shatter, glitch, claw slash, portal and fade (plus random), on top of v2's katana and comic page.
- **4 new games (6 total), each with a high score:** Chimichanga Flight (flappy), Claws vs Katana (rhythm duel), Whack-a-Merc and Taco Trail (snake).
- **Original synth soundtrack (WebAudio only):** Neon Regret (synthwave), 8-Bit Unaliving (chiptune) and Elevator to the Void (lounge).
  Also a 16-button soundboard, about 26 new sound effects, and haptics where the device supports them.
- **Ask Deadpool:** an offline, ruder magic 8-ball. Type a question, tap the ball, or shake the phone.
- **Multiverse Roulette:** spin a wheel for a random face, theme and scene. The dice button on the watch does a quick roll.
- **Merc Booth:** a selfie camera with mask overlays, stickers, comic, Void, Bub, Noir and Thermal filters, and save/share.
- **Daily Challenge:** three seeded dares a day, a streak counter and a 14-day calendar.
- **Widget Stack:** 8 spring-animated gauges.
- **World:** a 3D spinning globe with a live day/night terminator and city times, plus a spirit level and a katana compass.
- **Visual FX screen** and a **Hub split into sections**. There is also a reduce-motion option.
- **64 achievements** (36 new) and **25 easter eggs** (14 new).

## Credits
Unofficial fan project. All art, sounds, music and jokes are original. Not affiliated with Marvel/Disney.
Fonts under SIL Open Font License (see fonts/OFL-LICENSE.txt). Weather: Open-Meteo.com (CC BY 4.0).
Globe land mask baked from Natural Earth (public domain).
