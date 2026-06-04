export interface Tip {
  id: string;
  title: string;
  description: string; // HTML markup string
  image: string;
  category: string;
  readTime: string;
}

export const TIPS: Tip[] = [
  {
    id: "the-15-minute-rule",
    title: "Understanding Cravings: The 15-Minute Rule",
    image: "/survive/screen_1.png",
    category: "Mindset",
    readTime: "2 min read",
    description: `
      <p>A craving is not a command; it is merely a temporary feeling. Studies show that the physical intensity of a nicotine craving peaks around <strong>10 minutes</strong> and almost completely subsides by <strong>15 minutes</strong>.</p>
      
      <h3>The Strategy:</h3>
      <p>When you feel a strong urge to smoke, tell yourself: <em>"I will wait just 15 minutes. If I still want to smoke after that, I will check in then."</em></p>
      
      <ul>
        <li><strong>Set a timer:</strong> Use your phone or the app to log the start.</li>
        <li><strong>Change your setting:</strong> Walk to a different room or step outside.</li>
        <li><strong>Distract your hands:</strong> Pick up a book, wash a dish, or browse this app.</li>
      </ul>
      
      <p>By delaying, you break the instant-gratification loop. Over time, these 15-minute victories compound into hours, days, and a completely smoke-free lifestyle.</p>
    `
  },
  {
    id: "hydration-as-a-shield",
    title: "The Power of Water: Hydration as a Shield",
    image: "/survive/screen_2.png",
    category: "Physical",
    readTime: "3 min read",
    description: `
      <p>Water is one of the simplest yet most effective tools in your delay arsenal. Drinking a glass of ice-cold water does two powerful things simultaneously:</p>
      
      <ol>
        <li><strong>It mimics the hand-to-mouth action:</strong> A large part of smoking is the mechanical ritual. Drinking water occupies your hands and mouth in a similar, healthy way.</li>
        <li><strong>It flushes toxins:</strong> Cold water helps accelerate the removal of nicotine and carbon monoxide from your bloodstream.</li>
      </ol>
      
      <h3>How to use this tip:</h3>
      <p>Keep a reusable bottle of cold water with you at all times. When a craving hits, take slow, deep sips. Focus on the sensation of the cold water traveling down your throat. This mindfulness technique grounds your body and interrupts the panic of the craving.</p>
    `
  },
  {
    id: "tactile-substitutes",
    title: "Reclaiming Your Hands: Tactile Substitutes",
    image: "/survive/screen_3.png",
    category: "Habit",
    readTime: "2 min read",
    description: `
      <p>Many smokers find that their hands feel empty and restless when they try to delay smoking. This physical restlessness can trigger a relapse even if you aren't experiencing chemical withdrawal.</p>
      
      <h3>Top Tactile Replacements:</h3>
      <p>To overcome "empty hand syndrome", try replacing the cigarette with these tactile items:</p>
      
      <ul>
        <li><strong>Stress Balls or Putty:</strong> Keeps fingers active and relieves muscle tension.</li>
        <li><strong>Fidget Rings:</strong> Subtle and stylish rings you can spin to occupy your fingers.</li>
        <li><strong>A heavy pen:</strong> Holding or twirling a pen can closely mimic the physical weight and feel of holding a cigarette.</li>
      </ul>
      
      <p>Keep these substitutes readily available in places where you usually smoke, such as your desk, car, or living room table.</p>
    `
  },
  {
    id: "box-breathing-guide",
    title: "Box Breathing: The Instant Calmer",
    image: "/survive/screen_4.png",
    category: "Stress Relief",
    readTime: "3 min read",
    description: `
      <p>Stress and anxiety are the most common triggers for smoking. When you smoke, you take deep, rhythmic breaths. Part of the calming effect of smoking actually comes from this breathing pattern, not the nicotine.</p>
      
      <h3>How to Box Breathe:</h3>
      <p>Box breathing is a technique used by high-performance athletes and Navy SEALs to reduce stress instantly:</p>
      
      <ol>
        <li><strong>Inhale:</strong> Breathe in slowly through your nose for 4 seconds.</li>
        <li><strong>Hold:</strong> Hold your breath for 4 seconds.</li>
        <li><strong>Exhale:</strong> Release your breath through your mouth for 4 seconds.</li>
        <li><strong>Hold:</strong> Rest with empty lungs for 4 seconds.</li>
      </ol>
      
      <p>Repeat this cycle 4 times. You will feel your heart rate drop and the nervous energy of the craving begin to melt away.</p>
    `
  },
  {
    id: "wash-away-triggers",
    title: "Clean Your Space: Wash Away the Triggers",
    image: "/survive/screen_5.png",
    category: "Environment",
    readTime: "2 min read",
    description: `
      <p>The smell of stale cigarette smoke is a constant, subliminal reminder of your habit. It can reactivate your brain's reward center and trigger intense cravings without you even realizing why.</p>
      
      <h3>Environmental Clean-up:</h3>
      <p>Take one afternoon to clean your personal environment:</p>
      
      <ul>
        <li><strong>Wash your clothes:</strong> Wash jackets, sweaters, and hats that might hold smoke residue.</li>
        <li><strong>Wash bed sheets:</strong> Sleep in a clean, fresh-smelling bedroom.</li>
        <li><strong>Detail your car:</strong> Wipe down dashboard surfaces and wash car seat covers. Use a fresh, clean scent.</li>
      </ul>
      
      <p>Creating a clean, non-smoking atmosphere signals a fresh start to your brain and makes returning to smoke feel less appealing.</p>
    `
  },
  {
    id: "post-meal-rewiring",
    title: "Re-wiring Post-Meal Routines",
    image: "/survive/screen_6.png",
    category: "Habit",
    readTime: "3 min read",
    description: `
      <p>For many, the cigarette immediately after eating is the hardest one to give up. This is a classic conditioned response: <strong>Finish meal &rarr; light up</strong>.</p>
      
      <h3>Breaking the Chain:</h3>
      <p>To rewire this response, you must insert a new action immediately after you finish eating:</p>
      
      <ul>
        <li><strong>Eat a mint or brush your teeth:</strong> The clean, minty taste contradicts the desire for smoke.</li>
        <li><strong>Leave the table immediately:</strong> Do not linger in the dining area. Stand up, wash your plate, or step into a different room.</li>
        <li><strong>Take a 5-minute walk:</strong> Moving your body changes your physical state and occupies your mind.</li>
      </ul>
      
      <p>By consistently replacing the post-meal smoke with one of these actions, you will break the automatic association within a few weeks.</p>
    `
  },
  {
    id: "tangible-savings",
    title: "Tracking Savings: Make Progress Tangible",
    image: "/survive/screen_7.png",
    category: "Motivation",
    readTime: "2 min read",
    description: `
      <p>Abstract health benefits can sometimes feel too distant to motivate you during a craving. Financial savings, on the other hand, are immediate and measurable.</p>
      
      <h3>Set a Reward Goal:</h3>
      <p>Look at the "Total Saved" tracker on your Delay dashboard. Pick a specific reward you want to buy with that money once you reach a milestone:</p>
      
      <ul>
        <li><strong>Weekly Milestone:</strong> A fancy coffee, a movie ticket, or a book.</li>
        <li><strong>Monthly Milestone:</strong> A nice dinner out, a new piece of clothing, or a subscription.</li>
        <li><strong>6-Month Milestone:</strong> A weekend getaway or new electronics.</li>
      </ul>
      
      <p>When you feel like light up, look at your target reward and remember what you are choosing to buy instead.</p>
    `
  },
  {
    id: "handling-social-pressure",
    title: "Social Smoking: How to Say No",
    image: "/survive/screen_8.png",
    category: "Social",
    readTime: "3 min read",
    description: `
      <p>Being around friends who smoke is one of the most high-risk situations for slips. The desire to fit in and the availability of cigarettes can make it easy to forget your progress.</p>
      
      <h3>Preparation Strategies:</h3>
      <p>Before you go out to a social gathering, plan your approach:</p>
      
      <ul>
        <li><strong>Be public about your target:</strong> Tell your friends, <em>"I'm trying to delay my smoking and extend my gaps today."</em> Good friends will support you and avoid offering you cigarettes.</li>
        <li><strong>Have a non-smoking buddy:</strong> Spend time with others who do not smoke.</li>
        <li><strong>Hold a drink:</strong> Keep a glass of water, soda, or a drink in your hand so it remains occupied.</li>
      </ul>
      
      <p>If the craving feels overwhelming, excuse yourself for a few minutes. Go to the restroom, wash your face, or step into a smoke-free zone to regain your focus.</p>
    `
  },
  {
    id: "nicotine-stress-myth",
    title: "Stress Management: The Nicotine Myth",
    image: "/survive/screen_9.png",
    category: "Mindset",
    readTime: "3 min read",
    description: `
      <p>Many smokers believe that smoking calms their nerves. However, scientific research shows that <strong>nicotine actually increases physical stress</strong> on the body.</p>
      
      <h3>The Cycle:</h3>
      <p>Nicotine is a stimulant. It increases your heart rate and blood pressure. The "relief" you feel when you light up is simply the alleviation of the nicotine withdrawal symptoms that began about 30 minutes after your last cigarette.</p>
      
      <p>In other words, smoking causes the very anxiety and restlessness it claims to cure!</p>
      
      <h3>Alternative Stress Relievers:</h3>
      <p>Instead of smoking to relieve stress, try activities that actually calm the nervous system: walking, herbal tea, listening to ambient music, or talking to a friend.</p>
    `
  },
  {
    id: "delay-over-perfection",
    title: "Celebrate Delays: Progress, Not Perfection",
    image: "/survive/screen_10.png",
    category: "Motivation",
    readTime: "2 min read",
    description: `
      <p>Traditional quit programs emphasize a strict binary: either you are 100% clean, or you have failed completely. This "all-or-nothing" thinking often leads to full relapse after a single slip.</p>
      
      <h3>The Delay Philosophy:</h3>
      <p>Delay is built on a different principle: <strong>abstinence is the long-term result of repeated, successful delays</strong>. Every single time you wait, you are weakening the neural connections of the habit.</p>
      
      <ul>
        <li><strong>If you smoke:</strong> Do not judge yourself. You didn't lose your progress. The hours you delayed are still victories.</li>
        <li><strong>Log it and restart:</strong> Press "I Smoked", check your session metrics, and try to delay slightly longer next time.</li>
      </ul>
      
      <p>By celebrating your progress instead of demanding perfection, you build confidence and naturally reduce your smoking over time.</p>
    `
  }
];

export function getTipById(id: string): Tip | undefined {
  return TIPS.find((t) => t.id === id);
}
