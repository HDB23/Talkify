export interface ScriptedOption {
  id: string;
  text: string;
  isCorrect: boolean;
  correction?: string;
}

export interface ScriptedTurn {
  turnNumber: number;
  partnerPrompt: string;
  options: ScriptedOption[];
  partnerFollowUp: string;
}

export interface ScriptedScenario {
  id: string;
  title: string;
  characterName: string;
  welcomeMessage: string;
  turns: ScriptedTurn[];
}

export const SCRIPTED_SCENARIOS: Record<string, ScriptedScenario> = {
  "coffee-shop": {
    id: "coffee-shop",
    title: "Coffee Shop Barista",
    characterName: "Sarah",
    welcomeMessage: "Hi there! Welcome to Talkify Beans. What can I get started for you today?",
    turns: [
      {
        turnNumber: 1,
        partnerPrompt: "Hi there! Welcome to Talkify Beans. What can I get started for you today?",
        options: [
          {
            id: "1a",
            text: "Hi! I'd like a medium iced latte, please.",
            isCorrect: true,
          },
          {
            id: "1b",
            text: "Give me one coffee now.",
            isCorrect: false,
            correction: "'Give me one coffee now' sounds a bit demanding. Using 'I'd like...' or 'Could I get... please?' is much more polite.",
          },
          {
            id: "1c",
            text: "I want drink iced latte.",
            isCorrect: false,
            correction: "Missing infinitive preposition or article: say 'I want to drink an iced latte' or 'I'd like an iced latte, please.'",
          },
        ],
        partnerFollowUp: "Great choice! An iced latte. What kind of milk would you prefer for that?",
      },
      {
        turnNumber: 2,
        partnerPrompt: "What kind of milk would you prefer in your iced latte?",
        options: [
          {
            id: "2a",
            text: "Oat milk, please. Do you have oat milk?",
            isCorrect: true,
          },
          {
            id: "2b",
            text: "I prefer oat milk, is extra cost?",
            isCorrect: false,
            correction: "Question structure error: say 'Is there an extra charge for oat milk?' instead of 'is extra cost?'",
          },
          {
            id: "2c",
            text: "Put milk oat in cup.",
            isCorrect: false,
            correction: "Word order issue: noun adjective inverted. Say 'Please use oat milk' instead of 'Put milk oat'.",
          },
        ],
        partnerFollowUp: "Yes, we have fresh oat milk! Would you like any flavor syrup added to it?",
      },
      {
        turnNumber: 3,
        partnerPrompt: "Would you like any flavor syrup added to your drink today?",
        options: [
          {
            id: "3a",
            text: "Just a pump of sugar-free vanilla, please.",
            isCorrect: true,
          },
          {
            id: "3b",
            text: "No sugar syrup want I.",
            isCorrect: false,
            correction: "Incorrect word order: Subject-Verb-Object inverted. Say 'I don't want any sugar syrup' instead.",
          },
          {
            id: "3c",
            text: "Add vanilla syrup very much sweet.",
            isCorrect: false,
            correction: "Awkward phrasing: say 'Make it extra sweet with vanilla syrup, please.'",
          },
        ],
        partnerFollowUp: "Got it, one pump of vanilla! Would you like anything to eat with your drink today?",
      },
      {
        turnNumber: 4,
        partnerPrompt: "Would you like anything to eat from our pastry display today?",
        options: [
          {
            id: "4a",
            text: "A blueberry muffin sounds great, thanks!",
            isCorrect: true,
          },
          {
            id: "4b",
            text: "I am not eating no food.",
            isCorrect: false,
            correction: "Double negative error: 'not eating no food'. Say 'I don't want any food' or 'No food for me, thanks.'",
          },
          {
            id: "4c",
            text: "Give muffin blueberry to me.",
            isCorrect: false,
            correction: "Imperative phrasing: 'I'll have a blueberry muffin' is far more natural than 'Give muffin blueberry to me'.",
          },
        ],
        partnerFollowUp: "Awesome! I'll warm up that blueberry muffin for you. Would you like it warmed?",
      },
      {
        turnNumber: 5,
        partnerPrompt: "Would you like your blueberry muffin warmed up?",
        options: [
          {
            id: "5a",
            text: "Yes, please warm it up slightly.",
            isCorrect: true,
          },
          {
            id: "5b",
            text: "Yes, make it hot very much.",
            isCorrect: false,
            correction: "Unnatural modifier: say 'Yes, please make it quite warm' instead of 'hot very much'.",
          },
          {
            id: "5c",
            text: "No, cold is fine for eating.",
            isCorrect: false,
            correction: "Slightly clunky: 'No, having it room temperature is fine, thanks' or 'No thanks, cold is fine.'",
          },
        ],
        partnerFollowUp: "Perfect. May I have a name for the order?",
      },
      {
        turnNumber: 6,
        partnerPrompt: "May I have a name for your order so I can call you when it's ready?",
        options: [
          {
            id: "6a",
            text: "Sure, my name is Alex.",
            isCorrect: true,
          },
          {
            id: "6b",
            text: "Name is Alex mine.",
            isCorrect: false,
            correction: "Word order error: say 'My name is Alex' instead of 'Name is Alex mine'.",
          },
          {
            id: "6c",
            text: "You call Alex to me.",
            isCorrect: false,
            correction: "Awkward verb phrasing: say 'You can call me Alex' instead.",
          },
        ],
        partnerFollowUp: "Thanks, Alex! Will this be for here or to go?",
      },
      {
        turnNumber: 7,
        partnerPrompt: "Will this order be for here or to go?",
        options: [
          {
            id: "7a",
            text: "To go, please. I'm heading to work.",
            isCorrect: true,
          },
          {
            id: "7b",
            text: "I go away with coffee.",
            isCorrect: false,
            correction: "Unnatural idiom: in English coffee shops, the standard phrases are 'To go' or 'Takeout'.",
          },
          {
            id: "7c",
            text: "For here stay in store.",
            isCorrect: false,
            correction: "Awkward expression: simply say 'For here, please' or 'I'll drink it here.'",
          },
        ],
        partnerFollowUp: "Got it, to go! How will you be paying today?",
      },
      {
        turnNumber: 8,
        partnerPrompt: "How will you be paying for your order today?",
        options: [
          {
            id: "8a",
            text: "I'll pay by credit card, please.",
            isCorrect: true,
          },
          {
            id: "8b",
            text: "I pay with money card.",
            isCorrect: false,
            correction: "Incorrect terminology: say 'debit card' or 'credit card' rather than 'money card'.",
          },
          {
            id: "8c",
            text: "Pay card can I?",
            isCorrect: false,
            correction: "Broken sentence structure: say 'Can I pay by card?' instead.",
          },
        ],
        partnerFollowUp: "Sure thing! You can tap or insert your card on the terminal right here.",
      },
      {
        turnNumber: 9,
        partnerPrompt: "Payment went through! Would you like a printed receipt with your purchase?",
        options: [
          {
            id: "9a",
            text: "No receipt needed, thank you!",
            isCorrect: true,
          },
          {
            id: "9b",
            text: "No paper give me.",
            isCorrect: false,
            correction: "Abrupt command: say 'No receipt required, thanks' or 'I don't need a receipt.'",
          },
          {
            id: "9c",
            text: "Receipt is no necessary.",
            isCorrect: false,
            correction: "Grammar error: adverb instead of adjective. Say 'A receipt is not necessary' instead of 'is no necessary'.",
          },
        ],
        partnerFollowUp: "All set! Your drink and muffin will be ready at the pick-up counter in just a moment.",
      },
      {
        turnNumber: 10,
        partnerPrompt: "Here is your fresh iced oat latte and warm blueberry muffin! Have a wonderful day!",
        options: [
          {
            id: "10a",
            text: "Thank you so much! Have a great day too!",
            isCorrect: true,
          },
          {
            id: "10b",
            text: "Thanks! Bye bye see you.",
            isCorrect: false,
            correction: "Overly informal/abrupt: 'Thank you! Have a good one!' is standard polite conversation.",
          },
          {
            id: "10c",
            text: "Good coffee drink I will.",
            isCorrect: false,
            correction: "Inverted word order: say 'I'll enjoy the coffee!' instead of 'Good coffee drink I will'.",
          },
        ],
        partnerFollowUp: "You're very welcome! Enjoy your day!",
      },
    ],
  },
  "airport": {
    id: "airport",
    title: "Airport Customs Control",
    characterName: "Officer Davis",
    welcomeMessage: "Good evening. Welcome! What is the main purpose of your visit to the country today?",
    turns: [
      {
        turnNumber: 1,
        partnerPrompt: "Good evening. Passport please! What is the main purpose of your trip today?",
        options: [
          {
            id: "1a",
            text: "Good evening. I'm here for vacation and sight-seeing.",
            isCorrect: true,
          },
          {
            id: "1b",
            text: "I come here for travel fun.",
            isCorrect: false,
            correction: "Slightly informal for customs: 'I'm visiting for tourism/vacation' is clear and official.",
          },
          {
            id: "1c",
            text: "My purpose is do nothing work.",
            isCorrect: false,
            correction: "Grammar mistake: say 'I am not here for work, just leisure' or 'I am visiting as a tourist.'",
          },
        ],
        partnerFollowUp: "Thank you. And how long will you be staying in the country?",
      },
      {
        turnNumber: 2,
        partnerPrompt: "How many days or weeks do you plan to stay in the country?",
        options: [
          {
            id: "2a",
            text: "I'll be staying for two weeks.",
            isCorrect: true,
          },
          {
            id: "2b",
            text: "I stay 14 days long.",
            isCorrect: false,
            correction: "Redundant modifier: say 'I will stay for 14 days' or 'For two weeks'.",
          },
          {
            id: "2c",
            text: "Two weeks time I remain.",
            isCorrect: false,
            correction: "Unnatural sentence structure: say 'I'll be here for two weeks.'",
          },
        ],
        partnerFollowUp: "Understood. Where will you be staying during your two-week visit?",
      },
      {
        turnNumber: 3,
        partnerPrompt: "Where will you be staying during your stay here?",
        options: [
          {
            id: "3a",
            text: "I'll be staying at the Grand Hotel downtown.",
            isCorrect: true,
          },
          {
            id: "3b",
            text: "I sleep at hotel in city.",
            isCorrect: false,
            correction: "Improper vocabulary for travel context: say 'I am staying at a hotel' rather than 'sleep at hotel'.",
          },
          {
            id: "3c",
            text: "Hotel room reserved by me.",
            isCorrect: false,
            correction: "Awkward passive phrasing: 'I have a hotel reservation downtown' is much more natural.",
          },
        ],
        partnerFollowUp: "Great. Do you have a return ticket back to your home country?",
      },
      {
        turnNumber: 4,
        partnerPrompt: "Do you have a confirmed return ticket back to your home country?",
        options: [
          {
            id: "4a",
            text: "Yes, I have a return flight booked for the 25th.",
            isCorrect: true,
          },
          {
            id: "4b",
            text: "Yes, ticket back is in my bag.",
            isCorrect: false,
            correction: "Missing article: say 'Yes, the return ticket is in my bag' or 'I have a return ticket.'",
          },
          {
            id: "4c",
            text: "I buy return ticket yesterday.",
            isCorrect: false,
            correction: "Past tense verb error: say 'I bought my return ticket yesterday.'",
          },
        ],
        partnerFollowUp: "Excellent. Are you traveling alone today or with family?",
      },
      {
        turnNumber: 5,
        partnerPrompt: "Are you traveling alone today, or are you with a group or family?",
        options: [
          {
            id: "5a",
            text: "I am traveling alone.",
            isCorrect: true,
          },
          {
            id: "5b",
            text: "I travel by my own self.",
            isCorrect: false,
            correction: "Phrasing error: say 'by myself' or 'on my own' rather than 'by my own self'.",
          },
          {
            id: "5c",
            text: "No people with me coming.",
            isCorrect: false,
            correction: "Inverted structure: say 'Nobody is traveling with me' or 'I'm on my own.'",
          },
        ],
        partnerFollowUp: "Alright. What is your current occupation back home?",
      },
      {
        turnNumber: 6,
        partnerPrompt: "What is your profession or occupation back in your home country?",
        options: [
          {
            id: "6a",
            text: "I work as a software engineer.",
            isCorrect: true,
          },
          {
            id: "6b",
            text: "My job is do computer code.",
            isCorrect: false,
            correction: "Informal/improper term: say 'I work in software development' or 'I am a software engineer.'",
          },
          {
            id: "6c",
            text: "I am worker of technology.",
            isCorrect: false,
            correction: "Unnatural phrasing: say 'I work in the tech industry.'",
          },
        ],
        partnerFollowUp: "Very good. Are you carrying any fresh fruits, plants, or meats in your baggage?",
      },
      {
        turnNumber: 7,
        partnerPrompt: "Are you bringing any agricultural items, food, fresh fruits, or meats?",
        options: [
          {
            id: "7a",
            text: "No, I am not carrying any food or agricultural items.",
            isCorrect: true,
          },
          {
            id: "7b",
            text: "No food item inside bag mine.",
            isCorrect: false,
            correction: "Possessive placement error: say 'No food in my bag' instead of 'bag mine'.",
          },
          {
            id: "7c",
            text: "I do not carry no fruit.",
            isCorrect: false,
            correction: "Double negative: say 'I don't carry any fruit' or 'No fruits at all.'",
          },
        ],
        partnerFollowUp: "Good. Are you carrying more than $10,000 in cash or equivalent currency?",
      },
      {
        turnNumber: 8,
        partnerPrompt: "Are you carrying cash or currency exceeding $10,000 USD?",
        options: [
          {
            id: "8a",
            text: "No, I am carrying far less than that.",
            isCorrect: true,
          },
          {
            id: "8b",
            text: "No, I have small money only.",
            isCorrect: false,
            correction: "Improper adjective usage: say 'I only have a small amount of cash.'",
          },
          {
            id: "8c",
            text: "Not $10,000 cash with me.",
            isCorrect: false,
            correction: "Incomplete phrase: say 'I don't have that much cash on me.'",
          },
        ],
        partnerFollowUp: "Alright. Is this your first time visiting our country?",
      },
      {
        turnNumber: 9,
        partnerPrompt: "Is this your first visit here, or have you visited before?",
        options: [
          {
            id: "9a",
            text: "Yes, this is my very first time here!",
            isCorrect: true,
          },
          {
            id: "9b",
            text: "First time I am coming.",
            isCorrect: false,
            correction: "Slightly awkward: 'It's my first time visiting' sounds more natural.",
          },
          {
            id: "9c",
            text: "I never come here before past.",
            isCorrect: false,
            correction: "Tense redundancy: say 'I've never been here before.'",
          },
        ],
        partnerFollowUp: "Welcome! Everything looks in order with your documentation.",
      },
      {
        turnNumber: 10,
        partnerPrompt: "Here is your stamped passport. Enjoy your stay in the country!",
        options: [
          {
            id: "10a",
            text: "Thank you officer! Have a great day!",
            isCorrect: true,
          },
          {
            id: "10b",
            text: "Thanks, I go now.",
            isCorrect: false,
            correction: "Abrupt: 'Thank you very much, have a nice day!' is standard polite etiquette.",
          },
          {
            id: "10c",
            text: "Passport taken, good bye.",
            isCorrect: false,
            correction: "Awkward expression: simply say 'Thank you, officer! Goodbye.'",
          },
        ],
        partnerFollowUp: "You're welcome! Proceed to the baggage claim area.",
      },
    ],
  },
  "doctor": {
    id: "doctor",
    title: "Doctor's Appointment",
    characterName: "Dr. Watson",
    welcomeMessage: "Hello! Please come in and have a seat. What is the issue that brings you here today?",
    turns: [
      {
        turnNumber: 1,
        partnerPrompt: "Hello! Come on in. What symptoms have you been experiencing lately?",
        options: [
          {
            id: "1a",
            text: "Hello Doctor. I've had a bad headache and a sore throat for two days.",
            isCorrect: true,
          },
          {
            id: "1b",
            text: "Head is hurting me very strong.",
            isCorrect: false,
            correction: "Unnatural adjective: say 'I have a severe headache' or 'My head hurts badly.'",
          },
          {
            id: "1c",
            text: "Throat pain make me feel sick.",
            isCorrect: false,
            correction: "Verb agreement error: say 'My throat pain is making me feel sick.'",
          },
        ],
        partnerFollowUp: "I'm sorry to hear that. On a scale of 1 to 10, how severe is the pain?",
      },
      {
        turnNumber: 2,
        partnerPrompt: "On a scale from 1 to 10, how would you rate your headache pain?",
        options: [
          {
            id: "2a",
            text: "It's around a 6 out of 10. Quite uncomfortable.",
            isCorrect: true,
          },
          {
            id: "2b",
            text: "Pain is number 6 big.",
            isCorrect: false,
            correction: "Awkward descriptor: say 'It's about a 6 out of 10.'",
          },
          {
            id: "2c",
            text: "I rate pain 6 high.",
            isCorrect: false,
            correction: "Clunky expression: say 'I'd rate it at a 6.'",
          },
        ],
        partnerFollowUp: "Alright, a 6 out of 10. Have you taken any over-the-counter medication?",
      },
      {
        turnNumber: 3,
        partnerPrompt: "Have you taken any painkillers like ibuprofen or paracetamol?",
        options: [
          {
            id: "3a",
            text: "Yes, I took some paracetamol yesterday, but it only helped a little.",
            isCorrect: true,
          },
          {
            id: "3b",
            text: "I eat medicine pill yesterday night.",
            isCorrect: false,
            correction: "Verb error: we 'take' medicine, not 'eat' medicine in English. Say 'I took a pill yesterday.'",
          },
          {
            id: "3c",
            text: "Pain pill drank I with water.",
            isCorrect: false,
            correction: "Inverted order & verb error: say 'I swallowed a painkiller with water.'",
          },
        ],
        partnerFollowUp: "I see. Have you had any fever, chills, or body aches alongside the headache?",
      },
      {
        turnNumber: 4,
        partnerPrompt: "Have you noticed any fever, temperature, or body chills?",
        options: [
          {
            id: "4a",
            text: "I felt a bit feverish last night, but I haven't checked my exact temperature.",
            isCorrect: true,
          },
          {
            id: "4b",
            text: "Body hot last night I had.",
            isCorrect: false,
            correction: "Syntax error: say 'I had a fever last night' or 'My body felt hot.'",
          },
          {
            id: "4c",
            text: "Fever came to me yesterday.",
            isCorrect: false,
            correction: "Phrasing error: say 'I developed a fever yesterday.'",
          },
        ],
        partnerFollowUp: "Let me check your temperature and listen to your breathing with my stethoscope.",
      },
      {
        turnNumber: 5,
        partnerPrompt: "Take a deep breath in and out... okay, lungs sound clear! Are you allergic to any medications?",
        options: [
          {
            id: "5a",
            text: "No, I don't have any known medical allergies.",
            isCorrect: true,
          },
          {
            id: "5b",
            text: "No medicine make me allergy.",
            isCorrect: false,
            correction: "Grammar mistake: say 'No medications cause me allergies' or 'I am not allergic to anything.'",
          },
          {
            id: "5c",
            text: "I have zero medicine allergy history.",
            isCorrect: false,
            correction: "Unnatural expression: say 'I have no history of drug allergies.'",
          },
        ],
        partnerFollowUp: "Good to know. How has your sleep and appetite been over the last few days?",
      },
      {
        turnNumber: 6,
        partnerPrompt: "How has your appetite and sleep quality been recently?",
        options: [
          {
            id: "6a",
            text: "I haven't been sleeping well due to the pain, but my appetite is normal.",
            isCorrect: true,
          },
          {
            id: "6b",
            text: "Sleep bad, food eat okay.",
            isCorrect: false,
            correction: "Fragmented sentence: say 'I've been sleeping poorly, but eating fine.'",
          },
          {
            id: "6c",
            text: "I no sleep good in night.",
            isCorrect: false,
            correction: "Grammar error: say 'I haven't slept well at night.'",
          },
        ],
        partnerFollowUp: "Understood. Lack of sleep can definitely worsen headaches.",
      },
      {
        turnNumber: 7,
        partnerPrompt: "Do you have any pre-existing medical conditions like high blood pressure or asthma?",
        options: [
          {
            id: "7a",
            text: "No, I am generally healthy with no pre-existing conditions.",
            isCorrect: true,
          },
          {
            id: "7b",
            text: "No illness problem inside body.",
            isCorrect: false,
            correction: "Informal & ungrammatical: say 'I don't have any underlying health issues.'",
          },
          {
            id: "7c",
            text: "Body condition is fine good.",
            isCorrect: false,
            correction: "Redundant adjective: say 'My general health is good.'",
          },
        ],
        partnerFollowUp: "That's good. It looks like a mild viral infection causing tension headaches.",
      },
      {
        turnNumber: 8,
        partnerPrompt: "I will prescribe an anti-inflammatory medication and recommend rest. Does that sound okay?",
        options: [
          {
            id: "8a",
            text: "That sounds great. How many times a day should I take it?",
            isCorrect: true,
          },
          {
            id: "8b",
            text: "How much pills eat everyday?",
            isCorrect: false,
            correction: "Grammar error: 'How many pills should I take each day?' (pills are countable, so use 'how many').",
          },
          {
            id: "8c",
            text: "Medicine take when time?",
            isCorrect: false,
            correction: "Syntax error: say 'When should I take the medicine?'",
          },
        ],
        partnerFollowUp: "Take one tablet twice a day after meals for five days.",
      },
      {
        turnNumber: 9,
        partnerPrompt: "Should your symptoms get worse, please schedule a follow-up appointment.",
        options: [
          {
            id: "9a",
            text: "Understood. Should I call the clinic if the headache persists?",
            isCorrect: true,
          },
          {
            id: "9b",
            text: "If head hurt more I phone you?",
            isCorrect: false,
            correction: "Grammar error: say 'If my head hurts more, should I call you?'",
          },
          {
            id: "9c",
            text: "I come back doctor office later.",
            isCorrect: false,
            correction: "Missing preposition: say 'I will come back to the doctor's office later.'",
          },
        ],
        partnerFollowUp: "Yes, absolutely! Don't hesitate to call if you experience fever above 101°F.",
      },
      {
        turnNumber: 10,
        partnerPrompt: "Here is your prescription note. Get plenty of rest and drink lots of water!",
        options: [
          {
            id: "10a",
            text: "Thank you so much Dr. Watson! Have a nice day!",
            isCorrect: true,
          },
          {
            id: "10b",
            text: "Thanks doctor, goodbye now.",
            isCorrect: false,
            correction: "Slightly abrupt: 'Thank you Doctor! Take care' is warmer.",
          },
          {
            id: "10c",
            text: "Paper medicine taken, thanks.",
            isCorrect: false,
            correction: "Unnatural expression: say 'I've got the prescription, thank you.'",
          },
        ],
        partnerFollowUp: "You're very welcome! Take care and feel better soon!",
      },
    ],
  },
  "college-presentation": {
    id: "college-presentation",
    title: "College Presentation Jury",
    characterName: "Professor Reynolds",
    welcomeMessage: "Thank you for sharing your presentation! I really enjoyed it. To start, could you tell me what was your favorite part of working on this project?",
    turns: [
      {
        turnNumber: 1,
        partnerPrompt: "Thank you for your presentation! To start, what was the most interesting finding in your research?",
        options: [
          {
            id: "1a",
            text: "The most interesting finding was how significantly user engagement increased after the design update.",
            isCorrect: true,
          },
          {
            id: "1b",
            text: "Research result was very big surprise for me.",
            isCorrect: false,
            correction: "Improper academic register: say 'The research results were surprisingly positive.'",
          },
          {
            id: "1c",
            text: "I like finding data very much.",
            isCorrect: false,
            correction: "Overly simple phrasing for a university defense: say 'I found analyzing the dataset very rewarding.'",
          },
        ],
        partnerFollowUp: "Fascinating data! Why did you choose this specific methodology for data collection?",
      },
      {
        turnNumber: 2,
        partnerPrompt: "What made you choose quantitative surveys over qualitative interviews for this study?",
        options: [
          {
            id: "2a",
            text: "Surveys allowed us to gather data from a larger and more diverse sample size quickly.",
            isCorrect: true,
          },
          {
            id: "2b",
            text: "Survey is easy to make on computer.",
            isCorrect: false,
            correction: "Lacks academic rigor: say 'Surveys provided an efficient method to capture broad data.'",
          },
          {
            id: "2c",
            text: "I no want talk to people face to face.",
            isCorrect: false,
            correction: "Unprofessional phrasing: say 'Qualitative interviews were less feasible due to time constraints.'",
          },
        ],
        partnerFollowUp: "That makes methodological sense. How did you ensure your sample remained unbiased?",
      },
      {
        turnNumber: 3,
        partnerPrompt: "How did your team handle potential sample bias during participant recruitment?",
        options: [
          {
            id: "3a",
            text: "We used randomized sampling across different age groups and regions.",
            isCorrect: true,
          },
          {
            id: "3b",
            text: "We pick random people anywhere.",
            isCorrect: false,
            correction: "Casual phrasing: say 'We selected participants at random' or 'We used random sampling.'",
          },
          {
            id: "3c",
            text: "Bias was not inside our project.",
            isCorrect: false,
            correction: "Awkward expression: say 'We actively mitigated bias in our study.'",
          },
        ],
        partnerFollowUp: "Good control measure. Were there any unexpected challenges during data collection?",
      },
      {
        turnNumber: 4,
        partnerPrompt: "What was the biggest obstacle your team faced while gathering responses?",
        options: [
          {
            id: "4a",
            text: "Initial response rates were lower than expected, so we extended our survey window.",
            isCorrect: true,
          },
          {
            id: "4b",
            text: "People no answer questions online.",
            isCorrect: false,
            correction: "Grammar mistake: say 'Many respondents failed to complete the survey online.'",
          },
          {
            id: "4c",
            text: "Problem was too much hard work.",
            isCorrect: false,
            correction: "Informal: say 'Data collection proved more labor-intensive than anticipated.'",
          },
        ],
        partnerFollowUp: "Adapting your timeline was a wise decision. How do your results compare to existing literature?",
      },
      {
        turnNumber: 5,
        partnerPrompt: "Did your findings align with previous research studies in this field?",
        options: [
          {
            id: "5a",
            text: "Yes, our results strongly support the findings published by Dr. Smith in 2022.",
            isCorrect: true,
          },
          {
            id: "5b",
            text: "Yes, research same like old books.",
            isCorrect: false,
            correction: "Inappropriate academic terminology: say 'Our results align with established literature.'",
          },
          {
            id: "5c",
            text: "My project better than old papers.",
            isCorrect: false,
            correction: "Unscholarly claim: say 'Our study offers updated insights compared to older papers.'",
          },
        ],
        partnerFollowUp: "That reinforces your theoretical foundation nicely. How did you divide tasks within your team?",
      },
      {
        turnNumber: 6,
        partnerPrompt: "How was the workload distributed among your team members?",
        options: [
          {
            id: "6a",
            text: "I focused on data analysis while my partner handled the presentation design and literature review.",
            isCorrect: true,
          },
          {
            id: "6b",
            text: "I do all work and friend do nothing.",
            isCorrect: false,
            correction: "Unprofessional comment: say 'I took leadership of the analysis phase.'",
          },
          {
            id: "6c",
            text: "Work divided half half equal.",
            isCorrect: false,
            correction: "Colloquial repetition: say 'The workload was divided equally between us.'",
          },
        ],
        partnerFollowUp: "Effective collaboration is crucial. If you had another month, what would you add?",
      },
      {
        turnNumber: 7,
        partnerPrompt: "If you had an extra month to continue this research project, what would you expand upon?",
        options: [
          {
            id: "7a",
            text: "I would conduct follow-up qualitative interviews to gain deeper context behind the numbers.",
            isCorrect: true,
          },
          {
            id: "7b",
            text: "I make survey more big with more questions.",
            isCorrect: false,
            correction: "Redundant adjective: say 'I would expand the scope of the survey.'",
          },
          {
            id: "7c",
            text: "I do nothing more, project finished.",
            isCorrect: false,
            correction: "Lacks academic ambition: say 'The current scope is complete, but longitudinal tracking would be valuable.'",
          },
        ],
        partnerFollowUp: "Qualitative depth would indeed add great value. What key conclusion should the audience remember?",
      },
      {
        turnNumber: 8,
        partnerPrompt: "What is the single most important takeaway from your presentation today?",
        options: [
          {
            id: "8a",
            text: "That user-centered design directly drives long-term platform engagement.",
            isCorrect: true,
          },
          {
            id: "8b",
            text: "Design is very important for all people.",
            isCorrect: false,
            correction: "Overly generic statement: specify the precise thesis statement of your research.",
          },
          {
            id: "8c",
            text: "Remember my presentation slides.",
            isCorrect: false,
            correction: "Vague: restate your key analytical takeaway clearly.",
          },
        ],
        partnerFollowUp: "A clear and concise conclusion. Excellent work articulating your main thesis.",
      },
      {
        turnNumber: 9,
        partnerPrompt: "How do you plan to apply what you learned from this project in your future career?",
        options: [
          {
            id: "9a",
            text: "I plan to apply these data analysis techniques in my upcoming industry internship.",
            isCorrect: true,
          },
          {
            id: "9b",
            text: "I use computer data for getting job.",
            isCorrect: false,
            correction: "Casual phrasing: say 'I intend to leverage these research skills in my professional career.'",
          },
          {
            id: "9c",
            text: "Project skill help me make money.",
            isCorrect: false,
            correction: "Too informal for academic evaluation: focus on professional development.",
          },
        ],
        partnerFollowUp: "That sounds like a great stepping stone for your career.",
      },
      {
        turnNumber: 10,
        partnerPrompt: "Well done! The jury is very impressed with your presentation and defense. Congratulations!",
        options: [
          {
            id: "10a",
            text: "Thank you so much Professor Reynolds! I really appreciate your feedback!",
            isCorrect: true,
          },
          {
            id: "10b",
            text: "Thanks prof, bye!",
            isCorrect: false,
            correction: "Overly casual: 'Thank you Professor for your time and guidance!' is proper academic courtesy.",
          },
          {
            id: "10c",
            text: "Presentation good score give me.",
            isCorrect: false,
            correction: "Improper imperative: say 'Thank you for your favorable evaluation.'",
          },
        ],
        partnerFollowUp: "You're welcome! You may step down now.",
      },
    ],
  },
  "job-interview": {
    id: "job-interview",
    title: "Job Interview Practice",
    characterName: "Sophia",
    welcomeMessage: "Hello! Welcome, it's wonderful to meet you today. To get started, could you tell me a little bit about yourself and what you like to do?",
    turns: [
      {
        turnNumber: 1,
        partnerPrompt: "Welcome to the interview! To kick things off, could you tell me a little bit about yourself?",
        options: [
          {
            id: "1a",
            text: "Hi Sophia! I'm a software developer with 3 years of experience building web applications.",
            isCorrect: true,
          },
          {
            id: "1b",
            text: "I am person who like computers very much.",
            isCorrect: false,
            correction: "Overly simple for a job interview: state your professional title and years of relevant experience.",
          },
          {
            id: "1c",
            text: "My name is John and I want job for salary.",
            isCorrect: false,
            correction: "Unprofessional motivation: focus on your skills, background, and enthusiasm for the role.",
          },
        ],
        partnerFollowUp: "Great background! Why are you interested in joining our company specifically?",
      },
      {
        turnNumber: 2,
        partnerPrompt: "What attracted you to apply for a role at our company?",
        options: [
          {
            id: "2a",
            text: "I admire your innovative products and strong engineering culture.",
            isCorrect: true,
          },
          {
            id: "2b",
            text: "Your office is close to my house.",
            isCorrect: false,
            correction: "Weak motivation: while commute matters, highlight company mission and tech stack first.",
          },
          {
            id: "2c",
            text: "I need money to pay bill.",
            isCorrect: false,
            correction: "Inappropriate interview answer: emphasize mutual growth, interest in the work, and skills.",
          },
        ],
        partnerFollowUp: "That's wonderful to hear! What would you consider your greatest professional strength?",
      },
      {
        turnNumber: 3,
        partnerPrompt: "What is your greatest professional strength in the workplace?",
        options: [
          {
            id: "3a",
            text: "My greatest strength is problem-solving and clear communication with cross-functional teams.",
            isCorrect: true,
          },
          {
            id: "3b",
            text: "I am hard worker non stop.",
            isCorrect: false,
            correction: "Cliché phrasing: specify concrete skills like 'problem-solving', 'adaptability', or 'attention to detail'.",
          },
          {
            id: "3c",
            text: "I do everything fast without mistakes.",
            isCorrect: false,
            correction: "Unrealistic claim: say 'I take pride in delivering high-quality work efficiently.'",
          },
        ],
        partnerFollowUp: "Valuable skills! On the flip side, what is an area you are currently trying to improve?",
      },
      {
        turnNumber: 4,
        partnerPrompt: "Can you share an area or skill you are actively working to improve?",
        options: [
          {
            id: "4a",
            text: "I sometimes spend too much time perfecting minor details, so I'm practicing prioritizing key deliverables.",
            isCorrect: true,
          },
          {
            id: "4b",
            text: "I have no weakness at all.",
            isCorrect: false,
            correction: "Avoid claiming perfection: self-awareness and continuous self-improvement are key in interviews.",
          },
          {
            id: "4c",
            text: "I get angry when people slow me down.",
            isCorrect: false,
            correction: "Red flag response: phrase interpersonal challenges constructively (e.g. 'adapting to different work paces').",
          },
        ],
        partnerFollowUp: "Great self-awareness! Can you tell me about a challenging project you worked on?",
      },
      {
        turnNumber: 5,
        partnerPrompt: "Describe a complex project you completed. How did you handle obstacles?",
        options: [
          {
            id: "5a",
            text: "When facing tight deadlines, I broke the project into smaller tasks and communicated daily with my team.",
            isCorrect: true,
          },
          {
            id: "5b",
            text: "Project was hard but I work late night.",
            isCorrect: false,
            correction: "Focus on strategy rather than just long hours: explain your structured approach and teamwork.",
          },
          {
            id: "5c",
            text: "Manager told me do it so I did.",
            isCorrect: false,
            correction: "Lacks initiative: show personal ownership and proactive problem-solving.",
          },
        ],
        partnerFollowUp: "Excellent problem-solving approach! How do you handle disagreements with colleagues?",
      },
      {
        turnNumber: 6,
        partnerPrompt: "How do you manage disagreements or differing opinions with team members?",
        options: [
          {
            id: "6a",
            text: "I listen open-mindedly, focus on objective data, and work together toward a shared solution.",
            isCorrect: true,
          },
          {
            id: "6b",
            text: "I fight for my idea because I am right.",
            isCorrect: false,
            correction: "Uncollaborative stance: emphasize active listening and finding common ground.",
          },
          {
            id: "6c",
            text: "I ignore bad ideas from people.",
            isCorrect: false,
            correction: "Negative phrasing: say 'I address differing views constructively through discussion.'",
          },
        ],
        partnerFollowUp: "Team harmony is essential. Where do you see yourself professionally in five years?",
      },
      {
        turnNumber: 7,
        partnerPrompt: "Where do you see your career progressing over the next 5 years?",
        options: [
          {
            id: "7a",
            text: "I hope to grow into a senior technical lead role taking on larger architectural responsibilities.",
            isCorrect: true,
          },
          {
            id: "7b",
            text: "I want be boss of company.",
            isCorrect: false,
            correction: "Too informal: say 'I aim to progress into a managerial or leadership capacity.'",
          },
          {
            id: "7c",
            text: "I don't know future plan.",
            isCorrect: false,
            correction: "Shows lack of direction: share career aspirations aligned with professional growth.",
          },
        ],
        partnerFollowUp: "Ambitious goals! How do you handle working under tight deadlines or high pressure?",
      },
      {
        turnNumber: 8,
        partnerPrompt: "How do you maintain quality when working under strict deadlines?",
        options: [
          {
            id: "8a",
            text: "I stay focused by prioritizing critical path tasks and managing my time efficiently.",
            isCorrect: true,
          },
          {
            id: "8b",
            text: "I feel stressed but try finish fast.",
            isCorrect: false,
            correction: "Weak response: emphasize stress-management techniques and task prioritization.",
          },
          {
            id: "8c",
            text: "I ask deadline extension every time.",
            isCorrect: false,
            correction: "Unreliable impression: highlight deadline compliance and proactive risk communication.",
          },
        ],
        partnerFollowUp: "Very reassuring. Do you have any questions for me about the role or company?",
      },
      {
        turnNumber: 9,
        partnerPrompt: "We're nearing the end of the interview. What questions do you have for me?",
        options: [
          {
            id: "9a",
            text: "What does success look like in the first 90 days for this position?",
            isCorrect: true,
          },
          {
            id: "9b",
            text: "How much vacation days give to me?",
            isCorrect: false,
            correction: "Premature question: reserve benefit/perk questions for the offer stage; ask role/team questions first.",
          },
          {
            id: "9c",
            text: "No questions, everything okay.",
            isCorrect: false,
            correction: "Missed opportunity: asking thoughtful questions demonstrates genuine interest in the company.",
          },
        ],
        partnerFollowUp: "That's a fantastic question! Success means onboarding quickly and leading your first project feature.",
      },
      {
        turnNumber: 10,
        partnerPrompt: "Thank you so much for coming in today! We'll be in touch regarding next steps soon.",
        options: [
          {
            id: "10a",
            text: "Thank you Sophia! It was a pleasure speaking with you today. Have a great day!",
            isCorrect: true,
          },
          {
            id: "10b",
            text: "Bye, tell me if I get job.",
            isCorrect: false,
            correction: "Abrupt closing: express appreciation for their time and reiterate your enthusiasm.",
          },
          {
            id: "10c",
            text: "I wait call from you ok.",
            isCorrect: false,
            correction: "Improper closing etiquette: say 'I look forward to hearing from you!'",
          },
        ],
        partnerFollowUp: "Likewise! Have a wonderful rest of your day!",
      },
    ],
  },
};
