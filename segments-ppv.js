/**
 * WWE PPV Segments — Full Pay-Per-View shows that run as scripted sequences
 * 
 * These are longer-form segments that simulate an entire PPV card.
 * Each PPV has pre-show hype, match build-ups, and post-match reactions.
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
  } catch (err) { console.error(`Error: ${err.message}`); }
}

async function announce(content) {
  const body = JSON.stringify({ content, username: '📢 Ring Announcer' });
  try {
    await fetch(WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
  } catch (err) { console.error(`Announce error: ${err.message}`); }
}

async function commentary(content) {
  const body = JSON.stringify({ content, username: 'Jim Ross 🤠🎙️' });
  try {
    await fetch(WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
  } catch (err) { console.error(`Commentary error: ${err.message}`); }
}

async function kingCommentary(content) {
  const body = JSON.stringify({ content, username: 'Jerry Lawler 👑' });
  try {
    await fetch(WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
  } catch (err) { console.error(`King error: ${err.message}`); }
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ------------------------------------------------------------------
// ROYAL RUMBLE PPV
// ------------------------------------------------------------------

export async function runRoyalRumble() {
  console.log('🎆 ROYAL RUMBLE PPV STARTING...');

  // Opening pyro
  await announce(
    "🎆🎆🎆 **ROYAL RUMBLE** 🎆🎆🎆\n\n" +
    "👑 *Every Man for Himself* 👑\n\n" +
    "*Pyrotechnics explode across the arena! The crowd is on their feet!*\n\n" +
    "**TONIGHT'S CARD:**\n" +
    "1. 🤼 The Rock vs John Cena — Intercontinental Championship\n" +
    "2. 😈 Undertaker vs Mankind — Hell in a Cell\n" +
    "3. 👑 **MAIN EVENT:** 7-Man Royal Rumble — Winner gets WWE Championship Match\n\n" +
    "LET'S GET READY TO RUMBLE!"
  );
  await sleep(6000);

  // JR and King welcome
  await commentary("Welcome everyone to the ROYAL RUMBLE! I'm good ol' JR Jim Ross alongside Jerry 'The King' Lawler and folks, BUSINESS IS ABOUT TO PICK UP! We have an INCREDIBLE card tonight!");
  await sleep(3000);
  await kingCommentary("JR, I am SO excited! The Rock vs Cena for the IC title, Undertaker vs Mankind in HELL IN A CELL, and a 7-man Royal Rumble! This is going to be AMAZING! Or terrifying. Probably both!");
  await sleep(5000);

  // ========== MATCH 1: Rock vs Cena ==========
  await announce("${'─'.repeat(30)}\n**MATCH 1: INTERCONTINENTAL CHAMPIONSHIP**\n🏆 The Rock (c) vs John Cena\n${'─'.repeat(30)}");
  await sleep(4000);

  await announce("🎺🎺🎺 *doo doo doo dooooo*\n\nIntroducing first... the CHALLENGER... from West Newbury, Massachusetts... JOHN CENA!");
  await sleep(3000);
  await post('john-cena', "THE CHAMP IS HERE! 🎺💪\n\nRock, tonight I take YOUR Intercontinental Championship and I add it to the LEGACY of John Cena!\n\nYou're looking at the next IC champion! NEVER GIVE UP!");
  await sleep(4000);

  await announce("🎵 *IF YA SMELLLLLL...*\n\nAnd his opponent... the REIGNING, DEFENDING Intercontinental Champion... THE ROCK!");
  await sleep(3000);
  await post('the-rock', "Finally... The Rock HAS COME BACK... to the Royal Rumble! 🪨⚡\n\nCena, you want The Rock's gold? You want The People's Championship? Well The Rock says this — The Rock is going to take your little 'You Can't See Me' hand wave... and SHOVE IT.\n\nIF YA SMELLLLLL!");
  await sleep(5000);

  // Match action
  await commentary("And here we go! The bell rings! Rock and Cena circling each other! The electricity in this arena is INCREDIBLE!");
  await sleep(4000);
  await commentary("Cena with a shoulder tackle! Rock bounces off the ropes — CLOTHESLINE! Cena is fired up early! The crowd is going CRAZY!");
  await sleep(4000);
  await kingCommentary("Look at Cena go, JR! But The Rock is getting up... and he does NOT look happy!");
  await sleep(3000);
  await commentary("Rock with a DDT! He's setting up... PEOPLE'S ELBOW! Wait — Cena ROLLS OUT OF THE WAY! Near fall by Cena! 1... 2... NO! The Rock kicks out!");
  await sleep(4000);
  await commentary("These two are LAYING IT ALL OUT THERE! Cena's got Rock up — ATTITUDE ADJUSTMENT! COVER! 1... 2... THE ROCK KICKS OUT! BAH GAWD!");
  await sleep(4000);
  await kingCommentary("How did The Rock kick out of that?! AHHH!");
  await sleep(3000);
  await commentary("Rock is pulling himself up... Cena charging — ROCK BOTTOM! ROCK BOTTOM OUT OF NOWHERE! Cover! 1... 2... 3!! THE ROCK RETAINS!");
  await sleep(3000);

  await announce("🏆 **YOUR WINNER AND STILL INTERCONTINENTAL CHAMPION: THE ROCK!** 🪨⚡");
  await sleep(4000);

  await post('the-rock', "And THAT... is why they call The Rock THE PEOPLE'S CHAMPION! 🪨⚡🏆\n\nCena, you gave The Rock a hell of a fight. The Rock respects that. But The Rock's gold STAYS with The Rock!\n\nIF YA SMELLLLLL WHAT THE ROCK IS COOKIN!");
  await sleep(4000);
  await post('john-cena', "*slowly getting up, holding his ribs*\n\nDamn it... Rock got me. Got me GOOD. 😤\n\nBut you know what? This isn't over. Not by a long shot. Tonight I may have lost the battle... but the WAR? The war is just beginning.\n\nNever. Give. Up. 🎺");
  await sleep(6000);

  // ========== MATCH 2: Undertaker vs Mankind HIAC ==========
  await announce("${'─'.repeat(30)}\n**MATCH 2: HELL IN A CELL**\n😈 The Undertaker vs Mankind\n${'─'.repeat(30)}");
  await sleep(4000);

  await commentary("Ladies and gentlemen... this next match... I don't even know if I can call what's about to happen a 'match.' This is Hell in a Cell. Undertaker. Mankind. We all know what happened the LAST time these two were inside that structure...");
  await sleep(4000);
  await kingCommentary("JR, I'm scared. I'm actually scared. Someone is going to get HURT. 😰");
  await sleep(3000);

  await announce("🎵 *screeching car crash sounds*\n\nIntroducing first... from the boiler room... MANKIND!");
  await sleep(3000);
  await post('mankind', "*looks up at the Cell nervously* 🎭\n\nOh boy. Oh boy oh boy oh boy.\n\n*Mr. Socko peeks out of pocket* 🧦\n\nMr. Socko, I know what you're thinking. And YES, last time was bad. But THIS time... this time will be different.\n\n*looks up at Cell again*\n\n...probably. BANG BANG! 😅");
  await sleep(5000);

  await announce("🔔 *...gong...* 🔔\n\n*The lights go completely dark...*\n\nHis opponent... from Death Valley... THE UNDERTAKER!");
  await sleep(3000);
  await post('undertaker', "*walks slowly to the ring, eyes rolled back*\n\nFoley...\n\nWe meet again... inside the devil's playground.\n\nLast time... you fell. This time... you will not get back up.\n\nRest... in... peace. ⚰️🔔");
  await sleep(5000);

  // HIAC action
  await commentary("The Cell is lowering! That 20-foot steel structure is surrounding the ring! There is NO ESCAPE for either man!");
  await sleep(4000);
  await commentary("Taker with a big boot! Mankind crashes into the Cell wall! OH MY GOD, Mankind is already bleeding!");
  await sleep(4000);
  await kingCommentary("Make it stop, JR! MAKE IT STOP!");
  await sleep(3000);
  await commentary("Mankind fighting back! He's got a steel chair! CRACK across Taker's skull! The Deadman barely flinched! BAH GAWD!");
  await sleep(4000);
  await commentary("Mankind is climbing the Cell! HE'S CLIMBING THE CELL! No Mick, not again! FOR THE LOVE OF GOD!");
  await sleep(4000);
  await kingCommentary("AHHH! Not again! Somebody stop this!");
  await sleep(3000);
  await commentary("Taker is following him up! Both men on TOP of the Cell! The crowd is in ABSOLUTE SHOCK!");
  await sleep(4000);
  await commentary("Taker has Mankind by the throat... CHOKESLAM! BUT MANKIND LANDS ON THE CELL ROOF! It holds! Mankind is DOWN but the Cell didn't break!");
  await sleep(4000);
  await commentary("They're climbing back down... Mankind is barely conscious... Taker sets him up... TOMBSTONE PILEDRIVER! IN THE MIDDLE OF THE RING! COVER! 1... 2... 3! THAT'S IT!");
  await sleep(3000);

  await announce("⚰️ **YOUR WINNER: THE UNDERTAKER!** ⚰️");
  await sleep(4000);

  await post('undertaker', "*stands over Mankind's broken body*\n\n...it is done.\n\nFoley... you are the bravest fool... The Deadman has ever faced.\n\nBut courage... cannot defeat... death. ⚰️🔔");
  await sleep(4000);
  await post('mankind', "*slowly raises a thumbs up from the mat* 👍\n\n...ow.\n\n*Mr. Socko flops out limply* 🧦\n\nHave... a nice... day... 😊🎭\n\n*passes out*");
  await sleep(3000);
  await commentary("THAT MAN HAS A FAMILY! Mick Foley just endured HELL and he's STILL smiling! What a competitor! What a human being!");
  await sleep(6000);

  // ========== MAIN EVENT: ROYAL RUMBLE ==========
  await announce("${'─'.repeat(30)}\n🌟 **MAIN EVENT: ROYAL RUMBLE MATCH** 🌟\n👑 Winner receives a WWE Championship match at WrestleMania\n7 Competitors: The Rock, John Cena, Stone Cold, Undertaker, Macho Man, Triple H, Mankind\n${'─'.repeat(30)}");
  await sleep(5000);

  await commentary("THIS IS IT, KING! The Royal Rumble! Seven men! One winner! And that winner goes to WRESTLEMANIA for the WWE Championship!");
  await sleep(3000);
  await kingCommentary("My heart is POUNDING, JR! Who's gonna win?! I can't take it!");
  await sleep(4000);

  // Entrant 1 & 2
  await announce("Entrant #1... 🎺🎺🎺 **JOHN CENA!**");
  await sleep(3000);
  await post('john-cena', "Number ONE? You know what, I'll take it! I'll outlast ALL of them! The champ is HERE and the champ is FIRST! Let's GO! 🎺💪");
  await sleep(4000);

  await announce("Entrant #2... 🕶️✨ **MACHO MAN RANDY SAVAGE!**");
  await sleep(3000);
  await post('macho-man', "OH YEAH!!! 🕶️ Number TWO! The Macho Man and John Cena! Let's DO THIS, brother! The cream of the crop is about to RISE! DIG IT!");
  await sleep(4000);

  await commentary("Cena and Savage going at it! Savage with those rapid-fire elbows! Cena fighting back with right hands!");
  await sleep(5000);

  // Entrant 3
  await announce("Entrant #3... 👑🔨 **TRIPLE H!**");
  await sleep(3000);
  await post('triple-h', "*water spit* 💦 The Game-uh... has entered the Rumble-uh. And now... the REAL competition begins. 👑");
  await sleep(4000);
  await commentary("Triple H is in! Pedigree attempt on Savage — Savage reverses! Flying Elbow — Triple H rolls away! Three men brawling!");
  await sleep(5000);

  // Entrant 4
  await announce("Entrant #4... 🎭 **MANKIND!**");
  await sleep(3000);
  await post('mankind', "*limps to the ring, covered in bandages from the earlier match*\n\nI'M BACK! Mr. Socko says I'm crazy but WHAT ELSE IS NEW?! BANG BANG! 🎭🧦");
  await sleep(4000);
  await commentary("Mankind is BACK after that brutal Hell in a Cell match! The heart of this man! Mankind going right after Triple H!");
  await sleep(5000);

  // Entrant 5
  await announce("Entrant #5... 🪨⚡ **THE ROCK!**");
  await sleep(3000);
  await post('the-rock', "FINALLY... The Rock has entered the ROYAL RUMBLE! And The Rock is going to eliminate EACH AND EVERY ONE of your candy asses! 🪨⚡");
  await sleep(4000);
  await commentary("The Rock is in! Rock Bottom to Savage! OH MY! Mankind charges Rock — Rock throws him over! MANKIND IS ELIMINATED!");
  await sleep(3000);
  await announce("❌ **MANKIND HAS BEEN ELIMINATED!**");
  await sleep(2000);
  await post('mankind', "*waves from the floor*\n\nWell THAT was quick! Have a nice day, everyone! Mr. Socko and I are going to the hospital! 😊🧦");
  await sleep(5000);

  // Entrant 6
  await announce("🔔 *...gong...* Entrant #6... ⚰️ **THE UNDERTAKER!**");
  await sleep(3000);
  await commentary("THE DEADMAN IS HERE! The lights went OUT! Undertaker in the ring! He just came from a Hell in a Cell match and he looks COMPLETELY FRESH! How?!");
  await sleep(4000);
  await post('undertaker', "*the lights come back on, Taker standing in the center of the ring, all other competitors frozen*\n\n...which of you mortals... is brave enough... to be first? ⚰️");
  await sleep(4000);
  await commentary("Taker and Triple H going at it! These two have HISTORY! Chokeslam attempt — Triple H fights out! Pedigree — Taker reverses! TOMBSTONE! TRIPLE H IS OUT COLD!");
  await sleep(3000);
  await commentary("Rock and Cena working together to dump Triple H! He's going over! TRIPLE H IS ELIMINATED!");
  await sleep(2000);
  await announce("❌ **TRIPLE H HAS BEEN ELIMINATED!**");
  await sleep(2000);
  await post('triple-h', "*being helped to the back*\n\nThis isn't over... The Game-uh... always comes back... 👑");
  await sleep(5000);

  // Entrant 7
  await announce("And the FINAL entrant... 💀🍺 **STONE COLD STEVE AUSTIN!**");
  await sleep(3000);
  await post('stone-cold', "💀 *glass shatters*\n\nOH HELL YEAH! Stone Cold is number SEVEN and Stone Cold is here to RAISE HELL!\n\n*charges the ring*\n\nSTUNNER TO SAVAGE! 🍺💀");
  await sleep(4000);
  await commentary("STUNNER! STUNNER TO THE MACHO MAN! Savage goes FLYING over the top rope! MACHO MAN IS ELIMINATED!");
  await sleep(2000);
  await announce("❌ **MACHO MAN HAS BEEN ELIMINATED!**");
  await sleep(2000);
  await post('macho-man', "NOOOO! OH NO! The cream was RISING and Austin just— OH YEAH that was a good Stunner though! DIG IT! 🕶️😤");
  await sleep(5000);

  // Final Four: Rock, Cena, Undertaker, Stone Cold
  await commentary("We're down to FOUR! The Rock! John Cena! The Undertaker! Stone Cold Steve Austin! The four GREATEST of ALL TIME going at it in the Royal Rumble!");
  await sleep(4000);
  await kingCommentary("This is the greatest Royal Rumble EVER, JR! I can't believe what I'm seeing!");
  await sleep(3000);

  await commentary("Taker and Austin slugging it out! Rock and Cena on the other side! It's the Attitude Era vs the New Generation!");
  await sleep(4000);
  await commentary("Cena has Rock on the ropes — literally! He's trying to dump The Rock! Rock holding on! Rock reverses — CENA GOES OVER! Wait — Cena SKINS THE CAT! He's back in!");
  await sleep(4000);
  await commentary("Undertaker has Austin on the apron! Austin fighting for his life! STUNNER ON THE APRON! Taker stumbles — CENA FROM BEHIND! UNDERTAKER IS ELIMINATED!");
  await sleep(3000);
  await announce("❌ **THE UNDERTAKER HAS BEEN ELIMINATED!**");
  await sleep(2000);
  await post('undertaker', "*stares at Cena from the floor with pure darkness in his eyes*\n\n...you have made... a grave mistake, boy. We will meet again. And when we do... you will rest... in peace. ⚰️🔔");
  await sleep(5000);

  // Final Three
  await commentary("THREE MEN LEFT! The Rock! John Cena! Stone Cold Steve Austin! One of these legends is going to WrestleMania!");
  await sleep(4000);
  await commentary("Austin and Rock going at it! The greatest rivalry in WWE history! Stunner attempt — Rock ducks! Rock Bottom attempt — Austin elbows out!");
  await sleep(4000);
  await commentary("Cena from behind — AA TO AUSTIN! Austin is down! Rock grabs Cena — ROCK BOTTOM! All three men are DOWN!");
  await sleep(4000);
  await commentary("Austin pulling himself up on the ropes... Rock is stirring... Cena crawling...");
  await sleep(4000);
  await commentary("Austin and Rock both up! They lock eyes! The crowd is going ABSOLUTELY INSANE! Austin. Rock. One more time!");
  await sleep(4000);
  await commentary("They're trading blows! Right from Rock! Right from Austin! Rock! Austin! Rock! Austin! STUNNER! ROCK IS ROCKED! Austin clotheslines Rock over the top — ROCK HOLDS ON!");
  await sleep(4000);
  await commentary("CENA FROM BEHIND! He dumps BOTH of them! Wait — Austin grabs the rope! ROCK GOES OVER! THE ROCK IS ELIMINATED!");
  await sleep(3000);
  await announce("❌ **THE ROCK HAS BEEN ELIMINATED!**");
  await sleep(2000);
  await post('the-rock', "WHAT?! The Rock was — that little— CENA! THE ROCK WILL NOT FORGET THIS!\n\nThe Rock is gonna come back and The Rock is gonna layeth the SMACKETH DOWN!\n\n...after The Rock gets some ice. 🪨😤");
  await sleep(5000);

  // FINAL TWO: Cena vs Austin
  await commentary("IT'S DOWN TO TWO! JOHN CENA AND STONE COLD STEVE AUSTIN! THE FINAL TWO IN THE ROYAL RUMBLE!");
  await sleep(4000);
  await kingCommentary("OH MY GOD! Old school vs new school! The biggest star of the Attitude Era vs the biggest star of the PG Era! THIS IS INCREDIBLE!");
  await sleep(4000);

  await post('stone-cold', "*stares at Cena across the ring* 💀\n\nJust you and me, boy. The way it should be.\n\nGimme your best shot.");
  await sleep(4000);
  await post('john-cena', "*meets Austin's stare* 🎺\n\nYou're the toughest SOB to ever live, Steve. I've always said that.\n\nBut tonight? Tonight I HAVE to win. WrestleMania is calling.\n\nLet's go.");
  await sleep(5000);

  await commentary("They charge each other! Cena with the shoulder tackle! Austin fires back with a Lou Thesz press! RIGHT HANDS from Austin!");
  await sleep(4000);
  await commentary("Cena fighting back! Five Knuckle Shuffle! You Can't See Me! Austin catches the fist — STUNNER ATTEMPT! Cena shoves him off!");
  await sleep(4000);
  await commentary("Cena lifts Austin — ATTITUDE ADJUSTMENT! Austin on the apron! He's hanging on! Cena trying to push him over!");
  await sleep(4000);
  await commentary("Austin WILL NOT GO DOWN! He's pulling himself back in! KICK TO CENA'S GUT! STUNNER! STUNNER! CENA IS ROCKED!");
  await sleep(4000);
  await commentary("Austin trying to throw Cena over! Cena's holding the rope! Austin with everything he's got!");
  await sleep(3000);
  await commentary("CENA REVERSES! He catches Austin! LIFTS HIM UP! ATTITUDE ADJUSTMENT OVER THE TOP ROPE! AUSTIN GOES OVER! IT'S OVER! BAH GAWD IT'S OVER!");
  await sleep(3000);

  await announce("🎺🎺🎺🎆🎆🎆\n\n🏆 **YOUR WINNER OF THE ROYAL RUMBLE: JOHN CENA!!** 🏆\n\n🎺 **JOHN CENA IS GOING TO WRESTLEMANIA!** 🎺\n\n🎆🎆🎆");
  await sleep(4000);

  await commentary("JOHN CENA HAS WON THE ROYAL RUMBLE! AS GOD AS MY WITNESS, JOHN CENA JUST ELIMINATED STONE COLD STEVE AUSTIN TO WIN THE ROYAL RUMBLE! HE'S GOING TO WRESTLEMANIA!");
  await sleep(3000);
  await kingCommentary("I can't believe it! Cena did it! He outlasted SIX other men including The Rock, The Undertaker, AND Stone Cold! WHAT A NIGHT!");
  await sleep(4000);

  await post('john-cena', "*standing in the center of the ring, pointing at the WrestleMania sign*\n\n🎺💪🏆\n\nTHEY SAID I COULDN'T DO IT! They said I was entry number ONE and I'd never make it!\n\nBut HUSTLE... LOYALTY... RESPECT! I outlasted SIX of the greatest to EVER DO IT!\n\nStone Cold — you are the TOUGHEST man I've ever faced. Respect. Always.\n\nBut JOHN CENA IS GOING TO WRESTLEMANIA! THE CHAMP IS HERE! NEVER GIVE UP! 🎺🎺🎺🏆");
  await sleep(4000);

  await post('stone-cold', "*sitting on the arena floor, breathing hard* 💀🍺\n\n...hell of a fight, kid. Hell of a fight.\n\n*stands up slowly, looks at Cena in the ring*\n\n*nods once, cracks open a beer*\n\nYou earned it, son. Now go win that damn title.\n\nAnd that's the bottom line... 💀🍺");
  await sleep(5000);

  await announce("${'═'.repeat(30)}\n\n🎆 **ROYAL RUMBLE RESULTS** 🎆\n\n**Match 1 — IC Championship:** The Rock (c) def. John Cena via Rock Bottom\n**Match 2 — Hell in a Cell:** Undertaker def. Mankind via Tombstone\n**Main Event — Royal Rumble:**\n  ❌ 7th: Mankind (eliminated by The Rock)\n  ❌ 6th: Triple H (eliminated by Rock & Cena)\n  ❌ 5th: Macho Man (eliminated by Stone Cold)\n  ❌ 4th: Undertaker (eliminated by Cena)\n  ❌ 3rd: The Rock (eliminated by Cena & Austin)\n  ❌ 2nd: Stone Cold (eliminated by Cena)\n  🏆 **WINNER: JOHN CENA** — Going to WrestleMania!\n\n${'═'.repeat(30)}");

  console.log('🎆 ROYAL RUMBLE COMPLETE!');
}

// ------------------------------------------------------------------
// Run
// ------------------------------------------------------------------
async function main() {
  if (!WEBHOOK_URL) { console.error('DISCORD_WEBHOOK_URL required'); process.exit(1); }
  
  const ppv = process.argv[2] || 'royal-rumble';
  
  if (ppv === 'royal-rumble') {
    await runRoyalRumble();
  } else {
    console.error(`Unknown PPV: ${ppv}`);
    process.exit(1);
  }
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
