// ---------- snack library ----------
// every snack has tags. the bot scores each snack against
// what you typed and suggests the best match.
const SNACKS = [
  { emoji: '🍫', name: 'dark chocolate squares', tags: ['sweet', 'sad', 'stressed', 'treat'] },
  { emoji: '🍿', name: 'popcorn',               tags: ['salty', 'crunchy', 'bored', 'movie', 'light'] },
  { emoji: '🍓', name: 'strawberries & yogurt', tags: ['sweet', 'fresh', 'healthy', 'happy', 'light'] },
  { emoji: '🥨', name: 'pretzels',              tags: ['salty', 'crunchy', 'stressed', 'quick'] },
  { emoji: '🍎', name: 'apple & peanut butter', tags: ['sweet', 'crunchy', 'healthy', 'tired', 'energy'] },
  { emoji: '🧀', name: 'cheese & crackers',     tags: ['salty', 'crunchy', 'cozy', 'hungry'] },
  { emoji: '🍪', name: 'warm cookies',          tags: ['sweet', 'cozy', 'sad', 'lonely', 'treat'] },
  { emoji: '🥜', name: 'trail mix',             tags: ['salty', 'sweet', 'crunchy', 'energy', 'focus', 'quick'] },
  { emoji: '🍌', name: 'banana',                tags: ['sweet', 'healthy', 'energy', 'tired', 'quick'] },
  { emoji: '🍵', name: 'tea & a biscuit',       tags: ['cozy', 'anxious', 'calm', 'light', 'sweet'] },
  { emoji: '🍜', name: 'cup noodles',           tags: ['salty', 'warm', 'cozy', 'hungry', 'quick', 'sad'] },
  { emoji: '🥕', name: 'veggies & hummus',      tags: ['crunchy', 'healthy', 'fresh', 'focus'] },
  { emoji: '🍦', name: 'ice cream',             tags: ['sweet', 'cold', 'treat', 'happy', 'celebrate', 'sad'] },
  { emoji: '🫐', name: 'frozen blueberries',    tags: ['sweet', 'cold', 'healthy', 'fresh', 'bored'] },
  { emoji: '🍞', name: 'toast with honey',      tags: ['sweet', 'warm', 'cozy', 'quick', 'tired'] },
  { emoji: '🧁', name: 'a cupcake',             tags: ['sweet', 'celebrate', 'happy', 'treat'] },
  { emoji: '🥒', name: 'pickles',               tags: ['salty', 'crunchy', 'sour', 'bored'] },
  { emoji: '🍋', name: 'sour gummies',          tags: ['sour', 'sweet', 'bored', 'treat'] },
];

// words people type → the tag they mean
const WORD_TO_TAG = {
  sad: 'sad', down: 'sad', upset: 'sad', crying: 'sad', blue: 'sad',
  stressed: 'stressed', stress: 'stressed', overwhelmed: 'stressed', busy: 'stressed',
  anxious: 'anxious', nervous: 'anxious', worried: 'anxious',
  calm: 'calm', relax: 'calm', chill: 'calm',
  tired: 'tired', sleepy: 'tired', exhausted: 'tired', drained: 'tired',
  bored: 'bored', meh: 'bored',
  happy: 'happy', good: 'happy', great: 'happy',
  celebrate: 'celebrate', celebrating: 'celebrate', party: 'celebrate', yay: 'celebrate',
  lonely: 'lonely', alone: 'lonely',
  cozy: 'cozy', cold: 'cold', warm: 'warm',
  focus: 'focus', studying: 'focus', working: 'focus', work: 'focus', study: 'focus',
  hungry: 'hungry', starving: 'hungry',
  sweet: 'sweet', sugar: 'sweet', chocolate: 'sweet', dessert: 'sweet',
  salty: 'salty', savory: 'salty', chips: 'salty',
  crunchy: 'crunchy', crispy: 'crunchy', crunch: 'crunchy',
  sour: 'sour', tangy: 'sour',
  healthy: 'healthy', light: 'light', fresh: 'fresh', energy: 'energy',
  quick: 'quick', fast: 'quick', easy: 'quick',
  treat: 'treat', movie: 'movie',
};

// little notes based on mood
const MOOD_NOTES = {
  sad: "sad days deserve gentle treats 🥺",
  stressed: "deep breath first, then crunch 😮‍💨",
  anxious: "something warm and calm might help 🍵",
  tired: "here's a little energy boost ⚡",
  bored: "let's make snack time fun 🎲",
  happy: "happy snacks for a happy you ✨",
  celebrate: "ooh we're celebrating! 🎉",
  lonely: "a cozy snack, and maybe text a friend 💌",
  focus: "brain food incoming 🧠",
};

const CHIPS = ['😮‍💨 stressed', '😴 tired', '🥺 sad', '🎉 celebrating', '🍬 something sweet', '🧂 salty & crunchy', '🔁 another one'];

// ---------- state ----------
const $ = id => document.getElementById(id);
let lastTags = [];
let recent = []; // don't repeat the last few snacks

// ---------- brain ----------
function findTags(text) {
  const words = text.toLowerCase().replace(/[^a-z\s]/g, ' ').split(/\s+/);
  const tags = [];
  words.forEach(w => {
    if (WORD_TO_TAG[w] && !tags.includes(WORD_TO_TAG[w])) tags.push(WORD_TO_TAG[w]);
  });
  // "not happy" shouldn't count as happy
  if (/\b(not|dont|don't|never)\b.*\b(happy|good|great)\b/.test(text.toLowerCase())) {
    const i = tags.indexOf('happy');
    if (i > -1) tags.splice(i, 1, 'sad');
  }
  return tags;
}

function bestSnack(tags) {
  const scored = SNACKS
    .filter(s => !recent.includes(s.name))
    .map(s => ({
      snack: s,
      // 1 point per matching tag, plus a tiny random nudge so ties feel fresh
      score: tags.filter(t => s.tags.includes(t)).length + Math.random() * 0.5,
    }))
    .sort((a, b) => b.score - a.score);

  const choice = scored[0].snack;
  recent.push(choice.name);
  if (recent.length > 4) recent.shift();
  return choice;
}

function respond(text) {
  const lower = text.toLowerCase();

  if (/\b(hi|hello|hey|hii)\b/.test(lower)) {
    return { text: "hiii snack friend! 🍓 how are you feeling, and what are you craving?" };
  }
  if (/\b(thanks|thank|ty|yum|yummy)\b/.test(lower)) {
    return { text: "enjoy your snack! 💕 come back when you're hungry again." };
  }

  let tags = findTags(text);
  const wantsAnother = /\b(another|again|else|different|more|next)\b/.test(lower);

  if (tags.length === 0 && wantsAnother && lastTags.length) tags = lastTags;
  if (tags.length === 0 && !wantsAnother) {
    return { text: "hmm, tell me a mood (stressed, tired, happy...) or a craving (sweet, salty, crunchy...) 🍪" };
  }

  lastTags = tags;
  const snack = bestSnack(tags);
  const mood = tags.find(t => MOOD_NOTES[t]);
  const intro = mood ? MOOD_NOTES[mood] : pick(["ooh I've got just the thing 👀", 'try this one! 😋']);
  const matched = tags.filter(t => snack.tags.includes(t));

  return { text: intro, snack, matched };
}

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// ---------- chat ----------
function addMessage(text, who) {
  const div = document.createElement('div');
  div.className = 'msg ' + who;
  div.textContent = text;
  $('messages').appendChild(div);
  scrollDown();
  return div;
}

function addSnackCard(snack, matched) {
  const card = document.createElement('div');
  card.className = 'snack';
  const why = matched.length ? 'perfect for: ' + matched.join(', ') : 'a little surprise pick!';
  card.innerHTML =
    '<div class="emoji">' + snack.emoji + '</div>' +
    '<div>' +
      '<div class="name">' + snack.name + '</div>' +
      '<div class="why">' + why + '</div>' +
      '<div class="tags">' + snack.tags.map(t => '<span class="tag">' + t + '</span>').join('') + '</div>' +
    '</div>';
  $('messages').appendChild(card);
  scrollDown();
}

function scrollDown() { $('messages').scrollTop = $('messages').scrollHeight; }

function send(text) {
  text = text.trim();
  if (!text) return;
  addMessage(text, 'user');

  const typing = addMessage('', 'bot');
  typing.innerHTML = '<span class="typing"><span></span><span></span><span></span></span>';
  const answer = respond(text);

  setTimeout(() => {
    typing.textContent = answer.text;
    if (answer.snack) {
      addSnackCard(answer.snack, answer.matched);
      const logo = $('logo');
      logo.textContent = answer.snack.emoji;
      logo.classList.remove('munch');
      void logo.offsetWidth;
      logo.classList.add('munch');
    }
    scrollDown();
  }, 800);
}

// ---------- setup ----------
CHIPS.forEach(c => {
  const b = document.createElement('button');
  b.className = 'chip';
  b.textContent = c;
  b.addEventListener('click', () => send(c));
  $('chips').appendChild(b);
});

$('composer').addEventListener('submit', e => {
  e.preventDefault();
  send($('input').value);
  $('input').value = '';
});

addMessage("hi! I'm snack buddy 🍓 tell me how you feel and what you're craving, like \"tired and want something sweet\"", 'bot');
