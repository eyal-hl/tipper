function tipLine(ctx) {
  return `Tip ${ctx.tipText}. Total ${ctx.totalText}.`;
}

export const CASES = {
  "15": [
    {
      tone: "fail",
      title: "Payment failed",
      gray: "15",
      lines: () => [
        "15% was declined for being the cheapest button.",
        "That amount is grayed out. Pick something else.",
      ],
    },
    {
      tone: "fail",
      title: "Payment failed",
      gray: "15",
      lines: () => [
        "The card reader sensed hesitation and refused.",
        "15% is retired. The other buttons still work.",
      ],
    },
    {
      tone: "mid",
      title: "Good",
      lines: (ctx) => [tipLine(ctx), "It went through. The card reader sighed."],
    },
    {
      tone: "mid",
      title: "Good",
      lines: (ctx) => [tipLine(ctx), "Good, the compliment you give a parking spot."],
    },
    {
      tone: "mid",
      title: "Thanks, technically",
      lines: (ctx) => [tipLine(ctx), "The server said thanks in the voice saved for relatives."],
    },
    {
      tone: "mid",
      title: "Printed",
      lines: (ctx) => [tipLine(ctx), "The receipt wrote \"meh\" on the tip line by itself."],
    },
    {
      tone: "mid",
      title: "Noted",
      lines: (ctx) => [tipLine(ctx), "The kitchen marked you down as fine."],
    },
    {
      tone: "mid",
      title: "Accepted",
      lines: (ctx) => [tipLine(ctx), "A penny rolled away in secondhand embarrassment."],
    },
    {
      tone: "mid",
      title: "Barely",
      lines: (ctx) => [tipLine(ctx), "The tip jar did not clap."],
    },
    {
      tone: "mid",
      title: "Dimmer",
      lines: (ctx) => [tipLine(ctx), "The screen dimmed a little, matching the effort."],
    },
  ],
  "18": [
    {
      tone: "mid",
      title: "Great",
      lines: (ctx) => [tipLine(ctx), "Great is what people say when it is not wow."],
    },
    {
      tone: "mid",
      title: "Fine",
      lines: (ctx) => [tipLine(ctx), "The kitchen will describe you as fine."],
    },
    {
      tone: "mid",
      title: "Nod",
      lines: (ctx) => [tipLine(ctx), "The server nodded the minimum legal amount."],
    },
    {
      tone: "mid",
      title: "Filed",
      lines: (ctx) => [tipLine(ctx), "This tip has been filed under acceptable."],
    },
    {
      tone: "mid",
      title: "Unbothered",
      lines: (ctx) => [tipLine(ctx), "The manager did not look up."],
    },
    {
      tone: "mid",
      title: "Achievement",
      lines: (ctx) => [tipLine(ctx), "You unlocked Baseline Human."],
    },
    {
      tone: "mid",
      title: "Sure",
      lines: (ctx) => [tipLine(ctx), "A busser said \"sure\" and kept walking."],
    },
    {
      tone: "mid",
      title: "Room temp",
      lines: (ctx) => [tipLine(ctx), "The fries will be a normal temperature. That is the reward."],
    },
    {
      tone: "mid",
      title: "They tried",
      lines: (ctx) => [tipLine(ctx), "Recorded in the book as \"they tried\"."],
    },
    {
      tone: "mid",
      title: "One beep",
      lines: (ctx) => [tipLine(ctx), "The reader beeped once. Politely. That was the whole party."],
    },
  ],
  "20": [
    {
      tone: "wow",
      title: "Wow",
      lines: (ctx) => [tipLine(ctx), "You have been removed from the group chat titled bad tippers."],
    },
    {
      tone: "wow",
      title: "Wow",
      lines: (ctx) => [tipLine(ctx), "The server practiced this exact face in the walk-in."],
    },
    {
      tone: "wow",
      title: "Wow",
      lines: (ctx) => [tipLine(ctx), "A straw was placed on the table with intention."],
    },
    {
      tone: "wow",
      title: "Upgraded",
      lines: (ctx) => [tipLine(ctx), "You are now Person Who Tips."],
    },
    {
      tone: "wow",
      title: "Small bell",
      lines: (ctx) => [tipLine(ctx), "The kitchen rang a bell. A very small bell."],
    },
    {
      tone: "wow",
      title: "Alright",
      lines: (ctx) => [tipLine(ctx), "Someone in the back said this one is alright."],
    },
    {
      tone: "wow",
      title: "Napkin",
      lines: (ctx) => [tipLine(ctx), "Confetti was considered. A napkin was folded instead."],
    },
    {
      tone: "wow",
      title: "Refill",
      lines: (ctx) => [tipLine(ctx), "Your water will be refilled before you ask. Once."],
    },
    {
      tone: "wow",
      title: "Blush",
      lines: (ctx) => [tipLine(ctx), "The terminal blushed. That is a known setting."],
    },
    {
      tone: "wow",
      title: "On record",
      lines: (ctx) => [tipLine(ctx), "Wow has been added to your permanent record, kindly."],
    },
  ],
  "30": [
    {
      tone: "wow",
      title: "Best service ever",
      canUpcharge: true,
      lines: (ctx) => [tipLine(ctx), "A busser just named a kayak after you."],
    },
    {
      tone: "wow",
      title: "Best service ever",
      canUpcharge: true,
      lines: (ctx) => [tipLine(ctx), "Your name is going on the specials board, in ketchup."],
    },
    {
      tone: "legend",
      title: "Speech",
      lines: (ctx) => [tipLine(ctx), "The manager is writing a speech and will not be stopped."],
    },
    {
      tone: "legend",
      title: "Productive tears",
      lines: (ctx) => [tipLine(ctx), "Someone cried, but in a way that increased morale."],
    },
    {
      tone: "wow",
      title: "Group chat",
      lines: (ctx) => [tipLine(ctx), "The owner texted the family chat with a screenshot."],
    },
    {
      tone: "wow",
      title: "Bottomless",
      lines: (ctx) => [tipLine(ctx), "The soda is now bottomless. Spiritually."],
    },
    {
      tone: "legend",
      title: "Family dinner",
      lines: (ctx) => [tipLine(ctx), "They are going to tell this story at family dinner."],
    },
    {
      tone: "wow",
      title: "Glow",
      canUpcharge: true,
      lines: (ctx) => [tipLine(ctx), "The receipt is glowing. The terminal wants 45%."],
    },
    {
      tone: "legend",
      title: "Afterlife",
      lines: (ctx) => [tipLine(ctx), "You skipped the line in the afterlife. Bring the receipt."],
    },
    {
      tone: "wow",
      title: "Myth",
      canUpcharge: true,
      lines: (ctx) => [tipLine(ctx), "The machine tried to bump this itself. You can allow it."],
    },
  ],
  none: [
    {
      tone: "curse",
      title: "No tip detected",
      lines: () => ["A curse has been placed.", "Your fries will arrive cold, on purpose."],
    },
    {
      tone: "curse",
      title: "No tip detected",
      lines: () => ["The curse department clocked in.", "Every charger you own works at one angle."],
    },
    {
      tone: "curse",
      title: "Zero received",
      lines: () => ["Transaction: nothing.", "Your phone battery will live at 9%."],
    },
    {
      tone: "curse",
      title: "No tip detected",
      lines: () => ["Autocorrect has been briefed.", "It will change \"ok\" into \"20% is fine\"."],
    },
    {
      tone: "curse",
      title: "Noted, badly",
      lines: () => ["The next tip screen starts at 30%.", "It already knows your name."],
    },
    {
      tone: "curse",
      title: "No tip detected",
      lines: () => ["A small hex, locally sourced.", "Your show will buffer during the joke."],
    },
    {
      tone: "curse",
      title: "Traffic curse",
      lines: () => ["Every green light turns yellow as you arrive.", "This is because of the zero."],
    },
    {
      tone: "curse",
      title: "No tip detected",
      lines: () => ["Your airpods will connect to a stranger.", "They are also not tipping."],
    },
    {
      tone: "curse",
      title: "Last fry",
      lines: () => ["The last fry will always be the soggy one.", "You did this."],
    },
    {
      tone: "curse",
      title: "Jacket curse",
      lines: () => ["Your food will arrive as you put your jacket on.", "The curse lifts if you pick a real amount."],
    },
  ],
};

export const CUSTOM_LOW = [
  {
    tone: "fail",
    title: "Payment failed",
    lines: (ctx) => [`${ctx.tipText} bounced.`, "The reader knows a loophole when it sees one."],
  },
  {
    tone: "fail",
    title: "Payment failed",
    lines: (ctx) => [`${ctx.percentText} is a costume.`, "Aim higher. This button has standards."],
  },
  {
    tone: "fail",
    title: "Declined",
    lines: (ctx) => [ctx.tipText, "Custom shame is still shame. Try again."],
  },
  {
    tone: "fail",
    title: "Payment failed",
    lines: () => ["The chip said absolutely not.", "Type a number you can say out loud."],
  },
  {
    tone: "fail",
    title: "Too small",
    lines: (ctx) => [`${ctx.tipText} did not clear the sensor.`, "The sensor is dramatic, and correct."],
  },
  {
    tone: "fail",
    title: "Payment failed",
    lines: () => ["That amount was rounded down to a sigh.", "Pick another number."],
  },
  {
    tone: "fail",
    title: "Rejected",
    lines: (ctx) => [ctx.tipText, "The terminal has seen 15%. It was not impressed then either."],
  },
  {
    tone: "fail",
    title: "Payment failed",
    lines: () => ["Insufficient generosity.", "The card is fine. The choice is not."],
  },
  {
    tone: "fail",
    title: "Bounced",
    lines: (ctx) => [`${ctx.percentText} of the bill.`, "Even the decimal point looked away."],
  },
  {
    tone: "fail",
    title: "Payment failed",
    lines: () => ["Nice try, accountant.", "The machine wants a real tip."],
  },
];

export const CUSTOM_MID = [
  {
    tone: "mid",
    title: "Custom, sure",
    lines: (ctx) => [tipLine(ctx), "You avoided the buttons and still landed on fine."],
  },
  {
    tone: "mid",
    title: "Calculated",
    lines: (ctx) => [tipLine(ctx), "Somebody did math to feel original."],
  },
  {
    tone: "mid",
    title: "Respectable",
    lines: (ctx) => [tipLine(ctx), "The server's eyebrow went up, then back down."],
  },
  {
    tone: "mid",
    title: "Custom",
    lines: (ctx) => [tipLine(ctx), "Not a preset. Still a personality."],
  },
  {
    tone: "mid",
    title: "Close enough",
    lines: (ctx) => [tipLine(ctx), "This is the energy of measuring a cup with your heart."],
  },
  {
    tone: "mid",
    title: "Logged",
    lines: (ctx) => [tipLine(ctx), "Filed under \"made their own adventure, got a B\"."],
  },
  {
    tone: "mid",
    title: "Custom",
    lines: (ctx) => [tipLine(ctx), "The keypad respects the effort. Barely."],
  },
  {
    tone: "mid",
    title: "Odd cents",
    lines: (ctx) => [tipLine(ctx), "Those cents will haunt a bookkeeper, kindly."],
  },
  {
    tone: "mid",
    title: "Accepted",
    lines: (ctx) => [tipLine(ctx), "A normal tip wearing a handmade hat."],
  },
  {
    tone: "mid",
    title: "Custom",
    lines: (ctx) => [tipLine(ctx), "The reader beeped like it meant it."],
  },
];

export const CUSTOM_WOW = [
  {
    tone: "wow",
    title: "Custom wow",
    lines: (ctx) => [tipLine(ctx), "You skipped Wow! and still did the assignment."],
  },
  {
    tone: "wow",
    title: "Handmade",
    lines: (ctx) => [tipLine(ctx), "A custom amount with a personality. Rare."],
  },
  {
    tone: "wow",
    title: "Approved",
    lines: (ctx) => [tipLine(ctx), "The kitchen will hear a flattering version of this."],
  },
  {
    tone: "wow",
    title: "Custom",
    lines: (ctx) => [tipLine(ctx), "Somebody in the back just said \"oh, nice\"."],
  },
  {
    tone: "wow",
    title: "Extra step",
    lines: (ctx) => [tipLine(ctx), "You used the keypad. That is already a love language."],
  },
  {
    tone: "wow",
    title: "Sharp",
    lines: (ctx) => [tipLine(ctx), "Clean number. Clean conscience."],
  },
  {
    tone: "wow",
    title: "Custom",
    lines: (ctx) => [tipLine(ctx), "The terminal saved this one to show its friends."],
  },
  {
    tone: "wow",
    title: "Solid",
    lines: (ctx) => [tipLine(ctx), "Water refills have been authorized."],
  },
  {
    tone: "wow",
    title: "Custom wow",
    lines: (ctx) => [tipLine(ctx), "Wow, but you typed it yourself, so it counts double."],
  },
  {
    tone: "wow",
    title: "Kept",
    lines: (ctx) => [tipLine(ctx), "This receipt is going on the office fridge."],
  },
];

export const CUSTOM_HIGH = [
  {
    tone: "legend",
    title: "Philanthropy",
    canUpcharge: true,
    lines: (ctx) => [tipLine(ctx), "The owner is refreshing boat listings."],
  },
  {
    tone: "legend",
    title: "Unreasonable",
    lines: (ctx) => [tipLine(ctx), "A busser is naming a plant after you."],
  },
  {
    tone: "wow",
    title: "Custom legend",
    lines: (ctx) => [tipLine(ctx), "The special just became your first name."],
  },
  {
    tone: "legend",
    title: "Too kind",
    lines: (ctx) => [tipLine(ctx), "Security has questions, but they are grateful questions."],
  },
  {
    tone: "wow",
    title: "Huge",
    canUpcharge: true,
    lines: (ctx) => [tipLine(ctx), "The terminal wants to round this up out of excitement."],
  },
  {
    tone: "legend",
    title: "Speechless",
    lines: (ctx) => [tipLine(ctx), "The manager forgot how words work."],
  },
  {
    tone: "wow",
    title: "Custom",
    lines: (ctx) => [tipLine(ctx), "This will be brought up at the staff meeting, warmly."],
  },
  {
    tone: "legend",
    title: "Hero",
    lines: (ctx) => [tipLine(ctx), "Your table is now a landmark."],
  },
  {
    tone: "wow",
    title: "Best custom ever",
    lines: (ctx) => [tipLine(ctx), "Someone is already telling this story wrong, bigger."],
  },
  {
    tone: "legend",
    title: "Frame it",
    lines: (ctx) => [tipLine(ctx), "The receipt is getting a frame. A small one. Still."],
  },
];

export const CUSTOM_BOAT = [
  {
    tone: "legend",
    title: "Security hold",
    lines: (ctx) => [tipLine(ctx), "That is not a tip. That is a down payment on the restaurant."],
  },
  {
    tone: "legend",
    title: "Boat",
    lines: (ctx) => [`${ctx.tipText} on a ${ctx.billText} bill.`, "The owner already left for the dealership."],
  },
  {
    tone: "legend",
    title: "Sir",
    lines: (ctx) => [tipLine(ctx), "Sir, this is a tip screen."],
  },
  {
    tone: "legend",
    title: "Acquisition",
    lines: (ctx) => [tipLine(ctx), "Legal is asking if you meant to buy the place."],
  },
  {
    tone: "legend",
    title: "Too much",
    lines: (ctx) => [tipLine(ctx), "The reader fan spun up. It is nervous and honored."],
  },
  {
    tone: "legend",
    title: "Hold",
    lines: (ctx) => [tipLine(ctx), "A manager is running over. They are smiling too wide."],
  },
  {
    tone: "legend",
    title: "Yacht",
    lines: (ctx) => [tipLine(ctx), "The kayak has been upgraded to a rumor of a yacht."],
  },
  {
    tone: "legend",
    title: "Error of joy",
    lines: (ctx) => [tipLine(ctx), "The terminal printed a heart and then apologized."],
  },
  {
    tone: "legend",
    title: "Wealth event",
    lines: (ctx) => [tipLine(ctx), "Somebody in the kitchen just learned the word benefactor."],
  },
  {
    tone: "legend",
    title: "Confirmed",
    lines: (ctx) => [tipLine(ctx), "Spiritually, you own the napkins now."],
  },
];

export const UPCHARGE = [
  {
    tone: "legend",
    title: "45%. Obviously.",
    lines: (ctx) => [tipLine(ctx), "The special is now just your name, louder."],
  },
  {
    tone: "legend",
    title: "45%",
    lines: (ctx) => [tipLine(ctx), "A manager is crying in a productive way."],
  },
  {
    tone: "legend",
    title: "Rounded up",
    lines: (ctx) => [tipLine(ctx), "The kayak now has a tiny flag."],
  },
  {
    tone: "legend",
    title: "45%",
    lines: (ctx) => [tipLine(ctx), "The owner added you to the will as a joke. Mostly."],
  },
  {
    tone: "legend",
    title: "Allowed",
    lines: (ctx) => [tipLine(ctx), "The terminal hummed like a proud appliance."],
  },
  {
    tone: "legend",
    title: "45%",
    lines: (ctx) => [tipLine(ctx), "Staff meal tonight is just telling this story."],
  },
  {
    tone: "legend",
    title: "Escalated",
    lines: (ctx) => [tipLine(ctx), "Your cup will never be empty again. Today."],
  },
  {
    tone: "legend",
    title: "45%",
    lines: (ctx) => [tipLine(ctx), "A busser saluted. It was awkward. It counted."],
  },
  {
    tone: "legend",
    title: "Mythic",
    lines: (ctx) => [tipLine(ctx), "This table is getting a plaque. Paper, but still."],
  },
  {
    tone: "legend",
    title: "45%",
    lines: (ctx) => [tipLine(ctx), "The curse department has been sent home early."],
  },
];

export const BACK_LINES = [
  "There is no back. There is only tip.",
  "The door is decorative.",
  "You can leave the screen. You cannot leave the bit.",
  "Nice try. The arrow points at your conscience.",
  "Going back is how the bill grows.",
  "Still here. The terminal respects the commitment.",
  "That button has never worked. Today it works against you.",
  "Exit is a 20% concept.",
  "The manager felt that tap.",
  "You live here now. Pick a percentage.",
];

export const PRIVACY_LINES = [
  "We already know. We saw you look at No Tip.",
  "This privacy policy is decorative, like most of them.",
  "We collect one thing: hesitation.",
  "Your hover on 15% has been anonymized into gossip.",
  "We do not sell your data. We judge it locally.",
  "The reader remembers the back button.",
  "Privacy mode is just the screen being darker.",
  "We saw the custom keypad. We are not mad. We are awake.",
  "No account. No charge. Just a permanent vibe.",
  "clover.com/privacy is a bit. You are the product, affectionately.",
];

export const ROASTS = {
  empty: [
    "Type a number. The machine is watching.",
    "The keypad is patient. You should not test that.",
    "Any number. Cowardice is also a number, technically.",
    "Start typing before the curse department notices.",
    "A blank tip is just No Tip in a trench coat.",
    "The cursor is blinking in a judgmental way.",
    "Enter something you can defend to a stranger.",
    "Zero is available. So are better ideas.",
    "The bill is sitting right there. Do math if you must.",
    "Custom means you chose this. Own it.",
  ],
  bad: [
    "That is not a number. Bold strategy.",
    "The decimal is lonely.",
    "Numbers, please. The curse understands numbers.",
    "That input has been reported to no one, sadly.",
    "Try digits. Letters are for the curse screen.",
  ],
  zero: [
    "Zero. The curse department just clocked in.",
    "That is No Tip with extra steps.",
    "0.00 has a reputation.",
    "You can still delete this and be loved.",
    "The keypad sighed.",
    "Submitting zero is a lifestyle.",
    "Even the backspace is nervous.",
    "This will not print a heart.",
    "A blank check would have been funnier.",
    "Last chance to type a real digit.",
  ],
  low: [
    "The reader is already side-eyeing you.",
    "That percent does not survive contact with the sensor.",
    "Cheap, but handmade. Still cheap.",
    "You can add a digit. The digit would help.",
    "This is a tip the way a wave is a conversation.",
    "The terminal has seen this movie.",
    "Below the buttons. Spiritually and mathematically.",
    "A coin would be embarrassed.",
    "Keep going. The number can still recover.",
    "Small on purpose is still small.",
  ],
  mid: [
    "Barely legal generosity. It might even go through.",
    "Respectable. The eyebrow is considering it.",
    "You landed between the presets. Mysterious.",
    "This will beep once, politely.",
    "Fine has never looked so specific.",
    "The server will say thanks and mean some of it.",
    "Custom, but normal. A rare bird.",
    "Those cents are doing their best.",
    "Acceptable, with a handmade edge.",
    "The kitchen will call this sure.",
  ],
  wow: [
    "Oh, we are typing real money.",
    "The keypad is having a nice day.",
    "This clears Wow! without touching the button.",
    "Somebody practiced this number.",
    "Solid. The reader can feel it.",
    "You could stop here and be a legend locally.",
    "The decimal is proud of you.",
    "That is a tip people mention later.",
    "Keep it. Or don't. It is already good.",
    "The curse department is closing its laptop.",
  ],
  high: [
    "Oh we are doing philanthropy now.",
    "The owner is refreshing the boat listings.",
    "A kayak just felt a disturbance in the force.",
    "This will get a speech.",
    "The specials board is clearing space.",
    "You may still add a digit. Unwise. Incredible.",
    "Staff meal is going to be this story.",
    "The terminal fan just spun up.",
    "Generous enough to concern security, sweetly.",
    "Frame-worthy, if the frame is small.",
  ],
  boat: [
    "That is not a tip. That is a down payment.",
    "Sir, this is a tip screen.",
    "The dealership is already on the line.",
    "Legal would like a word, and a hug.",
    "You are buying napkins at this point.",
    "The reader needs a moment.",
    "A yacht rumor has started in the kitchen.",
    "Delete a digit if you want to stay a customer.",
    "This number has its own weather.",
    "Spiritually you own the restaurant.",
  ],
};

export function drawCase(decks, id, cases) {
  let deck = decks[id];
  if (!deck || deck.length === 0) {
    deck = cases.map((_, index) => index);
    for (let i = deck.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
  }
  const index = deck.pop();
  decks[id] = deck;
  return cases[index];
}

export function roastFor(custom, amount, percent, ready) {
  let list = ROASTS.empty;
  if (custom && !ready) list = ROASTS.bad;
  else if (custom && amount === 0) list = ROASTS.zero;
  else if (custom && percent < 15) list = ROASTS.low;
  else if (custom && percent < 20) list = ROASTS.mid;
  else if (custom && percent < 30) list = ROASTS.wow;
  else if (custom && percent < 100 && amount < 200) list = ROASTS.high;
  else if (custom) list = ROASTS.boat;

  const seed = custom.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const line = list[seed % list.length];
  if (custom && ready && amount > 0 && percent < 15) {
    return `${percent.toFixed(0)}%. ${line}`;
  }
  return line;
}

export function poolForCustom(amount, percent) {
  if (amount <= 0) return { id: "none", cases: CASES.none };
  if (percent < 15) return { id: "custom-low", cases: CUSTOM_LOW };
  if (percent < 20) return { id: "custom-mid", cases: CUSTOM_MID };
  if (percent < 30) return { id: "custom-wow", cases: CUSTOM_WOW };
  if (percent < 100 && amount < 200) return { id: "custom-high", cases: CUSTOM_HIGH };
  return { id: "custom-boat", cases: CUSTOM_BOAT };
}
