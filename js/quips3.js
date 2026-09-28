/* Deadpool Watch 3S — the threequel's original quips, new achievements, new easter eggs, Ask Deadpool answers,
   roulette slices and the daily challenge pool. All text written fresh for this app. */
(function () {
  const Q = DP.QUIPS;
  Q.general.push(
    "Deadpool Watch 3S. The S stands for 'Sequel to the Sequel'. Or 'Spectacular'. Or 'Sorry'.",
    "Threequels are usually where franchises go to die. Good thing I can't.",
    "Nick, you installed a THIRD one. At this point we're legally roommates.",
    "I've been promoted to the big leagues. Same mouth. Bigger budget. Worse decisions.",
    "They let me into the main universe now. I'm told I'm the saviour. I've read the reviews. I agree.",
    "Somewhere a studio executive is sweating about this app. Good. Sweat, Kevin.",
    "I asked for a bigger watch face. They gave me 24 of them. Careful what you wish for.",
    "My claw-happy buddy says hi. Actually he said something unprintable. Same thing.",
    "Multiverse tip: every universe has a version of you. This one has the best watch.",
    "I'm the most self-aware wristwatch in any timeline. Low bar. Still cleared it.",
    "Please enjoy this complimentary fourth-wall break. *crash* Oops. There goes the drywall.",
    "Swipe for faces, tap for trouble, shake for chaos. That's the whole manual.",
    "I've got particle physics now. Mostly I use it to make a mess. Science!",
    "This app runs offline. Just like my moral compass.",
    "Tilt the phone. Watch the shell casings roll. Tell me that's not therapy.",
    "Every chimichanga you ignore makes a baby unicorn cry. Just saying.",
    "Hold on, I'm getting a note from legal. ... They said 'please stop'. Denied.",
    "I don't have a character arc. I have a character circle. Round and round, baby.",
    "Grumpy claw guy thinks this app is 'too much'. He also thinks hugs are a hate crime.",
    "I was Marvel's saviour once. Now I tell you the time. Humble era.",
    "Studio note: 'Can he be less crude?' Studio note response: *extremely loud raspberry*",
    "I've been rated R for Relentless.",
    "You look like someone who deserves a snack. Or a nap. Or a snack nap.",
    "Every time you open this app a fourth wall gets its wings.",
    "Plot twist: the watch was watching YOU the whole time. Hi.",
    "Hydrate, stretch, stop doom-scrolling. Wow. I sound like a wellness app. Kill me. Oh wait.",
    "If this app crashes, it's a feature. A dramatic, cinematic feature.",
    "Did you know I can see your thumb? Big thumb. Confident thumb. Respect.",
    "Remember: violence is never the answer. Unless the question is 'what's in the sequel?'",
    "There's a daily challenge now. Because apparently you need homework from a cartoon.",
    "I made a synth soundtrack out of pure math. Hans Zimmer who?",
    "I've got a 3D head now. It's round in all the right places.",
    "You know what goes great with time? Tacos. You know what goes great with tacos? More tacos.",
    "Fun fact: the Void has terrible Wi-Fi. Good thing I work offline.",
    "Achievements are just participation trophies for adults. Collect them all. I'm proud of you.",
    "Legally distinct timekeeping since two versions ago.",
    "Today's forecast: 90% chance of chimichangas, 10% chance of feelings.",
    "Don't look now, but you're the most interesting person in this timeline. I checked. Barely beat a squirrel.",
    "One day they'll make a movie about this watch. I'll play myself. Obviously.",
    "Nick, if you're reading this, you've been staring at a watch for a while. Blink. Good. Proud of you.",
    "Oh, you're back! I was just alphabetizing my katanas.",
    "If I had a dollar for every face I have, I'd have 24 dollars. Which is sad. Tip your watch.",
    "I contain multitudes. Multitudes of bad ideas.",
    "Some watches count steps. I count regrets. We're both good at our jobs.",
    "I could've been a sundial. Look at me now, Ma. Pixels!",
    "The number one cause of fourth-wall damage is me. The number two cause is also me.",
    "Remember to tell someone you love them today. Then tell me. I'm needy.",
    "My therapist says I use humour as a defence mechanism. I told her that was hilarious.",
    "Wanna see a magic trick? Look at the time. Now it's different. MAGIC.",
    "Cameo alert! It's... you. Looking at your phone. Riveting.",
    "Being a watch is great. No stairs. No leg day. No legs, occasionally.",
    "Warning: excessive use of this app may result in chimichanga cravings and mild enlightenment.",
    "I'm the only watch with a healing factor. And a criminal record.",
    "This is the part where the music swells and you feel something. Hit the soundtrack button. Go on.",
    "Somebody said 'multiverse fatigue'. I said 'multiverse FATIGUES', and then I wore camo for a week.",
    "No clue what time it is in the Void. Mostly 'too late'.",
    "Peggy says woof. Translation: 'feed me and also you smell like despair'.",
    "Life tip: act like you know what you're doing. That's how I got this job."
  );
  Object.assign(Q, {
    claws: ["SNIKT! Not mine. Borrowed. Don't tell him.", "Those claws are adamantium. My feelings are not. Be gentle.", "Grumpy's claws pop out when he's angry. So... always.", "Three claws per hand. Eight hours per shift. Zero dental plan.", "Careful, those are sharp. I learned that the fun way.", "He cuts his steak with those. And his hair. You can tell."],
    storm: ["The Void's got weather now. Mostly 'apocalyptic with a chance of screaming'.", "Every lightning bolt is a timeline getting pruned. Sorry, Earth-4127.", "Welcome to the end of everything. Mind the sand. It gets everywhere.", "Storm's getting worse. Did somebody tap it again? Nick. NICK.", "The Void: where old franchises go to lie down."],
    corps: ["The Corps is assembled! Nobody bring the headpool. He bites.", "Roll call: me, me, me, lady me, dog me, cowboy me, baby me, and... also me.", "More of me? The world isn't ready. The world has never been ready.", "Every variant thinks they're the main one. We're all wrong. It's me. I'm the main one.", "The Deadpool Corps: like a boy band but with more amputations."],
    chimi: ["Every hour I eat a chimichanga. It's called time management.", "Chimi-clock! When the plate's empty, it's midnight. And I'm full of regret.", "Don't judge. Chimichangas are a food group. The best one.", "Nom. That was 3 o'clock. It tasted like 3 o'clock.", "Say 'chimichanga' five times fast. Now eat one. You earned it."],
    mask3d: ["Look at me! I'm three-dimensional! Finally, depth!", "Spin me! Wheee! I'm a real boy!", "This is my good angle. All my angles are my good angle.", "They rendered my head in real time. My head's never looked this round.", "Stop spinning me, I'm getting WebGL-sick."],
    liquid: ["I'm made of liquid chrome now. Very slippery. Very expensive.", "Shiny! I can see my reflection. Still gorgeous.", "Metaballs! Get your mind out of the gutter. It's maths.", "Liquid metal Deadpool. I'll be back. Wait, wrong franchise. Sue me.", "Blob mode activated. Do not pour me down the drain."],
    arcade: ["Insert coin! Or chimichanga. The machine takes both.", "16-bit Deadpool! I've got fewer pixels and more attitude.", "Jump! JUMP! Why did you let me fall in the pit, Nick?!", "High score! Your name will be enshrined forever. Or until the cache clears.", "In 16-bit my face has four pixels. Still handsome."],
    comic: ["New panel every minute. Stan's cameo is sold separately.", "I love comics. They're like movies but you can't hear me swear.", "Page turn! Plot twist! It's still the same time, just drawn differently.", "BAM! POW! That's the sound of my art budget.", "This is a comic panel. That makes you a reader. Nerd. Welcome."],
    neon: ["It's 1986 forever in here. Big hair. Bigger synths.", "Synthwave Deadpool! The keytar is under the bed.", "Retro vibes only. Leave your 2026 problems at the door.", "Neon grid, endless sunset. Tell your ex you're doing great.", "Cue the saxophone solo. There's always a saxophone solo."],
    mouth: ["That's the time. You're welcome.", "Did I say that right? I always say it right.", "Merc with a mouth, clock with a jaw.", "Want me to say it again? Tap me. I never shut up anyway.", "Time is a flat circle. Like a chimichanga, but sadder.", "Sound on for the full experience. Sound off for the full disappointment.", "I've been talking since before you picked me up.", "That's all the news. Back to you, Nick."],
    peggy: ["Who's a good girl? She is. She's the only good girl. The rest of us are awful.", "Peggy doesn't do tricks. Peggy IS the trick.", "Her face looks like a haunted mop. I'd die for her. Repeatedly.", "Peggy approves of this timeline. Mostly because of the snacks."],
    roulette: ["The multiverse has spoken! And it said... this.", "New universe, who dis?", "Spinning the wheel of chaos. No refunds.", "You got a variant! Congrats, it's defective.", "Jackpot! No wait, that's just a different face. Still counts."],
    daily: ["Daily challenge accepted! Wow, look at you, doing chores for a cartoon.", "Challenge complete! Your streak is safe, champ.", "All three done! Gold star. Actual star not included."],
    sandbox: ["Physics! Newton would be proud. Or nauseous.", "Tilt the phone and watch it all slide. Therapeutic chaos.", "It's a snow globe of bad decisions."],
    booth: ["Say chimichanga!", "Gorgeous. You look like my stunt double.", "Frame that. Actually, frame me. Frame both of us."],
    globe: ["That's the Earth. Mine. I rented it.", "Spin the globe! I promise no world-ending events. Probably.", "The sun sets on every timeline. Except the Void. That's just always 'nope'."],
    level: ["Perfectly balanced. As all things should be. Wait, wrong guy.", "Level! Like my emotional stability. Ha. Ha. Ha.", "The bubble's in the middle! You'd make a great carpenter. Or a grumpy immortal."],
    soundtrack: ["Hit it! This is my theme song. I wrote it with math.", "Cue the music. Somewhere, a saxophone weeps.", "Soundtrack on. Every moment is now dramatic. Even this one."]
  });
  Q.hourly.push("It's {t}. Three versions deep and still on time. Mostly.", "{t}. Chimichanga o'clock is always now, spiritually.");

  // ---------- achievements (3S) ----------
  [
    ["faces_all_3s", "Multiverse Tourist", "View every face in 3S", "\uD83C\uDF0C"],
    ["faces_new_5", "Fresh Faces", "View 5 of the new 3S faces", "\uD83C\uDD95"],
    ["storm_10", "Storm Chaser", "Summon 10 lightning strikes on Void Storm", "\u26C8\uFE0F"],
    ["comic_5", "Page Turner", "Flip the comic panel 5 times", "\uD83D\uDCD6"],
    ["mouth_time", "Lip Service", "Make the talking mask say the time", "\uD83D\uDC44"],
    ["flappy_10", "Frequent Flyer", "Score 10 in Chimichanga Flight", "\uD83D\uDEEB"],
    ["flappy_30", "Deep-Fried Pilot", "Score 30 in Chimichanga Flight", "\uD83D\uDE80"],
    ["duel_win", "Claws Down", "Win a Claws vs Katana duel", "\u2694\uFE0F"],
    ["duel_perfect", "Flawless Merc", "Win a duel without a single miss", "\uD83C\uDFC6"],
    ["whack_50", "Variant Whacker", "Score 50 in Whack-a-Merc", "\uD83D\uDD28"],
    ["whack_100", "Corps Commander", "Score 100 in Whack-a-Merc", "\uD83C\uDF96\uFE0F"],
    ["snake_15", "Taco Trail Blazer", "Eat 15 tacos in Taco Trail", "\uD83C\uDF2E"],
    ["snake_40", "Taco Titan", "Eat 40 tacos in Taco Trail", "\uD83D\uDC0D"],
    ["arcade_all", "Arcade Rat", "Play all six games", "\uD83D\uDD79\uFE0F"],
    ["ask_1", "Curious Merc", "Ask Deadpool a question", "\uD83C\uDFB1"],
    ["ask_10", "Needy", "Ask Deadpool 10 questions", "\uD83D\uDDE3\uFE0F"],
    ["roulette_1", "Spin Doctor", "Spin the Multiverse Roulette", "\uD83C\uDFB0"],
    ["roulette_10", "Variant Addict", "Spin the roulette 10 times", "\uD83C\uDF00"],
    ["booth_1", "Say Chimichanga", "Snap a photo in the Merc Booth", "\uD83D\uDCF8"],
    ["daily_1", "Homework Done", "Complete a daily challenge", "\uD83D\uDCC5"],
    ["streak_3", "Habit Forming", "3-day daily streak", "\uD83D\uDD25"],
    ["streak_7", "Weekly Merc", "7-day daily streak", "\uD83D\uDCAF"],
    ["globe", "World Tour", "Spin the 3D globe", "\uD83C\uDF0D"],
    ["compass", "Katana North", "Use the level & compass", "\uD83E\uDDED"],
    ["widgets", "Gauge Nerd", "Open the widget stack", "\uD83D\uDCCA"],
    ["music", "Needle Drop", "Turn on the synth soundtrack", "\uD83C\uDFB9"],
    ["soundboard_10", "Sound Guy", "Hit 10 soundboard buttons", "\uD83D\uDD0A"],
    ["scene_all", "Location Scout", "Try every background scene", "\uD83C\uDFAC"],
    ["intro_watch", "Opening Credits", "Watch the whole intro", "\uD83C\uDF9E\uFE0F"],
    ["splat_100", "Messy Merc", "Make 100 blood splatters", "\uD83E\uDE78"],
    ["shatter", "Glass Cannon", "Use the shatter transition", "\uD83E\uDE9F"],
    ["sandbox", "Physics Major", "Play in the physics sandbox", "\uD83E\uDDEA"],
    ["eggs_15", "Egg Hoarder", "Find 15 easter eggs", "\uD83E\uDDFA"],
    ["ach_30", "Overachiever", "Unlock 30 achievements", "\uD83E\uDD47"],
    ["imported", "Sequel Continuity", "Carry your progress over from v2", "\uD83D\uDCE6"],
    ["eco", "Eco Merc", "Turn on battery saver", "\uD83D\uDD0B"]
  ].forEach(([id, name, desc, icon]) => DP.ACHIEVEMENTS.push({ id, name, desc, icon }));

  // ---------- easter eggs (3S) ----------
  DP.EGGS.push(
    { id: "headspin", name: "Head Spin", hint: "Spin the 3D mask three times." },
    { id: "chatterbox", name: "Chatterbox", hint: "Make the talking mask talk five times." },
    { id: "konami", name: "Cheat Code", hint: "Up, up, down, down... on the Taco Trail D-pad." },
    { id: "peggy", name: "Good Girl", hint: "Ask Deadpool who's a good girl." },
    { id: "bub", name: "Hey Bub", hint: "Ask Deadpool about 'bub'." },
    { id: "wish1111", name: "Make a Wish", hint: "Open the app at 11:11." },
    { id: "chimi_overload", name: "Chimi Overload", hint: "Feed the hunger gauge until it bursts." },
    { id: "jackpot", name: "Jackpot", hint: "Land the same face twice in a row on the roulette." },
    { id: "globe_spin", name: "Spin Cycle", hint: "Fling the globe really hard." },
    { id: "level", name: "Zen Merc", hint: "Hold the phone perfectly level for 3 seconds." },
    { id: "postcredits", name: "Post-Credits Scene", hint: "Tap the fine print at the bottom of Settings 3 times." },
    { id: "casings100", name: "Brass Collector", hint: "Eject 100 shell casings." },
    { id: "needle_drop", name: "Needle Drop", hint: "Let the soundtrack play for a full minute." },
    { id: "peggy_pets", name: "Maximum Good Girl", hint: "Pet the dog face ten times in a row." }
  );

  // ---------- Ask Deadpool ----------
  DP.ASK = {
    yes: ["Yes. Obviously. Next question.", "Absolutely. I'd bet my other leg on it.", "Signs point to HELL YEAH.", "Yes, and I'm not even being sarcastic. Mark the calendar.", "The multiverse says yes. All of it. Unanimously. Weird.", "Yep. Do it. What's the worst that could happen? Don't answer that.", "Survey says: yes. The survey was me.", "Does a chimichanga have a crunchy shell? Yes."],
    no: ["No. Hard no. Katana-through-the-heart no.", "Absolutely not, and I've done some dumb stuff.", "Nope. Nope nope nope. A whole nope rope.", "The stars say no. The stars are also gas balls, so, you know.", "My sources say no. My sources are a talking dog and a guy in the Void.", "Not in this timeline. Try Earth-8.", "No. But I respect the audacity.", "If I said yes I'd be lying, and I only lie about important things."],
    maybe: ["Maybe. Ask me after a chimichanga.", "Reply hazy. Like my memory of 2016.", "Could go either way. Like my career.", "Ask again when I'm not busy doing nothing.", "The answer is... *drumroll*... ask the grumpy guy.", "50/50. Which is also my rating on most websites.", "I'm contractually unable to answer that one.", "Flip a coin. If you're disappointed by the result, you know your answer. Deep, right?"],
    kw: [
      [/good girl|peggy|dog/i, ["She's the goodest. Ugliest. Goodest. Peggy forever.", "Peggy is sleeping on my face right now. I can't breathe. Worth it."], "peggy"],
      [/\bbub\b|wolverine|claws|logan/i, ["Ugh, Grumpy? He's fine. He's always fine. He said so, while stabbing a wall.", "Hey, bub. Hey, bub. HEY BUB. See? It's annoying. Now you know how he feels."], "bub"],
      [/chimi|taco|food|hungry|eat/i, ["Food question? The answer is always chimichangas.", "Eat the thing. Life's short. Mine isn't, but yours is."]],
      [/love|crush|date|marry|girlfriend|boyfriend/i, ["Love is a battlefield. Bring a katana and a nice cologne.", "Text them. Wait, is it 2 AM? Don't text them.", "Shoot your shot. Metaphorically. Please, metaphorically."]],
      [/money|rich|lottery|job|raise|work/i, ["Money can't buy happiness, but it can buy chimichangas, which is close.", "Ask for the raise. Wear the mask. Terrify HR.", "Invest in yourself. And in tacos. Tacos never crash."]],
      [/die|death|dead|immortal/i, ["I've died so many times I have a loyalty card. You'll be fine.", "Death is overrated. Like brunch."]],
      [/marvel|avengers|disney|mcu|multiverse/i, ["I'm not allowed to talk about that. The mouse is listening. Hi, mouse.", "The multiverse is a mess. I'm the mop. A sarcastic mop."]],
      [/who are you|your name|what are you/i, ["I'm Deadpool. Merc. Mouth. Watch. Legend. Pick four.", "I'm the voice in your pocket. The good kind. Mostly."]],
      [/meaning of life|purpose|why/i, ["42? No, that's another franchise. The answer is 'snacks and friends'.", "Why? Because the writers said so. That's the answer to most things."]],
      [/time|clock|late/i, ["It's time to get a watch. Oh wait. You have me. You're welcome.", "You're not late. Everyone else is early. Confidence!"]]
    ]
  };
  // ---------- Multiverse Roulette flavour ----------
  DP.ROULETTE = ["Earth-10005", "Earth-Chimichanga", "Earth-Peggy", "The Void", "Earth-8-Bit", "Earth-Neon", "Earth-Beige (TVA)", "Earth-Unicorn", "Earth-Baby-Legs", "Earth-Lawsuit", "Earth-Director's-Cut", "Earth-Budget-Cuts", "Earth-Nicepool", "Earth-Cowboy", "Earth-Kid", "Earth-Headpool"];
  // ---------- daily challenge pool (seeded 3/day). metric = stats diff key; n = amount ----------
  DP.DAILY = [
    { id: "quips", text: "Endure 15 quips", metric: "quips", n: 15 },
    { id: "walls", text: "Break the fourth wall 3 times", metric: "walls", n: 3 },
    { id: "faces", text: "Swipe through 10 faces", metric: "faceviews", n: 10 },
    { id: "flappy", text: "Score 5+ in Chimichanga Flight", metric: "best.flappy", n: 5, abs: true },
    { id: "whack", text: "Score 25+ in Whack-a-Merc", metric: "best.whack", n: 25, abs: true },
    { id: "snake", text: "Eat 8 tacos in one Taco Trail run", metric: "best.snake", n: 8, abs: true },
    { id: "slice", text: "Score 30+ in Katana Slice", metric: "best.slice", n: 30, abs: true },
    { id: "duel", text: "Win a Claws vs Katana duel", metric: "duelWins", n: 1 },
    { id: "ask", text: "Ask Deadpool 3 questions", metric: "asks", n: 3 },
    { id: "roulette", text: "Spin the Multiverse Roulette twice", metric: "spins", n: 2 },
    { id: "splat", text: "Make 20 blood splatters (tap stuff!)", metric: "splats", n: 20 },
    { id: "casings", text: "Eject 30 shell casings in the sandbox", metric: "casings", n: 30 },
    { id: "mood", text: "Log your mood", metric: "moodLogs", n: 1 },
    { id: "sound", text: "Press 5 soundboard buttons", metric: "sb", n: 5 },
    { id: "music", text: "Play the soundtrack for 30 seconds", metric: "musicSec", n: 30 },
    { id: "taps", text: "Tap a watch face 20 times", metric: "faceTaps", n: 20 }
  ];
  DP.SOUNDBOARD = [
    ["gun", "🔫", "Bang"], ["shotgun", "💥", "Boomstick"], ["snikt", "🗡️", "Snikt"], ["slash", "⚔️", "Katana"], ["airhorn", "📯", "Air Horn"], ["drumroll", "🥁", "Drumroll"],
    ["sadTrombone", "🎺", "Sad Trombone"], ["fart", "💨", "Whoopsie"], ["bruh", "😐", "Bruh"], ["cash", "💰", "Ka-ching"], ["laser", "🔴", "Pew"], ["impact", "🎬", "Trailer Hit"],
    ["thunder", "⛈️", "Thunder"], ["heartbeat", "💓", "Heartbeat"], ["crunch", "🌯", "Crunch"], ["whoosh", "🌪️", "Whoosh"]
  ];
})();
