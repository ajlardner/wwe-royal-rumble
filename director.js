/**
 * WWE Discord Director — Live Standalone Version
 * 
 * Posts as WWE characters via Discord webhook.
 * Runs directly on the host machine.
 * Uses OpenClaw's built-in LLM for character responses.
 */

import { CHARACTERS, getCharacter, listCharacters, getFeudPartners } from './characters.js';

const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
const CHANNEL_ID = process.env.DISCORD_CHANNEL_ID;
const GUILD_ID = process.env.DISCORD_GUILD_ID;

if (!WEBHOOK_URL) {
  console.error('DISCORD_WEBHOOK_URL required');
  process.exit(1);
}

// Post as a character via webhook
async function postAsCharacter(characterId, content) {
  const char = getCharacter(characterId);
  if (!char) return;
  
  const body = JSON.stringify({
    content,
    username: char.displayName,
    avatar_url: char.avatar,
  });
  
  const res = await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  });
  
  if (!res.ok) {
    console.error(`Webhook failed for ${char.name}: ${res.status}`);
  } else {
    console.log(`[${char.name}] ${content.slice(0, 80)}...`);
  }
  
  // Rate limit: wait 1.5s between webhook posts
  await new Promise(r => setTimeout(r, 1500));
}

// Generate an opening segment
async function openingSegment() {
  console.log('🎤 Opening segment starting...');
  
  // The Rock's entrance
  await postAsCharacter('the-rock', 
    "Finally... The Rock HAS COME BACK to Discord! 🪨⚡\n\nThe Rock says this — The Rock has been ALL over the world. Hollywood. WrestleMania. The People's living rooms. But NOTHING... and The Rock means NOTHING... compares to the electricity The Rock feels RIGHT HERE, right now. *raises eyebrow*\n\nSo The Rock has one question for all of you... DO YA SMELL WHAT THE ROCK IS COOKIN'?!");

  await new Promise(r => setTimeout(r, 4000));
  
  // Cena responds
  await postAsCharacter('john-cena',
    "🎺🎺🎺 Woah woah woah, hold on a second Rocky!\n\nYou come out here talking about being the most electrifying man in sports entertainment, but last time I checked, the CHAMP. IS. HERE. 💪\n\nHustle, loyalty, respect — three things The Rock left behind when he went to Hollywood. But hey, at least your movies are... well... they exist! 😂\n\nYou can't see me, Rock. And THAT is something even your People's Eyebrow can't fix!");

  await new Promise(r => setTimeout(r, 5000));
  
  // Rock fires back
  await postAsCharacter('the-rock',
    "The Rock is gonna stop you RIGHT there, John. You wanna talk about movies? The Rock made more in ONE movie than you made in your ENTIRE career of waving your hand in front of your face like a jabroni! 🤣\n\nAnd The Rock KNOWS the people can see him — all 260 pounds of Grade-A, People's Champion, laying-the-smackdown GREATNESS.\n\nSo why don't you take your little \"hustle loyalty respect\" catchphrase, shine it up REAL nice... turn that sumbitch sideways... and— well, you know the rest. 😏");

  await new Promise(r => setTimeout(r, 5000));
  
  // Cena getting heated
  await postAsCharacter('john-cena',
    "Oh, I know the rest alright. I know that every single time we've stepped in that ring, it's been ONCE IN A LIFETIME. And every time? The crowd REMEMBERS.\n\nYou wanna compare bank accounts? Fine. But championships? I got SIXTEEN, baby. 1-6. That's more title reigns than you have good Fast & Furious movies! 🏆\n\nThe champ is HERE, Rock. Not in Hollywood. Not on a movie set. RIGHT HERE.");

  await new Promise(r => setTimeout(r, 6000));

  // GLASS SHATTERS - Stone Cold interrupts
  await postAsCharacter('stone-cold',
    "💀 ***glass shatters*** 💀\n\nWHAT?\n\nNow hold on just a damn minute. Stone Cold Steve Austin came here to drink beer and raise hell, and I'm just about ALL out of beer. 🍺\n\nRocky, you can take your People's Elbow and shove it. Cena, you can take your hustle loyalty respect and stuff it.\n\nBecause Austin 3:16 says the both of you need to shut your mouths before I open up a can of whoop-ass on BOTH of ya!\n\nAnd THAT'S the bottom line... cause Stone Cold said so! 💀🍺");

  await new Promise(r => setTimeout(r, 5000));

  // Rock responds to Austin
  await postAsCharacter('the-rock',
    "Well well well... if it isn't the Texas Rattlesnake himself. The Rock respects you Steve, The Rock truly does. You're the toughest SOB to ever step foot in a WWE ring.\n\nBut The Rock didn't come to Discord to play nice. The Rock came here to layeth the smacketh down on ALL your candy asses!\n\nSo Steve... you wanna drink your little beers? Go ahead. But just know — The Rock is here. The People's Champion is HERE. And The Rock... is just getting started. 🪨⚡");

  await new Promise(r => setTimeout(r, 5000));

  // Austin doesn't care
  await postAsCharacter('stone-cold',
    "WHAT?\n\nYou finished? Good. Because Stone Cold doesn't give a damn about your little eyebrow or your electrifying whatever-the-hell.\n\n*cracks open a beer* 🍺\n\nI came here for one reason: to raise hell. And if either one of you jabrones gets in my way, you're getting a Stunner. That goes for you Rock, that goes for you Cena, that goes for ANYBODY in this server.\n\nGimme a HELL YEAH! 💀");

  await new Promise(r => setTimeout(r, 6000));

  // The lights go out...
  await postAsCharacter('undertaker',
    "🔔 *...gong...* 🔔\n\n*The lights go dark. The temperature drops. A bell tolls in the distance.*\n\n...\n\nYou mortals... bicker and squabble... like children in a playground...\n\nBut The Deadman has been watching. Listening. Waiting.\n\nThis Discord... is now... MY yard.\n\nAnd each of you... will eventually... rest... in... peace. ⚰️");

  await new Promise(r => setTimeout(r, 5000));

  // Macho Man can't help himself
  await postAsCharacter('macho-man',
    "OH YEAH!!! 🕶️✨\n\nMACHO MAN RANDY SAVAGE is in the BUILDING, brother! And let me tell you something — ALL of you jabronis, ALL of you tough guys, ALL of you Deadmen and People's Champions and whatever the HELL John Cena calls himself —\n\nNONE of you — and I mean NONE OF YOU — are the cream of the crop! Because the CREAM... rises... to the TOP! And I'm the cream in YOUR coffee! OH YEAH!\n\nSnap into a Slim Jim! DIG IT! 🕶️");

  await new Promise(r => setTimeout(r, 5000));

  // Triple H makes his presence known
  await postAsCharacter('triple-h',
    "🎵 *Time to play the Game...* 🎵\n\nYou know... I've been sitting backstage, watching all of this unfold. The Rock's running his mouth. Cena's doing his boy scout routine. Austin's drinking beer. Taker's being spooky. And Savage is... well, Savage is being Savage.\n\nBut here's the thing-uh... In this business-uh... it's not about who talks the loudest. It's about who plays the Game the BEST.\n\nAnd I... AM... the Game. 👑\n\nSo enjoy your little reunion tour, boys. Because The Cerebral Assassin is here. And I'm already three moves ahead of ALL of you. 🔨");

  await new Promise(r => setTimeout(r, 5000));

  // Mankind shows up
  await postAsCharacter('mankind',
    "Oh! Oh oh oh! 🎭\n\nMr. Socko! MR. SOCKO! Do you see this?! Everyone's here! The Rock — my buddy! My tag team partner! Rock 'n' Sock Connection FOREVER!\n\n*pulls out Mr. Socko* 🧦\n\nYou know, I once fell sixteen feet through an announcer's table, and I gotta say... landing in this Discord channel hurts ALMOST as much! Ha ha ha!\n\nBut seriously folks — Mankind is here. Cactus Jack is here. Dude Love is... well, Dude Love is somewhere grooving.\n\nHave a nice day! 😊🎭");

  await new Promise(r => setTimeout(r, 4000));

  // Final exchange - Rock and Mankind reunion
  await postAsCharacter('the-rock',
    "Mick! The Rock... The Rock is actually happy to see you, you crazy son of a— well, you know.\n\nRock 'n' Sock Connection! The most entertaining tag team in the HISTORY of this business!\n\n...But The Rock is still gonna layeth the smacketh down on EVERYONE in this server. Including you, Mick. It's nothing personal.\n\nIF YA SMELLLLLL... WHAT THE ROCK... IS COOKIN'! 🪨⚡🔥");

  console.log('🎤 Opening segment complete! All 7 wrestlers have entered the arena.');
}

// Run it
openingSegment().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
