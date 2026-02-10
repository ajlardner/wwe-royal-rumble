/**
 * WWE Segments — Pre-written storyline segments that fire in sequence
 * 
 * Each segment is a series of character messages with timing.
 * The engine picks segments randomly and fires them with natural delays.
 */

import { getCharacter } from './characters.js';

const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

async function post(characterId, content) {
  const char = getCharacter(characterId);
  if (!char) { console.error(`Unknown character: ${characterId}`); return; }
  
  const body = JSON.stringify({ content, username: char.displayName, avatar_url: char.avatar });
  try {
    const res = await fetch(WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
    if (res.status === 429) {
      const data = await res.json();
      await sleep((data.retry_after || 2) * 1000 + 500);
      await fetch(WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
    }
    console.log(`[${char.name}] ${content.slice(0, 60)}...`);
  } catch (err) { console.error(`Error: ${err.message}`); }
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ------------------------------------------------------------------
// Segment Library
// ------------------------------------------------------------------

const SEGMENTS = [
  // --- ROCK vs CENA PROMOS ---
  {
    name: "Rock vs Cena: Championship Debate",
    messages: [
      ['the-rock', "Let The Rock ask all of you a question... Who is the GREATEST WWE Champion of ALL TIME? *raises eyebrow*\n\nYou're looking at him. The Brahma Bull. The Great One. THE PEOPLE'S CHAMPION. 🪨⚡"],
      ['john-cena', "Greatest of all time? ROCK. You left! You went to Hollywood and made movies about tooth fairies! 🧚\n\nI STAYED. Sixteen titles. SIXTEEN. I was here every single Monday night while you were on a movie set! The champ is HERE. 🎺"],
      ['the-rock', "Oh you wanna go THERE, John? The Rock left and came BACK. Multiple times. And EVERY SINGLE TIME the crowd went INSANE. Why? Because they MISSED The Rock!\n\nDid they miss you when you turned invisible? NO! Because NOBODY CAN SEE YOU! 🤣🤣🤣"],
      ['john-cena', "You know what Rock, that's actually pretty funny. I'll give you that one. 😂\n\nBut here's the thing — when WrestleMania came, when it was Once in a Lifetime... I beat you. And when we did it AGAIN? I was right there too.\n\nRespect. But the champ... is STILL here. 🏆"],
    ]
  },
  {
    name: "Stone Cold's Open Challenge",
    messages: [
      ['stone-cold', "Alright listen up! 💀🍺\n\nStone Cold Steve Austin is issuing an OPEN CHALLENGE. Any man, any woman, any damn person in this server — you think you can hang with the Texas Rattlesnake?\n\nStep up. Get stunned. Go home.\n\nGimme a HELL YEAH! 🍺🍺🍺"],
      ['triple-h', "An open challenge? *laughs* Steve... in this business-uh... you don't issue challenges. You ACCEPT them. Because The Game-uh... The Game is ALWAYS ready.\n\nYou want a fight, Austin? I'm right here. I've always been right here. 👑🔨"],
      ['stone-cold', "WHAT?\n\nHunter, I was hoping you'd step up. Because out of everybody in this locker room, you're the one I've been ITCHING to stomp a mudhole in.\n\nYou and your fancy suits and your corporate job and your damn water spit routine — it's ALL gonna end with a Stunner.\n\nAnd THAT'S the bottom line! 💀"],
      ['triple-h', "Suits? Corporate? Steve, I EVOLVED. I went from breaking bones in the ring to running the ENTIRE business. And you? You're still drinking beer and cutting the same promo from 1998.\n\nBut you know what? I respect you enough to beat you myself. No games. No tricks. Just The Game... vs The Rattlesnake. 👑"],
    ]
  },
  {
    name: "Macho Man's Grand Entrance",
    messages: [
      ['macho-man', "OH YEAH!!! 🕶️✨\n\nLadies and gentlemen, boys and girls, CHILDREN OF ALL AGES — the MACHO MAN RANDY SAVAGE has something to say!\n\nI've been watching ALL of you... the Rock with his eyebrow, Cena with his invisible act, Austin with his beer... and NONE OF YOU have what it takes!\n\nThe cream of the crop RISES TO THE TOP! And I, the Macho Man, am the CREAM! In YOUR coffee! OH YEAH! Snap into a Slim Jim! 🕶️✨\n\nDIG IT!!!"],
      ['the-rock', "The Rock... The Rock just heard the Macho Man say he's the cream in The Rock's coffee.\n\n*raises eyebrow*\n\nThe Rock doesn't drink coffee, Savage. The Rock drinks THE TEARS OF HIS ENEMIES. But The Rock appreciates the enthusiasm! The Macho Man is one CRAZY son of a gun!\n\nBut The Rock is still the most electrifying man in ALL of sports entertainment. 🪨"],
      ['macho-man', "CRAZY?! OH YEAH, I'm crazy! Crazy like a FOX, Rock! You think your little eyebrow trick scares the Macho Man?! NOTHING scares the Macho Man!\n\nI dropped the flying elbow on Ricky Steamboat at WrestleMania III and the WORLD has never been the same! OH YEAH!\n\nThe cream... ALWAYS... rises... to the TOP! And The Rock? You're just the cup! DIG IT! 🕶️✨"],
    ]
  },
  {
    name: "Mankind and Rock Reunion",
    messages: [
      ['mankind', "🎭 Hey! Hey Rock! ROCKY!\n\n*waves Mr. Socko frantically* 🧦\n\nRemember me?! It's your old buddy! Your TAG TEAM PARTNER! The Rock 'n' Sock Connection!\n\nRemember This Is Your Life? Remember the popcorn? Remember when we were the most ENTERTAINING tag team in WWE HISTORY?!\n\nMr. Socko misses you, Rock. *holds up sock puppet sadly* 🧦😢"],
      ['the-rock', "...Mick.\n\nThe Rock... *sighs* ...The Rock actually has a soft spot for you, Mick. The Rock won't admit it publicly but—\n\nWait, this IS public.\n\nOkay fine! The Rock 'n' Sock Connection was THE GREATEST tag team The Rock was ever part of! There, The Rock said it!\n\nBut Mick... put the sock away. Please. The Rock is BEGGING you. 🪨"],
      ['mankind', "HE SAID IT! MR. SOCKO, HE SAID IT! 🧦😊\n\n*dances around happily*\n\nTHIS IS THE GREATEST DAY OF MANKIND'S LIFE! Well... second greatest. The greatest was when I won the WWE Championship and Tony Schiavone said 'that'll put butts in seats' and 600,000 people changed the channel TO US!\n\nHave a nice day, Rocky! HAVE A NICE DAY! 😊🎭"],
      ['the-rock', "The Rock already regrets this. 😑\n\nBut... *looks at Mankind dancing with a sock puppet* ...The Rock can't help but smile.\n\nFine. FINE! One more time. For the people.\n\nTHE ROCK 'N' SOCK CONNECTION IS BACK, BABY! But The Rock is NOT wearing a sock. EVER. 🪨⚡🧦"],
    ]
  },
  {
    name: "Undertaker Threatens Everyone",
    messages: [
      ['undertaker', "🔔 *the lights dim*\n\nI have watched... from the shadows... as you all play your games...\n\nThe Rock... with his catchphrases...\nCena... with his invisible act...\nAustin... with his beer...\n\nBut when the bell tolls... when the darkness falls... none of that matters.\n\nAt the Royal Rumble... each of you will enter the ring... and each of you... will be ELIMINATED. By me.\n\nBecause this is MY yard. And the dead... do not lose. ⚰️"],
      ['stone-cold', "Taker... with all due respect... and I mean that... you're one of the greatest to ever do it.\n\nBut if you think Stone Cold Steve Austin is scared of some purple lightning and a fancy hat... you got another thing coming.\n\nI don't care if you're dead, alive, or somewhere in between — you step to Austin, you get stunned. Period. 💀🍺"],
      ['undertaker', "Austin... you were always... brave. Foolish... but brave.\n\nBravery... will not save you... from what is coming.\n\n*the lights flicker and go out*\n\n... rest... in... peace. 🔔⚰️"],
    ]
  },
  {
    name: "Triple H Mind Games",
    messages: [
      ['triple-h', "You know what I love about this business-uh? 👑\n\nEveryone thinks it's about who hits the hardest. Who's the toughest. Who has the best catchphrase.\n\nBut it's not. It's about who's the SMARTEST. Who plays the game the best.\n\nAnd while all of you are out here cutting promos and drinking beer and raising eyebrows... The Cerebral Assassin is already ten moves ahead.\n\nI know who's going to win the Royal Rumble. I know who's going to be eliminated first. I know EVERYTHING.\n\nBecause I am The Game. And The Game... is THAT damn good. 🔨👑"],
      ['john-cena', "Ten moves ahead? Hunter, the only move YOU need to worry about is the Attitude Adjustment that's coming your way! 🎺\n\nYou can play all the mind games you want. You can bring your sledgehammer, your fancy suits, your water bottle routine. But at the end of the day?\n\nNEVER. GIVE. UP. And John Cena is coming for EVERYONE in that Rumble! 💪"],
      ['triple-h', "Cena... *slow clap* ...inspiring speech. Really. The kids love it.\n\nBut this isn't a PG fairy tale, John. This is the GAME. And in my game-uh... the nice guy finishes LAST.\n\nSee you in the Rumble, boy scout. 👑"],
    ]
  },
  {
    name: "Royal Rumble Hype",
    messages: [
      ['the-rock', "FINALLY... The Rock has something IMPORTANT to say!\n\nThe ROYAL RUMBLE is approaching, and The Rock wants EVERYONE to know — The People's Champion is entering that match. And when 29 other jabronis try to throw The Rock over the top rope...\n\nThe Rock is gonna take EACH AND EVERY ONE of their candy asses and toss them out like yesterday's room service! 🪨⚡\n\nIF YA SMELLLLLL... WHAT THE ROCK... IS COOKIN'!"],
      ['john-cena', "The Royal Rumble, baby! THIS is where legends are made! 🎺\n\n30 men enter. 1 man stands tall. And that ONE man is going to be JOHN CENA!\n\nI've won the Royal Rumble before. I'll do it AGAIN. Because the champ... doesn't... QUIT! 🏆💪"],
      ['stone-cold', "Rumble? 💀 Stone Cold has won THREE Royal Rumbles. THREE.\n\nRock, you won one. Cena, you won two. I won THREE. Do the math, boys.\n\nAustin 3:16 says the Rattlesnake is going to WrestleMania! And if you don't like it... well... you know what happens. STUNNER. 🍺💀"],
      ['macho-man', "OH YEAH!!! The ROYAL RUMBLE! 🕶️✨\n\nThe Macho Man INVENTED excitement! When I come over that top rope, every single one of you jabronis is getting an ELBOW DROP FROM THE TOP! OH YEAH!\n\nThe cream RISES! The Macho Man WINS! Snap into a Slim Jim! DIG IT! 🕶️🕶️🕶️"],
      ['undertaker', "The Royal Rumble... 🔔\n\n...a fitting name... for a burial ground.\n\n29 souls... will rest... in peace. ⚰️"],
    ]
  },
  {
    name: "Backstage Segment: Rock and Austin",
    messages: [
      ['the-rock', "*backstage, near the vending machines*\n\nSteve. 🪨\n\n...The Rock wants to say something. And The Rock means this sincerely.\n\nWe built this business, Steve. You and The Rock. WrestleMania 15, 17, 19. Three times. Three classics.\n\nThe Rock respects you. Truly. The toughest SOB to ever live."],
      ['stone-cold', "*takes a long sip of beer* 🍺\n\n...Rock.\n\nYou know I'm not good at this sentimental crap. But yeah. Those matches... those were something special.\n\nYou made me better, Rock. I hate to admit it but you did.\n\n*awkward silence*\n\n...but if you tell anyone I said that, I'll Stunner you into next week. 💀"],
      ['the-rock', "The Rock wouldn't DREAM of it. *smirks*\n\nNow... The Rock is going to go out there and electrify the people. You gonna come watch?\n\n...or are you just gonna drink beer in the parking lot again? 🪨⚡"],
      ['stone-cold', "*finishes beer, crushes can*\n\nI'll be in the parking lot. 🍺\n\n...but I'll be watching. 💀"],
    ]
  },
  {
    name: "Mankind's Bedtime Story",
    messages: [
      ['mankind', "Hey everyone! 🎭 Mankind here!\n\nSo Mr. Socko and I were just talking backstage, and Mr. Socko suggested I tell you all a BEDTIME STORY! 🧦\n\n*clears throat*\n\nOnce upon a time, in a galaxy called the WWE... there was a man named Mick Foley. And Mick Foley was thrown off a steel cage by a seven-foot dead man.\n\nSIXTEEN FEET. Through an announcer's table.\n\nAnd then — AND THEN — he got up and CLIMBED BACK UP THE CAGE. And got thrown THROUGH the cage.\n\nAnd you know what? He'd do it again. Because Mankind is CRAZY! BANG BANG!\n\nThe end. Have a nice day! 😊🎭"],
      ['undertaker', "...that story... is missing a detail, Foley.\n\nYou forgot to mention... that when you hit the floor... when the table shattered beneath you...\n\nThe Undertaker felt... nothing.\n\nBecause The Deadman... does not feel. ⚰️"],
      ['mankind', "*nervous laughter* Ha ha... ha... yeah... I remember, Taker. I remember real well.\n\n*rubs lower back*\n\nYou know what, Mr. Socko and I are gonna go find a nice safe corner somewhere. Maybe the boiler room. \n\nHave a nice day, Deadman! Please don't hurt me again! 😅🧦🎭"],
    ]
  },
  {
    name: "Undertaker vs Mankind: Unfinished Business",
    messages: [
      ['undertaker', "🔔\n\nFoley...\n\nYou think a few jokes and a sock puppet... can erase what happened between us?\n\nThe Undertaker remembers EVERYTHING. The cell. The thumbtacks. The fire.\n\nWe are bound together... by pain... and by destiny. And destiny says... we are not finished. ⚰️"],
      ['mankind', "Taker... *gulps* ...you know, most people send a text when they want to catch up. Maybe a nice email. 'Hey Mick, remember when I threw you off a cage? Good times!'\n\nBut nooooo, you gotta be all spooky about it. 🎭\n\n*Mr. Socko hides behind Mankind's back* 🧦"],
      ['undertaker', "...humor will not save you, Foley. Nothing will.\n\nWhen the bell tolls for the last time... when the darkness claims this Discord...\n\nYou and I... will finish... what we started. ⚰️🔔"],
      ['mankind', "Well... if we're gonna do this again... I have ONE condition.\n\n*holds up Mr. Socko* 🧦\n\nMr. Socko gets ringside seats. Non-negotiable.\n\n...also maybe some extra padding on the announcer's table this time? Just a thought! BANG BANG! 🎭😅"],
    ]
  },
  {
    name: "John Cena Motivational Speech",
    messages: [
      ['john-cena', "You know... everybody in this server is talking about championships, about being the greatest, about stunners and elbow drops and tombstones...\n\nBut let me tell you something that NOBODY else is gonna say. 🎺\n\nIt's not about the wins. It's not about the titles. It's about getting KNOCKED DOWN... and getting back UP.\n\nI've lost big matches. I've been booed out of arenas. I've had HALF the crowd chanting 'Let's Go Cena' and the other half chanting 'Cena Sucks.'\n\nAnd you know what? I showed up the NEXT night. And the night after that. And the night after THAT.\n\nHustle. Loyalty. Respect. It's not just a slogan. It's a LIFESTYLE. 💪\n\nNever. Give. Up. 🎺"],
      ['stone-cold', "WHAT?\n\n...did Cena just give a motivational speech in a Discord server?\n\nWHAT?\n\nSon, this ain't a TED Talk. This is the Royal Rumble. Save your speeches for the kids. 🍺\n\n...but I ain't gonna lie. That was kinda nice. Don't tell anyone I said that. 💀"],
      ['the-rock', "The Rock heard every word of that, John. Every. Single. Word.\n\nAnd The Rock has to say... *raises eyebrow* ...The Rock agrees. With MOST of it.\n\nExcept the part about being the greatest. That's still The Rock. But the hustle, the loyalty, the respect? The Rock can get behind that.\n\n...just this once. Don't let it go to your head, jabroni. 🪨⚡"],
    ]
  },
  {
    name: "Triple H Power Play",
    messages: [
      ['triple-h', "Let me paint a picture for all of you. 👑\n\nWhen I started in this business, I was a blue-blood from Connecticut. A snob. A joke.\n\nThen I became The Game. Then I became The King of Kings. Then I became the man who RUNS this entire company.\n\nEvolution is a mystery-uh. Full of change that no one sees-uh.\n\nAnd right now? I see OPPORTUNITY. The Royal Rumble is chaos. And in chaos... The Cerebral Assassin THRIVES. 🔨👑"],
      ['macho-man', "OH YEAH! Triple H thinks he's EVOLVED?! 🕶️✨\n\nThe Macho Man has been evolving since before Hunter was BORN! I evolved from a manager to a champion to a LEGEND! OH YEAH!\n\nYou wanna talk about mystery, Hunter? Here's a mystery — HOW IS THE CREAM ALWAYS ON TOP?! Because the Macho Man PUT IT THERE! DIG IT! 🕶️"],
      ['triple-h', "*slow, condescending clap*\n\nSavage... you're a legend. The Game respects that.\n\nBut legends-uh... belong in the Hall of Fame. Not in The Game's ring.\n\nI've beaten EVERYONE. Taker at WrestleMania. Austin in his prime. The Rock when he was The Rock.\n\nWhat makes you think the Macho Man is ANY different? 👑🔨"],
      ['macho-man', "DIFFERENT?! I'll TELL you what's different, Hunter! OH YEAH!\n\nThe difference is that when I walk into that ring, I don't PLAY games — I END them! The flying elbow doesn't negotiate! The flying elbow doesn't play politics! The flying elbow just DROPS! FROM THE TOP ROPE! OH YEAHHH!\n\nDIG IT, GAME BOY! 🕶️✨💥"],
    ]
  },
  {
    name: "Stone Cold Tells a Story",
    messages: [
      ['stone-cold', "*sits down on a steel chair in the middle of the ring*\n\n🍺 *cracks open a beer*\n\nLet me tell you people a story.\n\nJune 1996. King of the Ring. Stone Cold Steve Austin beat Jake the Snake Roberts and grabbed that microphone.\n\n'Austin 3:16 says I just whipped your ass.'\n\nSix words. Six words that changed professional wrestling FOREVER.\n\nBefore that night, I was just another guy. After that night? I was Stone Cold Steve Austin. And the world was never the same.\n\nSo to every single person in this Royal Rumble — you better have YOUR six words ready. Because when that bell rings, there ain't no scripts, there ain't no second chances.\n\nThere's just the ring, the Rumble, and whoever's tough enough to be the last one standing.\n\nAnd that's the bottom line... cause Stone Cold said so. 💀🍺"],
      ['undertaker', "...an impressive speech, Austin. For a mortal.\n\nBut The Deadman remembers June 1996 as well. The Undertaker was already a legend when you were finding your voice.\n\nSix words changed YOUR world. But The Undertaker's world... was always... darkness. 🔔⚰️"],
      ['stone-cold', "Taker, I respect the hell outta you. I really do.\n\nBut if you interrupt my beer time ONE more time, legend or not, you're gettin a Stunner.\n\n*takes a long swig* 🍺\n\nNow where was I... oh yeah. GIMME A HELL YEAH! 💀"],
    ]
  },
  {
    name: "Mankind's Interview",
    messages: [
      ['mankind', "🎭 *Mankind sits down for a backstage interview*\n\nSo you wanna know about the Royal Rumble? You wanna know Mankind's strategy?\n\n*pulls out Mr. Socko* 🧦\n\nWell Mr. Socko and I have been doing EXTENSIVE preparation. We watched film. We studied tendencies. We made a CHART.\n\n*holds up a napkin with crayon drawings*\n\nSee, step one: DON'T GET THROWN OVER THE TOP ROPE.\nStep two: THROW EVERYONE ELSE OVER THE TOP ROPE.\nStep three: WIN.\n\nPretty brilliant, right? 😊\n\n...oh, and step four: HAVE A NICE DAY! BANG BANG! 🎭"],
      ['the-rock', "The Rock just saw Mankind's 'strategy' and The Rock has to say...\n\n...it's written in CRAYON, Mick. CRAYON.\n\nThe Rock's strategy is written in gold ink on Italian leather. Because The Rock IS class. The Rock IS excellence.\n\nBut The Rock admits... step four was pretty solid. 🪨😏"],
      ['mankind', "ROCKY LIKED STEP FOUR! 😊😊😊\n\nMr. Socko, did you hear that?! Rocky liked our strategy!\n\n*Mr. Socko does a happy dance* 🧦\n\nRock 'n' Sock Connection STRATEGIC ALLIANCE?! Is this happening?! IS THIS REALLY HAPPENING?! 🎭"],
      ['the-rock', "NO. No it is NOT happening, Mick. The Rock is a SOLO act in the Royal Rumble.\n\n...but if you're getting thrown over the top rope and you need a hand... The Rock might... MIGHT... think about it.\n\nMaybe. 🪨"],
    ]
  },
  {
    name: "Tag Team Discussion",
    messages: [
      ['john-cena', "You know what this Royal Rumble server needs? Some TAG TEAM ACTION! 🎺\n\nWho's teaming up with who? Rock and Sock Connection? The Two Man Power Trip? DX?\n\nI personally volunteer to team with ANYONE who wants to take down The Rock! 😏"],
      ['the-rock', "Take down The Rock?! 🤣 TAKE DOWN THE ROCK?!\n\nThe Rock has been in tag teams with MANKIND — the craziest SOB alive — and STILL came out on top!\n\nYou want a partner to take down The Rock? You're gonna need the ENTIRE LOCKER ROOM, jabroni! 🪨⚡"],
      ['triple-h', "Tag teams? Please. The Game doesn't NEED a partner. But if I had to choose...\n\n*looks at Stone Cold*\n\n...the Two Man Power Trip was the most DOMINANT tag team in WWE history. Austin and Triple H. Nobody could touch us.\n\nRight, Steve? 👑"],
      ['stone-cold', "Don't look at me like that, Hunter. We teamed up ONE TIME and you spent the whole match trying to steal my spotlight.\n\nIf Stone Cold teams with ANYONE... it'll be... actually no. DTA. Don't Trust Anybody. Stone Cold rides alone. 🍺💀"],
    ]
  },
];

// ------------------------------------------------------------------
// Engine
// ------------------------------------------------------------------

let segmentIndex = 0;
const shuffled = [...SEGMENTS].sort(() => Math.random() - 0.5);

async function runSegment() {
  const segment = shuffled[segmentIndex % shuffled.length];
  segmentIndex++;
  
  console.log(`\n📺 Running segment: "${segment.name}"`);
  
  for (const [charId, content] of segment.messages) {
    await post(charId, content);
    const delay = 4000 + Math.random() * 4000; // 4-8 seconds between messages
    await sleep(delay);
  }
  
  console.log(`📺 Segment complete: "${segment.name}"`);
}

async function main() {
  if (!WEBHOOK_URL) { console.error('DISCORD_WEBHOOK_URL required'); process.exit(1); }
  
  console.log(`🎤 WWE Segments Engine — ${SEGMENTS.length} segments loaded`);
  
  // Run segments with 2-5 minute gaps
  while (true) {
    await runSegment();
    const gap = (120 + Math.random() * 180) * 1000; // 2-5 min
    console.log(`⏳ Next segment in ${Math.round(gap / 1000)}s`);
    await sleep(gap);
  }
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
