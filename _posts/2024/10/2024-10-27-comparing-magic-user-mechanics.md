---
title: Comparing Magic User Mechanics in D&D 5e
layout: post
tags:
    - dungeon-master
    - rules
---
This is something that has been bugging me for a while now: When reading through the Player's Handbook (PHB), it's really hard to understand how the rules for magic _differ_ between classes. If all you want to know is how magic works for your specific class, it's perfect! But I'd like to compare and contrast the mechanics of using magic in D&D 5e. So I went and did a bunch of homework to sum this up for future reference. 

This article isn't about flavour. It's not about how the magic using classes differ based on where they get their magic from. It's about the core mechanics. I'm using the [SRD](https://media.wizards.com/2016/downloads/DND/SRD-OGL_V5.1.pdf) as a reference here, except for the Artificer, which is described in [Tasha's Cauldron of Everything](https://en.wikipedia.org/wiki/Tasha%27s_Cauldron_of_Everything). Note that the licensing of the SRD overrules the licensing on this site for content quoted from there.

Here's what I learned.
## Spellcasting Basics

The various classes differ in their **Spellcasting Ability**. This directly affects your **Spell save DC** and your **Spell attack modifier**.

> Spell save DC = 8 + proficiency bonus + Spellcasting Ability modifier

> Spell attack modifier = proficiency bonus + Spellcasting Ability modifier

Next, we can also group them into their **Spellcasting Type**: **Full Casters** and **Half Casters** have a different progression of spell slots, with Full Casters gaining access to level 9 spells at level 17, whereas Half Casters only going up to level 5 spells. Half Casters progress more slowly than Full Casters.

Warlocks are the odd ones out here, being something called **Pact Casters**. Like Half Casters, Pact Casters only progress to level 5 spells. Unlike the other casters, their spell slots are not divided by spell level - they have less spell slots, but all spells are cast at the highest spell level they have reached. They have a lot less spell slots than the other casters, but gain them back after a short rest - instead of the long rest required by the others.

Finally, Half Casters generally don't get **cantrips**, except for the Artificer.

| Class     | Spellcasting Type | Spellcasting Ability | Cantrips Known | Max Spell level |
| --------- | ----------------- | -------------------- | -------------- | --------------- |
| Bard      | Full Caster       | Charisma             | Yes            | 9               |
| Cleric    | Full Caster       | Wisdom               | Yes            | 9               |
| Druid     | Full Caster       | Wisdom               | Yes            | 9               |
| Sorcerer  | Full Caster       | Charisma             | Yes            | 9               |
| Wizard    | Full Caster       | Intelligence         | Yes            | 9               |
| Artificer | Half Caster       | Intelligence         | Yes            | 5               |
| Paladin   | Half Caster       | Charisma             | **No**         | 5               |
| Ranger    | Half Caster       | Wisdom               | **No**         | 5               |
| Warlock   | **Pact Caster**   | Charisma             | Yes            | 5               |

## Spell Preparation and Spell Learning

The next table focuses on how each class manages their spells, including how they acquire new spells, whether they need to prepare spells, and how they recover their spell slots.

There are two main ways a magic user learns spells:
- Choose new spells when levelling up / No preparation needed
- Access to entire spell list / Prepare spells each day

The Wizard class is an outlier here: They need to prepare spells each day, but they don't automatically have access to the entire Wizard spell list. Instead, they're supposed to go and find additional spells in dungeons, old books, scrolls etc. in addition to the spells they get to choose when levelling up.

The Half Casters also don't all use the same strategy. Artificer and Paladin are supposed to prepare spells each day. The amount of spells they can prepare is calculated using the following formula:

> Number of spells prepared: Spell Ability modifier + half your level, rounded down (minimum of one spell). 

| Class     | How They Get New Spells                                                 | Prepare                 | Recovery Mechanism | Spellcasting Focus |
| --------- | ----------------------------------------------------------------------- | ----------------------- | ------------------ | ------------------ |
| Bard      | Choose new spells when leveling up                                      | No preparation needed   | Long rest          | Musical Instrument |
| Cleric    | Access to entire Cleric spell list                                      | Prepare spells each day | Long rest          | Holy Symbol        |
| Druid     | Access to entire Druid spell list                                       | Prepare spells each day | Long rest          | Druidic Focus      |
| Sorcerer  | Choose new spells when leveling up                                      | No preparation needed   | Long rest          | None               |
| Wizard    | Choose new spells when leveling up **or copy from spell scrolls/books** | Prepare spells each day | Long rest          | Arcane Focus       |
| Artificer | Access to entire Artificer spell list                                   | Prepare spells each day | Long rest          | Tools/Arcane Focus |
| Paladin   | Access to entire Paladin spell list                                     | Prepare spells each day | Long rest          | Holy Symbol        |
| Ranger    | Choose new spells when leveling up from Ranger spell list               | No preparation needed   | Long rest          | None               |
| Warlock   | Choose new spells when leveling up from Warlock spell list              | No preparation needed   | Short rest         | Arcane Focus       |

Of course there are other differences, special features and perks of the different classes, but these are the main ones affecting the main mechanics of using magic.