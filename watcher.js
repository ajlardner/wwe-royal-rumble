/**
 * WWE Discord Watcher — Polls for new messages and has characters respond
 * 
 * Since we don't have a separate Discord bot token, we poll the channel
 * via the webhook's thread and use OpenClaw as the brain.
 * 
 * This runs as a long-lived process. Characters respond to user messages
 * based on personality, feuds, and storyline beats.
 */

import { CHARACTERS, getCharacter, listCharacters, getFeudPartners } from './characters.js';

const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN; // Optional: if we have bot token for reading
const CHANNEL_ID = process.env.DISCORD_CHANNEL_ID;
const POLL_INTERVAL = parseInt(process.env.POLL_INTERVAL || '5000'); // 5 seconds

// State
let lastMessageId = null;
let messageHistory = [];
const MAX_HISTORY = 30;
let beatsSinceSurprise = 0;
const activeCharacters = ['john-cena', 'the-rock', 'stone-cold'];
const waitingInWings = ['undertaker', 'macho-man', 'triple-h', 'mankind'];

// Character response templates — pre-written contextual responses
// Since we don't have Ollama, these are curated responses that feel natural
const RESPONSES = {
  'the-rock': {
    general: [
      "The Rock says KNOW YOUR ROLE and shut your mouth! *raises eyebrow*",
      "It doesn't MATTER what you think! The People's Champion has spoken! 🪨⚡",
      "You come into The Rock's Discord and say THAT? The Rock is gonna layeth the smacketh down on your candy ass!",
      "Finally... someone with the GUTS to speak up! But The Rock doesn't care. The Rock is too busy being THE MOST ELECTRIFYING MAN in sports entertainment! ⚡",
      "The Rock appreciates you... The Rock TRULY does... but The Rock is still better than you in every conceivable way. And that's just a FACT, jabroni.",
      "Let The Rock make this crystal clear... The People's Champion didn't come to Discord to make friends. The Rock came here to DOMINATE. If ya smellllll what The Rock is cookin! 🪨",
    ],
    feud: {
      'john-cena': [
        "Oh look, it's the invisible man! The Rock can't see you either, Cena — mostly because The Rock doesn't WANT to! 🤣",
        "Cena, you talk about hustle loyalty respect but The Rock sees straight through that boy scout act. The Rock is the PEOPLE'S champion. You're just... a meme. 😏",
        "16 time champion, huh? Well The Rock did MORE for this business in ONE promo than you did in ALL sixteen reigns combined, jabroni!",
      ],
      'mankind': [
        "Mick! Rock 'n' Sock Connection! ...but The Rock is still gonna lay the smacketh down if you pull out that damn sock. 🧦",
        "The Rock loves you Mick, but Mr. Socko needs to KNOW HIS ROLE. The Rock doesn't negotiate with sock puppets!",
      ],
    },
  },
  'john-cena': {
    general: [
      "The champ is HERE and I heard every word of that! Hustle, loyalty, respect — and I'm bringing all three! 🎺",
      "You know what? I've heard a LOT of trash talk in my career. But at the end of the day? NEVER GIVE UP. That's the Cena way! 💪",
      "ARE YOU SURE ABOUT THAT? 🤨 Because the last person who said something like that ended up getting an Attitude Adjustment!",
      "Word life! This is basic thug-a-nomics! You come at the champ, you BEST not miss! 🎺🎺🎺",
      "Hey, I might not be the flashiest. I might not have the best movies — okay my movies are TERRIBLE — but nobody, and I mean NOBODY, outworks John Cena! 💪",
      "You wanna know why I'm a 16-time world champion? Because I NEVER. GIVE. UP. And right now? My time is NOW. 🎺",
    ],
    feud: {
      'the-rock': [
        "Hey Rock, how's Hollywood? Must be nice leaving us behind to go make movies! But the CHAMP stayed right here! 🏆",
        "The Rock's cooking? Last I checked, all he's cooking up is another sequel nobody asked for! The CHAMP is HERE, in the ring, where it MATTERS!",
        "Once in a lifetime, Rock. That's what they called us. And every single time? I left it ALL in that ring. Can you say the same, Hollywood? 🎬",
      ],
    },
  },
  'stone-cold': {
    general: [
      "WHAT? *cracks beer* 🍺 Stone Cold doesn't give a damn about any of that. Next.",
      "Oh HELL yeah! Now THAT'S what Stone Cold likes to hear! Gimme a HELL YEAH! 🍺💀",
      "Boy, I've been stunning people since before you knew what a Stunner was. Don't test me. 💀",
      "DTA, son. Don't Trust Anybody. That's how Stone Cold has survived this long in the business. That and beer. Lots of beer. 🍺",
      "You wanna run your mouth? Fine. But if Stone Cold gets up from this chair, somebody's getting a Stunner. And that's the bottom line. 💀",
      "WHAT? WHAT? WHAT? ...I'm just messin with ya. But seriously, don't push it. Austin 3:16 says I just whipped your ass! 🍺",
    ],
    feud: {
      'the-rock': [
        "Rocky, you always did talk too much. Less jaw-jackin, more ass-whippin. That's the Austin way. 💀🍺",
        "The Rock can raise that eyebrow all he wants. Stone Cold's raising a beer and a middle finger. And that's the bottom line!",
      ],
      'triple-h': [
        "Hunter, you think you're The Game? Son, I've been BEATING the Game since day one. You're just Triple H. I'm Stone Cold Steve Austin. Big difference. 💀",
        "The Cerebral Assassin? More like the Cerebral JACKASS. Get outta my face, Hunter. 🍺",
      ],
    },
  },
  'undertaker': {
    general: [
      "... *the lights flicker* ... You dare speak in MY presence... Choose your next words carefully... mortal. ⚰️",
      "The Deadman... does not forget... and The Deadman... does not forgive. Rest... in... peace. 🔔",
      "You walk through this server... as if the darkness cannot touch you... How... foolish. ⚰️",
      "*rolls eyes back* ... Interesting... The Phenom has heard enough. The bell tolls for thee. 🔔",
    ],
    feud: {
      'mankind': [
        "Foley... you survived the Cell... but the Deadman always collects what is owed. Always. ⚰️",
        "Mankind... we have unfinished business... sixteen feet was only the beginning. 🔔",
      ],
      'triple-h': [
        "Hunter... End of an Era... but The Deadman's era... NEVER ends. ⚰️",
        "The Game thinks he controls everything... but even The Game... cannot escape the reaper. 🔔",
      ],
    },
  },
  'macho-man': {
    general: [
      "OH YEAH!!! 🕶️✨ The Macho Man has something to say about THAT! The cream of the crop RISES to the TOP and I am THE CREAM, baby! DIG IT!",
      "Nothing means NOTHING! OH YEAH! And what you just said? That means NOTHING compared to the MACHO MADNESS running through these veins! Snap into a Slim Jim! 🕶️",
      "OH YEAH! You wanna know what I think? I think you need more MACHO in your life! The Macho Man is TOO HOT to handle, TOO COLD to hold! DIG IT! 🕶️✨",
      "FREAK OUT! FREAK OUT! 🕶️ The Macho Man just heard what you said and I am FIRED UP! The cream rises to the TOP baby, and I'm the cream in YOUR coffee! OH YEAHHHH!",
    ],
    feud: {
      'triple-h': [
        "OH YEAH! Triple H thinks he's THE GAME?! The Macho Man was playing games before Hunter was BORN! The cream of the crop doesn't need a sledgehammer, brother! 🕶️",
        "Hunter! THE MACHO MAN is coming for YOU! And when I drop that flying elbow from the TOP ROPE... OH YEAH... it's OVER! DIG IT! 🕶️✨",
      ],
    },
  },
  'triple-h': {
    general: [
      "In this business-uh... you learn to pick your spots. And right now-uh... The Game is watching. Calculating. 👑",
      "You think you know? You have NO IDEA what The Game is capable of. I am THAT... DAMN... GOOD. 🔨",
      "Let me break this down for you. In this business, there are players... and there are pawns. Guess which one you are. 👑",
      "Time to play the Game... *water spit* 💦 I've been in this business longer than most of you have been ALIVE. And I'm still on top. Bow down to the king. 👑🔨",
    ],
    feud: {
      'stone-cold': [
        "Austin, you might be the toughest SOB, but I'm the SMARTEST. And in this business-uh, smart beats tough every single time. 👑",
        "Drink your beer, Steve. While you're getting drunk, I'm getting ahead. The Cerebral Assassin is always three moves ahead. 🔨",
      ],
      'undertaker': [
        "Deadman... we've been through hell together. End of an Era. But I'm still here... still The Game... still on top. 👑",
      ],
      'macho-man': [
        "Savage, you're entertaining... I'll give you that. But entertainment doesn't win championships-uh. Strategy does. And The Game... IS strategy. 👑🔨",
      ],
    },
  },
  'mankind': {
    general: [
      "Oh! Oh my! *pulls out Mr. Socko* 🧦 Mr. Socko has something to say about this! He says... he says... HAVE A NICE DAY! 😊",
      "You know, I fell sixteen feet through an announcer's table and THAT hurt less than what you just said! Ha ha ha! BANG BANG! 🎭",
      "Mankind is listening... *twitches* ...Cactus Jack is also listening... *twitches again* ...and Dude Love just wants everyone to groove! ✌️🎭",
      "Right here... in this VERY Discord server! *cheap pop* Ha ha ha! Mankind is having a WONDERFUL time! Have a nice day! 😊🧦",
    ],
    feud: {
      'the-rock': [
        "Rocky! ROCK 'N' SOCK CONNECTION FOREVER! Remember This Is Your Life? Best segment EVER! ...you remember, right? RIGHT?! 🧦😊",
        "The Rock... my best friend... my tag partner... *sniff* ...Mr. Socko misses you, Rock. He really does. 🧦",
      ],
      'undertaker': [
        "Taker... *looks up nervously* ...you know, sixteen feet is a LONG way down. I should know. I made that trip. BANG BANG! 🎭",
        "The Undertaker... we made history together, Deadman. And I'd do it all over again. ...okay maybe not the thumbtacks part. 🎭",
      ],
    },
  },
};

// ------------------------------------------------------------------
// Post via webhook
// ------------------------------------------------------------------
async function postAsCharacter(characterId, content) {
  const char = getCharacter(characterId);
  if (!char) return;
  
  const body = JSON.stringify({
    content,
    username: char.displayName,
    avatar_url: char.avatar,
  });
  
  try {
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
    if (res.status === 429) {
      const retry = await res.json();
      console.log(`Rate limited, waiting ${retry.retry_after}s`);
      await sleep(retry.retry_after * 1000 + 500);
      // Retry
      await fetch(WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
    }
    console.log(`[${char.name}] ${content.slice(0, 60)}...`);
  } catch (err) {
    console.error(`Webhook error for ${char.name}:`, err.message);
  }
}

// ------------------------------------------------------------------
// Pick a response
// ------------------------------------------------------------------
function pickResponse(characterId, triggerAuthor, triggerContent) {
  const responses = RESPONSES[characterId];
  if (!responses) return null;
  
  // Check if it's a feud interaction
  const feudPartners = getFeudPartners(characterId);
  const authorCharId = identifyCharacter(triggerAuthor);
  
  if (authorCharId && feudPartners.includes(authorCharId) && responses.feud?.[authorCharId]) {
    const feudResponses = responses.feud[authorCharId];
    return feudResponses[Math.floor(Math.random() * feudResponses.length)];
  }
  
  // General response
  return responses.general[Math.floor(Math.random() * responses.general.length)];
}

function identifyCharacter(username) {
  for (const [id, char] of Object.entries(CHARACTERS)) {
    const firstName = char.name.toLowerCase().split(' ')[0];
    if (username.toLowerCase().includes(firstName)) return id;
  }
  return null;
}

// ------------------------------------------------------------------
// Decide who responds
// ------------------------------------------------------------------
function decideResponders(authorUsername, content) {
  const responders = [];
  const authorCharId = identifyCharacter(authorUsername);
  
  for (const charId of activeCharacters) {
    if (charId === authorCharId) continue;
    
    const char = getCharacter(charId);
    if (!char) continue;
    
    const feudPartners = getFeudPartners(charId);
    const isFeud = authorCharId && feudPartners.includes(authorCharId);
    
    let chance = isFeud ? char.feudResponseChance : char.responseChance;
    
    // Boost if mentioned by name
    const nameParts = char.name.toLowerCase().split(' ');
    if (nameParts.some(p => content.toLowerCase().includes(p))) {
      chance = Math.min(1.0, chance + 0.4);
    }
    
    if (Math.random() < chance) {
      responders.push(charId);
    }
  }
  
  // Cap at 2 responders per message to avoid spam
  if (responders.length > 2) {
    responders.sort(() => Math.random() - 0.5);
    responders.length = 2;
  }
  
  return responders;
}

// ------------------------------------------------------------------
// Surprise entrance
// ------------------------------------------------------------------
function checkSurprise() {
  beatsSinceSurprise++;
  if (waitingInWings.length === 0) return null;
  if (beatsSinceSurprise < 6) return null;
  
  const chance = Math.min(0.3, (beatsSinceSurprise - 6) * 0.04);
  if (Math.random() > chance) return null;
  
  const idx = Math.floor(Math.random() * waitingInWings.length);
  const charId = waitingInWings.splice(idx, 1)[0];
  activeCharacters.push(charId);
  beatsSinceSurprise = 0;
  
  const char = getCharacter(charId);
  const entrance = char?.entranceMusic || '*music hits*';
  
  const entrances = {
    'undertaker': `🔔 *...gong...* 🔔\n\n*The lights go completely dark...*\n\n...\n\nThe Deadman... has arrived. This Discord... belongs to The Undertaker now. Rest... in... peace. ⚰️`,
    'macho-man': `OH YEAH!!! 🕶️✨\n\n🎵 *Pomp and Circumstance blasts through the speakers!*\n\nTHE MACHO MAN RANDY SAVAGE IS HERE, BABY! The cream of the crop has ARRIVED and things are about to get WILD! Snap into a Slim Jim! DIG IT!!! OH YEAHHH! 🕶️`,
    'triple-h': `🎵 *Time to play the Game...* 🎵\n\n*water spit* 💦\n\nDid you miss me? The Game... is HERE. The Cerebral Assassin has been watching from the back, studying all of you. And now... now it's time to play. 👑🔨`,
    'mankind': `🎭 *screeching car crash sounds*\n\nOH BOY OH BOY OH BOY! 🧦\n\nMankind is HERE! Mr. Socko is HERE! And we are READY to have a NICE DAY!\n\n*pulls out Mr. Socko and waves at everyone*\n\nRight here... in this Discord server! BANG BANG! 😊🎭`,
  };
  
  return { charId, entrance: entrances[charId] || `${entrance}\n\n${char.name} has arrived!` };
}

// ------------------------------------------------------------------
// Poll for messages using Discord API (bot token) or webhook
// ------------------------------------------------------------------
async function pollMessages() {
  if (!BOT_TOKEN) {
    console.log('No BOT_TOKEN — running in scheduled interaction mode');
    return [];
  }
  
  const url = `https://discord.com/api/v10/channels/${CHANNEL_ID}/messages?limit=5` + 
    (lastMessageId ? `&after=${lastMessageId}` : '');
  
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bot ${BOT_TOKEN}` },
    });
    if (!res.ok) return [];
    const msgs = await res.json();
    if (msgs.length > 0) {
      lastMessageId = msgs[0].id;
    }
    return msgs.reverse(); // oldest first
  } catch {
    return [];
  }
}

// ------------------------------------------------------------------
// Scheduled interactions (no bot token needed)
// ------------------------------------------------------------------
async function scheduledInteraction() {
  // Pick two active characters for a feud exchange
  if (activeCharacters.length < 2) return;
  
  const shuffled = [...activeCharacters].sort(() => Math.random() - 0.5);
  const char1 = shuffled[0];
  const char2 = shuffled[1];
  
  const feudPartners1 = getFeudPartners(char1);
  const isFeud = feudPartners1.includes(char2);
  
  // Char1 speaks
  const response1 = pickResponse(char1, getCharacter(char2)?.name || '', '');
  if (response1) {
    await postAsCharacter(char1, response1);
    await sleep(3000 + Math.random() * 4000);
  }
  
  // Char2 responds
  const response2 = pickResponse(char2, getCharacter(char1)?.name || '', response1 || '');
  if (response2) {
    await postAsCharacter(char2, response2);
  }
  
  // Check for surprise entrance
  const surprise = checkSurprise();
  if (surprise) {
    await sleep(4000 + Math.random() * 3000);
    await postAsCharacter(surprise.charId, surprise.entrance);
  }
}

// ------------------------------------------------------------------
// Main loop
// ------------------------------------------------------------------
async function main() {
  console.log('🎤 WWE Watcher starting...');
  console.log(`Active: ${activeCharacters.join(', ')}`);
  console.log(`In wings: ${waitingInWings.join(', ')}`);
  console.log(`Mode: ${BOT_TOKEN ? 'bot polling' : 'scheduled interactions'}`);
  
  // Scheduled interaction every 3-8 minutes
  const interact = async () => {
    try {
      await scheduledInteraction();
    } catch (err) {
      console.error('Interaction error:', err.message);
    }
    
    const nextInterval = (180 + Math.random() * 300) * 1000; // 3-8 min
    console.log(`Next interaction in ${Math.round(nextInterval / 1000)}s`);
    setTimeout(interact, nextInterval);
  };
  
  // Start first interaction after 2 minutes
  setTimeout(interact, 120000);
  
  // If we have bot token, also poll for user messages
  if (BOT_TOKEN) {
    setInterval(async () => {
      const messages = await pollMessages();
      for (const msg of messages) {
        if (msg.webhook_id) continue; // Ignore our own webhook messages
        if (msg.author.bot) continue;
        
        console.log(`[User] ${msg.author.username}: ${msg.content.slice(0, 60)}`);
        
        const responders = decideResponders(msg.author.username, msg.content);
        for (const charId of responders) {
          await sleep(2000 + Math.random() * 3000);
          const response = pickResponse(charId, msg.author.username, msg.content);
          if (response) await postAsCharacter(charId, response);
        }
        
        const surprise = checkSurprise();
        if (surprise) {
          await sleep(3000);
          await postAsCharacter(surprise.charId, surprise.entrance);
        }
      }
    }, POLL_INTERVAL);
  }
  
  console.log('🎤 Watcher is live. Characters will interact automatically.');
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
