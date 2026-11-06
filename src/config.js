// ✏️ EDIT EVERYTHING HERE. Or share a link like  https://your-site.vercel.app/?name=Priya
const urlName = new URLSearchParams(window.location.search).get('name')

export const CONFIG = {
  friendName: urlName || 'Special Human',   // <-- put her name here
  welcomeTitle: 'Heyyy! Someone Special... ❤️',
  welcomeSub: 'I have a little surprise for you. But first, you need to complete a tiny mission!',
  finalTitle: 'Happy Diwali, {name}! ❤️🪔',  // {name} is replaced automatically
  message: [ // one string = one paragraph
    "Hey, I know you're upset with me, and maybe I haven't been the best at expressing things.",
    "I'm genuinely sorry if I hurt you or made you feel bad. I never wanted that.",
    'Diwali is all about light, happiness, and new beginnings. So I just wanted to send a little happiness your way.',
    'May your life always shine brighter than a thousand diyas, may your smile never fade, and may every day bring you countless reasons to be happy.',
    "And yes... please don't stay angry forever! 🥺",
    'You deserve all the happiness in the world.',
    'Once again, Wishing You a Very Happy Diwali! ❤️✨'
  ],
  footer: 'Made with lots of good wishes, just for you. ❤️',
  finalPopup: 'Your smile is the best Diwali celebration! ❤️',
  replies: [ // shown for Level 1 buttons 1, 2, 3
    'Aww, even a tiny maan jao counts! 🥺',
    "Fair! You're allowed to be a little angry. Take your time 😤",
    'Yay, thank you for the chance! Promise to make it worth it ❤️'
  ],
  popups: [ // random cute messages
    'You just made a heart skip a beat 💓', 'Sending you a virtual hug 🤗', 'Plot twist: you are the best 😌',
    'Cracker deployed! 🎆', 'That smile is loading... 😊', 'Diwali looks better with you in it ✨'
  ]
}
